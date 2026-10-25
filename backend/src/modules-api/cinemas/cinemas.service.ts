import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class CinemasService {
  constructor(private readonly prisma: PrismaService) {}
  systems() { return this.prisma.cinemaSystem.findMany({ include: { cinemas: { include: { rooms: true } } } }); }
  async cinemasBySystem(code: string) { const system = await this.prisma.cinemaSystem.findUnique({ where: { code }, include: { cinemas: { include: { rooms: true } } } }); return system?.cinemas || []; }
  showtimesBySystem(code: string, groupCode = 'GP01') { return this.prisma.showtime.findMany({ where: { room: { cinema: { system: { code } } }, movie: { groupCode } }, include: { movie: true, room: { include: { cinema: true } } }, orderBy: { startAt: 'asc' } }); }
  showtimesByMovie(movieId: number) { return this.prisma.showtime.findMany({ where: { movieId }, include: { movie: true, room: { include: { cinema: { include: { system: true } } } } }, orderBy: { startAt: 'asc' } }); }
}
