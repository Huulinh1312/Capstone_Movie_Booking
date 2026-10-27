# Movie Booking Backend

Backend cho dự án đặt vé xem phim cuối khóa, xây dựng bằng NestJS,
TypeScript, Prisma và MySQL/TiDB Cloud.

Thư mục `nodejs_56` là code mẫu tham khảo và không thuộc backend này.

## Công nghệ

- NestJS 11
- TypeScript
- Prisma 6
- MySQL compatible database
- TiDB Cloud cho production
- JWT và bcrypt
- Swagger
- Multer upload hình ảnh
- Docker

## Môi trường production

Backend production:

- API: <https://capstone-movie-booking.onrender.com/api>
- Swagger: <https://capstone-movie-booking.onrender.com/api/docs>
- Health check: <https://capstone-movie-booking.onrender.com/health>

Swagger là tài liệu chính để xem endpoint, query, body và response hiện tại.

## Cài đặt local

### Yêu cầu

- Node.js 20 trở lên.
- npm 10 trở lên.
- MySQL local hoặc Docker Desktop.
- Git và PowerShell.

### Cách 1: Dùng Docker MySQL

Từ thư mục gốc dự án:

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

Backend local:

```text
http://localhost:3069/api
```

Swagger local:

```text
http://localhost:3069/api/docs
```

Health check local:

```text
http://localhost:3069/health
```

### Cách 2: Dùng MySQL đã cài trên máy

Tạo database `movie_booking`, sau đó cấu hình `DATABASE_URL` trong file
`.env` theo thông tin MySQL của máy. Ví dụ an toàn, không dùng mật khẩu thật:

```env
PORT=3069
DATABASE_URL="mysql://movie_user:movie_password@localhost:3307/movie_booking"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="http://localhost:5173"
```

Sau đó chạy:

```powershell
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run start:dev
```

Không sử dụng database hệ thống như `sys` cho Prisma. Hãy dùng database riêng
như `movie_booking`.

## Biến môi trường

Các biến bắt buộc:

```env
PORT=3069
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="http://localhost:5173"
```

