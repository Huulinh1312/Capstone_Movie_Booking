import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '../../common/decorators/role.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('QuanLyDatVe')
@ApiTags('QuanLyDatVe')
export class BookingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('LayDanhSachPhongVe')
  @ApiOperation({ summary: 'Lấy danh sách phòng vé và trạng thái ghế' })
  @ApiQuery({ name: 'MaLichChieu', required: true, type: Number, example: 1, description: 'Mã lịch chiếu' })
  async getSeats(@Query('MaLichChieu', ParseIntPipe) showtimeId: number) {
    const showtime = await this.prisma.showtime.findUnique({ where: { id: showtimeId }, include: { movie: true, room: { include: { seats: true } } } });
    if (!showtime) return null;
    const booked = new Set((await this.prisma.bookingSeat.findMany({ where: { showtimeId }, select: { seatId: true } })).map((item) => item.seatId));
    return { thongTinPhim: showtime.movie, danhSachGhe: showtime.room.seats.map((seat) => ({ ...seat, daDat: booked.has(seat.id) })) };
  }

  @Get('LayLichSuDatVe')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Lấy lịch sử đặt vé của tài khoản hiện tại' })
  async getBookingHistory(@CurrentUser() user: { id: number }) {
    return this.prisma.booking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        showtime: {
          include: {
            movie: true,
            room: { include: { cinema: true } },
          },
        },
        seats: { include: { seat: true } },
      },
    });
  }

  @Delete('XoaLichSuDatVe')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Xóa một vé khỏi lịch sử đặt vé của tài khoản hiện tại' })
  async deleteBookingHistory(@CurrentUser() user: { id: number }, @Query('bookingId', ParseIntPipe) bookingId: number) {
    const booking = await this.prisma.booking.findFirst({ where: { id: bookingId, userId: user.id }, select: { id: true } });
    if (!booking) throw new NotFoundException('Không tìm thấy vé trong lịch sử');
    await this.prisma.booking.delete({ where: { id: booking.id } });
    return { message: 'Đã xóa vé khỏi lịch sử đặt vé' };
  }

  @Post('DatVe')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Đặt vé xem phim' })
  @ApiBody({ schema: { type: 'object', required: ['maLichChieu', 'danhSachVe'], properties: { maLichChieu: { type: 'integer', example: 1 }, danhSachVe: { type: 'array', items: { type: 'object', properties: { maGhe: { type: 'integer', example: 1 }, giaVe: { type: 'integer', example: 90000 } } } } } } })
  async book(@Body() body: CreateBookingDto, @CurrentUser() user: { id: number }) {
    const seatIds = [...new Set((body.danhSachVe || []).map((seat) => Number(seat.maGhe)).filter((seatId) => Number.isInteger(seatId) && seatId > 0))];
    if (!seatIds.length) throw new BadRequestException('Vui lòng chọn ít nhất một ghế');
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const showtime = await transaction.showtime.findUnique({ where: { id: Number(body.maLichChieu) } });
        if (!showtime) throw new NotFoundException('Không tìm thấy lịch chiếu');
        const validSeats = await transaction.seat.count({ where: { id: { in: seatIds }, roomId: showtime.roomId } });
        if (validSeats !== seatIds.length) throw new BadRequestException('Ghế không thuộc phòng chiếu');
        const booking = await transaction.booking.create({
          data: {
            userId: user.id,
            showtimeId: showtime.id,
            totalPrice: seatIds.length * showtime.ticketPrice,
            seats: { create: seatIds.map((seatId) => ({ seatId, showtimeId: showtime.id })) },
          },
          include: { seats: true },
        });
        return booking;
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Một hoặc nhiều ghế đã được đặt');
      throw error;
    }
  }

  @Post('TaoLichChieu')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Tạo lịch chiếu cho phim tại rạp' })
  @ApiBody({ schema: { type: 'object', required: ['maPhim', 'maRap', 'ngayChieuGioChieu', 'giaVe'], properties: { maPhim: { type: 'integer', example: 1 }, maRap: { type: 'string', example: 'CGV-SG-01' }, ngayChieuGioChieu: { type: 'string', format: 'date-time', example: '2026-10-25T19:30:00.000Z' }, giaVe: { type: 'integer', example: 90000 }, maNhom: { type: 'string', example: 'GP01' } } } })
  async createShowtime(@Body() body: { maPhim: number; maRap: string; ngayChieuGioChieu: string; giaVe: number }) {
    const room = await this.prisma.room.findUnique({ where: { code: body.maRap } });
    if (!room) return null;
    return this.prisma.showtime.create({ data: { movieId: Number(body.maPhim), roomId: room.id, startAt: new Date(body.ngayChieuGioChieu), ticketPrice: Number(body.giaVe) } });
  }
}
