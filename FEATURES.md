# 🚗 AutoRent — Danh sách tính năng hệ thống

> Hệ thống quản lý cho thuê xe tự lái SaaS — Full-stack (React + Node.js + PostgreSQL)

---

## 🏗️ Kiến trúc tổng quan

| Layer | Công nghệ |
|---|---|
| Frontend | React (Vite) + TypeScript + Ant Design |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (Access Token + Refresh Token Rotation) |
| Thanh toán QR | VietQR API (NAPAS247 chuẩn) |
| Triển khai | Docker Compose |

---

## 👥 Phân quyền (3 vai trò)

- **CUSTOMER** — Khách hàng thuê xe
- **MANAGER** — Quản lý vận hành (nhân viên)
- **ADMIN** — Quản trị viên hệ thống

---

## 🔐 1. Xác thực & Bảo mật (Auth)

- [x] Đăng ký tài khoản (email + số điện thoại, tự động tạo hồ sơ khách hàng)
- [x] Đăng nhập (JWT Access Token 15 phút)
- [x] Refresh Token tự động xoay vòng (Token Rotation) — chống replay attack
- [x] Đăng xuất (thu hồi refresh token)
- [x] Quên mật khẩu (tạo reset token)
- [x] Đặt lại mật khẩu qua token
- [x] Đổi mật khẩu khi đã đăng nhập

---

## 🚘 2. Quản lý phương tiện (Vehicles)

- [x] Xem danh sách xe (có lọc theo loại, hãng, trạng thái, giá)
- [x] Xem chi tiết xe (thông số kỹ thuật, ảnh, đánh giá, giá thuê)
- [x] Thêm xe mới (form đầy đủ: thông tin, ảnh, giá, thể loại)
- [x] Chỉnh sửa thông tin xe
- [x] Xóa xe khỏi hệ thống
- [x] Quản lý trạng thái xe: `AVAILABLE` / `RENTED` / `RESERVED` / `MAINTENANCE` / `INACTIVE` / `INCIDENT`
- [x] Tự động cập nhật trạng thái xe theo vòng đời đơn đặt
- [x] Cập nhật số km hiện tại của xe sau mỗi lần thuê

---

## 📅 3. Đặt xe & Quản lý đơn hàng (Bookings)

- [x] Tìm kiếm xe theo ngày nhận / trả, địa điểm
- [x] Kiểm tra xe có trùng lịch đặt hay không trước khi cho đặt
- [x] Quy trình đặt xe nhiều bước (chọn xe → xem chi tiết → xác nhận & thanh toán)
- [x] Tự động tính giá thuê (số ngày × giá/ngày + phí dịch vụ + bảo hiểm)
- [x] Tự động sinh mã đặt xe (VD: `AR-20260816-512`)
- [x] Xem lịch sử đơn hàng của khách hàng
- [x] Xem chi tiết đơn hàng (thông tin xe, thời gian, giá, trạng thái)
- [x] Hủy đơn hàng
- [x] Cập nhật trạng thái đơn: `PENDING` → `CONFIRMED` → `ACTIVE` → `COMPLETED` / `CANCELLED` / `REJECTED`
- [x] Lịch sử thay đổi trạng thái đơn hàng (Booking Status History)
- [x] Ghi chú của khách hàng khi đặt xe
- [x] Tính phí phụ trội khi trả xe (phí trễ, km vượt, xăng, vệ sinh, thiệt hại)

---

## 💳 4. Thanh toán (Payments)

- [x] Thanh toán qua **Chuyển khoản ngân hàng** (VietQR — tự động tạo mã QR kèm số tiền & nội dung)
- [x] Thanh toán qua **VNPay** (chuyển hướng cổng thanh toán)
- [x] Thanh toán qua **MoMo** (chuyển hướng ví điện tử)
- [x] Thanh toán tiền mặt (CASH)
- [x] Xác nhận thanh toán thủ công (Admin/Manager)
- [x] Hoàn tiền (Refund)
- [x] Tự động cập nhật trạng thái đơn hàng khi thanh toán cọc thành công (`PENDING` → `CONFIRMED`)
- [x] Lịch sử giao dịch thanh toán của khách hàng
- [x] Sinh mã giao dịch tự động (VD: `TX-20260816-4521`)

---

## 📄 5. Hợp đồng điện tử (Contracts)

- [x] Tự động tạo hợp đồng nháp khi đặt xe thành công
- [x] Ký hợp đồng điện tử (online) qua mã đặt xe
- [x] Xem nội dung hợp đồng HTML đầy đủ
- [x] Quản lý danh sách hợp đồng (Admin/Manager)
- [x] Trạng thái hợp đồng: `PENDING_SIGN` → `SIGNED` / `EXPIRED` / `CANCELLED`

---

## 🔄 6. Biên bản bàn giao xe (Handover Records)

- [x] Tạo biên bản giao xe (PICKUP): ghi nhận số km, mức xăng, tình trạng xe
- [x] Tạo biên bản nhận xe trả (RETURN): ghi nhận thiệt hại, phí phụ trội
- [x] Tự động chuyển trạng thái đơn khi hoàn thành bàn giao (`CONFIRMED` → `ACTIVE` khi PICKUP, `ACTIVE` → `COMPLETED` khi RETURN)
- [x] Tự động cộng phí phụ trội vào tổng chi phí đơn hàng
- [x] Cập nhật số km xe sau mỗi lần trả xe

