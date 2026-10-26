# Movie Booking Frontend

Frontend cho dự án đặt vé xem phim cuối khóa, xây dựng bằng React, Vite,
Tailwind CSS, Redux Toolkit và Axios.

Frontend được triển khai độc lập với backend. Backend production hiện tại:

- API: <https://capstone-movie-booking.onrender.com/api>
- Swagger: <https://capstone-movie-booking.onrender.com/api/docs>

## Công nghệ

- React 19
- Vite
- React Router
- Redux Toolkit và React Redux
- TanStack React Query
- Axios
- Tailwind CSS
- Formik và Yup

## Chức năng

### Người dùng

- Xem danh sách phim.
- Tìm kiếm phim theo tên.
- Xem chi tiết phim.
- Xem lịch chiếu.
- Xem hệ thống rạp và phòng chiếu.
- Đăng ký và đăng nhập.
- Chọn ghế theo lịch chiếu.
- Đặt vé bằng tài khoản đã đăng nhập.
- Xem thông tin tài khoản.

### Quản trị viên

- Xem danh sách phim.
- Thêm phim và upload hình ảnh.
- Xóa phim.
- Xem người dùng.
- Xem hệ thống rạp và phòng chiếu.
- Tạo lịch chiếu.

## Cấu trúc thư mục

```text
frontend/
├── public/                 # Hình nền và tài nguyên tĩnh
├── src/
│   ├── api/                # Các service gọi backend
│   ├── components/         # Component dùng chung và route guard
│   ├── Layout/             # Layout người dùng và quản trị
│   ├── pages/              # Các màn hình của ứng dụng
│   ├── store/              # Redux store và auth slice
│   ├── App.jsx             # Khai báo routes
│   ├── index.css           # CSS toàn cục
│   └── main.jsx            # Điểm khởi động React
├── .env.example            # Biến môi trường mẫu
├── package.json
└── vite.config.js
```

## Yêu cầu môi trường

- Node.js 20 trở lên.
- npm 10 trở lên.
- Backend đang chạy local hoặc có thể truy cập backend production.

## Cài đặt và chạy local

Từ thư mục gốc dự án:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

Mở địa chỉ được Vite hiển thị trong terminal để sử dụng ứng dụng.

## Biến môi trường

File `.env.example` hiện được cấu hình với backend production:

```env
VITE_API_URL=https://capstone-movie-booking.onrender.com/api
```

Nếu chạy backend local, có thể đổi thành:

```env
VITE_API_URL=http://localhost:3069/api
```

Không commit file `.env` nếu file này chứa thông tin riêng của môi trường.
Vite chỉ expose các biến bắt đầu bằng `VITE_`.

## API và xác thực

Tất cả request được gửi qua [axiosInstance.js](./src/api/axiosInstance.js).
Sau khi đăng nhập, access token được lưu ở localStorage và tự động gửi qua
header:

```http
Authorization: Bearer <accessToken>
```

URL hình ảnh tương đối từ backend, ví dụ `/uploads/movie.jpg`, được chuyển
thành URL đầy đủ của backend bằng helper `getAssetUrl`.

Các nhóm API frontend sử dụng:

```text
src/api/authApi.js
src/api/movieApi.js
src/api/cinemaApi.js
src/api/showtimesApi.js
src/api/userApi.js
```

## Các route chính

```text
/                    Trang chủ
/movies              Danh sách phim
/movies/:id          Chi tiết phim
/cinemas             Hệ thống rạp
/booking/:showtimeId Chọn ghế và đặt vé
/profile             Thông tin tài khoản
/login               Đăng nhập
/register            Đăng ký
/admin               Trang quản trị
```

Route quản trị yêu cầu user có role `QuanTri` hoặc `ADMIN`. Route đặt vé yêu
cầu đăng nhập trước khi xác nhận đặt vé.

## Tài khoản kiểm thử

Nếu backend đã chạy seed thành công:

```text
Tài khoản: admin
Mật khẩu: 123456
Quyền: QuanTri
```

Không dùng tài khoản này cho môi trường production thật.

## Kiểm tra chất lượng

Build production:

```powershell
npm run build
```

Xem bản build bằng Vite preview:

```powershell
npm run preview
```

Lint:

```powershell
npm run lint
```

`npm run build` phải hoàn tất thành công trước khi deploy.

## Deploy lên Vercel

1. Import repository GitHub vào Vercel.
2. Chọn thư mục:

```text
Root Directory: frontend
```

3. Vercel tự nhận diện framework Vite. Nếu cần nhập thủ công:

```text
Build Command: npm run build
Output Directory: dist
```

4. Thêm Environment Variable:

```text
Name:  VITE_API_URL
Value: https://capstone-movie-booking.onrender.com/api
```

5. Deploy hoặc Redeploy project.
6. Sao chép domain Vercel và cập nhật biến `CLIENT_URL` ở backend Render.

Sau khi thay đổi `VITE_API_URL`, cần redeploy vì Vite đưa biến môi trường vào
bundle tại thời điểm build.

## Kiểm tra sau deploy

1. Mở trang frontend Vercel.
2. Đăng ký hoặc đăng nhập.
3. Kiểm tra danh sách phim và chi tiết phim.
4. Chọn lịch chiếu.
5. Kiểm tra sơ đồ ghế.
6. Đặt một ghế chưa được đặt.
7. Đăng nhập tài khoản admin và kiểm tra `/admin`.
8. Nếu request bị CORS, kiểm tra `CLIENT_URL` trên Render.

Backend Render có thể mất vài chục giây để thức dậy sau một thời gian không
hoạt động. Đây không phải lỗi cấu hình frontend.

