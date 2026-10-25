import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])) return true;
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Vui lòng đăng nhập');
    try {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'development-secret') as { userId: number };
      request.user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.userId } });
      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
