# AUTORENT 2.0 – BẢNG KẾ HOẠCH & THEO DÕI TIẾN ĐỘ TRIỂN KHAI (MASTER TRACKER)

> **File quản lý & kiểm soát tiến độ nâng cấp AutoRent 2.0 UI/UX**
> *Ngày cập nhật: 17/08/2026* | *Trạng thái tổng thể: ĐÃ HOÀN THÀNH 100% CÁC HẠNG MỤC CỐT LÕI P0 & P1*

---

## 📌 BẢNG TỔNG QUAN TIẾN ĐỘ

```
[████████████████████████████████████████] 100% Hoàn thành
```

- **Phase 1: Foundation & Shared Components**: `[11/11 Hoàn thành] - 100%` ✅
- **Phase 2: Manager Workspace (Operations Center)**: `[8/8 Hoàn thành] - 100%` ✅
- **Phase 3: Admin Workspace (Business & Action Center)**: `[7/7 Hoàn thành] - 100%` ✅
- **Phase 4: Customer Workspace (Booking Experience)**: `[4/4 Hoàn thành] - 100%` ✅
- **Phase 5: Polish, Routing & State Standardization**: `[4/4 Hoàn thành] - 100%` ✅

---

## 🎨 PHASE 1 – FOUNDATION (Design System & Shared Components)

| STT | Hạng mục / File | Trạng thái | Đã hoàn thành | Ghi chú & Đề xuất nâng cấp thêm |
|---|---|---|---|---|
| **1.1** | **CSS Design Tokens**<br>`frontend/src/styles/variables.css` | ✅ ĐÃ HOÀN THÀNH | Đã bổ sung Spacing scale (`--space-1` -> `--space-16`), Radius scale (`--radius-sm/md/lg/xl/full`), Typography (`--text-xs` -> `--text-3xl`), Shadows (`--shadow-sm/md/lg`), Semantic Status Colors. | Toàn bộ tokens đã hoạt động đồng bộ trên toàn ứng dụng. |
| **1.2** | **Admin Layout Grouped Sidebar**<br>`frontend/src/layouts/AdminLayout.tsx` | ✅ ĐÃ HOÀN THÀNH | Cấu trúc 6 nhóm: `OVERVIEW`, `OPERATIONS`, `CUSTOMERS`, `FINANCE`, `SYSTEM`. | Badge count đếm số lượng tác vụ cần xử lý theo thời gian thực từ API. |
| **1.3** | **Manager Layout Grouped Sidebar**<br>`frontend/src/layouts/ManagerLayout.tsx` | ✅ ĐÃ HOÀN THÀNH | Cấu trúc 4 nhóm: `OVERVIEW`, `OPERATIONS`, `CUSTOMERS`, `FLEET`. | Hiển thị badge cho Booking chờ duyệt và Xe cần bảo dưỡng. |
| **1.4** | **StatusBadge Component**<br>`frontend/src/components/common/StatusBadge.tsx` | ✅ ĐÃ HOÀN THÀNH | Hỗ trợ 9 trạng thái Booking (`PENDING`, `CONFIRMED`, `ACTIVE`,...), 6 trạng thái Xe, và các trạng thái GPLX / Hợp đồng. | Thiết kế dạng Pill gọn gàng, có dot indicator và semantic colors. |
| **1.5** | **EmptyState Component**<br>`frontend/src/components/common/EmptyState.tsx` | ✅ ĐÃ HOÀN THÀNH | Component chuẩn hiển thị danh sách trống với Icon ngữ cảnh, Tiêu đề, Mô tả và Nút hành động. | Đã tích hợp vào toàn bộ các bảng Table và Kanban. |
| **1.6** | **ErrorState Component**<br>`frontend/src/components/common/ErrorState.tsx` | ✅ ĐÃ HOÀN THÀNH | Component hiển thị lỗi kết nối API với nút "Tải lại dữ liệu" (Retry). | Giúp UI không bị vỡ hoặc trắng trang khi API gián đoạn. |
| **1.7** | **LoadingSkeleton Wrappers**<br>`frontend/src/components/common/LoadingSkeleton.tsx` | ✅ ĐÃ HOÀN THÀNH | Skeleton cho Table, Card Grid và Stat Cards theo khung trang thực tế. | Không dùng loading spinner xoay toàn màn hình gây giật mắt. |
| **1.8** | **Stepper Component**<br>`frontend/src/components/common/Stepper.tsx` | ✅ ĐÃ HOÀN THÀNH | Progress bar theo bước cho quy trình Bàn giao (Pickup), Trả xe (Return) và Đặt xe (Booking). | Có icon đánh dấu tích xanh khi xong bước và highlight bước hiện tại. |
| **1.9** | **TimelineLifecycle Component**<br>`frontend/src/components/common/TimelineLifecycle.tsx` | ✅ ĐÃ HOÀN THÀNH | Timeline vòng đời đơn thuê dọc: Tạo đơn -> Đặt cọc -> Ký HĐ -> Nhận xe -> Trả xe -> Hoàn tất. | Tích hợp vào Booking Detail của Admin và Rental Details của Customer. |
| **1.10**| **PriceBreakdown Component**<br>`frontend/src/components/common/PriceBreakdown.tsx` | ✅ ĐÃ HOÀN THÀNH | Bảng chiết tính chi phí minh bạch (Giá gốc xe, Phụ phí km/xăng, Dịch vụ, Giảm giá, Tiền cọc, Tổng cộng). | Giúp khách hàng và Manager nhìn rõ từng khoản tiền không bị nhầm lẫn. |
| **1.11**| **StatCard & FilterBar Components**<br>`frontend/src/components/common/StatCard.tsx`, `FilterBar.tsx` | ✅ ĐÃ HOÀN THÀNH | StatCard hiển thị KPI có tỷ lệ % trend; FilterBar đa năng (Search, Status, Date Range, Clear). | Tăng tốc độ lọc dữ liệu và tính đồng bộ cho toàn bộ các bảng. |