---

## 🔧 7. Bảo dưỡng xe (Maintenance)

- [x] Lên lịch bảo dưỡng cho xe (chuyển trạng thái xe sang `MAINTENANCE`)
- [x] Hoàn thành bảo dưỡng (chuyển xe về `AVAILABLE`)
- [x] Xem danh sách lịch bảo dưỡng
- [x] Chỉnh sửa / Xóa lịch bảo dưỡng
- [x] Ghi chi phí bảo dưỡng

---

## ⭐ 8. Đánh giá & Nhận xét (Reviews)

- [x] Khách hàng gửi đánh giá sau khi hoàn thành chuyến đi
- [x] Xếp hạng sao (1–5) + nội dung nhận xét
- [x] Chỉ được đánh giá đơn đã hoàn thành và chưa đánh giá
- [x] Xem thống kê đánh giá trung bình theo xe
- [x] Xem / Sửa / Xóa đánh giá (Admin)

---

## 🔔 9. Thông báo (Notifications)

- [x] Thông báo tự động khi đặt xe thành công
- [x] Thông báo khi trạng thái đơn hàng thay đổi
- [x] Thông báo khi thanh toán xác nhận thành công
- [x] Thông báo khi được hoàn tiền
- [x] Đánh dấu đã đọc thông báo
- [x] Xem danh sách tất cả thông báo

---

## 👤 10. Hồ sơ khách hàng (Customer Profile)

- [x] Xem & cập nhật thông tin cá nhân (tên, SĐT, địa chỉ, ngày sinh)
- [x] Tải lên ảnh đại diện
- [x] Tải lên / cập nhật GPLX (Giấy phép lái xe) — ảnh mặt trước & mặt sau
- [x] Xem trạng thái xác minh GPLX: `PENDING` / `VERIFIED` / `REJECTED`
- [x] Đổi mật khẩu

---

## 📊 11. Dashboard & Báo cáo (Admin/Manager)

- [x] Tổng quan: số xe, đơn hàng, khách hàng, doanh thu hôm nay
- [x] Biểu đồ doanh thu theo tháng (cả năm)
- [x] Biểu đồ phân bổ trạng thái đơn hàng
- [x] Biểu đồ phân bổ phương tiện theo loại xe
- [x] Top 5 xe được đặt nhiều nhất
- [x] Top 5 khách hàng chi tiêu cao nhất
- [x] Danh sách 5 đơn hàng gần nhất
- [x] Tỷ lệ xe sẵn sàng cho thuê

---

## 🏢 12. Quản lý người dùng & Manager (Admin)

- [x] Xem danh sách tất cả khách hàng
- [x] Tìm kiếm, lọc khách hàng
- [x] Xem chi tiết hồ sơ khách hàng
- [x] Khóa / Mở khóa tài khoản
- [x] Tạo tài khoản Manager mới
- [x] Cập nhật thông tin Manager
- [x] Xóa tài khoản Manager
- [x] Phân quyền theo vai trò (CUSTOMER / MANAGER / ADMIN)

---

## ⚙️ 13. Cài đặt hệ thống (Settings)

- [x] Xem và cập nhật cấu hình hệ thống (tên công ty, phí dịch vụ, v.v.)

---

## 📁 14. Media & Upload ảnh

- [x] Upload ảnh xe (nhiều ảnh)
- [x] Upload ảnh GPLX khách hàng
- [x] Upload ảnh đại diện người dùng
- [x] Xem / Xóa media đã upload

---

## 🗂️ 15. Nhật ký hệ thống (Audit Logs)

- [x] Ghi lại toàn bộ thao tác quan trọng (tạo/sửa/xóa booking, payment, user...)
- [x] Xem lịch sử audit log (Admin)
- [x] Lưu trạng thái cũ / mới cho từng thao tác

---

## 🌐 16. Trang Landing & Giao diện công khai

- [x] Trang chủ giới thiệu dịch vụ AutoRent
- [x] Trang danh sách xe công khai (có thể tìm kiếm, lọc)
- [x] Trang chi tiết xe công khai
- [x] Hỗ trợ đa ngôn ngữ (Tiếng Việt / English)
- [x] Responsive (mobile-friendly)

---

## 🛠️ 17. Kỹ thuật & Hạ tầng

- [x] API RESTful với Swagger UI documentation
- [x] Xác thực middleware (JWT) bảo vệ tất cả route private
- [x] Phân quyền middleware theo role
- [x] Rate limiting (giới hạn số request)
- [x] Helmet (bảo mật HTTP headers)
- [x] Morgan (HTTP request logging)
- [x] Winston logger (phân loại log: auth, booking, payment)
- [x] Zod validation (kiểm tra dữ liệu đầu vào)
- [x] Error handling tập trung
- [x] Docker Compose (backend + frontend + database)
- [x] Health check endpoint (`/api/health`)

---

*Tài liệu này được tự động tổng hợp từ toàn bộ source code của dự án AutoRent.*
