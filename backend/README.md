# AutoRent - SaaS Car Rental Management Backend

Hệ thống quản lý thuê xe tự lái (SaaS Car Rental Management System) xây dựng trên nền tảng Node.js, Express, Prisma ORM và MySQL.

## Công nghệ sử dụng
* **Core:** Node.js 22 LTS & TypeScript
* **Web Framework:** Express.js (ES Modules)
* **Database & ORM:** MySQL 8 & Prisma ORM
* **Xác thực:** JWT (Access Token & Refresh Token lưu DB)
* **Tải tệp tin:** Multer (Lưu trữ ảnh & tài liệu cục bộ tại `/uploads`)
* **Kiểm tra dữ liệu đầu vào:** Zod Validation
* **Ghi nhật ký:** Winston Logger (Lưu trữ log vào mục `/logs`)
* **Tài liệu hóa API:** Swagger OpenAPI 3.0 & Postman Collection
* **Bảo mật:** Helmet, CORS, Express Rate Limiter, Bcrypt
* **Triển khai:** Docker & Docker Compose

---

## Cấu trúc dự án
```text
backend/
├── prisma/
│   ├── schema.prisma             # Lược đồ database Prisma
│   ├── seed.ts                   # Dữ liệu mẫu (Admin, Danh mục, Cấu hình)
│   └── create_missing_tables.sql # Script tạo các bảng còn thiếu
├── src/
│   ├── config/                   # Cấu hình Prisma, Multer
│   ├── constants/                # Hằng số hệ thống
│   ├── controllers/              # Bộ điều khiển lớp giao tiếp HTTP
│   ├── dtos/                     # Data Transfer Objects
│   ├── helpers/                  # Helper phân trang, truy vấn động
│   ├── middlewares/              # Xử lý lỗi, phân quyền xác thực JWT
│   ├── repositories/             # Lớp giao tiếp trực tiếp với database
│   ├── routes/                   # Định tuyến API
│   ├── services/                 # Logic nghiệp vụ & Payment Strategy
│   ├── utils/                    # Ghi log, định dạng phản hồi, serializer
│   └── app.ts                    # Điểm khởi chạy Express ứng dụng
├── swagger/
│   ├── swagger.json              # Đặc tả Swagger OpenAPI 3.0
│   └── postman_collection.json   # Bộ kiểm thử Postman API
├── Dockerfile                    # Docker build file cho production
├── .env                          # Biến môi trường
└── tsconfig.json                 # Cấu hình biên dịch TypeScript
```

---

## Hướng dẫn cài đặt và chạy ứng dụng

### 1. Chuẩn bị môi trường
Yêu cầu hệ thống đã cài đặt:
* Node.js v22+
* MySQL 8
* Docker & Docker Compose (nếu muốn chạy qua container)

### 2. Cài đặt các gói phụ thuộc (Local)
Mở terminal tại thư mục `backend/` và chạy lệnh:
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` tại thư mục `backend/` (đã có sẵn mẫu cấu hình mặc định):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:@localhost:3306/autorent_db"
JWT_SECRET="autorent_jwt_access_secret_key_2026_super_secure"
JWT_REFRESH_SECRET="autorent_jwt_refresh_secret_key_2026_super_secure_refresh"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
```

### 4. Đồng bộ cấu trúc Database & Chạy Seed dữ liệu
Tạo các bảng còn thiếu và nạp dữ liệu quản trị viên mẫu:
```bash
# Nạp dữ liệu seed ban đầu (Admin account, Vehicle Categories, System Settings)
npm run seed
```

Tài khoản quản trị viên mặc định:
* **Email:** `admin@autorent.vn`
* **Mật khẩu:** `admin123`

### 5. Chạy ứng dụng chế độ Phát triển (Development)
```bash
npm run dev
```
Hệ thống sẽ chạy tại địa chỉ: `http://localhost:5000`

---

## Tài liệu hóa và Kiểm thử API

### 1. Swagger UI Document
Truy cập đường dẫn sau trên trình duyệt để kiểm tra mô tả API và chạy thử trực tiếp:
* **Link:** `http://localhost:5000/api-docs`

### 2. Postman Collection
Bạn có thể nhập tệp tin kiểm thử Postman có sẵn tại:
* [Postman Collection](file:///D:/AutoRent/backend/swagger/postman_collection.json)

---

## Nghiệp vụ đặc thù

### 1. Quy trình đổi trạng thái đơn đặt xe (Booking Status History)
Mỗi lần đơn hàng chuyển trạng thái (`PENDING` -> `CONFIRMED` -> `ACTIVE` -> `COMPLETED`), hệ thống sẽ tự động:
1. Lưu lại biên bản lịch sử trạng thái tại bảng `booking_status_history`.
2. Tự động đổi trạng thái của xe tương ứng (`AVAILABLE`, `RESERVED`, `RENTED`).
3. Gửi thông báo hệ thống (Notification) về tài khoản khách hàng.

### 2. Chiến lược Thanh toán (Payment Strategy Pattern)
Lớp thanh toán áp dụng thiết kế **Strategy Pattern** giúp dễ dàng hoán đổi/nâng cấp cổng thanh toán trực tuyến:
* **CASH**: Giao dịch tại văn phòng.
* **BANK_TRANSFER**: Tạo mã VietQR thanh toán quét QR nhanh.
* **VNPAY**: Tạo link chuyển hướng sang cổng thanh toán VNPay Sandbox.
* **MOMO**: Tạo link chuyển hướng sang cổng thanh toán MoMo Sandbox.

### 3. Upload File tích hợp chung (One Media Table)
Toàn bộ ảnh xe, giấy tờ tùy thân khách hàng, ảnh nghiệm thu bàn giao và hóa đơn thanh toán đều được lưu chung vào bảng duy nhất `media_files` để tối ưu liên kết quan hệ và quản lý tệp tin.

---

## Triển khai bằng Docker Compose
Để chạy toàn bộ hệ thống gồm MySQL và Node.js Backend trong các container độc lập:
1. Quay lại thư mục gốc dự án `D:\AutoRent`.
2. Chạy lệnh:
```bash
docker-compose up --build -d
```
Hệ thống sẽ khởi tạo container MySQL và tự động liên kết kết nối đến Backend API chạy trên cổng `5000`.
