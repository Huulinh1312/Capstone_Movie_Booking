# Capstone Movie Booking

Website đặt vé xem phim được xây dựng cho dự án cuối khóa Node.js.
Ứng dụng gồm frontend React và backend NestJS, kết nối cơ sở dữ liệu MySQL.

## Người thực hiện

Đây là dự án cá nhân do **Nguyễn Hữu Linh** thực hiện. Vì dự án chỉ có một thành viên nên không có phân chia task giữa các thành viên; tiến độ được theo dõi bằng bảng task cá nhân và Trello/Excel.

## Demo

- Frontend: <https://capstone-movie-booking.vercel.app>
- Backend API: <https://capstone-movie-booking.onrender.com/api>
- Swagger: <https://capstone-movie-booking.onrender.com/api/docs>

## Chức năng

### Người dùng

- Đăng ký, đăng nhập và xác thực bằng JWT.
- Xem danh sách và thông tin chi tiết phim.
- Xem rạp, phòng chiếu và lịch chiếu.
- Chọn ghế và đặt vé.
- Xem thông tin tài khoản.
- Cập nhật hồ sơ và ảnh đại diện.
- Xem và xóa lịch sử đặt vé của tài khoản.

### Quản trị viên

- Thêm phim và upload hình ảnh.
- Xóa phim.
- Xem danh sách người dùng.
- Xem hệ thống rạp và phòng chiếu.
- Tạo lịch chiếu.
- Phân quyền tài khoản bằng JWT.

## Công nghệ

**Frontend**

- React, Vite
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS

**Backend**

- NestJS, TypeScript
- Prisma
- MySQL/TiDB Cloud
- JWT, bcrypt
- Swagger
- Docker

## Cấu trúc dự án

```text
Capstone_Movie_Booking/
├── backend/       # NestJS API và Prisma
├── frontend/      # React/Vite
├── nodejs_56/     # Code mẫu tham khảo
└── README.md
```

`nodejs_56` chỉ dùng để tham khảo và không thuộc source code chính của dự án.

## Chạy dự án local

### Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
docker compose up -d mysql
npm run prisma:generate
npm run db:push
npm run db:seed
npm run start:dev
```

Backend chạy tại:

```text
http://localhost:3069/api
```

### Frontend

Mở một terminal khác:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

Frontend sử dụng backend production trong `.env.example`:

```env
VITE_API_URL=https://capstone-movie-booking.onrender.com/api
```

Khi chạy cả backend local, đổi thành:

```env
VITE_API_URL=http://localhost:3069/api
```

## Tài khoản kiểm thử

Sau khi chạy seed:

```text
Tài khoản: admin
Mật khẩu: 123456
Quyền: QuanTri
```

## Kiểm tra build

```powershell
cd frontend
npm run build

cd ..\backend
npm run build
```

## Deploy

### Backend Render

- Root Directory: `backend`
- Runtime: Docker
- Database: TiDB Cloud
- Cấu hình `DATABASE_URL`, `JWT_SECRET` và `CLIENT_URL`

### Frontend Vercel

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable:

```env
VITE_API_URL=https://capstone-movie-booking.onrender.com/api
```

## Tài liệu chi tiết

- [README Frontend](./frontend/README.md)
- [README Backend](./backend/README.md)
- [Postman Collection](./backend/postman/Movie-Booking-API.postman_collection.json)
- [Project Tasks](./backend/project-tasks.csv)

## Lưu ý bảo mật

- Không commit file `.env`.
- Không chia sẻ password database, JWT secret hoặc access token.
- Không sử dụng database `sys` cho Prisma.
- Nếu thông tin đăng nhập bị lộ, hãy tạo thông tin mới.
