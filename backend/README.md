# Movie Booking Backend (NestJS + TypeScript)

Backend độc lập cho đồ án Movie, viết theo cấu trúc `nodejs_56/nestjs/gateway`, không sửa thư mục `nodejs_56`.

## Chạy lần đầu

```powershell
cd backend
Copy-Item .env.example .env
npm install
docker compose up -d mysql
npm run db:push
npx prisma generate
npm run db:seed
npm run start:dev
```

- API: `http://localhost:3069/api`
- Swagger: `http://localhost:3069/api/docs`
- Health check: `http://localhost:3069/health`
- Tài khoản seed: `admin` / `123456`

`db:push` được dùng cho môi trường Docker học tập hiện tại vì tài khoản
`movie_user` không có quyền tạo shadow database của Prisma Migrate. Khi triển
khai production, có thể cấp quyền tạo database cho user migration rồi dùng
`npm run prisma:migrate`.

## TablePlus

Tạo kết nối MySQL với host `127.0.0.1`, port `3307`, database `movie_booking`, user `movie_user`, password `movie_password`.

## Postman

Gọi `POST /api/QuanLyNguoiDung/DangKy`, sau đó `POST /api/QuanLyNguoiDung/DangNhap`. Lưu `data.accessToken` vào biến `accessToken` và dùng header `Authorization: Bearer {{accessToken}}`.

Các API đọc phim/rạp không cần đăng nhập. API thêm, sửa, xóa phim và tạo lịch chiếu cần tài khoản admin. API `DatVe` cần tài khoản người dùng.

## Kết nối frontend

Đặt biến môi trường frontend `VITE_API_URL=http://localhost:3069/api` và cấu hình `axiosInstance` dùng giá trị này. Khi deploy, đổi URL thành domain backend đã deploy và thêm domain frontend vào `CLIENT_URL`.

## Cấu trúc source

```text
src/
├── common/
│   ├── decorators/
│   └── guard/
├── modules-api/
│   ├── auth/
│   ├── bookings/
│   └── movies/
├── modules-system/
│   └── prisma/
├── app.module.ts
└── main.ts
```

Các module mới nên tuân theo mẫu `module -> controller -> service -> dto` giống thư mục mẫu NestJS.

## Tài liệu nộp dự án

- Postman Collection: `postman/Movie-Booking-API.postman_collection.json`
- Bảng phân công có thể mở trực tiếp bằng Excel: `project-tasks.csv`
- Docker production: `Dockerfile`

Các task hiện được chia cho Nguyễn Hữu Linh và Trương Tuấn Tú trong file CSV.

## Production

Build image:

```powershell
docker build -t movie-booking-api .
```

Run bằng biến môi trường production:

```powershell
docker run --name movie-booking-api -d -p 3069:3069 --env-file .env movie-booking-api
```

Production cần MySQL cloud; không dùng thông tin database local trong `.env.example`.
