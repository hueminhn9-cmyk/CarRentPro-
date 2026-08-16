# BẢNG KIỂM THỬ CHỨC NĂNG HỆ THỐNG AUTORENT

> Phiên bản: 1.0.0 | Ngày tạo: 17/08/2026 | Môi trường: http://localhost:5173 (Frontend) / http://localhost:5000/api (Backend)

---

## THÔNG TIN TÀI KHOẢN TEST

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | admin@autorent.vn | admin123 |
| Manager HN | manager@autorent.vn | manager123 |
| Manager HCM | manager.hcm@autorent.vn | manager123 |
| Khách hàng | nguyenvana@gmail.com | user123 |

---

## MODULE 1: XÁC THỰC & BẢO MẬT (AUTH)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-AUTH-01 | Đăng ký tài khoản mới thành công | Chưa có tài khoản | 1. Vào /auth/register 2. Điền đầy đủ: Họ tên, Email mới, SĐT mới, Mật khẩu 3. Bấm Đăng ký | Tạo tài khoản thành công, redirect về trang đăng nhập | Cao | Chưa test |
| TC-AUTH-02 | Đăng ký với email đã tồn tại | Email đã có trong hệ thống | 1. Vào /auth/register 2. Điền email đã tồn tại 3. Bấm Đăng ký | Hiển thị lỗi "Email đã được sử dụng" | Cao | Chưa test |
| TC-AUTH-03 | Đăng ký thiếu trường bắt buộc | Không có | 1. Vào /auth/register 2. Để trống một hoặc nhiều trường bắt buộc 3. Bấm Đăng ký | Hiển thị lỗi validation từng trường | Cao | Chưa test |
| TC-AUTH-04 | Đăng nhập thành công với tài khoản hợp lệ | Tài khoản đã tồn tại | 1. Vào /auth/login 2. Nhập email + mật khẩu đúng 3. Bấm Đăng nhập | Đăng nhập thành công, redirect về dashboard tương ứng vai trò | Cao | Chưa test |
| TC-AUTH-05 | Đăng nhập với mật khẩu sai | Tài khoản đã tồn tại | 1. Vào /auth/login 2. Nhập email đúng + mật khẩu sai 3. Bấm Đăng nhập | Hiển thị lỗi "Email hoặc mật khẩu không chính xác" | Cao | Chưa test |
| TC-AUTH-06 | Đăng nhập với email không tồn tại | Không có | 1. Vào /auth/login 2. Nhập email không tồn tại 3. Bấm Đăng nhập | Hiển thị lỗi "Email hoặc mật khẩu không chính xác" | Cao | Chưa test |
| TC-AUTH-07 | Admin đăng nhập vào đúng dashboard | Tài khoản Admin | Đăng nhập bằng admin@autorent.vn | Redirect về /admin/dashboard | Cao | Chưa test |
| TC-AUTH-08 | Manager đăng nhập vào đúng dashboard | Tài khoản Manager | Đăng nhập bằng manager@autorent.vn | Redirect về /manager/dashboard | Cao | Chưa test |
| TC-AUTH-09 | Đăng xuất thành công | Đã đăng nhập | 1. Bấm nút Đăng xuất | Redirect về trang chủ, xóa session | Cao | Chưa test |
| TC-AUTH-10 | Truy cập trang Admin khi chưa đăng nhập | Chưa đăng nhập | Truy cập trực tiếp /admin/dashboard | Redirect về /auth/login | Cao | Chưa test |
| TC-AUTH-11 | Customer không thể truy cập trang Admin | Đăng nhập bằng Customer | Truy cập /admin/dashboard | Redirect về trang không có quyền | Cao | Chưa test |
| TC-AUTH-12 | Quên mật khẩu - Gửi yêu cầu đặt lại | Email tồn tại trong hệ thống | 1. Vào /auth/forgot-password 2. Nhập email 3. Bấm Gửi | Thông báo "Đã gửi email đặt lại mật khẩu" | Trung bình | Chưa test |
| TC-AUTH-13 | Đổi mật khẩu khi đã đăng nhập | Đã đăng nhập | 1. Vào Profile 2. Nhập mật khẩu cũ đúng + mật khẩu mới 3. Lưu | Đổi mật khẩu thành công | Trung bình | Chưa test |

---

