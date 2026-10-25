import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private safe(user: { passwordHash: string; [key: string]: unknown }) { const { passwordHash, ...result } = user; return result; }
  async list(groupCode = 'GP01') { return (await this.prisma.user.findMany({ where: { groupCode }, orderBy: { id: 'desc' } })).map((user) => this.safe(user)); }
  async search(keyword: string) { return (await this.prisma.user.findMany({ where: { OR: [{ account: { contains: keyword } }, { fullName: { contains: keyword } }, { email: { contains: keyword } }] } })).map((user) => this.safe(user)); }
  async paginate(keyword: string, page: number, size: number) {
    const where = { OR: [{ account: { contains: keyword } }, { fullName: { contains: keyword } }, { email: { contains: keyword } }] };
    const [items, total] = await Promise.all([this.prisma.user.findMany({ where, skip: (page - 1) * size, take: size }), this.prisma.user.count({ where })]);
    return { items: items.map((user) => this.safe(user)), totalCount: total, currentPage: page, count: size };
  }
  async find(account: string) { const user = await this.prisma.user.findUnique({ where: { account } }); if (!user) throw new NotFoundException('Không tìm thấy người dùng'); return this.safe(user); }
  async create(body: CreateUserDto) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ account: body.taiKhoan }, { email: body.email }] } });
    if (exists) throw new ConflictException('Tài khoản hoặc email đã tồn tại');
    const user = await this.prisma.user.create({ data: { account: body.taiKhoan, passwordHash: await bcrypt.hash(body.matKhau, 10), email: body.email, fullName: body.hoTen, phone: body.soDt, groupCode: body.maNhom || 'GP01', role: body.maLoaiNguoiDung === 'QuanTri' ? 'ADMIN' : 'USER' } });
    return this.safe(user);
  }
  async update(body: UpdateUserDto) {
    const data: { email?: string; fullName?: string; phone?: string; groupCode?: string; passwordHash?: string; role?: 'ADMIN' | 'USER' } = { email: body.email, fullName: body.hoTen, phone: body.soDt, groupCode: body.maNhom || 'GP01' };
    if (body.matKhau) data.passwordHash = await bcrypt.hash(body.matKhau, 10);
    if (body.maLoaiNguoiDung) data.role = body.maLoaiNguoiDung === 'QuanTri' ? 'ADMIN' : 'USER';
    return this.safe(await this.prisma.user.update({ where: { account: body.taiKhoan }, data }));
  }
  async remove(account: string) { await this.prisma.user.delete({ where: { account } }); return { message: 'Xóa người dùng thành công' }; }
}