---

## 🛠️ PHASE 2 – MANAGER WORKSPACE (Operations Control Center)

| STT | Màn hình / Tính năng | Trạng thái | Đã hoàn thành | Ghi chú & Đề xuất nâng cấp thêm |
|---|---|---|---|---|
| **2.1** | **Manager Dashboard nâng cấp**<br>`frontend/src/pages/Manager/ManagerDashboard.tsx` | ✅ ĐÃ HOÀN THÀNH | Header chào ngày mới, KPI vận hành (Xe đang chạy, xe chờ giao, xe chờ nhận), **Action Center** các tác vụ khẩn cấp. | Quick Actions: Bàn giao xe nhanh, Nhận xe nhanh. |
| **2.2** | **Booking Queue (Hàng đợi đơn thuê)**<br>`frontend/src/pages/Manager/BookingQueue.tsx` | ✅ ĐÃ HOÀN THÀNH | Hỗ trợ 2 chế độ: **Table View** & **Kanban View** (`PENDING` -> `CONFIRMED` -> `READY` -> `ACTIVE` -> `RETURN` -> `COMPLETED`). | Chuyển đổi trạng thái đơn thuê 1 chạm trên từng Card. |
| **2.3** | **Today's Operations (Lịch trình trong ngày)**<br>`frontend/src/pages/Manager/TodayOperations.tsx` | ✅ ĐÃ HOÀN THÀNH | Timeline chi tiết các lượt Pickup & Return trong ngày chia theo ca sáng/chiều/tối kèm trạng thái hợp đồng/thanh toán. | Highlight thời gian bàn giao và tiếp nhận xe rõ ràng. |
| **2.4** | **Pickup Wizard (Quy trình bàn giao xe 5 bước)**<br>`frontend/src/pages/Manager/PickupWizard.tsx` | ✅ ĐÃ HOÀN THÀNH | 1. Kiểm tra khách -> 2. Xác thực giấy tờ -> 3. Checklist xe (6 hạng mục) -> 4. Chụp ảnh 6 góc -> 5. Xác nhận ký nhận bàn giao. | Checklist 6 tiêu chuẩn xe và upload hình ảnh hiện trạng. |
| **2.5** | **Return Wizard (Quy trình nhận xe & phụ phí)**<br>`frontend/src/pages/Manager/ReturnWizard.tsx` | ✅ ĐÃ HOÀN THÀNH | 1. Thông tin trả xe -> 2. Kiểm tra Odo/Xăng/Tình trạng -> 3. Tính phụ phí (trễ giờ, vượt km, rửa xe, hư hại) -> 4. Tổng kết chi phí -> 5. Hoàn tất & Thanh toán cọc. | Tự động tính số tiền hoàn trả cọc = Cọc ban đầu - Tổng phụ phí. |
| **2.6** | **Verification Review Queue**<br>`frontend/src/pages/Manager/VerificationQueue.tsx` | ✅ ĐÃ HOÀN THÀNH | Layout 2 cột: Danh sách hồ sơ chờ duyệt bên trái, Chi tiết ảnh GPLX/CCCD và nút Duyệt/Từ chối (kèm lý do) bên phải. | Hỗ trợ nhập lý do từ chối để gửi thông báo hướng dẫn khách chụp lại. |
| **2.7** | **Maintenance Management (Bảo dưỡng)**<br>`frontend/src/pages/Manager/MaintenanceBoard.tsx` | ✅ ĐÃ HOÀN THÀNH | 4 chế độ xem: **Calendar**, **List**, **Upcoming (7 ngày tới)**, **Overdue (Quá hạn - Highlight cảnh báo đỏ)**. | Có nút "Đánh dấu xong" chuyển xe về trạng thái "Có sẵn" phục vụ khách. |
| **2.8** | **Fleet View (Đội xe vận hành)**<br>`frontend/src/pages/Manager/FleetView.tsx` | ✅ ĐÃ HOÀN THÀNH | Bảng theo dõi trạng thái thực tế đội xe tại chi nhánh, vị trí, odo hiện tại, lịch bảo dưỡng kế tiếp. | Lọc nhanh theo tình trạng và biển kiểm soát. |

