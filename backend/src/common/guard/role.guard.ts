import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<'ADMIN' | 'USER'>(ROLE_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRole) return true;
    const user = context.switchToHttp().getRequest().user;
    if (user?.role !== requiredRole) throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    return true;
  }
}
