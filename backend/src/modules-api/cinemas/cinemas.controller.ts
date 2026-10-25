import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CinemasService } from './cinemas.service';

@Controller('QuanLyRap')
@ApiTags('QuanLyRap')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}
  @Public() @Get('LayThongTinHeThongRap') @ApiOperation({ summary: 'Lấy danh sách hệ thống rạp' }) systems() { return this.cinemasService.systems(); }
  @Public() @Get('LayThongTinCumRapTheoHeThong') @ApiOperation({ summary: 'Lấy cụm rạp theo hệ thống rạp' }) @ApiQuery({ name: 'maHeThongRap', required: true, example: 'CGV' }) bySystem(@Query('maHeThongRap') code: string) { return this.cinemasService.cinemasBySystem(code); }
  @Public() @Get('LayThongTinLichChieuHeThongRap') @ApiOperation({ summary: 'Lấy lịch chiếu theo hệ thống rạp' }) @ApiQuery({ name: 'maHeThongRap', required: true, example: 'CGV' }) @ApiQuery({ name: 'maNhom', required: false, example: 'GP01' }) showtimesBySystem(@Query('maHeThongRap') code: string, @Query('maNhom') group = 'GP01') { return this.cinemasService.showtimesBySystem(code, group); }
  @Public() @Get('LayThongTinLichChieuPhim') @ApiOperation({ summary: 'Lấy lịch chiếu theo phim' }) @ApiQuery({ name: 'MaPhim', required: true, type: Number, example: 1 }) showtimesByMovie(@Query('MaPhim', ParseIntPipe) movieId: number) { return this.cinemasService.showtimesByMovie(movieId); }
}
