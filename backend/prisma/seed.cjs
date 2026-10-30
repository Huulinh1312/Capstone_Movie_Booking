const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const systemSeeds = [
  { code: 'CGV', name: 'CGV Cinemas' },
  { code: 'GALAXY', name: 'Galaxy Cinema' },
  { code: 'LOTTE', name: 'Lotte Cinema' },
  { code: 'BHD', name: 'BHD Star Cineplex' },
];

const cinemaSeeds = [
  { code: 'CGV-SVH', name: 'CGV Sư Vạn Hạnh', address: 'Tầng 6, Vạn Hạnh Mall, TP. Hồ Chí Minh', systemCode: 'CGV' },
  { code: 'CGV-LM81', name: 'CGV Landmark 81', address: 'Vinhomes Central Park, TP. Hồ Chí Minh', systemCode: 'CGV' },
  { code: 'CGV-PV', name: 'CGV Pearl Plaza', address: '561A Điện Biên Phủ, TP. Hồ Chí Minh', systemCode: 'CGV' },
  { code: 'GALAXY-ND', name: 'Galaxy Nguyễn Du', address: '116 Nguyễn Du, TP. Hồ Chí Minh', systemCode: 'GALAXY' },
  { code: 'GALAXY-KD', name: 'Galaxy Kinh Dương Vương', address: '718bis Kinh Dương Vương, TP. Hồ Chí Minh', systemCode: 'GALAXY' },
  { code: 'LOTTE-NSG', name: 'Lotte Cinema Nam Sài Gòn', address: '469 Nguyễn Hữu Thọ, TP. Hồ Chí Minh', systemCode: 'LOTTE' },
  { code: 'LOTTE-GV', name: 'Lotte Cinema Gò Vấp', address: '242 Nguyễn Văn Lượng, TP. Hồ Chí Minh', systemCode: 'LOTTE' },
  { code: 'BHD-THD', name: 'BHD Star Thảo Điền', address: 'Vincom Mega Mall Thảo Điền, TP. Hồ Chí Minh', systemCode: 'BHD' },
  { code: 'CGV-CT', name: 'CGV Aeon Mall Tân Phú', address: '30 Bờ Bao Tân Thắng, TP. Hồ Chí Minh', systemCode: 'CGV' },
  { code: 'GALAXY-Q9', name: 'Galaxy Sala', address: 'Tầng 2, Thiso Mall Sala, TP. Hồ Chí Minh', systemCode: 'GALAXY' },
  { code: 'LOTTE-TB', name: 'Lotte Cinema Tây Bắc', address: 'Khu đô thị Celadon City, TP. Hồ Chí Minh', systemCode: 'LOTTE' },
  { code: 'BHD-CC', name: 'BHD Star Cineplex Bitexco', address: 'Tầng 3, Bitexco Financial Tower, TP. Hồ Chí Minh', systemCode: 'BHD' },
];

