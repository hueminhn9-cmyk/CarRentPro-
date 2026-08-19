# TÀI LIỆU MÔ TẢ CHỨC NĂNG NGHIỆP VỤ

## Tên dự án: AutoRent — Hệ thống Quản lý Cho thuê Xe Tự lái SaaS

> Phiên bản: 1.0.0 · Ngày tạo: 16/08/2026 · Stack: React + Node.js + MySQL + Prisma

---

## 1. TỔNG QUAN HỆ THỐNG

AutoRent là nền tảng SaaS (Software as a Service) quản lý toàn bộ quy trình nghiệp vụ cho thuê xe tự lái, bao gồm:

- Đặt xe trực tuyến cho khách hàng
- Quản lý vận hành & bàn giao xe cho nhân viên (Manager)
- Quản trị hệ thống toàn cục cho Admin
- Theo dõi hạm đội, bảo dưỡng, hợp đồng điện tử, thanh toán

### 1.1 Kiến trúc tổng quan

| Lớp | Công nghệ |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Ant Design 5 |
| Backend API | Node.js + Express + TypeScript |
| Cơ sở dữ liệu | MySQL 8.4 + Prisma ORM |
| Xác thực | JWT (Access Token 15 phút + Refresh Token 7 ngày) |
| Triển khai | Docker Compose |
| Tài liệu API | Swagger UI (/api-docs) |

### 1.2 Phân hệ & địa chỉ truy cập

