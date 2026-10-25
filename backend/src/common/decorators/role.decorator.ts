import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'requiredRole';
export const Role = (role: 'ADMIN' | 'USER') => SetMetadata(ROLE_KEY, role);