## MODULE 2: QUẢN LÝ PHƯƠNG TIỆN (VEHICLES)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-VEH-01 | Xem danh sách xe (trang Landing) | Không cần đăng nhập | Truy cập /vehicles | Hiển thị danh sách xe AVAILABLE, đủ thông tin (tên, giá, ảnh, trạng thái) | Cao | Chưa test |
| TC-VEH-02 | Lọc xe theo danh mục | Không cần đăng nhập | 1. Vào /vehicles 2. Chọn bộ lọc "SUV" | Chỉ hiển thị xe thuộc danh mục SUV | Cao | Chưa test |
| TC-VEH-03 | Lọc xe theo khoảng giá | Không cần đăng nhập | 1. Vào /vehicles 2. Nhập khoảng giá (VD: 500K - 2M/ngày) | Chỉ hiển thị xe trong khoảng giá đó | Cao | Chưa test |
| TC-VEH-04 | Xem chi tiết xe | Không cần đăng nhập | 1. Vào /vehicles 2. Bấm vào một xe | Hiển thị thông số kỹ thuật, mô tả, ảnh, giá, đánh giá, nút đặt xe | Cao | Chưa test |
| TC-VEH-05 | Thêm xe mới (Admin) | Đăng nhập Admin | 1. Vào /admin/vehicles/new 2. Điền đầy đủ thông tin 3. Lưu | Xe được tạo, hiển thị trong danh sách | Cao | Chưa test |
| TC-VEH-06 | Thêm xe thiếu trường bắt buộc | Đăng nhập Admin | 1. Vào /admin/vehicles/new 2. Để trống biển kiểm soát 3. Lưu | Hiển thị lỗi validation | Cao | Chưa test |
| TC-VEH-07 | Chỉnh sửa thông tin xe | Đăng nhập Admin | 1. Vào /admin/vehicles 2. Bấm Edit trên một xe 3. Thay đổi giá 4. Lưu | Thông tin xe được cập nhật | Cao | Chưa test |
| TC-VEH-08 | Xóa xe khỏi hệ thống | Đăng nhập Admin | 1. Vào /admin/vehicles 2. Bấm Delete trên xe chưa có đơn thuê 3. Xác nhận | Xe bị xóa khỏi danh sách | Trung bình | Chưa test |
| TC-VEH-09 | Xe MAINTENANCE không xuất hiện khi đặt | Có xe đang bảo dưỡng | Vào /vehicles | Xe trạng thái MAINTENANCE không hiển thị hoặc không cho đặt | Cao | Chưa test |
| TC-VEH-10 | Upload ảnh cho xe | Đăng nhập Admin | 1. Vào form tạo/sửa xe 2. Upload ảnh JPG/PNG 3. Lưu | Ảnh được lưu và hiển thị trên trang chi tiết xe | Trung bình | Chưa test |
| TC-VEH-11 | Thêm xe vào yêu thích (Landing) | Không cần đăng nhập | Bấm icon trái tim trên card xe | Icon đổi màu (đã thêm vào yêu thích) | Thấp | Chưa test |
| TC-VEH-12 | Tìm kiếm xe theo tên | Không cần đăng nhập | 1. Vào /vehicles 2. Nhập từ khóa vào thanh tìm kiếm | Hiển thị kết quả phù hợp với từ khóa | Trung bình | Chưa test |

---