const movieSeeds = [
  {
    name: 'Dune: Hành Tinh Cát 2',
    description: 'Paul Atreides đồng hành cùng Chani và người Fremen trong cuộc chiến định mệnh trên Arrakis.',
    rating: 9,
    isHot: true,
    isShowing: true,
  },
  {
    name: 'Godzilla x Kong: Đế Chế Mới',
    description: 'Hai biểu tượng quái vật buộc phải hợp tác trước một mối đe dọa khổng lồ dưới lòng đất.',
    rating: 8,
    isHot: true,
    isShowing: true,
  },
  {
    name: 'Kung Fu Panda 4',
    description: 'Po bắt đầu chuyến phiêu lưu mới để tìm người kế nhiệm và bảo vệ Thung Lũng Bình Yên.',
    rating: 8,
    isShowing: true,
  },
  {
    name: 'Mai',
    description: 'Một câu chuyện tình cảm về những tổn thương, lựa chọn và cơ hội bắt đầu lại.',
    rating: 8,
    isHot: true,
    isShowing: true,
  },
  {
    name: 'Furiosa: Câu Chuyện Từ Mad Max',
    description: 'Hành trình sinh tồn dữ dội của Furiosa trong thế giới hậu tận thế khắc nghiệt.',
    rating: 8,
    isShowing: true,
  },
  {
    name: 'Deadpool & Wolverine',
    description: 'Deadpool phải hợp tác với Wolverine trong một nhiệm vụ xuyên qua những thực tại bất ngờ.',
    rating: 9,
    isUpcoming: true,
  },
  {
    name: 'Inside Out 2',
    description: 'Riley bước vào tuổi thiếu niên và đón nhận những cảm xúc mới trong tâm trí mình.',
    rating: 9,
    isUpcoming: true,
  },
  {
    name: 'A Quiet Place: Ngày Một',
    description: 'Một thành phố lớn đối mặt với ngày đầu tiên của cuộc xâm lăng từ những sinh vật săn âm thanh.',
    rating: 8,
    isUpcoming: true,
  },
  {
    name: 'Despicable Me 4',
    description: 'Gru và gia đình tiếp tục cuộc sống đầy rắc rối với một thành viên nhỏ tuổi mới.',
    rating: 8,
    isUpcoming: true,
  },
  {
    name: 'Vùng Đất Linh Hồn',
    description: 'Một chuyến phiêu lưu kỳ ảo mở ra thế giới của lòng can đảm, tình thân và sự trưởng thành.',
    rating: 8,
    isUpcoming: true,
  },
  {
    name: 'Chị Chị Em Em 3',
    description: 'Tác phẩm tâm lý drama Việt Nam xoay quanh những bí mật, lựa chọn và mối quan hệ đầy giằng co.',
    rating: 8,
    isHot: true,
    isShowing: true,
  },
  {
    name: 'Trại Buôn Người',
    description: 'Phim hành động hồi hộp xoay quanh cuộc truy đuổi đường dây buôn người và hành trình giải cứu nạn nhân.',
    rating: 8,
    isHot: true,
    isShowing: true,
  },
  {
    name: 'Clayface',
    description: 'Một câu chuyện kinh dị khoa học viễn tưởng về nhân vật có khả năng biến đổi và nỗi ám ảnh không thể kiểm soát.',
    rating: 8,
    isShowing: true,
  },
  {
    name: 'Quỷ Ăn Tạng 4: Hổ Tinh',
    description: 'Cuộc đối đầu hành động kinh dị với lời nguyền về hổ tinh và những thế lực siêu nhiên đáng sợ.',
    rating: 8,
    isShowing: true,
  },
  {
    name: 'Cõi Nguyền',
    description: 'Một lời nguyền cổ xưa kéo cả gia đình vào chuỗi sự kiện bí ẩn và kinh hoàng.',
    rating: 7,
    isShowing: true,
  },
  {
    name: 'Bambi: Lãnh Địa Săn Mồi',
    description: 'Bambi trở lại trong một câu chuyện kinh dị sinh tồn giữa khu rừng bị con người biến thành lãnh địa săn mồi.',
    rating: 7,
    isShowing: true,
  },
  {
    name: 'Gia Đình x Điệp Viên Mã: Trắng',
    description: 'Gia đình Forger bước vào nhiệm vụ mới đầy hài hước, hành động và những tình huống bất ngờ.',
    rating: 8,
    isHot: true,
    isShowing: true,
  },
  {
    name: 'Avatar: Lửa Và Tro Tàn',
    description: 'Hành trình mới trên Pandora mở ra cuộc xung đột giữa các bộ tộc và sức mạnh của thiên nhiên.',
    rating: 9,
    isUpcoming: true,
  },
  {
    name: 'Thám Tử Kiên: Kỳ Án Không Đầu',
    description: 'Vụ án bí ẩn tại một thị trấn ven sông thử thách khả năng suy luận của vị thám tử tài ba.',
    rating: 8,
    isHot: true,
    isShowing: true,
  },
  {
    name: 'Mật Mã Bóng Đêm',
    description: 'Một nhóm chuyên gia phải giải mã tín hiệu bí ẩn trước khi thành phố rơi vào thảm họa.',
    rating: 7,
    isUpcoming: true,
  },
];