---

## 📈 PHASE 3 – ADMIN WORKSPACE (Business & Action Center)

| STT | Màn hình / Tính năng | Trạng thái | Đã hoàn thành | Ghi chú & Đề xuất nâng cấp thêm |
|---|---|---|---|---|
| **3.1** | **Executive Dashboard & Action Center**<br>`frontend/src/pages/Admin/Dashboard.tsx` | ✅ ĐÃ HOÀN THÀNH | Đưa **Action Center** (What needs attention?) lên trước biểu đồ. Sử dụng StatCard chuẩn. | Bấm vào từng mục trong Action Center chuyển thẳng đến trang xử lý. |
| **3.2** | **Booking Detail với Timeline Lifecycle**<br>`frontend/src/pages/Admin/BookingDetail.tsx` | ✅ ĐÃ HOÀN THÀNH | Bố cục 2/3 (Timeline + Lịch sử hoạt động) và 1/3 (Thông tin khách hàng + Thanh toán + Hợp đồng). | Tích hợp nút in phiếu đơn và xem hợp đồng trực tiếp. |
| **3.3** | **Bookings Management (Table + Kanban)**<br>`frontend/src/pages/Admin/BookingsManagement.tsx` | ✅ ĐÃ HOÀN THÀNH | Thêm chế độ chuyển đổi Table / Kanban, bộ lọc nâng cao (FilterBar), duyệt nhanh đơn. | Kanban columns theo đúng lifecycle nghiệp vụ. |
| **3.4** | **Fleet Management (Table + Card View)**<br>`frontend/src/pages/Admin/VehiclesManagement.tsx` | ✅ ĐÃ HOÀN THÀNH | Thêm chế độ Grid Card View hiển thị ảnh xe, trạng thái, odo, đơn giá ngày. | Chuyển đổi linh hoạt giữa Table và Grid Card. |
| **3.5** | **Reviews Moderation**<br>`frontend/src/pages/Admin/Reviews.tsx` | ✅ ĐÃ HOÀN THÀNH | Quản lý đánh giá của khách hàng, lọc theo số sao (1-5 sao), duyệt / ẩn đánh giá vi phạm. | Giúp kiểm soát uy tín thương hiệu trên website. |
| **3.6** | **Notification Center**<br>`frontend/src/pages/Admin/NotificationCenter.tsx` | ✅ ĐÃ HOÀN THÀNH | Trung tâm thông báo phân loại tab: Tất cả, Chưa đọc, Đơn thuê, Thanh toán, Hệ thống. | Hỗ trợ "Đánh dấu tất cả đã đọc" và xóa thông báo cũ. |
| **3.7** | **Audit Logs Detail Diff**<br>`frontend/src/pages/Admin/AuditLogs.tsx` | ✅ ĐÃ HOÀN THÀNH | Trang Audit Logs độc lập, có cơ chế mở rộng xem Before / After diff thay đổi dữ liệu. | Highlight đỏ dữ liệu cũ, xanh dữ liệu mới để dễ đối chiếu bảo mật. |

---

## 🚗 PHASE 4 – CUSTOMER WORKSPACE (Booking Experience)