## MODULE 3: ĐẶT XE (BOOKING)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-BKG-01 | Đặt xe thành công (luồng đầy đủ) | Đăng nhập Customer, GPLX đã xác minh | 1. Chọn xe AVAILABLE 2. Bấm "Đặt xe ngay" 3. Chọn ngày nhận/trả 4. Chọn phương thức thanh toán 5. Xác nhận | Tạo đơn thành công, mã AR-YYYYMMDD-XXX, trạng thái PENDING | Cao | Chưa test |
| TC-BKG-02 | Đặt xe khi chưa đăng nhập | Chưa đăng nhập | Bấm "Đặt xe ngay" trên trang chi tiết xe | Redirect về trang đăng nhập | Cao | Chưa test |
| TC-BKG-03 | Kiểm tra xe không bị đặt trùng lịch | Xe đã có đặt ngày 01-05/09 | Đặt xe cùng khoảng ngày đó | Hiển thị lỗi "Xe đã được đặt trong khoảng thời gian này" | Cao | Chưa test |
| TC-BKG-04 | Xem danh sách đơn thuê của tôi | Đăng nhập Customer, có đơn thuê | Vào /customer/rentals | Hiển thị tất cả đơn thuê, đúng trạng thái | Cao | Chưa test |
| TC-BKG-05 | Xem chi tiết đơn thuê | Đăng nhập Customer, có đơn thuê | Bấm vào một đơn thuê trong /customer/rentals | Hiển thị đầy đủ: thông tin xe, ngày, giá, trạng thái, timeline | Cao | Chưa test |
| TC-BKG-06 | Admin duyệt đơn thuê | Đăng nhập Admin, có đơn PENDING | 1. Vào /admin/bookings 2. Bấm vào đơn PENDING 3. Bấm "Duyệt đơn & Giao xe" | Trạng thái đổi sang CONFIRMED/ACTIVE, thanh toán PAID | Cao | Chưa test |
| TC-BKG-07 | Admin từ chối đơn thuê | Đăng nhập Admin, có đơn PENDING | 1. Vào /admin/bookings 2. Bấm vào đơn PENDING 3. Bấm "Từ chối đơn đặt" | Trạng thái đổi sang CANCELLED, thanh toán REFUND | Cao | Chưa test |
| TC-BKG-08 | Admin hoàn thành đơn thuê | Đăng nhập Admin, có đơn ACTIVE | 1. Vào chi tiết đơn ACTIVE 2. Bấm "Hoàn thành thuê & Nhận xe" | Trạng thái đổi sang COMPLETED | Cao | Chưa test |
| TC-BKG-09 | Xem danh sách tất cả đơn thuê (Admin) | Đăng nhập Admin | Vào /admin/bookings | Hiển thị tất cả đơn thuê trong hệ thống, kèm bộ lọc | Cao | Chưa test |
| TC-BKG-10 | Tính giá tự động (kiểm tra công thức) | Đặt xe 3 ngày, giá 800K/ngày | Xem màn hình checkout | Hiển thị: Tiền thuê 2.400.000 + Bảo hiểm 300.000 + Phí DV 100.000 = 2.800.000 VND | Cao | Chưa test |
| TC-BKG-11 | Biên lai đặt xe sau khi đặt thành công | Đặt xe thành công | Sau khi xác nhận đặt xe | Hiển thị trang biên lai với mã đặt xe, thông tin đơn | Trung bình | Chưa test |
| TC-BKG-12 | Lịch sử trạng thái đơn thuê | Có đơn thuê đã qua nhiều trạng thái | Xem chi tiết đơn thuê | Hiển thị timeline các trạng thái kèm thời gian | Trung bình | Chưa test |

---

## MODULE 4: THANH TOÁN (PAYMENTS)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-PAY-01 | Chọn phương thức Chuyển khoản | Đang ở bước checkout | Chọn "Chuyển khoản ngân hàng" | Hiển thị thông tin tài khoản ngân hàng hoặc QR | Cao | Chưa test |
| TC-PAY-02 | Chọn phương thức Thẻ tín dụng | Đang ở bước checkout | Chọn "Thẻ tín dụng" | Giao diện thanh toán thẻ hiển thị | Cao | Chưa test |
| TC-PAY-03 | Chọn phương thức Ví điện tử (MoMo) | Đang ở bước checkout | Chọn "Ví điện tử" | Chuyển hướng sang cổng MoMo | Cao | Chưa test |
| TC-PAY-04 | Xem lịch sử thanh toán (Customer) | Đăng nhập Customer, có giao dịch | Vào /customer/payments | Hiển thị danh sách giao dịch kèm mã TXN, số tiền, trạng thái | Trung bình | Chưa test |
| TC-PAY-05 | Xác nhận thanh toán thủ công (Admin) | Đăng nhập Admin, đơn đang chờ TT | Vào chi tiết đơn, bấm xác nhận nhận tiền | Trạng thái thanh toán đổi sang PAID | Cao | Chưa test |
| TC-PAY-06 | Hoàn tiền khi hủy đơn | Admin hủy đơn đã cọc | Hủy đơn thuê | Trạng thái thanh toán đổi sang REFUNDED | Cao | Chưa test |
| TC-PAY-07 | Mã giao dịch tự động sinh đúng format | Tạo giao dịch mới | Xem danh sách giao dịch | Mã giao dịch theo format TXN-AR-YYYYMMDD-XXXX | Trung bình | Chưa test |

---

