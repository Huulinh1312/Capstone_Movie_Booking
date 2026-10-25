const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { account: 'admin' },
    update: { passwordHash, role: 'ADMIN' },
    create: {
      account: 'admin',
      passwordHash,
      email: 'admin@movie.local',
      fullName: 'Movie Admin',
      phone: '0900000000',
      role: 'ADMIN',
    },
  });

  const system = await prisma.cinemaSystem.upsert({
    where: { code: 'CGV' },
    update: {},
    create: { code: 'CGV', name: 'CGV', logo: '' },
  });
  const cinema = await prisma.cinema.upsert({
    where: { code: 'CGV-SG' },
    update: {},
    create: {
      code: 'CGV-SG',
      name: 'CGV Sư Vạn Hạnh',
      address: 'TP. Hồ Chí Minh',
      systemId: system.id,
    },
  });
  const room = await prisma.room.upsert({
    where: { code: 'CGV-SG-01' },
    update: {},
    create: { code: 'CGV-SG-01', name: 'Phòng 01', cinemaId: cinema.id },
  });

  const seatCount = await prisma.seat.count({ where: { roomId: room.id } });
  if (seatCount === 0) {
    await prisma.seat.createMany({
      data: Array.from({ length: 40 }, (_, index) => {
        const row = String.fromCharCode(65 + Math.floor(index / 10));
        const number = (index % 10) + 1;
        return {
          roomId: room.id,
          code: `${row}${number}`,
          name: `${row}${number}`,
          type: row === 'D' ? 'Vip' : 'Thuong',
        };
      }),
    });
  }

  let movie = await prisma.movie.findFirst({ where: { name: 'Demo Movie' } });
  if (!movie) {
    movie = await prisma.movie.create({
      data: {
        name: 'Demo Movie',
        description: 'Phim mẫu để kiểm thử API.',
        rating: 5,
        groupCode: 'GP01',
        isShowing: true,
        releaseDate: new Date(),
      },
    });
  }

  const showtimeCount = await prisma.showtime.count({ where: { movieId: movie.id, roomId: room.id } });
  if (showtimeCount === 0) {
    await prisma.showtime.create({
      data: {
        movieId: movie.id,
        roomId: room.id,
        startAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ticketPrice: 90000,
      },
    });
  }

  console.log('Seed completed');
  console.log('Admin account: admin / 123456');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
