import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { MoviesModule } from './modules-api/movies/movies.module';
import { BookingsModule } from './modules-api/bookings/bookings.module';
import { ProtectGuard } from './common/guard/protect.guard';
import { RoleGuard } from './common/guard/role.guard';
import { UsersModule } from './modules-api/users/users.module';
import { CinemasModule } from './modules-api/cinemas/cinemas.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, BookingsModule, UsersModule, CinemasModule],
  providers: [
    { provide: APP_GUARD, useClass: ProtectGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
