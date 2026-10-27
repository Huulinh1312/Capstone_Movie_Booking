import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('QuanLyNguoiDung')
@ApiTags('QuanLyNguoiDung')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('DangKy')
  @ApiOperation({ summary: 'Đăng ký tài khoản người dùng' })
  @ApiBody({ schema: { type: 'object', required: ['taiKhoan', 'matKhau', 'email', 'soDt', 'hoTen'], properties: { taiKhoan: { type: 'string', example: 'user01' }, matKhau: { type: 'string', example: '123456' }, email: { type: 'string', format: 'email', example: 'user01@gmail.com' }, soDt: { type: 'string', example: '0900000000' }, hoTen: { type: 'string', example: 'Nguyen Van A' } } } })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  register(@Body() body: RegisterDto) { return this.authService.register(body); }
  @Public()
  @Post('DangNhap')
  @ApiOperation({ summary: 'Đăng nhập và nhận access token' })
  @ApiBody({ schema: { type: 'object', required: ['taiKhoan', 'matKhau'], properties: { taiKhoan: { type: 'string', example: 'admin' }, matKhau: { type: 'string', example: '123456' } } } })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về data.accessToken' })
  login(@Body() body: LoginDto) { return this.authService.login(body); }

  @Public()
  @Get('LayDanhSachLoaiNguoiDung')
  @ApiOperation({ summary: 'Lấy danh sách loại người dùng' })
  getRoles() {
    return [{ maLoaiNguoiDung: 'KhachHang', tenLoai: 'Khách hàng' }, { maLoaiNguoiDung: 'QuanTri', tenLoai: 'Quản trị' }];
  }
}