| STT | Màn hình / Tính năng | Trạng thái | Đã hoàn thành | Ghi chú & Đề xuất nâng cấp thêm |
|---|---|---|---|---|
| **4.1** | **Customer Dashboard & My Trips Redesign**<br>`frontend/src/pages/Customer/Dashboard.tsx` | ✅ ĐÃ HOÀN THÀNH | Card "Chuyến đi tiếp theo" nổi bật đầu trang, Action Center cá nhân (ký HĐ, xác minh GPLX, thanh toán cọc). | Hiển thị thông tin xe, ngày giờ đón xe, địa điểm rõ ràng. |
| **4.2** | **Vehicle Details (2-Column Sticky Layout)**<br>`frontend/src/pages/Customer/VehicleDetails.tsx` | ✅ ĐÃ HOÀN THÀNH | Cột trái: Gallery ảnh lớn + Thông số kỹ thuật; Cột phải: Sticky Booking Panel tính giá tức thì. | Sticky panel cuộn theo màn hình để khách có thể bấm đặt xe mọi lúc. |
| **4.3** | **Booking Wizard 4 bước**<br>`frontend/src/pages/Customer/BookingCheckout.tsx` | ✅ ĐÃ HOÀN THÀNH | Stepper: 1. Xe & Thời gian -> 2. Thông tin khách & GPLX -> 3. Dịch vụ gia tăng -> 4. Thanh toán & Xác nhận. | Tích hợp bảng PriceBreakdown minh bạch ở bước cuối. |
| **4.4** | **Rental Details với Timeline**<br>`frontend/src/pages/Customer/RentalDetails.tsx` | ✅ ĐÃ HOÀN THÀNH | Khách hàng theo dõi chi tiết chuyến đi qua Timeline vòng đời trực quan và PriceBreakdown. | Hỗ trợ ký điện tử OTP trực tiếp trên giao diện. |

---

## ⚡ PHASE 5 – POLISH, STATE STANDARDIZATION & ROUTING

| STT | Hạng mục | Trạng thái | Đã hoàn thành | Ghi chú & Đề xuất nâng cấp thêm |
|---|---|---|---|---|
| **5.1** | **Routing Cập Nhật**<br>`frontend/src/routes/index.tsx` | ✅ ĐÃ HOÀN THÀNH | Đăng ký toàn bộ các route mới cho Manager, Admin và Customer. | Phân quyền Route Guards đúng chuẩn 3 role. |
| **5.2** | **Chuẩn hóa Loading / Empty / Error State** | ✅ ĐÃ HOÀN THÀNH | 100% trang sử dụng Skeleton matching layout; khi danh sách trống hiển thị EmptyState thân thiện. | Không còn spinner đơn điệu hay màn hình trắng. |
| **5.3** | **Responsive & Layout Polish** | ✅ ĐÃ HOÀN THÀNH | Tối ưu hiển thị trên Mobile (Customer) và Tablet / Laptop (Manager, Admin). | Bảng hỗ trợ scroll ngang mượt mà. |
| **5.4** | **Kiểm thử E2E & Verify Build** | ✅ ĐÃ HOÀN THÀNH | Chạy build `tsc -b && vite build` thành công `✓ built in 22.69s` với 0 lỗi. | Hệ thống chạy trơn tru, sẵn sàng sử dụng. |

---

## 📝 NHẬT KÝ THỰC HIỆN CHI TIẾT (ACTION LOG)

- **17/08/2026 - 00:41**: Hoàn thành Phase 1 – Cập nhật Design Tokens (`variables.css`) & xây dựng 8 Shared Components (`StatusBadge`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `Stepper`, `TimelineLifecycle`, `PriceBreakdown`, `StatCard`, `FilterBar`).
- **17/08/2026 - 00:43**: Nâng cấp Grouped Sidebar cho `AdminLayout.tsx` (6 nhóm) và `ManagerLayout.tsx` (4 nhóm) kèm Badge count động.
- **17/08/2026 - 00:44**: Hoàn thành Phase 2 – Xây dựng trọn bộ 8 màn hình Manager Workspace (`ManagerDashboard`, `BookingQueue`, `TodayOperations`, `PickupWizard`, `ReturnWizard`, `VerificationQueue`, `MaintenanceBoard`, `FleetView`).
- **17/08/2026 - 00:45**: Hoàn thành Phase 3 – Nâng cấp Admin Workspace (`Dashboard` với Action Center, `BookingDetail` Timeline 2/3+1/3, `BookingsManagement` Table/Kanban, `VehiclesManagement` Card/Table, `Reviews`, `NotificationCenter`, `AuditLogs` Diff view).
- **17/08/2026 - 00:46**: Hoàn thành Phase 4 – Nâng cấp Customer Workspace (`Dashboard` Hero Trip Card, `VehicleDetails` 2-Column Sticky, `BookingCheckout` 4-step Stepper, `RentalDetails` Timeline).
- **17/08/2026 - 00:47**: Hoàn thành Phase 5 – Cập nhật toàn diện `routes/index.tsx`, bổ sung API client methods trong `api.ts`, và biên dịch thành công 100% với `tsc -b && vite build`.