## MODULE 5: HỢP ĐỒNG ĐIỆN TỬ (CONTRACTS)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-CTR-01 | Hợp đồng tự động tạo sau khi đặt xe | Đặt xe thành công | Vào chi tiết đơn thuê | Trạng thái hợp đồng PENDING_SIGN | Cao | Chưa test |
| TC-CTR-02 | Khách hàng ký hợp đồng điện tử | Có hợp đồng PENDING_SIGN | 1. Vào chi tiết đơn thuê 2. Bấm "Ký điện tử ngay" 3. Xác nhận trong dialog | Hợp đồng đổi sang SIGNED, timeline cập nhật | Cao | Chưa test |
| TC-CTR-03 | Cảnh báo hợp đồng chưa ký | Đơn thuê chưa ký HĐ | Vào chi tiết đơn thuê | Hiển thị banner cảnh báo màu vàng "Hợp đồng chưa ký" | Cao | Chưa test |
| TC-CTR-04 | Tải hợp đồng PDF | Hợp đồng đã ký | 1. Vào chi tiết đơn thuê 2. Bấm "Tải bản hợp đồng (PDF)" | Tải về file PDF hợp đồng | Trung bình | Chưa test |
| TC-CTR-05 | Xem danh sách hợp đồng (Admin) | Đăng nhập Admin | Vào /admin/contracts | Hiển thị danh sách tất cả hợp đồng, kèm trạng thái | Trung bình | Chưa test |
| TC-CTR-06 | Hợp đồng bị hủy khi đơn bị từ chối | Đơn bị Admin từ chối | Xem chi tiết đơn | Trạng thái hợp đồng đổi sang CANCELLED | Cao | Chưa test |

---

## MODULE 6: BIÊN BẢN BÀN GIAO XE (HANDOVER)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-HND-01 | Truy cập biên bản bàn giao xe | Đăng nhập Admin, đơn đang ACTIVE | Vào chi tiết đơn, bấm "Biên bản bàn giao xe" | Hiển thị trang checklist bàn giao | Cao | Chưa test |
| TC-HND-02 | Hoàn thành checklist bàn giao | Đang ở trang handover | Tích đầy đủ 7 mục trong checklist | Nút "Xác nhận hoàn thành bàn giao xe" được kích hoạt | Cao | Chưa test |
| TC-HND-03 | Không thể bàn giao khi chưa đủ checklist | Đang ở trang handover | Chỉ tích 5/7 mục, bấm nút xác nhận | Hiển thị cảnh báo "Vui lòng hoàn thành đầy đủ tất cả các bước" | Cao | Chưa test |
| TC-HND-04 | Xác nhận bàn giao xe thành công | Đã tích đủ 7 mục | Bấm "Xác nhận hoàn thành bàn giao xe" | Đơn thuê đổi sang ACTIVE, redirect về chi tiết đơn | Cao | Chưa test |
| TC-HND-05 | Biên bản nhận xe trả (RETURN) | Đăng nhập Manager, đơn ACTIVE | Tạo biên bản RETURN với các thông tin phụ phí | Đơn đổi sang COMPLETED, phụ phí được ghi nhận | Cao | Chưa test |
| TC-HND-06 | Tính phụ phí km vượt | Xe giao 1.000 km, nhận về 1.300 km (định mức 200 km/ngày x 3 ngày = 600 km) | Nhập số km vào biên bản RETURN | Hệ thống tính phí: (1300-1000-600) km x đơn giá | Trung bình | Chưa test |

---

## MODULE 7: BẢO DƯỠNG XE (MAINTENANCE)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-MNT-01 | Xem danh sách lịch bảo dưỡng | Đăng nhập Admin | Vào /admin/maintenance | Hiển thị danh sách bảo dưỡng với tên xe, biển số, mô tả, chi phí, trạng thái | Cao | Chưa test |
| TC-MNT-02 | Xe đang bảo dưỡng hiển thị đúng trạng thái | Có xe MAINTENANCE trong DB | Vào /admin/maintenance | Hiển thị trạng thái "Đang bảo dưỡng" (badge màu vàng) | Cao | Chưa test |
| TC-MNT-03 | Hoàn thành bảo dưỡng - xe về AVAILABLE | Có xe đang IN_PROGRESS | 1. Vào /admin/maintenance 2. Bấm "Xong" trên xe đang bảo dưỡng 3. Xác nhận | Trạng thái bảo dưỡng đổi COMPLETED, xe về AVAILABLE | Cao | Chưa test |
| TC-MNT-04 | Xe MAINTENANCE không xuất hiện để đặt | Có xe đang MAINTENANCE | Vào danh sách xe public /vehicles | Xe đang bảo dưỡng không hiển thị AVAILABLE | Cao | Chưa test |
| TC-MNT-05 | Dashboard hiển thị cảnh báo xe cần bảo dưỡng | Đăng nhập Admin | Vào /admin/dashboard | Panel "Thông báo hạm đội" hiển thị xe sắp đến hạn bảo dưỡng | Trung bình | Chưa test |