Production dùng connection string TiDB Cloud có SSL. Ví dụ dạng tổng quát:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/movie_booking?sslaccept=strict"
```

Không commit các file `.env`, không đưa password database hoặc JWT secret lên
GitHub, ảnh chụp màn hình, Postman public workspace hay README.

## Prisma và database

Sinh Prisma Client:

```powershell
npm run prisma:generate
```

Đồng bộ schema với database:

```powershell
npm run db:push
```

Seed dữ liệu mẫu:

```powershell
npm run db:seed
```

Seed hiện tạo dữ liệu mẫu idempotent gồm:

- 10 phim mẫu không kèm poster để bạn upload sau trong Admin.
- 4 hệ thống rạp: CGV, Galaxy, Lotte và BHD Star.
- 8 cụm rạp, 16 phòng chiếu và 60 ghế mỗi phòng.
- Nhiều lịch chiếu với giá vé thường và Premium.

Chạy lại lệnh seed không tạo phim, rạp, phòng hoặc lịch chiếu trùng và không
ghi đè poster đã upload của các phim tồn tại.

### Lưu ý về poster phim trên Render

Poster upload từ Admin được lưu trực tiếp trong database dưới dạng dữ liệu ảnh,
không phụ thuộc vào thư mục `uploads` tạm của Render. Vì vậy poster không bị mất
khi service restart hoặc deploy lại. Database cần được đồng bộ schema trước khi
chạy bản backend mới:

```powershell
npm run prisma:generate
npm run db:push
```

Tài khoản seed:

```text
Tài khoản: admin
Mật khẩu: 123456
Quyền: QuanTri
```

Lệnh `db:push` phù hợp cho môi trường học tập và database mới. Trước khi
thay đổi database production, cần backup và kiểm tra schema.

## Kết nối bằng TablePlus

Với Docker local, dùng thông tin:

```text
Host:     127.0.0.1
Port:     3307
Database: movie_booking
User:     movie_user
Password: movie_password
```

Thông tin trên chỉ là cấu hình local mẫu. Không dùng nó để kết nối TiDB
production.

## API chính

### Authentication

```text
POST /api/QuanLyNguoiDung/DangKy
POST /api/QuanLyNguoiDung/DangNhap
GET  /api/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung
```

### Phim

```text
GET    /api/QuanLyPhim/LayDanhSachPhim
GET    /api/QuanLyPhim/LayThongTinPhim
GET    /api/QuanLyPhim/LayDanhSachBanner
GET    /api/QuanLyPhim/LayDanhSachPhimPhanTrang
GET    /api/QuanLyPhim/LayDanhSachPhimTheoNgay
POST   /api/QuanLyPhim/ThemPhimUploadHinh
POST   /api/QuanLyPhim/QuanLyPhim
POST   /api/QuanLyPhim/CapNhatPhimUpload
DELETE /api/QuanLyPhim/XoaPhim
DELETE /api/QuanLyPhim/XP
```

### Rạp và lịch chiếu

```text
GET /api/QuanLyRap/LayThongTinHeThongRap
GET /api/QuanLyRap/LayThongTinCumRapTheoHeThong
GET /api/QuanLyRap/LayThongTinLichChieuHeThongRap
GET /api/QuanLyRap/LayThongTinLichChieuPhim
```

### Đặt vé

```text
GET  /api/QuanLyDatVe/LayDanhSachPhongVe
POST /api/QuanLyDatVe/DatVe
POST /api/QuanLyDatVe/TaoLichChieu
```

Payload đặt vé:

```json
{
  "maLichChieu": 1,
  "danhSachVe": [
    {
      "maGhe": 1,
      "giaVe": 90000
    }
  ]
}
```

### Người dùng và quản trị

```text
GET    /api/QuanLyNguoiDung/LayDanhSachNguoiDung
GET    /api/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang
GET    /api/QuanLyNguoiDung/TimKiemNguoiDung
GET    /api/QuanLyNguoiDung/TimKiemNguoiDungPhanTrang
POST   /api/QuanLyNguoiDung/ThongTinTaiKhoan
POST   /api/QuanLyNguoiDung/LayThongTinNguoiDung
POST   /api/QuanLyNguoiDung/ThemNguoiDung
PUT    /api/QuanLyNguoiDung/CapNhatThongTinNguoiDung
POST   /api/QuanLyNguoiDung/CapNhatThongTinNguoiDung
DELETE /api/QuanLyNguoiDung/XoaNguoiDung
```

Các endpoint quản trị yêu cầu:

```http
Authorization: Bearer <accessToken>
```

## Response quan trọng

Đăng nhập trả trực tiếp access token:

```json
{
  "taiKhoan": "admin",
  "email": "admin@example.com",
  "hoTen": "Administrator",
  "maLoaiNguoiDung": "QuanTri",
  "accessToken": "..."
}
```

Danh sách ghế:

```json
{
  "thongTinPhim": {},
  "danhSachGhe": [
    {
      "id": 1,
      "code": "A1",
      "name": "A1",
      "type": "Thuong",
      "roomId": 1,
      "daDat": false
    }
  ]
}
```

## Postman

Collection nằm tại:

```text
backend/postman/Movie-Booking-API.postman_collection.json
```

Khi chạy local, biến `baseUrl` dùng:

```text
http://localhost:3069/api
```

Khi kiểm thử production, đổi thành:

```text
https://capstone-movie-booking.onrender.com/api
```

Quy trình kiểm thử:

1. Đăng ký tài khoản.
2. Đăng nhập và lấy `accessToken`.
3. Gửi token qua Bearer Auth.
4. Gọi API danh sách phim và lịch chiếu.
5. Gọi API lấy danh sách phòng vé.
6. Đặt một ghế chưa được đặt.
7. Thử đặt lại cùng ghế để kiểm tra lỗi xung đột.
8. Dùng tài khoản admin để kiểm tra API quản trị.

## Cấu trúc source

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.cjs
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   └── guard/
│   ├── modules-api/
│   │   ├── auth/
│   │   ├── bookings/
│   │   ├── cinemas/
│   │   ├── movies/
│   │   └── users/
│   ├── modules-system/
│   │   └── prisma/
│   ├── app.module.ts
│   └── main.ts
├── postman/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

Mỗi module API nên giữ cấu trúc:

```text
module/
├── controller
├── service
├── dto
└── module
```

## Build và chạy production

Build TypeScript:

```powershell
npm run build
```

Chạy bản đã build:

```powershell
npm run start:prod
```

Build Docker image:

```powershell
docker build -t movie-booking-api .
```

Chạy container bằng file biến môi trường local hoặc production:

```powershell
docker run --name movie-booking-api -d -p 3069:3069 --env-file .env movie-booking-api
```

Không đưa `.env` vào image hoặc repository.

## Deploy backend lên Render

1. Tạo Web Service từ repository GitHub.
2. Chọn Docker làm runtime.
3. Đặt Root Directory là:

```text
backend
```

4. Chọn branch cần deploy, thường là `main`.
5. Thêm các biến môi trường:

```text
PORT=3069
DATABASE_URL=<connection-string-TiDB-co-ssl>
JWT_SECRET=<secret-ngau-nhien>
CLIENT_URL=<domain-Vercel-cua-frontend>
```

6. Deploy và mở health check.
7. Mở Swagger để kiểm tra endpoint.

TiDB Cloud yêu cầu SSL và database không được là database hệ thống `sys`.
Hãy dùng database riêng, ví dụ `movie_booking`.

## Tài liệu nộp dự án

- Source code GitHub.
- Swagger backend.
- Postman collection.
- `project-tasks.csv` để mở bằng Excel.
- Dockerfile và docker-compose cho môi trường local.
- Link frontend Vercel.
- Link backend Render.
- Video demo các chức năng.

## Lưu ý bảo mật

- Không commit `.env`.
- Không commit password TiDB, JWT secret hoặc access token.
- Nếu password đã bị lộ, phải tạo password mới.
- Không sử dụng database `sys` cho Prisma.
- Chỉ cho phép frontend production trong `CLIENT_URL` khi deploy.
- Không tắt xác thực JWT để sửa lỗi tạm thời trên production.