| Phân hệ | Đường dẫn | Mô tả |
|---|---|---|
| Trang chủ | / | Giới thiệu dịch vụ, xe nổi bật |
| Cổng đặt xe | /vehicles | Tìm kiếm, lọc và đặt xe |
| Khách hàng | /customer/* | Dashboard, đơn thuê, tài liệu |
| Quản lý | /manager/* | Bảng vận hành Manager |
| Quản trị | /admin/* | Quản trị toàn hệ thống |
| API Backend | http://localhost:5000/api | RESTful API |

---

## 2. PHÂN QUYỀN (3 VAI TRÒ)

### 2.1 CUSTOMER — Khách hàng thuê xe

- Đăng ký / Đăng nhập tài khoản
- Tìm kiếm và xem danh sách, chi tiết xe
- Đặt xe & thanh toán trực tuyến
- Ký hợp đồng điện tử
- Xem lịch sử đơn thuê
- Tải lên và quản lý giấy tờ cá nhân (CCCD, GPLX)
- Gửi đánh giá & nhận xét sau chuyến đi
- Xem thông báo hệ thống

### 2.2 MANAGER — Quản lý vận hành

Bao gồm tất cả quyền CUSTOMER, cộng thêm:
- Xem bảng điều hành vận hành Manager
- Duyệt/từ chối đơn đặt xe
- Thực hiện biên bản bàn giao xe (PICKUP / RETURN)
- Xác minh giấy tờ GPLX của khách hàng
- Quản lý lịch bảo dưỡng xe

### 2.3 ADMIN — Quản trị viên hệ thống

Bao gồm tất cả quyền MANAGER, cộng thêm:
- Quản lý toàn bộ xe trong hạm đội (CRUD)
- Quản lý toàn bộ người dùng (bao gồm Manager)
- Xem báo cáo doanh thu & phân tích
- Quản lý hợp đồng
- Xem nhật ký kiểm toán (Audit Logs)
- Cấu hình tham số hệ thống

---

## 3. MÔ TẢ CHI TIẾT CHỨC NĂNG NGHIỆP VỤ

---

### 3.1 Xác thực & Bảo mật

#### Đăng ký tài khoản
- Thông tin: Họ tên, Email (duy nhất), Số điện thoại (duy nhất), Mật khẩu (bcrypt)
- Sau đăng ký: tự động tạo hồ sơ khách hàng, trạng thái ACTIVE, vai trò CUSTOMER

#### Đăng nhập
- Xác thực qua email + mật khẩu
- Trả về Access Token (15 phút) và Refresh Token (7 ngày)
- Token Rotation: Refresh Token cũ bị thu hồi sau mỗi lần làm mới

#### Các tính năng bảo mật khác
- Quên mật khẩu / Đặt lại mật khẩu qua token
- Đổi mật khẩu khi đã đăng nhập
- Đăng xuất (thu hồi Refresh Token)

---

### 3.2 Quản lý Phương tiện

#### Thông tin mỗi xe
- Mã xe, tên, thương hiệu, dòng xe, năm sản xuất
- Biển kiểm soát, màu sắc, số chỗ ngồi
- Hộp số (AUTO / MANUAL), loại nhiên liệu (GASOLINE / DIESEL / HYBRID / ELECTRIC)
- Số km hiện tại, km bao gồm/ngày (200 km mặc định), phí km vượt
- Giá thuê/ngày, tiền đặt cọc, địa điểm đậu xe

#### Vòng đời trạng thái xe
```
AVAILABLE --> RESERVED (có đặt cọc) --> RENTED (bàn giao xe)
   |                                         |
   +------ AVAILABLE (trả xe) <-------------+

AVAILABLE --> MAINTENANCE (bảo dưỡng) --> AVAILABLE (hoàn thành)
AVAILABLE --> INCIDENT (sự cố)
AVAILABLE --> INACTIVE (tạm ngưng)
```

#### Danh mục xe (5 loại)
- Sedan: Xe 4-5 chỗ, phù hợp đô thị
- SUV: Xe gầm cao 5-7 chỗ, địa hình
- Hatchback: Xe nhỏ gọn, tiết kiệm
- Pickup: Xe bán tải đa dụng
- Luxury: Dòng xe hạng sang cao cấp

---

### 3.3 Quy trình Đặt xe (4 bước)

```
Bước 1: Tìm kiếm xe
Bước 2: Chọn ngày nhận/trả & địa điểm
Bước 3: Xem chi tiết đặt xe (phân tích giá, dịch vụ bổ sung)
Bước 4: Chọn phương thức thanh toán & Xác nhận
Kết quả: Đơn thuê [PENDING] + Biên lai đặt xe
```

#### Công thức tính giá
```
Tổng tiền = (Giá/ngày x Số ngày)
           + Phí dịch vụ bổ sung
           + Phí bảo hiểm vật chất
           - Chiết khấu (nếu có)
           + Phụ phí phát sinh (km vượt, trễ giờ, xăng, vệ sinh, hư hại)
```
- Tiền cọc: Tính riêng, hoàn trả sau khi kết thúc (trừ phụ phí nếu có)
- Mã đặt xe tự động: Format AR-YYYYMMDD-XXX (VD: AR-20260816-001)

#### Vòng đời trạng thái đơn thuê
```
PENDING (Chờ xác nhận)
  |-- [Duyệt] --> CONFIRMED (Đã xác nhận)
  |-- [Từ chối] --> REJECTED

CONFIRMED --> READY_FOR_PICKUP (Khách ký HĐ + Trả cọc)
READY_FOR_PICKUP --> ACTIVE (Biên bản PICKUP)
ACTIVE --> WAITING_FOR_RETURN (Khách trả xe)
WAITING_FOR_RETURN --> COMPLETED (Biên bản RETURN + Thanh lý)

Từ bất kỳ trạng thái nào trước ACTIVE:
  --> CANCELLED (Hủy đơn)
  --> OVERDUE (Quá hạn)
```

#### Dịch vụ bổ sung
- Thiết bị định vị GPS: 50.000 VND/ngày
- Ghế ngồi trẻ em: 50.000 VND/ngày
- Bảo hiểm tai nạn tự nguyện: 100.000 VND/ngày
- Bộ phát Wifi 4G: 30.000 VND/ngày

---

### 3.4 Thanh toán

#### Phương thức thanh toán
| Phương thức | Mã | Mô tả |
|---|---|---|
| Tiền mặt | CASH | Tại showroom |
| Chuyển khoản | BANK_TRANSFER | QR banking |
| VNPay | VNPAY | Cổng thanh toán online |
| MoMo | MOMO | Ví điện tử |
| Thẻ tín dụng | CREDIT_CARD | Thẻ quốc tế |

#### Loại giao dịch
| Loại | Mô tả |
|---|---|
| DEPOSIT | Thanh toán cọc giữ xe |
| RENTAL | Thanh toán tiền thuê |
| SERVICE_FEE | Phí dịch vụ bổ sung |
| SURCHARGE | Phụ phí phát sinh |
| REFUND | Hoàn tiền cọc |

- Mã giao dịch tự động: TXN-AR-YYYYMMDD-XXXX
- Trạng thái: PENDING --> PAID --> REFUNDED hoặc FAILED

---

### 3.5 Hợp đồng Điện tử

#### Quy trình hợp đồng
```
Đặt xe thành công --> Tạo hợp đồng [PENDING_SIGN]
--> Khách ký online [SIGNED]
--> Giao xe [Booking ACTIVE]
--> Hoàn thành [TERMINATED]
```

#### Trạng thái hợp đồng
| Trạng thái | Mô tả |
|---|---|
| PENDING_SIGN | Chờ khách hàng ký điện tử |
| SIGNED | Đã ký, có hiệu lực pháp lý |
| TERMINATED | Đã thanh lý |
| CANCELLED | Hủy (do hủy đơn) |

#### Nội dung hợp đồng bao gồm
- Thông tin 2 bên (AutoRent & bên thuê)
- Thông tin phương tiện (biển số, tình trạng)
- Thời gian thuê, địa điểm nhận/trả xe
- Chi phí thuê, tiền cọc, phương thức thanh toán
- Điều khoản & điều kiện sử dụng xe
- Chính sách bảo hiểm & xử lý sự cố
- Chữ ký điện tử + thời gian ký

---

### 3.6 Biên bản Bàn giao Xe

#### Biên bản giao xe (PICKUP)
Thực hiện bởi: Manager

Thông tin ghi nhận:
- Số km đồng hồ, mức nhiên liệu (%)
- Tình trạng: EXCELLENT / GOOD / NORMAL / DAMAGED
- Mô tả chi tiết tình trạng, ghi chú

Danh mục kiểm tra bắt buộc (7 mục):
1. Đối chiếu CCCD và GPLX bản gốc
2. Kiểm tra ngoại thất: thân vỏ, gương, kính
3. Kiểm tra nội thất: ghế, bảng điều khiển
4. Mức pin/nhiên liệu đạt tiêu chuẩn (>80%)
5. Kiểm tra lốp xe, lốp dự phòng, dụng cụ
6. Bàn giao chìa khóa và giấy tờ xe
7. Khách ký xác nhận biên bản

#### Biên bản nhận xe (RETURN)
Thực hiện bởi: Manager

Phụ phí có thể phát sinh:
| Loại phụ phí | Mô tả |
|---|---|
| late_fee | Phí trả xe trễ |
| extra_km_fee | Phí km vượt định mức |
| fuel_fee | Phí đổ xăng |
| cleaning_fee | Phí vệ sinh xe |
| damage_fee | Phí bồi thường hư hại |

---

### 3.7 Bảo dưỡng Xe

#### Vòng đời lịch bảo dưỡng
```
SCHEDULED --> IN_PROGRESS --> COMPLETED
Hoặc: SCHEDULED --> CANCELLED / OVERDUE
```

#### Thông tin lịch bảo dưỡng
| Trường | Mô tả |
|---|---|
| Loại bảo dưỡng | Hạng mục thực hiện |
| Ngày lên lịch | Ngày dự kiến |
| Ngày hoàn thành | Ngày thực tế |
| Số km tại lần bảo dưỡng | Km đồng hồ |
| Ngày bảo dưỡng tiếp theo | Lịch kỳ tiếp |
| Chi phí | VND |
| Mô tả | Nội dung công việc |

Lưu ý: Xe đang MAINTENANCE không thể được đặt cho đến khi hoàn thành.

---

### 3.8 Hồ sơ Khách hàng

#### Thông tin hồ sơ
| Trường | Mô tả |
|---|---|
| Ngày sinh | Xác nhận đủ 18 tuổi |
| Địa chỉ | Địa chỉ thường trú |
| Số CCCD/CMND | Phải duy nhất |
| Số GPLX | Số giấy phép lái xe |
| Ngày hết hạn GPLX | Phải còn hạn ≥ 3 tháng |

#### Trạng thái xác minh
```
PENDING (Đã nộp, chờ duyệt)
  |-- [Admin/Manager kiểm tra] --> VERIFIED (Được phép thuê xe)
  |-- [Từ chối] --> REJECTED (GPLX không hợp lệ)
```

BẮT BUỘC: Phải có trạng thái VERIFIED mới được nhận bàn giao xe.

Upload giấy tờ:
- Ảnh GPLX mặt trước + mặt sau
- Hỗ trợ: JPG, PNG, PDF (tối đa 5MB)

---

### 3.9 Đánh giá & Nhận xét

Quy tắc:
- Chỉ đơn thuê COMPLETED mới được gửi đánh giá
- Mỗi đơn thuê chỉ được đánh giá 1 lần
- Đánh giá sao từ 1 đến 5
- Có thể kèm nội dung nhận xét

Quyền quản trị:
- Admin: xem / chỉnh sửa / xóa đánh giá vi phạm
- Điểm trung bình tự động cập nhật trên trang chi tiết xe

---

### 3.10 Thông báo hệ thống

| Sự kiện | Người nhận | Loại |
|---|---|---|
| Đặt xe thành công | Khách hàng | SUCCESS |
| Đơn được duyệt/từ chối | Khách hàng | SUCCESS / ERROR |
| Thanh toán xác nhận | Khách hàng | SUCCESS |
| Nhắc nhở ký hợp đồng | Khách hàng | WARNING |
| GPLX được xác minh/từ chối | Khách hàng | SUCCESS / ERROR |
| Xe sắp đến ngày bảo dưỡng | Admin/Manager | WARNING |
| Khuyến mãi | Khách hàng | PROMO |

Tính năng: đánh dấu đã đọc, đếm badge chưa đọc, xem lịch sử thông báo.

---

### 3.11 Dashboard & Báo cáo

#### Dashboard Admin - KPI tổng quan
- Tổng số xe trong hạm đội
- Số xe đang cho thuê
- Số xe đang bảo dưỡng
- Doanh thu lũy kế
- Biểu đồ doanh thu 7 tháng gần nhất
- Phân bổ trạng thái xe (Pie chart)
- 5 đơn thuê cập nhật gần nhất
- Cảnh báo xe cần bảo dưỡng

#### Dashboard Manager - KPI vận hành
- Số đơn chờ duyệt & tạo hợp đồng
- Số xe đang lưu hành hôm nay
- Số hồ sơ GPLX chờ xác minh
- Tỷ lệ xe sẵn sàng cho thuê (%)

#### Báo cáo Doanh thu (Admin)
- Tổng doanh thu thực tế
- Doanh thu hôm nay
- Tổng số lượt đặt xe
- Biểu đồ doanh thu theo tháng
- Doanh thu theo loại phương tiện (Sedan / SUV / Hatchback / Pickup / Luxury)
- Bảng phân tích dòng tiền chi tiết theo tháng

---

### 3.12 Quản lý Người dùng (Admin)

#### Quản lý Khách hàng
- Xem danh sách, tìm kiếm, lọc
- Xem chi tiết hồ sơ (thông tin, GPLX, lịch sử đặt xe)
- Duyệt/từ chối xác minh GPLX
- Khóa/mở khóa tài khoản (ACTIVE / BLOCKED)

#### Quản lý Manager
- Tạo tài khoản Manager mới
- Cập nhật thông tin (tên, email, số điện thoại)
- Đặt lại mật khẩu
- Xóa tài khoản Manager

---

### 3.13 Cài đặt Hệ thống

#### Thông tin chung
| Tham số | Mô tả |
|---|---|
| Tên doanh nghiệp | Tên công ty/nền tảng |
| Hotline | Số điện thoại hỗ trợ 24/7 |
| Email liên hệ | Email nghiệp vụ chính |
| Địa chỉ | Địa chỉ trụ sở chính |

#### Cấu hình chi phí & chính sách
| Tham số | Giá trị mặc định | Mô tả |
|---|---|---|
| Phí bảo hiểm vật chất | 100.000 VND/ngày | Bắt buộc mỗi ngày thuê |
| Phí bàn giao & vệ sinh | 100.000 VND/lần | Thu một lần khi bàn giao |
| Tiền cọc tối thiểu | 15.000.000 VND | Giữ tại showroom |
| Phí phạt hủy đơn | 30% tiền cọc | Khi hủy trong vòng 24h |

---

### 3.14 Quản lý Media & Upload

#### Loại media theo đối tượng
| Đối tượng | Loại ảnh |
|---|---|
| Xe | Mặt trước, mặt sau, bên trái, bên phải, nội thất, khoang máy |
| Khách hàng | GPLX mặt trước, GPLX mặt sau, Passport |
| Bàn giao xe | Ảnh PICKUP/RETURN (6 góc) |
| Thanh toán | Biên lai chuyển khoản |
| Đánh giá | Ảnh kèm review |

Thông số kỹ thuật:
- Định dạng: JPG, PNG, PDF, Video
- Kích thước tối đa: 10MB/file
- Lưu trữ: Local filesystem (mở rộng được sang S3/Cloudinary)
- Phục vụ: /uploads/

---

### 3.15 Nhật ký Kiểm toán (Audit Logs)

#### Thông tin mỗi bản ghi
| Trường | Mô tả |
|---|---|
| Người thực hiện | User ID |
| Hành động | Tên hành động (LOGIN, CREATE_BOOKING...) |
| Đối tượng | Bảng dữ liệu bị tác động |
| ID đối tượng | ID bản ghi bị tác động |
| Dữ liệu cũ | Snapshot trước khi thay đổi (JSON) |
| Dữ liệu mới | Snapshot sau khi thay đổi (JSON) |
| Địa chỉ IP | IP người thực hiện |
| User-Agent | Trình duyệt/thiết bị |
| Thời gian | Timestamp |

#### Hành động được theo dõi
- ADMIN_LOGIN — Đăng nhập Admin
- CREATE_VEHICLE — Tạo xe mới
- UPDATE_VEHICLE_STATUS — Cập nhật trạng thái xe
- APPROVE_BOOKING — Duyệt đơn đặt xe
- REJECT_BOOKING — Từ chối đơn
- CREATE_PAYMENT — Tạo giao dịch
- VERIFY_CUSTOMER_PROFILE — Xác minh GPLX
- UPDATE_SYSTEM_SETTINGS — Thay đổi cài đặt hệ thống

---

### 3.16 Trang Landing & Cổng công khai

#### Trang chủ (Landing Page)
- Slider hình ảnh xe cao cấp (4K cinematic)
- Thanh tìm kiếm nhanh (địa điểm, ngày, loại xe)
- Danh sách xe nổi bật (lấy từ database thực)
- Thống kê ấn tượng (số xe, khách hàng, năm kinh nghiệm)
- Cam kết dịch vụ (bảo hiểm, cứu hộ 24/7, hợp đồng minh bạch)
- Đánh giá của khách hàng nổi bật
- Thông tin liên hệ & form gửi ticket hỗ trợ
- Hỗ trợ đa ngôn ngữ: Tiếng Việt & English

#### Danh sách xe (Vehicle Listing)
- Hiển thị xe trạng thái AVAILABLE
- Bộ lọc: Danh mục, hãng xe, hộp số, nhiên liệu, khoảng giá, địa điểm
- Sắp xếp: Giá tăng/giảm, đánh giá, tên xe
- Phân trang, thêm vào yêu thích (Favorites)

#### Chi tiết xe (Vehicle Details)
- Gallery ảnh, thông số kỹ thuật đầy đủ
- Mô tả chi tiết, tính năng nổi bật
- Đánh giá từ khách hàng đã thuê
- Panel đặt xe (giá, trạng thái, nút "Đặt xe ngay")

---

## 4. API ENDPOINTS TỔNG QUAN

| Nhóm | Prefix | Mô tả |
|---|---|---|
| Xác thực | /api/auth | Đăng ký, đăng nhập, refresh token |
| Người dùng | /api/users | Quản lý tài khoản |
| Xe | /api/vehicles | Quản lý phương tiện |
| Đặt xe | /api/bookings | Quản lý đơn thuê |
| Thanh toán | /api/payments | Giao dịch thanh toán |
| Hợp đồng | /api/contracts | Hợp đồng điện tử |
| Bàn giao | /api/handover-records | Biên bản bàn giao xe |
| Bảo dưỡng | /api/maintenance | Lịch bảo dưỡng |
| Đánh giá | /api/reviews | Đánh giá của khách hàng |
| Thông báo | /api/notifications | Thông báo hệ thống |
| Media | /api/media | Upload & quản lý file |
| Hồ sơ KH | /api/customer-profiles | Hồ sơ & xác minh khách hàng |
| Dashboard | /api/dashboard | Thống kê & KPI |
| Cài đặt | /api/settings | Cấu hình hệ thống |
| Dịch vụ | /api/booking-services | Dịch vụ bổ sung đơn thuê |
| Audit Log | /api/audit-logs | Nhật ký kiểm toán |
| Lịch sử TT | /api/booking-status-history | Lịch sử trạng thái đơn |

Tài liệu API đầy đủ: http://localhost:5000/api-docs

---

## 5. DỮ LIỆU MẪU (SEED DATA)

| Bảng | Số lượng | Chi tiết |
|---|---|---|
| Người dùng | 15 | 1 Admin, 3 Manager (HN/HCM/ĐN), 11 Khách hàng |
| Hồ sơ khách hàng | 11 | Xác minh đa dạng |
| Danh mục xe | 5 | Sedan, SUV, Hatchback, Pickup, Luxury |
| Xe | 42 | VinFast, Toyota, Honda, BMW, Mercedes, Porsche... |
| Đơn thuê | 28 | Tháng 1 đến 8/2026 |
| Thanh toán | ~28 | Đa dạng phương thức |
| Hợp đồng | ~28 | Trạng thái đa dạng |
| Bảo dưỡng | 25 | 12 COMPLETED, 3 IN_PROGRESS, 2 SCHEDULED |
| Thông báo | 35 | Loại và trạng thái đa dạng |
| Nhật ký kiểm toán | 25 | Hành động đa dạng |

---

## 6. TÀI KHOẢN ĐĂNG NHẬP THỬ NGHIỆM

| Vai trò | Email | Mật khẩu | Ghi chú |
|---|---|---|---|
| Admin | admin@autorent.vn | admin123 | Toàn quyền hệ thống |
| Manager HN | manager@autorent.vn | manager123 | Chi nhánh Hà Nội |
| Manager HCM | manager.hcm@autorent.vn | manager123 | Chi nhánh TP.HCM |
| Manager ĐN | manager.danang@autorent.vn | manager123 | Chi nhánh Đà Nẵng |
| Khách hàng | nguyenvana@gmail.com | user123 | Hồ sơ đã xác minh |

---

## 7. CÁC LUẬT NGHIỆP VỤ QUAN TRỌNG

1. GPLX bắt buộc: Khách hàng phải có GPLX trạng thái VERIFIED mới được bàn giao xe.
2. Kiểm tra lịch trùng: Hệ thống kiểm tra xung đột lịch trước khi cho phép tạo đơn.
3. Hợp đồng trước bàn giao: Phải ký hợp đồng điện tử trước khi nhận xe.
4. Thanh toán cọc: Đơn chỉ chuyển CONFIRMED khi đã nhận đủ cọc.
5. Phí hủy 24h: Hủy trong vòng 24h trước giờ nhận xe bị phạt 30% tiền cọc.
6. Đánh giá sau hoàn thành: Chỉ đơn COMPLETED và chưa đánh giá mới được review.
7. Xe bảo dưỡng không cho đặt: Xe MAINTENANCE hoặc INCIDENT không xuất hiện trong tìm kiếm.
8. Một đơn – một hợp đồng: Mỗi đơn thuê chỉ có duy nhất một hợp đồng.
9. Audit toàn bộ: Mọi thao tác quan trọng đều ghi vào audit_logs kèm IP và User-Agent.
10. Token Rotation: Refresh Token bị thu hồi và thay mới sau mỗi lần làm mới Access Token.

---

## 8. CÔNG NGHỆ & BẢO MẬT

| Thành phần | Chi tiết |
|---|---|
| Mã hóa mật khẩu | bcrypt (salt rounds: 10) |
| JWT | Access Token 15 phút, Refresh Token 7 ngày |
| Rate Limiting | 100 requests / 15 phút / IP |
| Bảo mật HTTP | Helmet.js (CSP, XSS, HSTS...) |
| CORS | Whitelist domain cụ thể |
| Validation | Zod schema validation tất cả input |
| Logging | Winston logger (phân cấp độ) |
| HTTP Logging | Morgan middleware |
| Health Check | GET /api/health kiểm tra DB và API |

---

Tài liệu được tổng hợp từ toàn bộ source code của dự án AutoRent.
Cập nhật lần cuối: 16/08/2026