---

## MODULE 8: HỒ SƠ KHÁCH HÀNG & XÁC MINH GPLX

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-KYC-01 | Xem trang giấy tờ cá nhân | Đăng nhập Customer | Vào /customer/documents | Hiển thị trạng thái xác minh GPLX hiện tại | Cao | Chưa test |
| TC-KYC-02 | Upload GPLX thành công | GPLX chưa xác minh | 1. Vào /customer/documents 2. Bấm "Chọn và gửi tài liệu" 3. Chọn file ảnh JPG/PNG | Trạng thái đổi sang "Chờ duyệt", hiển thị thông báo thành công | Cao | Chưa test |
| TC-KYC-03 | Hiển thị cảnh báo chưa cập nhật GPLX | GPLX chưa upload | Vào /customer/documents | Hiển thị Alert Info "Chưa cập nhật GPLX" | Cao | Chưa test |
| TC-KYC-04 | Hiển thị trạng thái "Đang xác minh" | GPLX đã upload, chờ duyệt | Vào /customer/documents | Hiển thị Alert Warning "GPLX đang được xác minh" | Cao | Chưa test |
| TC-KYC-05 | Hiển thị trạng thái "Đã xác minh" | GPLX đã được duyệt | Vào /customer/documents | Hiển thị Alert Success "Xác minh thành công", nút upload bị disabled | Cao | Chưa test |
| TC-KYC-06 | Admin duyệt GPLX cho khách hàng | Đăng nhập Admin, có KH chờ duyệt | 1. Vào /admin/customers 2. Bấm "Phê duyệt" | Trạng thái GPLX của khách đổi sang VERIFIED | Cao | Chưa test |
| TC-KYC-07 | Admin từ chối GPLX | Đăng nhập Admin | 1. Vào /admin/customers 2. Bấm "Từ chối" | Trạng thái GPLX đổi sang REJECTED | Cao | Chưa test |
| TC-KYC-08 | Xem & cập nhật thông tin cá nhân | Đăng nhập Customer | 1. Vào /customer/profile 2. Thay đổi địa chỉ 3. Lưu | Thông tin được cập nhật thành công | Trung bình | Chưa test |

---

## MODULE 9: ĐÁNH GIÁ & NHẬN XÉT (REVIEWS)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-RVW-01 | Gửi đánh giá sau đơn COMPLETED | Đăng nhập Customer, có đơn COMPLETED | 1. Vào chi tiết đơn COMPLETED 2. Bấm "Gửi đánh giá xe" 3. Chọn sao + nội dung 4. Gửi | Đánh giá được lưu, hiển thị trên trang chi tiết xe | Cao | Chưa test |
| TC-RVW-02 | Không thể đánh giá đơn chưa hoàn thành | Đăng nhập Customer, đơn ACTIVE | Vào chi tiết đơn ACTIVE | Không hiển thị nút "Gửi đánh giá xe" | Cao | Chưa test |
| TC-RVW-03 | Không đánh giá 2 lần cho cùng đơn | Đã đánh giá đơn thuê | Vào chi tiết đơn đã đánh giá | Không hiển thị nút gửi đánh giá | Cao | Chưa test |
| TC-RVW-04 | Đánh giá hiển thị trên trang chi tiết xe | Có đánh giá trong hệ thống | Xem /vehicles/{id} | Hiển thị danh sách đánh giá, điểm sao trung bình | Trung bình | Chưa test |
| TC-RVW-05 | Admin xem và xóa đánh giá vi phạm | Đăng nhập Admin | 1. Vào quản lý reviews 2. Bấm Xóa đánh giá | Đánh giá bị xóa khỏi hệ thống | Thấp | Chưa test |

---

