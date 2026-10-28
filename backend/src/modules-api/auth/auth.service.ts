import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(body: RegisterDto) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ account: body.taiKhoan }, { email: body.email }] } });
    if (exists) throw new ConflictException('Tài khoản hoặc email đã tồn tại');
    const user = await this.prisma.user.create({ data: { account: body.taiKhoan, passwordHash: await bcrypt.hash(body.matKhau, 10), email: body.email, fullName: body.hoTen, phone: body.soDt } });
    return { id: user.id, taiKhoan: user.account, email: user.email, hoTen: user.fullName };
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { account: body.taiKhoan } });
    if (!user || !(await bcrypt.compare(body.matKhau, user.passwordHash))) throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'development-secret', { expiresIn: '7d' });
    return { taiKhoan: user.account, email: user.email, hoTen: user.fullName, avatar: user.avatar, maLoaiNguoiDung: user.role === 'ADMIN' ? 'QuanTri' : 'KhachHang', accessToken };
  }
}