async function ensureSeats(roomId) {
  const seatCount = await prisma.seat.count({ where: { roomId } });
  if (seatCount > 0) return;

  await prisma.seat.createMany({
    data: Array.from({ length: 60 }, (_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 10));
      const number = (index % 10) + 1;
      return {
        roomId,
        code: `${row}${number}`,
        name: `${row}${number}`,
        type: row >= 'E' ? 'Vip' : 'Thuong',
      };
    }),
  });
}

async function ensureShowtimes(movieId, roomId, ticketPrice) {
  const existing = await prisma.showtime.count({ where: { movieId, roomId } });
  if (existing > 0) return;

  const firstDay = new Date();
  firstDay.setHours(0, 0, 0, 0);
  const slots = [10, 13, 16, 19, 21];
  await prisma.showtime.createMany({
    data: slots.map((hour, index) => {
      const startAt = new Date(firstDay);
      startAt.setDate(startAt.getDate() + 1 + (movieId % 3));
      startAt.setHours(hour, index % 2 === 0 ? 0 : 30, 0, 0);
      return { movieId, roomId, startAt, ticketPrice };
    }),
  });
}

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

  const systems = [];
  for (const item of systemSeeds) {
    systems.push(await prisma.cinemaSystem.upsert({
      where: { code: item.code },
      update: { name: item.name },
      create: { ...item, logo: '' },
    }));
  }

  const cinemas = [];
  for (const item of cinemaSeeds) {
    const system = systems.find((record) => record.code === item.systemCode);
    const cinema = await prisma.cinema.upsert({
      where: { code: item.code },
      update: { name: item.name, address: item.address, systemId: system.id },
      create: { code: item.code, name: item.name, address: item.address, systemId: system.id },
    });
    cinemas.push(cinema);
  }

  const rooms = [];
  for (const [cinemaIndex, cinema] of cinemas.entries()) {
    for (let roomIndex = 1; roomIndex <= 2; roomIndex += 1) {
      const code = `${cinema.code}-${String(roomIndex).padStart(2, '0')}`;
      const room = await prisma.room.upsert({
        where: { code },
        update: { name: roomIndex === 1 ? 'Phòng tiêu chuẩn' : 'Phòng Premium', cinemaId: cinema.id },
        create: {
          code,
          name: roomIndex === 1 ? 'Phòng tiêu chuẩn' : 'Phòng Premium',
          cinemaId: cinema.id,
        },
      });
      await ensureSeats(room.id);
      rooms.push({ room, price: roomIndex === 1 ? 90000 : 120000, cinemaIndex });
    }
  }

  const movies = [];
  for (const item of movieSeeds) {
    const existing = await prisma.movie.findFirst({ where: { name: item.name } });
    const data = {
      ...item,
      groupCode: 'GP01',
      releaseDate: item.isUpcoming ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : new Date(),
    };
    movies.push(existing
      ? await prisma.movie.update({ where: { id: existing.id }, data })
      : await prisma.movie.create({ data: { ...data, image: null } }));
  }

  for (const [movieIndex, movie] of movies.entries()) {
    const selectedRooms = rooms.filter((item) => item.cinemaIndex % 3 === movieIndex % 3).slice(0, 3);
    for (const item of selectedRooms) {
      await ensureShowtimes(movie.id, item.room.id, item.price);
    }
  }

  console.log(`Seed completed: ${movies.length} movies, ${cinemas.length} cinemas, ${rooms.length} rooms`);
  console.log('Admin account: admin / 123456');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
