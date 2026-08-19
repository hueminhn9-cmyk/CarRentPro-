# AUTORENT 2.0 – TÀI LIỆU BÀN GIAO & HƯỚNG DẪN TIẾP TỤC KIỂM THỬ (HANDOVER & RESUME GUIDE)

> **File ghi nhớ toàn bộ thông tin môi trường, tài khoản, cấu trúc URL, trạng thái hoàn thành và danh sách kiểm thử chi tiết để tiếp tục công việc cho phiên làm việc tiếp theo.**
> *Ngày cập nhật: 17/08/2026* | *Dự án: AutoRent 2.0 Car Rental Platform* | *Git Branch: `updateUI`*

---

## 1. 🚀 HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG KHI TIẾP TỤC

Khi bắt đầu phiên làm việc mới, hãy đảm bảo 3 dịch vụ sau đang chạy:

### Bước 1: MySQL Server (Laragon)
- **Đường dẫn Data**: `C:\laragon\data\mysql-8.4`
- **Lệnh chạy thủ công (nếu chưa chạy qua Laragon UI)**:
  ```powershell
  & "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe" --datadir="C:\laragon\data\mysql-8.4" --console
  ```

### Bước 2: Backend API (Port 5000)
- **Thư mục**: `c:\laragon\www\HueMinh\autorent\backend`
- **Lệnh khởi chạy**:
  ```powershell
  cd c:\laragon\www\HueMinh\autorent\backend
  npm run dev
  ```
- **Kiểm tra API**: `http://localhost:5000/api/dashboard/stats`

### Bước 3: Frontend Web (Port 5173)
- **Thư mục**: `c:\laragon\www\HueMinh\autorent\frontend`
- **Lệnh khởi chạy**:
  ```powershell
  cd c:\laragon\www\HueMinh\autorent\frontend
  npm run dev
  ```
- **Địa chỉ truy cập**: `http://localhost:5173`

---

## 2. 🔑 DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP KIỂM THỬ

| Vai trò (Role) | Email đăng nhập | Mật khẩu (Password) | Quyền hạn & Không gian làm việc |
|---|---|---|---|
| **ADMIN** | `admin@autorent.vn` *(hoặc `admin@example.com`)* | `admin123` *(hoặc `password123`)* | Toàn quyền quản trị doanh nghiệp (`/admin/*`), duyệt doanh thu, quản lý đội xe, audit logs. |
| **MANAGER** | `manager@autorent.vn` *(hoặc `manager@example.com`)* | `manager123` *(hoặc `password123`)* | Không gian vận hành (`/manager/*`), điều phối giao nhận xe, duyệt GPLX, bảo dưỡng xe. |
| **CUSTOMER** | `customer@autorent.vn` *(hoặc `customer@example.com`)* | `customer123` *(hoặc `password123`)* | Không gian khách hàng (`/customer/*`), đặt xe, ký hợp đồng điện tử, xem lịch sử chuyến đi. |

---

## 3. 🌐 DANH MỤC TOÀN BỘ CÁC ĐƯỜNG DẪN (SITEMAP & URLS)

### 3.1. Public & Khách vãng lai
- **Trang chủ (Landing Page)**: `http://localhost:5173/`
- **Danh sách xe cho thuê (Vehicle Listing)**: `http://localhost:5173/vehicles`
- **Chi tiết xe (Vehicle Details)**: `http://localhost:5173/vehicles/1` *(Hỗ trợ 2-Column Sticky Booking Panel)*
- **Đăng nhập (Login)**: `http://localhost:5173/auth/login`
- **Đăng ký (Register)**: `http://localhost:5173/auth/register`

---

### 3.2. Customer Workspace (Trải nghiệm khách hàng)
- **Bảng điều khiển & Chuyến đi sắp tới (Hero Card + Action Center)**: `http://localhost:5173/customer/dashboard`
- **Quy trình Đặt xe 4 bước (Booking Wizard Stepper)**: `http://localhost:5173/customer/checkout?vehicleId=1`
- **Danh sách chuyến đi của tôi (My Trips)**: `http://localhost:5173/customer/my-rentals`
- **Chi tiết đơn thuê & Ký hợp đồng OTP (Rental Details Timeline)**: `http://localhost:5173/customer/rentals/1`
- **Quản lý Hồ sơ & GPLX (Documents)**: `http://localhost:5173/customer/documents`
- **Lịch sử thanh toán & Hóa đơn (Payments)**: `http://localhost:5173/customer/payments`
- **Trung tâm thông báo khách hàng**: `http://localhost:5173/customer/notifications`
- **Trung tâm trợ giúp (Support)**: `http://localhost:5173/customer/support`

---

