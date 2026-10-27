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

  const systems = [
    { code: 'CGV', name: 'CGV Cinemas' },
    { code: 'GALAXY', name: 'Galaxy Cinema' },
    { code: 'LOTTE', name: 'Lotte Cinema' },
    { code: 'BHD', name: 'BHD Star Cineplex' },
  ];
  const systemRecords = [];
  for (const item of systems) {
    systemRecords.push(await prisma.cinemaSystem.upsert({
      where: { code: item.code },
      update: { name: item.name },
      create: { ...item, logo: '' },
    }));
  }
  const cinemaSeeds = [
    { code: 'CGV-SG', name: 'CGV Sư Vạn Hạnh', address: 'Tầng 6, Vạn Hạnh Mall, TP. Hồ Chí Minh', systemCode: 'CGV' },
    { code: 'CGV-LD', name: 'CGV Landmark 81', address: 'Vinhomes Central Park, TP. Hồ Chí Minh', systemCode: 'CGV' },
    { code: 'GALAXY-NV', name: 'Galaxy Nguyễn Du', address: '116 Nguyễn Du, TP. Hồ Chí Minh', systemCode: 'GALAXY' },
    { code: 'LOTTE-Q7', name: 'Lotte Cinema Nam Sài Gòn', address: '469 Nguyễn Hữu Thọ, TP. Hồ Chí Minh', systemCode: 'LOTTE' },
    { code: 'BHD-THD', name: 'BHD Star Thảo Điền', address: 'Vincom Mega Mall Thảo Điền, TP. Hồ Chí Minh', systemCode: 'BHD' },
  ];
  const cinemaRecords = [];
  for (const item of cinemaSeeds) {
    const system = systemRecords.find((record) => record.code === item.systemCode);
    cinemaRecords.push(await prisma.cinema.upsert({
      where: { code: item.code },
      update: { name: item.name, address: item.address, systemId: system.id },
      create: { code: item.code, name: item.name, address: item.address, systemId: system.id },
    }));
  }
  const room = await prisma.room.upsert({
    where: { code: 'CGV-SG-01' },
    update: {},
    create: { code: 'CGV-SG-01', name: 'Phòng IMAX 01', cinemaId: cinemaRecords[0].id },
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

  const movieSeeds = [
    { name: 'Dune: Hành Tinh Cát 2', description: 'Paul Atreides tiếp tục hành trình bảo vệ gia đình và hành tinh Arrakis.', rating: 9, isShowing: true, isHot: true },
    { name: 'Mai', description: 'Một câu chuyện tình cảm giàu cảm xúc giữa những lựa chọn và cơ hội thứ hai.', rating: 8, isShowing: true, isHot: true },
    { name: 'Godzilla x Kong: Đế Chế Mới', description: 'Hai biểu tượng quái vật cùng đối mặt với một mối đe dọa khổng lồ.', rating: 8, isShowing: true, isHot: false },
    { name: 'Kung Fu Panda 4', description: 'Po trở lại với chuyến phiêu lưu hài hước và đầy cảm hứng.', rating: 8, isShowing: true, isHot: false },
    { name: 'Deadpool & Wolverine', description: 'Một cuộc hội ngộ không thể đoán trước của hai nhân vật nổi tiếng.', rating: 9, isShowing: false, isHot: false },
    { name: 'Furiosa: Câu Chuyện Từ Mad Max', description: 'Hành trình sinh tồn dữ dội trong thế giới hậu tận thế.', rating: 8, isShowing: false, isHot: false },
  ];
  const movieRecords = [];
  for (const item of movieSeeds) {
    const existing = await prisma.movie.findFirst({ where: { name: item.name } });
    movieRecords.push(existing
      ? await prisma.movie.update({ where: { id: existing.id }, data: item })
      : await prisma.movie.create({ data: { ...item, groupCode: 'GP01', releaseDate: new Date() } }));
  }
  const movie = movieRecords[0];

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
