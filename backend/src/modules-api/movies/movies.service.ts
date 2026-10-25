import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(groupCode = 'GP01') {
    return this.prisma.movie.findMany({ where: { groupCode }, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id }, include: { showtimes: true, banners: true } });
    if (!movie) throw new NotFoundException('Không tìm thấy phim');
    return movie;
  }

  async getBanners() {
    return this.prisma.banner.findMany({ include: { movie: true } });
  }

  async findPaginated(groupCode = 'GP01', page = 1, size = 10) {
    const where = { groupCode };
    const [items, total] = await Promise.all([
      this.prisma.movie.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { id: 'desc' } }),
      this.prisma.movie.count({ where }),
    ]);
    return { items, totalCount: total, currentPage: page, count: size };
  }

  async findByDate(groupCode: string, from: Date, to: Date, page = 1, size = 10) {
    const where = { groupCode, releaseDate: { gte: from, lte: to } };
    const [items, total] = await Promise.all([
      this.prisma.movie.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { releaseDate: 'desc' } }),
      this.prisma.movie.count({ where }),
    ]);
    return { items, totalCount: total, currentPage: page, count: size };
  }

  async create(data: { name: string; groupCode?: string; trailer?: string; description?: string; image?: string; releaseDate?: Date; rating?: number }) {
    return this.prisma.movie.create({ data });
  }

  async update(id: number, data: Partial<Parameters<MoviesService['create']>[0]>) {
    return this.prisma.movie.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.movie.delete({ where: { id } });
  }
}