## MODULE 10: THÔNG BÁO HỆ THỐNG (NOTIFICATIONS)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-NTF-01 | Nhận thông báo sau khi đặt xe thành công | Đăng nhập Customer | Đặt xe thành công | Thông báo "Đặt xe thành công" xuất hiện trong /customer/notifications | Cao | Chưa test |
| TC-NTF-02 | Nhận thông báo khi đơn được duyệt | Đăng nhập Customer, Admin duyệt đơn | Admin duyệt đơn của khách | Khách hàng nhận thông báo "Đơn thuê đã được xác nhận" | Cao | Chưa test |
| TC-NTF-03 | Xem danh sách thông báo | Đăng nhập Customer | Vào /customer/notifications | Hiển thị danh sách thông báo, phân biệt đã đọc/chưa đọc | Trung bình | Chưa test |
| TC-NTF-04 | Đánh dấu thông báo đã đọc | Có thông báo chưa đọc | Bấm vào thông báo | Thông báo đổi sang trạng thái đã đọc, badge giảm số | Trung bình | Chưa test |
| TC-NTF-05 | Badge thông báo trên header | Có thông báo chưa đọc | Nhìn vào icon chuông trên header | Hiển thị số lượng thông báo chưa đọc trên badge | Trung bình | Chưa test |

---

## MODULE 11: DASHBOARD & BÁO CÁO

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-DAS-01 | Admin Dashboard hiển thị KPI | Đăng nhập Admin | Vào /admin/dashboard | Hiển thị 4 thẻ KPI: Tổng xe, Đang cho thuê, Đang bảo dưỡng, Doanh thu lũy kế | Cao | Chưa test |
| TC-DAS-02 | Biểu đồ doanh thu theo tháng | Đăng nhập Admin | Vào /admin/dashboard | Hiển thị biểu đồ cột/đường 7 tháng gần nhất | Cao | Chưa test |
| TC-DAS-03 | Biểu đồ phân bổ trạng thái xe | Đăng nhập Admin | Vào /admin/dashboard | Hiển thị Pie chart trạng thái xe (AVAILABLE/RENTED/MAINTENANCE) | Cao | Chưa test |
| TC-DAS-04 | Bảng 5 đơn thuê mới nhất | Đăng nhập Admin | Vào /admin/dashboard | Hiển thị bảng 5 đơn thuê gần nhất kèm thông tin cơ bản | Cao | Chưa test |
| TC-DAS-05 | Nút "Thêm xe mới" từ Dashboard | Đăng nhập Admin | Bấm nút "Thêm xe mới" trên Dashboard | Redirect sang trang tạo xe mới | Trung bình | Chưa test |
| TC-DAS-06 | Manager Dashboard hiển thị KPI vận hành | Đăng nhập Manager | Vào /manager/dashboard | Hiển thị: Đơn chờ duyệt, Xe đang lưu hành, GPLX chờ duyệt, Tỷ lệ xe sẵn sàng | Cao | Chưa test |
| TC-DAS-07 | Báo cáo doanh thu - Tổng doanh thu | Đăng nhập Admin | Vào /admin/reports | Hiển thị tổng doanh thu thực tế từ các giao dịch PAID | Cao | Chưa test |
| TC-DAS-08 | Báo cáo doanh thu theo loại xe | Đăng nhập Admin | Vào /admin/reports | Biểu đồ cột hiển thị doanh thu theo danh mục (Sedan/SUV/Luxury...) | Trung bình | Chưa test |
| TC-DAS-09 | Bảng phân tích dòng tiền theo tháng | Đăng nhập Admin | Vào /admin/reports, xem bảng | Hiển thị bảng: Tháng / Lượt đặt xe / Doanh thu thuần | Trung bình | Chưa test |
| TC-DAS-10 | Dữ liệu Dashboard lấy từ backend thực | Đăng nhập Admin | Reload trang /admin/dashboard | Số liệu khớp với dữ liệu trong database | Cao | Chưa test |

---