### 3.3. Manager Workspace (Trung tâm điều hành & Vận hành chi nhánh)
- **Bảng điều hành ca trực (Operations Dashboard & Action Center)**: `http://localhost:5173/manager/dashboard`
- **Hàng đợi đơn thuê (Booking Queue Table & Kanban)**: `http://localhost:5173/manager/bookings`
- **Lịch trình giao nhận trong ngày (Today's Operations Timeline)**: `http://localhost:5173/manager/operations/today`
- **Quy trình bàn giao xe 5 bước (Pickup Wizard)**: `http://localhost:5173/manager/pickup/BK-2026-081`
- **Quy trình nhận xe trả & tính phụ phí (Return Wizard)**: `http://localhost:5173/manager/return/BK-2026-081`
- **Hàng đợi duyệt GPLX (Verification Review Queue 2 cột)**: `http://localhost:5173/manager/verification`
- **Quản lý bảo dưỡng xe (Maintenance Board 4 views: Calendar/List/Upcoming/Overdue)**: `http://localhost:5173/manager/maintenance`
- **Tình trạng đội xe chi nhánh (Fleet View)**: `http://localhost:5173/manager/fleet`

---

### 3.4. Admin Workspace (Quản trị chiến lược & Kinh doanh)
- **Executive Dashboard (KPI StatCards & Action Center)**: `http://localhost:5173/admin/dashboard`
- **Giám sát đơn thuê (Bookings Table & Kanban)**: `http://localhost:5173/admin/bookings`
- **Chi tiết đơn thuê nâng cao (Booking Detail Timeline 2/3 + 1/3)**: `http://localhost:5173/admin/bookings/1`
- **Chiến lược đội xe (Vehicles Table & Card Grid View)**: `http://localhost:5173/admin/vehicles`
- **Thêm xe mới (Vehicle Form)**: `http://localhost:5173/admin/vehicles/new`
- **Kiểm duyệt đánh giá khách hàng (Reviews Moderation)**: `http://localhost:5173/admin/reviews`
- **Báo cáo doanh thu & lợi nhuận (Revenue Reports)**: `http://localhost:5173/admin/revenue`
- **Kho hợp đồng pháp lý (Contracts Management)**: `http://localhost:5173/admin/contracts`
- **Quản lý nhân sự quản lý (Manager Management)**: `http://localhost:5173/admin/managers`
- **Danh sách khách hàng (Customers Management)**: `http://localhost:5173/admin/customers`
- **Trung tâm thông báo hệ thống (Notification Center tabs)**: `http://localhost:5173/admin/notifications`
- **Nhật ký bảo mật hệ thống (Audit Logs Before/After Diff)**: `http://localhost:5173/admin/audit-logs`
- **Cài đặt hệ thống (Settings)**: `http://localhost:5173/admin/settings`

---

## 4. 📊 TÌNH TRẠNG CÔNG VIỆC HIỆN TẠI (STATUS SUMMARY)

### ✅ Đã hoàn thành 100% Phát triển & Build:
1. **Design Tokens & Shared Components**: Toàn bộ CSS variables, 8 components dùng chung (`StatusBadge`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `Stepper`, `TimelineLifecycle`, `PriceBreakdown`, `StatCard`, `FilterBar`) đã viết xong và chạy chuẩn.
2. **Sidebars Navigation**: Layout Admin (6 nhóm) và Manager (4 nhóm) đã đổi sang Grouped Sidebar với badges động.
3. **Toàn bộ 8 màn hình Manager + 7 màn hình Admin + 4 màn hình Customer**: Đã được code hoàn chỉnh, đáp ứng 100% tài liệu AutoRent 2.0 Spec.
4. **Vite Build Verification**: Đã chạy `tsc -b && vite build` thành công `✓ built in 22.69s` không có bất kỳ lỗi TypeScript hay cú pháp nào.
5. **Fixed Bugs**:
   - Thêm fallback an toàn cho `FleetPieChart` và `RevenueChart` khi nạp dữ liệu rỗng.
   - Thêm type cast an toàn cho `rawBookings` và `api.dashboard.getKpis` trong dashboard.

---

## 5. 📋 KẾT QUẢ KIỂM THỬ TRÌNH DUYỆT (E2E TEST VERIFICATION)

### 👑 Kịch bản 1: Admin Workspace (Đã test trên Browser)
- [x] 1. `http://localhost:5173/admin/dashboard`: **ĐÃ TEST THÀNH CÔNG** – Executive Dashboard, StatCards doanh thu, Action Center khẩn cấp và biểu đồ phân bổ đội xe / doanh thu hiển thị mượt mà.
- [x] 2. `http://localhost:5173/admin/vehicles`: **ĐÃ TEST THÀNH CÔNG** – Chuyển đổi mượt mà giữa **Card Grid View** và **Table View**, hỗ trợ tìm kiếm và lọc trạng thái xe.
- [x] 3. `http://localhost:5173/admin/reviews`: **ĐÃ TEST THÀNH CÔNG** – Danh sách đánh giá khách hàng hiển thị đủ số sao, bình luận, các nút **Duyệt** và **Ẩn đánh giá**.
- [x] 4. `http://localhost:5173/admin/notifications`: **ĐÃ TEST THÀNH CÔNG** – Tab phân loại (Tất cả, Chưa đọc, Đơn thuê, Thanh toán, Hệ thống) hoạt động chính xác.
- [x] 5. `http://localhost:5173/admin/audit-logs`: **ĐÃ TEST THÀNH CÔNG** – Mở rộng từng bản ghi audit để xem so sánh **Before vs After Diff** trực quan.

---

### 🛠️ Kịch bản 2: Manager Workspace (Đã test trên Browser)
- [x] 1. `http://localhost:5173/manager/dashboard`: **ĐÃ TEST THÀNH CÔNG** – Operations Center, KPI vận hành ca trực, Action Center các đơn cần giao/nhận ngay.
- [x] 2. `http://localhost:5173/manager/bookings`: **ĐÃ TEST THÀNH CÔNG** – Chuyển đổi giữa chế độ **Kanban Board** và **Danh sách Table**, duyệt nhanh đơn.
- [x] 3. `http://localhost:5173/manager/operations/today`: **ĐÃ TEST THÀNH CÔNG** – Timeline lịch trình các ca bàn giao và tiếp nhận xe trong ngày.
- [x] 4. `http://localhost:5173/manager/pickup/BK-2026-081`: **ĐÃ TEST THÀNH CÔNG** – Chạy mượt mà qua các bước của Wizard: 1. Khách hàng -> 2. Xác thực giấy tờ -> 3. Checklist xe 6 hạng mục -> 4. Chụp ảnh 6 góc -> 5. Xác nhận ký nhận bàn giao.
- [ ] 5. `http://localhost:5173/manager/return/BK-2026-081`: *Hôm sau test tiếp Return Wizard và bộ tính phụ phí hoàn cọc.*
- [ ] 6. `http://localhost:5173/manager/verification`: *Hôm sau test tiếp duyệt ảnh GPLX 2 mặt.*
- [ ] 7. `http://localhost:5173/manager/maintenance`: *Hôm sau test tiếp bảng bảo dưỡng 4 tabs (Calendar/List/Overdue/Upcoming).*
- [ ] 8. `http://localhost:5173/manager/fleet`: *Hôm sau test tiếp đội xe chi nhánh.*

---

### 🚗 Kịch bản 3: Customer Workspace (Kiểm thử tiếp hôm sau)
- [ ] 1. `http://localhost:5173/customer/dashboard`: Kiểm tra Hero Card "Chuyến đi tiếp theo" và Action Center cá nhân.
- [ ] 2. `http://localhost:5173/vehicles/1`: Thử chọn ngày nhận/trả trên 2-Column Sticky Booking panel và xem giá tính tức thì.
- [ ] 3. `http://localhost:5173/customer/checkout?vehicleId=1`: Thử đi qua 4 bước đặt xe và bảng chiết tính chi phí minh bạch PriceBreakdown.
- [ ] 4. `http://localhost:5173/customer/rentals/1`: Kiểm tra Timeline tiến trình đơn thuê và modal ký hợp đồng điện tử qua OTP.

---

## 6. 💡 LƯU Ý KỸ THUẬT QUAN TRỌNG

1. **Về dữ liệu Booking Kanban**:
   - Cột Kanban đã được cấu hình mapping cả `PENDING` và `Chờ xác nhận`, `ACTIVE` và `Đang thuê` để hiển thị khớp 100%.
2. **Về Token & Phiên làm việc (Session)**:
   - Hệ thống đã tích hợp Axios Response Interceptor tự động làm mới JWT Access Token bằng Refresh Token, không lo bị out phiên đăng nhập khi test.
3. **Các file quản lý dự án**:
   - `AUTORENT_2.0_HANDOVER_RESUME_GUIDE.md` (Tài liệu bàn giao & tiến độ kiểm thử này)
   - `AUTORENT_2.0_IMPLEMENTATION_PLAN_TRACKER.md` (Bảng tiến độ tổng thể các Phase 1-5)
   - `AUTORENT_2.0_MASTER_UI_UX_UPGRADE_SPEC.md` (Tài liệu đặc tả nghiệp vụ gốc)

---
*Chúc bạn có một buổi nghỉ ngơi thoải mái! Toàn bộ mã nguồn và tài liệu đã được đẩy lên nhánh Git `updateUI` an toàn.*
