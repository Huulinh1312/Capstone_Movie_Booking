import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { UsersService } from './users.service';
import { Role } from '../../common/decorators/role.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('QuanLyNguoiDung')
@ApiTags('QuanLyNguoiDung')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('LayDanhSachNguoiDung')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiQuery({ name: 'MaNhom', required: false, example: 'GP01' })
  list(@Query('MaNhom') group = 'GP01') { return this.usersService.list(group); }
  @Get('LayDanhSachNguoiDungPhanTrang')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Lấy danh sách người dùng phân trang' })
  @ApiQuery({ name: 'maNhom', required: false, example: 'GP01' }) @ApiQuery({ name: 'soTrang', required: false, type: Number, example: 1 }) @ApiQuery({ name: 'soPhanTuTrenTrang', required: false, type: Number, example: 10 })
  paginate(@Query('maNhom') _group = 'GP01', @Query('soTrang') page = '1', @Query('soPhanTuTrenTrang') size = '10') { return this.usersService.paginate('', Number(page), Number(size)); }
  @Get('TimKiemNguoiDung')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Tìm kiếm người dùng' })
  @ApiQuery({ name: 'MaNhom', required: false, example: 'GP01' }) @ApiQuery({ name: 'tuKhoa', required: false, example: 'nguyen' })
  search(@Query('tuKhoa') keyword = '') { return this.usersService.search(keyword); }
  @Get('TimKiemNguoiDungPhanTrang')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Tìm kiếm người dùng phân trang' })
  @ApiQuery({ name: 'MaNhom', required: false, example: 'GP01' }) @ApiQuery({ name: 'tuKhoa', required: false, example: 'nguyen' }) @ApiQuery({ name: 'soTrang', required: false, type: Number, example: 1 }) @ApiQuery({ name: 'soPhanTuTrenTrang', required: false, type: Number, example: 10 })
  searchPage(@Query('tuKhoa') keyword = '', @Query('soTrang') page = '1', @Query('soPhanTuTrenTrang') size = '10') { return this.usersService.paginate(keyword, Number(page), Number(size)); }
  @Post('ThongTinTaiKhoan')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại' })
  profile(@CurrentUser() user: unknown) { return user; }
  @Post('LayThongTinNguoiDung')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Lấy thông tin người dùng theo tài khoản' })
  @ApiQuery({ name: 'taiKhoan', required: true, example: 'user01' })
  find(@Query('taiKhoan') account: string) { return this.usersService.find(account); }
  @Post('ThemNguoiDung')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Thêm người dùng' })
  @ApiBody({ schema: { type: 'object', required: ['taiKhoan', 'matKhau', 'email', 'soDt', 'hoTen', 'maLoaiNguoiDung'], properties: { taiKhoan: { type: 'string', example: 'user01' }, matKhau: { type: 'string', example: '123456' }, email: { type: 'string', example: 'user01@gmail.com' }, soDt: { type: 'string', example: '0900000000' }, hoTen: { type: 'string', example: 'Nguyen Van A' }, maNhom: { type: 'string', example: 'GP01' }, maLoaiNguoiDung: { type: 'string', example: 'KhachHang' } } } })
  create(@Body() body: CreateUserDto) { return this.usersService.create(body); }
  @Put('CapNhatThongTinNguoiDung')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Cập nhật thông tin người dùng bằng PUT' })
  @ApiBody({ schema: { type: 'object', required: ['taiKhoan'], properties: { taiKhoan: { type: 'string', example: 'user01' }, matKhau: { type: 'string', example: '123456' }, email: { type: 'string', example: 'new@gmail.com' }, soDt: { type: 'string', example: '0900000000' }, hoTen: { type: 'string', example: 'Nguyen Van B' }, maLoaiNguoiDung: { type: 'string', example: 'KhachHang' } } } })
  updatePut(@Body() body: UpdateUserDto) { return this.usersService.update(body); }
  @Post('CapNhatThongTinNguoiDung')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Cập nhật thông tin người dùng bằng POST' })
  updatePost(@Body() body: UpdateUserDto) { return this.usersService.update(body); }
  @Delete('XoaNguoiDung')
  @Role('ADMIN')
  @ApiBearerAuth('bearerAuth') @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiQuery({ name: 'TaiKhoan', required: true, example: 'user01' })
  remove(@Query('TaiKhoan') account: string) { return this.usersService.remove(account); }
}