## MODULE 12: QUẢN LÝ NGƯỜI DÙNG (ADMIN)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-USR-01 | Xem danh sách khách hàng | Đăng nhập Admin | Vào /admin/customers | Hiển thị danh sách khách hàng với thông tin cơ bản | Cao | Chưa test |
| TC-USR-02 | Tìm kiếm khách hàng theo tên | Đăng nhập Admin | 1. Vào /admin/customers 2. Nhập tên khách vào ô tìm kiếm | Lọc ra đúng khách hàng cần tìm | Cao | Chưa test |
| TC-USR-03 | Xem chi tiết hồ sơ khách hàng | Đăng nhập Admin | Bấm vào tên khách hàng | Hiển thị thông tin cá nhân, GPLX, lịch sử đặt xe | Trung bình | Chưa test |
| TC-USR-04 | Khóa tài khoản khách hàng | Đăng nhập Admin | Bấm "Khóa tài khoản" trên danh sách | Tài khoản đổi sang BLOCKED, khách không thể đăng nhập | Cao | Chưa test |
| TC-USR-05 | Mở khóa tài khoản khách hàng | Đăng nhập Admin, tài khoản đang BLOCKED | Bấm "Mở khóa" | Tài khoản đổi sang ACTIVE | Cao | Chưa test |
| TC-USR-06 | Tạo tài khoản Manager mới | Đăng nhập Admin | 1. Vào /admin/managers 2. Bấm "Thêm Manager" 3. Điền thông tin 4. Lưu | Manager được tạo, vai trò MANAGER | Cao | Chưa test |
| TC-USR-07 | Cập nhật thông tin Manager | Đăng nhập Admin | 1. Vào /admin/managers 2. Bấm Edit 3. Sửa thông tin 4. Lưu | Thông tin Manager được cập nhật | Trung bình | Chưa test |
| TC-USR-08 | Xóa tài khoản Manager | Đăng nhập Admin | Bấm "Xóa" trên Manager cần xóa | Manager bị xóa khỏi danh sách | Trung bình | Chưa test |

---

## MODULE 13: CÀI ĐẶT HỆ THỐNG (SETTINGS)

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-SET-01 | Xem trang cài đặt hệ thống | Đăng nhập Admin | Vào /admin/settings | Hiển thị 2 tab: Thông tin chung / Cấu hình chi phí & Chính sách | Trung bình | Chưa test |
| TC-SET-02 | Cập nhật tên doanh nghiệp | Đăng nhập Admin | 1. Vào tab Thông tin chung 2. Sửa tên 3. Bấm "Lưu cấu hình" | Lưu thành công, hiển thị thông báo | Trung bình | Chưa test |
| TC-SET-03 | Cập nhật phí bảo hiểm mặc định | Đăng nhập Admin | 1. Vào tab Cấu hình chi phí 2. Sửa phí bảo hiểm 3. Bấm "Lưu chính sách" | Lưu thành công, áp dụng cho đơn mới | Trung bình | Chưa test |
| TC-SET-04 | Cập nhật tỷ lệ phí hủy đơn | Đăng nhập Admin | Đổi tỷ lệ phí hủy từ 30% sang 20% và lưu | Cài đặt được lưu | Thấp | Chưa test |
| TC-SET-05 | Customer không thể truy cập Settings | Đăng nhập Customer | Truy cập /admin/settings trực tiếp | Bị chặn, redirect về trang không có quyền | Cao | Chưa test |

---

## MODULE 14: TRANG LANDING & GIAO DIỆN CÔNG KHAI

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-LND-01 | Trang chủ hiển thị đúng | Không cần đăng nhập | Truy cập http://localhost:5173 | Hiển thị Slider, tìm kiếm nhanh, danh sách xe nổi bật, cam kết dịch vụ | Cao | Chưa test |
| TC-LND-02 | Slider/Carousel hình ảnh hoạt động | Không cần đăng nhập | Xem trang chủ, đợi slider tự chuyển | Slider tự động chuyển ảnh, có nút điều hướng | Trung bình | Chưa test |
| TC-LND-03 | Danh sách xe nổi bật lấy từ database | Không cần đăng nhập | Reload trang chủ | Hiển thị xe thực từ database (không phải mock data) | Cao | Chưa test |
| TC-LND-04 | Đổi ngôn ngữ sang English | Không cần đăng nhập | Bấm nút chuyển ngôn ngữ EN | Toàn bộ nội dung đổi sang tiếng Anh | Trung bình | Chưa test |
| TC-LND-05 | Đổi ngôn ngữ sang Tiếng Việt | Đang ở chế độ English | Bấm nút chuyển ngôn ngữ VI | Toàn bộ nội dung đổi sang tiếng Việt | Trung bình | Chưa test |
| TC-LND-06 | Responsive trên mobile (375px) | Không cần đăng nhập | Mở DevTools, resize về 375px | Layout hiển thị đúng, không bị vỡ | Trung bình | Chưa test |
| TC-LND-07 | Trang hỗ trợ khách hàng | Không cần đăng nhập | Vào /customer/support | Hiển thị FAQ, thông tin liên hệ hotline 1900 6868 | Trung bình | Chưa test |
| TC-LND-08 | Tìm kiếm nhanh trên Landing Page | Không cần đăng nhập | Nhập địa điểm, chọn ngày, bấm Tìm | Redirect sang /vehicles với bộ lọc tương ứng | Cao | Chưa test |

---

## MODULE 15: HỆ THỐNG & BẢO MẬT

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-SYS-01 | Health Check API hoạt động | Backend đang chạy | GET http://localhost:5000/api/health | Response JSON: { status: "UP", services: { database: "UP", api: "UP" } } | Cao | Chưa test |
| TC-SYS-02 | Rate Limiting hoạt động | Backend đang chạy | Gửi > 100 request trong 15 phút từ cùng IP | HTTP 429 Too Many Requests | Trung bình | Chưa test |
| TC-SYS-03 | JWT hết hạn - Tự động refresh | Đã đăng nhập, Access Token hết hạn | Thực hiện bất kỳ API call nào | Hệ thống tự làm mới token, không yêu cầu đăng nhập lại | Cao | Chưa test |
| TC-SYS-04 | Audit Log ghi nhận thao tác | Đăng nhập Admin | Duyệt một đơn thuê | Kiểm tra trong /api/audit-logs: có bản ghi APPROVE_BOOKING | Trung bình | Chưa test |
| TC-SYS-05 | Swagger UI truy cập được | Backend đang chạy | Truy cập http://localhost:5000/api-docs | Giao diện Swagger hiển thị tất cả endpoint | Thấp | Chưa test |
| TC-SYS-06 | CORS chặn request từ domain lạ | Backend đang chạy | Gửi request từ domain không được phép | HTTP 403 Forbidden hoặc CORS error | Trung bình | Chưa test |

---

## MODULE 16: CUSTOMER DASHBOARD

| TC# | Tên test case | Điều kiện tiên quyết | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên | Trạng thái |
|---|---|---|---|---|---|---|
| TC-CUS-01 | Customer Dashboard hiển thị tổng quan | Đăng nhập Customer, có đơn thuê | Vào /customer/dashboard | Hiển thị: tổng đơn thuê, đang thuê, hoàn thành, đơn gần nhất | Cao | Chưa test |
| TC-CUS-02 | Danh sách đơn thuê của tôi | Đăng nhập Customer | Vào /customer/rentals | Hiển thị tất cả đơn của khách, đúng trạng thái | Cao | Chưa test |
| TC-CUS-03 | Timeline bàn giao xe hiển thị đúng | Có đơn ACTIVE | Vào chi tiết đơn thuê | Timeline hiển thị đúng bước đã hoàn thành (màu xanh) và chờ (màu xám) | Cao | Chưa test |
| TC-CUS-04 | Hóa đơn thanh toán chi tiết | Vào chi tiết đơn thuê | Xem hóa đơn | Hiển thị đúng: Đơn giá x ngày + Bảo hiểm + Phí dịch vụ = Tổng | Cao | Chưa test |
| TC-CUS-05 | Xem thông tin cá nhân | Đăng nhập Customer | Vào /customer/profile | Hiển thị thông tin: tên, email, SĐT, địa chỉ, ngày sinh | Trung bình | Chưa test |

---

## TỔNG KẾT

| Module | Tổng số TC | Cao | Trung bình | Thấp |
|---|---|---|---|---|
| AUTH - Xác thực | 13 | 10 | 3 | 0 |
| VEH - Phương tiện | 12 | 7 | 4 | 1 |
| BKG - Đặt xe | 12 | 9 | 3 | 0 |
| PAY - Thanh toán | 7 | 5 | 2 | 0 |
| CTR - Hợp đồng | 6 | 5 | 1 | 0 |
| HND - Bàn giao xe | 6 | 5 | 1 | 0 |
| MNT - Bảo dưỡng | 5 | 4 | 1 | 0 |
| KYC - Hồ sơ KH | 8 | 6 | 2 | 0 |
| RVW - Đánh giá | 5 | 3 | 1 | 1 |
| NTF - Thông báo | 5 | 2 | 3 | 0 |
| DAS - Dashboard | 10 | 6 | 4 | 0 |
| USR - Người dùng | 8 | 5 | 3 | 0 |
| SET - Cài đặt | 5 | 1 | 2 | 2 |
| LND - Landing | 8 | 3 | 5 | 0 |
| SYS - Hệ thống | 6 | 2 | 3 | 1 |
| CUS - Dashboard KH | 5 | 4 | 1 | 0 |
| **TỔNG** | **121** | **77** | **39** | **5** |

---

Ghi chú trạng thái: Chua test | Dang test | Pass | Fail | Skip
Ngay tao: 17/08/2026 | AutoRent Test Suite v1.0
