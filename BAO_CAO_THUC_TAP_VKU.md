# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG VIỆT HÀN
## KHOA KHOA HỌC MÁY TÍNH

***

<br/>

### BÁO CÁO THỰC TẬP THỰC TẾ
# XÂY DỰNG HỆ THỐNG QUẢN LÝ DỊCH VỤ CHO THUÊ XE TẠI DA NANG TRAVEL CAR

<br/>

* **Sinh viên thực hiện:** Nguyễn Huệ Minh
* **Mã số sinh viên:** 24ITB114
* **Lớp:** 24GIT2
* **Giảng viên hướng dẫn:** TS. Lê Thị Thu Nga

<br/>

**Đà Nẵng, tháng 8 năm 2026**

***

<br/>

# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG VIỆT HÀN
## KHOA KHOA HỌC MÁY TÍNH

***

<br/>

### BÁO CÁO THỰC TẬP THỰC TẾ
# XÂY DỰNG HỆ THỐNG QUẢN LÝ DỊCH VỤ CHO THUÊ XE TẠI DA NANG TRAVEL CAR

<br/>

* **Sinh viên thực hiện:** Nguyễn Huệ Minh
* **Mã số sinh viên:** 24ITB114
* **Lớp:** 24GIT2
* **Giảng viên hướng dẫn:** TS. Lê Thị Thu Nga

<br/>

**Đà Nẵng, tháng 8 năm 2026**

---

## LỜI MỞ ĐẦU

Trong bối cảnh chuyển đổi số đang diễn ra mạnh mẽ và nhu cầu di chuyển cá nhân tại các thành phố du lịch trọng điểm như Đà Nẵng ngày càng tăng cao, dịch vụ cho thuê xe tự lái đã trở thành một giải pháp phương tiện linh hoạt, tiện lợi và được ưa chuộng bậc nhất. Thành phố Đà Nẵng với lượng khách du lịch và thương gia đến tham quan, làm việc liên tục tăng trưởng đòi hỏi các đơn vị kinh doanh vận tải phải chuyển mình từ mô hình quản lý thủ công sang nền tảng số hóa minh bạch, hiện đại và tối ưu hóa vận hành.

Để đáp ứng xu hướng thực tiễn đó, báo cáo thực tập thực tế đề tài **"Xây dựng hệ thống quản lý dịch vụ cho thuê xe tại Da Nang Travel Car"** được thực hiện nhằm mang đến cho khách hàng trải nghiệm tìm kiếm, đặt thuê xe tự lái, ký hợp đồng điện tử và thanh toán trực tuyến một cách nhanh chóng, minh bạch và an toàn tối đa.

Mục tiêu cốt lõi của đề tài là xây dựng một hệ thống ứng dụng web toàn diện, tích hợp đầy đủ quy trình nghiệp vụ thực tế từ khâu tiếp nhận yêu cầu đặt xe, thẩm định hồ sơ giấy tờ (CCCD/GPLX), ký hợp đồng điện tử, bàn giao xe thực tế (ghi nhận số km, lượng nhiên liệu, tình trạng ngoại quan xe) cho đến tất toán phụ phí và hỗ trợ đa dạng phương thức thanh toán điện tử (VNPay, MoMo, VietQR, Tiền mặt). Giải pháp số hóa này góp phần giúp doanh nghiệp Da Nang Travel Car tối ưu hóa chi phí vận hành, loại bỏ sai sót thủ công, kiểm soát tình trạng đội xe và nâng cao chất lượng dịch vụ chuyên nghiệp.

Đề tài được thực hiện bởi sinh viên Nguyễn Huệ Minh thuộc Khoa Khoa học Máy tính - Trường Đại học Công nghệ Thông tin và Truyền thông Việt Hàn (VKU) dưới sự hướng dẫn tận tình của TS. Lê Thị Thu Nga. Tác giả hy vọng hệ thống sẽ là tiền đề vững chắc đóng góp vào sự phát triển của mô hình dịch vụ cho thuê xe công nghệ tại Việt Nam.

---

## NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN

...................................................................................................................................................................................................

...................................................................................................................................................................................................

...................................................................................................................................................................................................

...................................................................................................................................................................................................

...................................................................................................................................................................................................

...................................................................................................................................................................................................

...................................................................................................................................................................................................

...................................................................................................................................................................................................

<br/>

*Đà Nẵng, ngày … tháng … năm 2026*

**Chữ ký Giảng viên**

<br/>

<br/>

---

## LỜI CẢM ƠN

Trước tiên, với tình cảm sâu sắc và chân thành nhất, em xin được bày tỏ lòng biết ơn đến tất cả các cá nhân và tổ chức đã tạo điều kiện hỗ trợ, giúp đỡ em trong suốt quá trình học tập, thực tập và nghiên cứu hoàn thành đề tài này.

Với lòng biết ơn sâu sắc nhất, em xin gửi lời cảm ơn đến quý Thầy Cô khoa Khoa học Máy tính - Trường Đại học Công nghệ Thông tin và Truyền thông Việt Hàn (VKU) đã truyền đạt vốn kiến thức nền tảng và chuyên sâu quý báu cho em trong suốt thời gian học tập tại trường. Nhờ có những lời hướng dẫn, dạy bảo nhiệt tình của các thầy cô, em mới có đủ năng lực tư duy và kỹ năng chuyên môn để hoàn thành tốt đợt thực tập thực tế này.

Đặc biệt, em xin chân thành cảm ơn cô **TS. Lê Thị Thu Nga** đã tận tình định hướng, hỗ trợ chuyên môn và góp ý chi tiết cho em trong suốt quá trình thực hiện báo cáo. Nhờ có sự chỉ bảo sát sao của Cô, em mới có thể giải quyết được các bài toán nghiệp vụ phức tạp và hoàn thiện báo cáo đúng tiến độ.

Trong quá trình xây dựng hệ thống cũng như biên soạn báo cáo, khó tránh khỏi những thiếu sót nhất định do hạn chế về kinh nghiệm thực tế. Em rất mong nhận được những ý kiến đóng góp quý báu từ quý Thầy Cô trong Hội đồng đánh giá để em học hỏi thêm kinh nghiệm và hoàn thiện hơn trong các dự án tương lai.

Em xin chân thành cảm ơn!

<br/>

**Sinh viên thực hiện**

*Nguyễn Huệ Minh*

---

## MỤC LỤC

- [LỜI MỞ ĐẦU](#lời-mở-đầu)
- [NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN](#nhận-xét-của-giảng-viên-hướng-dẫn)
- [LỜI CẢM ƠN](#lời-cảm-ơn)
- [DANH MỤC CÁC TỪ VIẾT TẮT](#danh-mục-các-từ-viết-tắt)
- [Chương I. GIỚI THIỆU DỰ ÁN](#chương-i-giới-thiệu-dự-án)
  - [1. Giới thiệu dự án và Bối cảnh thực tế](#1-giới-thiệu-dự-án-và-bối-cảnh-thực-tế)
  - [2. Mục tiêu của đề tài](#2-mục-tiêu-của-đề-tài)
  - [3. Phạm vi và Đối tượng nghiên cứu](#3-phạm-vi-và-đối-tượng-nghiên-cứu)
  - [4. Phương pháp nghiên cứu và Tiếp cận đề tài](#4-phương-pháp-nghiên-cứu-và-tiếp-cận-đề-tài)
  - [5. Nội dung và Kế hoạch thực hiện](#5-nội-dung-và-kế-hoạch-thực-hiện)
  - [6. Bố cục báo cáo](#6-bố-cục-báo-cáo)
- [Chương II. KIẾN THỨC TỔNG QUAN](#chương-ii-kiến-thức-tổng-quan)
  - [1. Phân hệ Giao diện Người dùng (Front-end Technologies)](#1-phân-hệ-giao-diện-người-dùng-front-end-technologies)
  - [2. Phân hệ Xử lý Máy chủ (Back-end Technologies) và Cơ sở dữ liệu](#2-phân-hệ-xử-lý-máy-chủ-back-end-technologies-và-cơ-sở-dữ-liệu)
  - [3. Mẫu Thiết kế Phần mềm Áp dụng (Software Design Patterns)](#3-mẫu-thiết-kế-phần-mềm-áp-dụng-software-design-patterns)
  - [4. Kiến trúc Ứng dụng và Cơ chế Bảo mật](#4-kiến-trúc-ứng-dụng-và-cơ-chế-bảo-mật)
- [Chương III. PHÂN TÍCH THIẾT KẾ HỆ THỐNG](#chương-iii-phân-tích-thiết-kế-hệ-thống)
  - [1. Khảo sát hiện trạng và Đề xuất giải pháp số hóa](#1-khảo-sát-hiện-trạng-và-đề-xuất-giải-pháp-số-hóa)
  - [2. Phân tích Tác nhân và Ma trận Phân quyền (RBAC Matrix)](#2-phân-tích-tác-nhân-và-ma-trận-phân-quyền-rbac-matrix)
  - [3. Use Case Hệ thống và Đặc tả Chi tiết](#3-use-case-hệ-thống-và-đặc-tả-chi-tiết)
  - [4. Biểu đồ Hoạt động (Activity Diagrams)](#4-biểu-đồ-hoạt-động-activity-diagrams)
  - [5. Biểu đồ Tuần tự (Sequence Diagrams)](#5-biểu-đồ-tuần-tự-sequence-diagrams)
  - [6. Thiết kế Cơ sở Dữ liệu và Từ điển Dữ liệu (Data Dictionary)](#6-thiết-kế-cơ-sở-dữ-liệu-và-từ-điển-dữ-liệu-data-dictionary)
- [Chương IV. CHI TIẾT DỰ ÁN VÀ GIAO DIỆN HỆ THỐNG](#chương-iv-chi-tiết-dự-án-và-giao-diện-hệ-thống)
  - [4.0. Quy chuẩn Thiết kế Giao diện (UI/UX Design System)](#40-quy-chuẩn-thiết-kế-giao-diện-uiux-design-system)
  - [4.1. Giao diện Phân hệ Khách hàng (Customer & Guest Interface)](#41-giao-diện-phân-hệ-khách-hàng-customer--guest-interface)
    - [4.1.1. Trang chủ và Thanh tìm kiếm xe nhanh](#411-trang-chủ-và-thanh-tìm-kiếm-xe-nhanh)
    - [4.1.2. Màn hình Danh sách xe và Bộ lọc nâng cao](#412-màn-hình-danh-sách-xe-và-bộ-lọc-nâng-cao)
    - [4.1.3. Màn hình Chi tiết xe và Bảng tính giá thuê](#413-màn-hình-chi-tiết-xe-và-bảng-tính-giá-thuê)
    - [4.1.4. Màn hình Đăng ký tài khoản khách hàng](#414-màn-hình-đăng-ký-tài-khoản-khách-hàng)
    - [4.1.5. Màn hình Đăng nhập hệ thống](#415-màn-hình-đăng-nhập-hệ-thống)
    - [4.1.6. Màn hình Đặt xe và Lựa chọn dịch vụ bổ sung](#416-màn-hình-đặt-xe-và-lựa-chọn-dịch-vụ-bổ-sung)
    - [4.1.7. Màn hình Xác nhận đơn và Thanh toán cọc trực tuyến](#417-màn-hình-xác-nhận-đơn-và-thanh-toán-cọc-trực-tuyến)
    - [4.1.8. Màn hình Tải ảnh và Quản lý Giấy tờ xác minh (CCCD / GPLX)](#418-màn-hình-tải-ảnh-và-quản-lý-giấy-tờ-xác-minh-cccd--gplx)
    - [4.1.9. Màn hình Xem và Ký Hợp đồng điện tử trực tuyến](#419-màn-hình-xem-và-ký-hợp-đồng-điện-tử-trực-tuyến)
    - [4.1.10. Màn hình Quản lý Lịch sử đơn thuê và Trạng thái chuyến đi](#4110-màn-hình-quản-lý-lịch-sử-đơn-thuê-và-trạng-thái-chuyến-đi)
    - [4.1.11. Màn hình Đánh giá và Gửi phản hồi dịch vụ](#4111-màn-hình-đánh-giá-và-gửi-phản-hồi-dịch-vụ)
  - [4.2. Giao diện Phân hệ Quản trị và Vận hành (Admin & Manager Interface)](#42-giao-diện-phân-hệ-quản-trị-và-vận-hành-admin--manager-interface)
    - [4.2.1. Màn hình Dashboard Tổng quan và Báo cáo Doanh thu](#421-màn-hình-dashboard-tổng-quan-và-báo-cáo-doanh-thu)
    - [4.2.2. Màn hình Quản lý Danh mục và Thông tin Đội xe](#422-màn-hình-quản-lý-danh-mục-và-thông-tin-đội-xe)
    - [4.2.3. Màn hình Thẩm định và Duyệt Hồ sơ Giấy tờ Khách hàng](#423-màn-hình-thẩm-định-và-duyệt-hồ-sơ-giấy-tờ-khách-hàng)
    - [4.2.4. Màn hình Quản lý và Phê duyệt Đơn đặt xe](#424-màn-hình-quản-lý-và-phê-duyệt-đơn-đặt-xe)
    - [4.2.5. Màn hình Lập Biên bản Bàn giao xe khi giao (Pickup Record)](#425-màn-hình-lập-biên-bản-bàn-giao-xe-khi-giao-pickup-record)
    - [4.2.6. Màn hình Lập Biên bản Nhận lại xe và Tự động Tính phụ phí (Return Record)](#426-màn-hình-lập-biên-bản-nhận-lại-xe-và-tự-động-tính-phụ-phí-return-record)
    - [4.2.7. Màn hình Quản lý Lịch Bảo dưỡng và Chi phí Vận hành xe](#427-màn-hình-quản-lý-lịch-bảo-dưỡng-và-chi-phí-vận-hành-xe)
    - [4.2.8. Màn hình Quản lý Tài khoản Người dùng và Phân quyền Hệ thống](#428-màn-hình-quản-lý-tài-khoản-người-dùng-và-phân-quyền-hệ-thống)
- [KẾT LUẬN](#kết-luận)
  - [1. Đánh giá Mức độ Hoàn thiện Chức năng (Requirements Traceability Matrix)](#1-đánh-giá-mức-độ-hoàn-thiện-chức-năng-requirements-traceability-matrix)
  - [2. Kết quả đạt được](#2-kết-quả-đạt-được)
  - [3. Hạn chế của hệ thống](#3-hạn-chế-của-hệ-thống)
  - [4. Hướng phát triển](#4-hướng-phát-triển)
- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

---

## DANH MỤC CÁC TỪ VIẾT TẮT

| VIẾT TẮT | TÊN TIẾNG ANH / NỘI DUNG ĐẦY ĐỦ | DIỄN GIẢI Ý NGHĨA |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng, phương thức kết nối giữa Client và Server |
| **SPA** | Single Page Application | Ứng dụng web trang đơn, tải trang mượt mà không tải lại toàn bộ trình duyệt |
| **UI / UX** | User Interface / User Experience | Giao diện người dùng / Trải nghiệm người dùng |
| **JWT** | JSON Web Token | Chuẩn xác thực an toàn mã hóa chuỗi thông tin định danh giữa Client và Server |
| **ORM** | Object-Relational Mapping | Kỹ thuật ánh xạ cơ sở dữ liệu quan hệ sang đối tượng trong lập trình |
| **ERD** | Entity Relationship Diagram | Sơ đồ mối quan hệ giữa các thực thể dữ liệu |
| **RBAC** | Role-Based Access Control | Mô hình kiểm soát truy cập phân quyền dựa trên vai trò người dùng |
| **RTM** | Requirements Traceability Matrix | Ma trận ma vết đối soát mức độ hoàn thiện các yêu cầu |
| **CCCD** | Căn cước công dân | Giấy tờ định danh cá nhân của người thuê xe |
| **GPLX** | Giấy phép lái xe | Bằng lái xe hợp lệ của người điều khiển phương tiện |
| **ODO** | Odometer | Chỉ số đồng hồ đo tổng quãng đường đã di chuyển của xe (km) |
| **REST** | Representational State Transfer | Kiểu kiến trúc thiết kế dịch vụ Web thông qua giao thức HTTP |

---

# Chương I. GIỚI THIỆU DỰ ÁN

## 1. Giới thiệu dự án và Bối cảnh thực tế

Thành phố Đà Nẵng là trung tâm kinh tế, du lịch và dịch vụ lớn của khu vực miền Trung. Với lượng khách du lịch trong nước, quốc tế cùng giới thương gia đến tham quan, công tác tăng trưởng liên tục qua các năm, nhu cầu di chuyển chủ động bằng ô tô tự lái ngày càng gia tăng đáng kể. Khách hàng ngày nay hướng tới tính nhanh chóng, minh bạch về giá cả, sự tiện lợi khi tìm kiếm thông tin phương tiện và quy trình làm thủ tục đơn giản.

Tuy nhiên, khảo sát thực tế tại đơn vị kinh doanh **Da Nang Travel Car** ghi nhận quy trình vận hành quản lý hiện tại vẫn chủ yếu dựa trên các công pháp truyền thống:
* **Đặt xe & Tiếp nhận thông tin:** Khách hàng liên hệ qua điện thoại hoặc tin nhắn Zalo, nhân viên ghi chép lịch thủ công vào sổ theo dõi. Cách làm này dễ phát sinh nguy cơ trùng lịch xe (*Double Booking*) vào các giai đoạn cao điểm du lịch.
* **Thẩm định hồ sơ khách hàng:** Việc lưu trữ hình ảnh Giấy phép lái xe (GPLX) và Căn cước công dân (CCCD) diễn ra rời rạc trên thiết bị cá nhân của nhân viên, thiếu tính bảo mật thông tin và khó tra cứu khi cần thiết.
* **Bàn giao và Kiểm soát xe:** Biên bản giao nhận xe (ghi nhận số km ODO, % nhiên liệu, vết trầy xước) được viết tay trên giấy. Khi khách hàng trả xe, việc tính toán phụ phí trễ giờ, phụ phí vượt mốc km quy định hay thiếu xăng được tính tay, dễ dẫn đến tranh cãi chi phí không đáng có.
* **Thống kê doanh thu:** Việc tổng hợp doanh thu, theo dõi lịch bảo dưỡng định kỳ từng đầu xe và tính toán chi phí vận hành tốn nhiều thời gian, thiếu tính trực quan và chính xác.

Từ thực tế đó, việc nghiên cứu và xây dựng một giải pháp công nghệ số hóa toàn diện là yêu cầu cấp thiết. Đề tài **"Xây dựng hệ thống quản lý dịch vụ cho thuê xe tại Da Nang Travel Car"** được thực hiện nhằm cung cấp nền tảng Web quản lý hiện đại, tối ưu hóa toàn bộ luồng nghiệp vụ từ đặt xe trực tuyến, xác minh giấy tờ, lập hợp đồng điện tử, bàn giao xe đến thanh toán và báo cáo quản trị.

---

## 2. Mục tiêu của đề tài

Mục tiêu chính của đề tài là xây dựng thành công nền tảng phần mềm quản lý và đặt xe trực tuyến (Web Application) đáp ứng trọn vẹn yêu cầu nghiệp vụ thực tế của đơn vị Da Nang Travel Car:

* **Về phía Khách hàng (Người thuê xe):**
  * Tra cứu, tìm kiếm và lọc xe linh hoạt theo nhu cầu (loại xe, số chỗ, thương hiệu, loại nhiên liệu, hình thức số sàn/số tự động).
  * Thực hiện đặt xe trực tuyến nhanh chóng, công khai bảng giá thuê và mức tiền đặt cọc minh bạch.
  * Đăng tải ảnh hồ sơ xác minh (CCCD/GPLX) trực tiếp lên hệ thống để nhà xe thẩm định trước.
  * Xem dự thảo và thực hiện ký Hợp đồng cho thuê xe điện tử trực tiếp trên giao diện web.
  * Thanh toán cọc và hoàn tất hóa đơn tiện lợi qua nhiều kênh trực tuyến (quét mã VietQR, VNPay, ví MoMo) hoặc tiền mặt.
  * Đánh giá chất lượng dịch vụ sau chuyến đi.

* **Về phía Nhà xe (Quản lý & Admin Da Nang Travel Car):**
  * Quản lý tập trung toàn bộ danh mục đội xe, cập nhật trạng thái xe (Sẵn sàng cho thuê, Đang cho thuê, Đang bảo trì).
  * Thẩm định trực tuyến hồ sơ giấy tờ khách hàng, phê duyệt hoặc từ chối đơn đặt xe.
  * Lập biên bản bàn giao xe điện tử lúc giao (*Pickup*) và lúc nhận lại xe (*Return*), hệ thống tự động đối soát chỉ số ODO, lượng nhiên liệu để tính toán chính xác phụ phí trễ giờ/quá km/thiếu xăng.
  * Quản lý lịch bảo trì, bảo dưỡng và chi phí phát sinh cho từng phương tiện.
  * Theo dõi báo cáo thống kê doanh thu, tỷ lệ lấp đầy phương tiện qua bảng điều khiển (*Dashboard*) trực quan.

---

## 3. Phạm vi và Đối tượng nghiên cứu

* **Đối tượng nghiên cứu:** Quy trình nghiệp vụ cho thuê xe ô tô tự lái thực tế; phương pháp xây dựng ứng dụng Web hiện đại theo kiến trúc phân lớp; quy trình xác thực mã hóa an toàn và các giải pháp thanh toán điện tử.
* **Phạm vi ứng dụng:** Áp dụng trực tiếp tại đơn vị cho thuê xe Da Nang Travel Car (thành phố Đà Nẵng).
* **Giới hạn hệ thống:** Tập trung vào dòng xe ô tô tự lái từ 4 đến 7 chỗ; quy trình quản lý giao nhận xe, hợp đồng điện tử và báo cáo doanh thu quản trị.

---

## 4. Phương pháp nghiên cứu và Tiếp cận đề tài

Để hoàn thành hệ thống đáp ứng đúng yêu cầu thực tiễn, sinh viên áp dụng kết hợp các phương pháp nghiên cứu khoa học và kỹ thuật phần mềm:
1. **Phương pháp Khảo sát Thực tế & Thu thập Yêu cầu (Field Survey & Requirement Gathering):** Trực tiếp phỏng vấn quy trình vận hành của nhân viên quản lý tại Da Nang Travel Car để làm rõ các bài toán thực tế (cách tính phụ phí quá km, quy trình thẩm định CCCD/GPLX, quy trình giữ cọc).
2. **Phương pháp Phân tích Thiết kế Hệ thống Hướng Đối tượng (OOAD - Object-Oriented Analysis and Design):** Sử dụng các biểu đồ chuẩn UML (Use Case, Activity, Sequence, Class Diagram) để mô hình hóa toàn bộ các luồng công việc.
3. **Phương pháp Phát triển Phần mềm Agile/Scrum ngắn hạn:** Chia nhỏ quá trình xây dựng sản phẩm thành các chu kỳ phát triển (Sprint 2 tuần), giúp liên tục cải tiến giao diện và kiểm thử tính năng.
4. **Phương pháp Thực nghiệm & Kiểm thử (Empirical Testing):** Xây dựng bộ kịch bản kiểm thử (*Test Cases*) thử nghiệm đa dạng luồng giao dịch, đối soát phụ phí bàn giao xe và thanh toán trực tuyến.

---

## 5. Nội dung và Kế hoạch thực hiện

Dự án được triển khai trong vòng 16 tuần theo lộ trình rõ ràng, chia làm 6 giai đoạn chính:

```
[Tuần 1-2]   --->  Khảo sát nghiệp vụ thực tế tại Da Nang Travel Car & Thu thập yêu cầu
[Tuần 3-4]   --->  Phân tích yêu cầu hệ thống, xác định Actor, Use Case & Lập đề cương
[Tuần 5-6]   --->  Thiết kế Cơ sở dữ liệu (ERD), Kiến trúc hệ thống & Biểu đồ UML
[Tuần 7-10]  --->  Phát triển máy chủ Back-end API & Tích hợp cổng thanh toán trực tuyến
[Tuần 11-13] --->  Phát triển giao diện Front-end, tích hợp API & Hoàn thiện trang Quản trị
[Tuần 14-15] --->  Kiểm thử chức năng, tối ưu trải nghiệm UI/UX, bảo mật & Sửa lỗi
[Tuần 16]    --->  Tổng hợp tài liệu, hoàn thiện Báo cáo Thực tập Thực tế & Đóng gói sản phẩm
```

---

## 6. Bố cục báo cáo

Nội dung báo cáo thực tập thực tế bao gồm các phần chính sau:
* **Lời mở đầu, Lời cảm ơn, Mục lục, Danh mục từ viết tắt.**
* **Chương I: Giới thiệu dự án** - Trình bày bối cảnh thực tế, mục tiêu, phạm vi, phương pháp nghiên cứu và kế hoạch thực hiện.
* **Chương II: Kiến thức tổng quan** - Trình bày tổng quan nền tảng công nghệ (React, Node.js, Express, MySQL, Prisma ORM, JWT, Ant Design), các mẫu thiết kế phần mềm (*Strategy Pattern, State Pattern*) và kiến trúc bảo mật hệ thống.
* **Chương III: Phân tích thiết kế hệ thống** - Đánh giá hiện trạng, ma trận phân quyền RBAC, biểu đồ Use Case, biểu đồ Hoạt động, biểu đồ Tuần tự, Thiết kế CSDL (ERD) và Từ điển Dữ liệu (*Data Dictionary*).
* **Chương IV: Chi tiết dự án và Giao diện hệ thống** - Quy chuẩn thiết kế UI/UX và mô tả chi tiết 19 màn hình chức năng thuộc phân hệ Khách hàng và Quản trị Admin kèm khung vị trí chèn hình ảnh minh họa.
* **Kết luận và Tài liệu tham khảo** - Bảng đánh giá hoàn thiện RTM, tổng kết kết quả đạt được, hạn chế và hướng phát triển mở rộng.

---

# Chương II. KIẾN THỨC TỔNG QUAN

## 1. Phân hệ Giao diện Người dùng (Front-end Technologies)

* **HTML5 / CSS3 / JavaScript:** Là các nền tảng căn bản tạo nên cấu trúc, phong cách giao diện và tương tác cho ứng dụng Web. Trong dự án, HTML5 đóng vai trò định hình khung hình chuẩn ngữ nghĩa, CSS3 xử lý bố cục Responsive đáp ứng nhiều kích thước màn hình, còn JavaScript xử lý các luồng sự kiện tương tác bề mặt.
* **React.js:** Thư viện JavaScript mã nguồn mở hàng đầu được phát triển bởi Meta, chuyên dùng xây dựng giao diện người dùng theo mô hình ứng dụng trang đơn (*Single Page Application - SPA*). Cơ chế chia nhỏ giao diện thành các thành phần (*Components*) tái sử dụng giúp mã nguồn rõ ràng, dễ bảo trì. Thêm vào đó, cơ chế *Virtual DOM* của React tối ưu hóa việc cập nhật lại các phần thay đổi trên trang mà không phải tải lại toàn bộ trình duyệt, mang lại trải nghiệm mượt mà cho người dùng.
* **TypeScript:** Là ngôn ngữ mở rộng nâng cao của JavaScript được phát triển bởi Microsoft, bổ sung hệ thống kiểu dữ liệu tĩnh (*Static Typing*). TypeScript giúp phát hiện các sai sót cú pháp và kiểu dữ liệu ngay trong quá trình phát triển (*Compile-time*), giúp mã nguồn chặt chẽ và tăng độ tin cậy khi phát triển hệ thống lớn.
* **Ant Design (antd):** Thư viện bộ thành phần giao diện (*UI Component Library*) chuẩn doanh nghiệp. Ant Design cung cấp sẵn các thành phần như Bảng dữ liệu (*Table*), Biểu mẫu (*Form*), Hộp thoại (*Modal*), Thông báo (*Notification*) và Bộ chọn ngày (*DatePicker*) với phong cách thiết kế hiện đại, đồng nhất và chuẩn hóa UX.

---

## 2. Phân hệ Xử lý Máy chủ (Back-end Technologies) và Cơ sở dữ liệu

* **Node.js & Express.js:** Node.js là môi trường chạy JavaScript phía máy chủ dựa trên V8 Engine của Google. Mô hình xử lý bất đồng bộ dựa trên sự kiện (*Event-driven, Non-blocking I/O*) giúp Node.js phản hồi hàng ngàn yêu cầu truy cập đồng thời với hiệu năng vượt trội. Express.js đóng vai trò là Web Framework tối giản chạy trên Node.js, cung cấp hệ thống định tuyến (*Routing*) linh hoạt để xây dựng các dịch vụ API chuẩn RESTful.
* **Hệ quản trị CSDL MySQL:** Là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ, phổ biến và độ tin cậy cao. Dữ liệu trong hệ thống (thông tin người dùng, danh mục xe, đơn đặt xe, biên bản bàn giao, hợp đồng) được lưu trữ bài bản dưới dạng các bảng quan hệ có ràng buộc khóa chính, khóa ngoại chặt chẽ.
* **Prisma ORM:** Công cụ ORM (*Object-Relational Mapping*) thế hệ mới hỗ trợ Node.js và TypeScript. Prisma cung cấp cú pháp định nghĩa lược đồ dữ liệu (*Prisma Schema*) rõ ràng, tự động tạo mã truy vấn *Type-safe* và quản lý các bản nâng cấp cấu trúc cơ sở dữ liệu (*Migrations*) an toàn, giúp thao tác dữ liệu chính xác và ngăn ngừa rủi ro bảo mật.

---

## 3. Mẫu Thiết kế Phần mềm Áp dụng (Software Design Patterns)

Để đảm bảo kiến trúc phần mềm linh hoạt, dễ mở rộng và dễ bảo trì, dự án áp dụng các Mẫu thiết kế phần mềm (*Design Patterns*) kinh điển:

* **Strategy Pattern (Mẫu Chiến lược cho Thanh toán đa cổng):**
  * *Bài toán:* Hệ thống cần hỗ trợ nhiều hình thức thanh toán khác nhau (quét mã VietQR, cổng VNPay, ví MoMo, Tiền mặt) và có thể thêm cổng thanh toán mới trong tương lai.
  * *Giải pháp:* Áp dụng Strategy Pattern định nghĩa một Giao diện chung (*Payment Strategy Interface*) chứa phương thức xử lý thanh toán. Mỗi cổng thanh toán (VNPayStrategy, MoMoStrategy, VietQRStrategy) được đóng gói độc lập. Khi khách hàng chọn kênh thanh toán, hệ thống chỉ cần gọi chiến lược tương ứng mà không làm ảnh hưởng hay thay đổi mã nguồn các phần khác.

* **State Pattern (Mẫu Trạng thái cho Vòng đời Đơn thuê xe & Biên bản Bàn giao):**
  * *Bài toán:* Đơn thuê xe trải qua nhiều trạng thái nối tiếp (`PENDING` -> `CONFIRMED` -> `ACTIVE` -> `COMPLETED`) và ở mỗi trạng thái, các hành vi cho phép (duyệt đơn, lập biên bản bàn giao, hủy đơn, tất toán) là khác nhau.
  * *Giải pháp:* Mô hình hóa quản lý trạng thái giúp kiểm soát chặt chẽ luồng dữ liệu, ngăn ngừa các lỗi vi phạm nghiệp vụ (ví dụ: Không thể lập biên bản nhận lại xe khi đơn chưa ở trạng thái Đang thuê).

---

## 4. Kiến trúc Ứng dụng và Cơ chế Bảo mật

* **Mô hình Client - Server tách biệt:** Ứng dụng được thiết kế tách biệt hoàn toàn giữa giao diện người dùng (*React SPA*) và máy chủ dịch vụ (*Express RESTful API*). Mọi tương tác dữ liệu đều thông qua giao thức chuẩn HTTP/HTTPS dưới định dạng định dữ liệu JSON.
* **Cơ chế Phân quyền Truy cập theo Vai trò (RBAC - Role-Based Access Control):** Hệ thống phân quyền chặt chẽ giữa 3 nhóm đối tượng (`Customer`, `Manager`, `Admin`). Mỗi API Endpoint đều được bảo vệ bởi Middleware kiểm tra quyền hạn tương ứng.
* **Cơ chế Xác thực an toàn JWT (JSON Web Token):** Người dùng đăng nhập thành công sẽ được cấp mã định danh bảo mật Token. Mã Token này được đính kèm vào phần đầu header của các yêu cầu tiếp theo để máy chủ xác minh danh tính.
* **Mã hóa Mật khẩu một chiều (Bcrypt):** Mật khẩu của người dùng được mã hóa băm một chiều trước khi lưu vào cơ sở dữ liệu, đảm bảo tuyệt đối an toàn thông tin cá nhân.

---

# Chương III. PHÂN TÍCH THIẾT KẾ HỆ THỐNG

## 1. Khảo sát hiện trạng và Đề xuất giải pháp số hóa

Qua quá trình tìm hiểu thực tế quy trình vận hành tại nhà xe Da Nang Travel Car, báo cáo tổng hợp bảng so sánh đối sánh giữa phương thức quản lý thủ công truyền thống và giải pháp hệ thống số hóa mới:

| QUY TRÌNH NGHIỆP VỤ | HẠN CHẾ CỦA MÔ HÌNH THỦ CÔNG | GIẢI PHÁP HỆ THỐNG SỐ HÓA MỚI |
| :--- | :--- | :--- |
| **Đặt xe & Tiếp nhận** | Gọi điện/Zalo ghi chép thủ công, dễ trùng lịch xe mùa cao điểm. | Khách đặt xe trực tuyến 24/7, tự động kiểm tra trùng lịch theo thời gian. |
| **Quản lý Giấy tờ** | Lưu ảnh CCCD/GPLX rời rạc trên điện thoại, dễ mất mát và lộ thông tin. | Upload trực tiếp lên hệ thống an toàn, Admin duyệt hồ sơ online. |
| **Bàn giao & Trả xe** | Viết biên bản giấy, tính phụ phí bằng tay dễ sai sót và gây tranh cãi. | Lập biên bản Pickup/Return điện tử, hệ thống tự động tính chính xác phụ phí. |
| **Ký Hợp đồng** | Ký hợp đồng giấy tốn thời gian, khó lưu trữ và tra cứu lại. | Khách xem dự thảo và thực hiện Ký hợp đồng điện tử trực tiếp trên Web. |
| **Thanh toán** | Thanh toán tiền mặt hoặc chuyển khoản thủ công khó đối soát. | Tích hợp mã quét VietQR động, cổng VNPay, ví MoMo gạch nợ tự động. |
| **Báo cáo Quản trị** | Cộng tổng thủ công sổ sách cuối tháng, thiếu tính trực quan. | Biểu đồ báo cáo doanh thu, thống kê hiệu suất từng đầu xe thời gian thực. |

---

## 2. Phân tích Tác nhân và Ma trận Phân quyền (RBAC Matrix)

### 2.1. Danh sách Tác nhân (Actors)
Hệ thống xác định 03 nhóm tác nhân chính tham gia tương tác:
1. **Khách hàng (Customer / Guest):** Khách vãng lai xem thông tin xe và Khách hàng đã đăng ký tài khoản thực hiện đặt xe, upload giấy tờ, ký hợp đồng và thanh toán.
2. **Quản lý (Manager):** Nhân viên nhà xe chịu trách nhiệm duyệt hồ sơ khách hàng, phê duyệt đơn hàng, lập biên bản bàn giao/nhận xe và theo dõi xe bảo trì.
3. **Quản trị viên (Admin):** Chủ cơ sở kinh doanh, có toàn quyền quản trị danh mục xe, quản lý tài khoản nhân sự, cấu hình giá trị phụ phí và xem báo cáo doanh thu.

### 2.2. Ma trận Phân quyền Hệ thống (RBAC Matrix)

| PHÂN HỆ / CHỨC NĂNG | KHÁCH VẮNG LAI | KHÁCH HÀNG (CUSTOMER) | QUẢN LÝ (MANAGER) | QUẢN TRỊ VIÊN (ADMIN) |
| :--- | :---: | :---: | :---: | :---: |
| **Xem danh sách & Chi tiết xe** |  [x] |  [x] |  [x] |  [x] |
| **Đăng ký / Đăng nhập** |  [x] |  [x] |  [x] |  [x] |
| **Tạo đơn đặt xe trực tuyến** |  [-] |  [x] |  [-] |  [-] |
| **Upload giấy tờ (CCCD/GPLX)** |  [-] |  [x] |  [-] |  [-] |
| **Ký hợp đồng điện tử** |  [-] |  [x] |  [-] |  [-] |
| **Thanh toán cọc / Tất toán** |  [-] |  [x] |  [-] |  [-] |
| **Đánh giá dịch vụ xe** |  [-] |  [x] |  [-] |  [-] |
| **Thẩm định hồ sơ giấy tờ** |  [-] |  [-] |  [x] |  [x] |
| **Phê duyệt / Hủy đơn đặt xe** |  [-] |  [-] |  [x] |  [x] |
| **Lập biên bản Pickup / Return** |  [-] |  [-] |  [x] |  [x] |
| **Quản lý lịch bảo trì xe** |  [-] |  [-] |  [x] |  [x] |
| **Thêm / Sửa / Xóa danh mục xe** |  [-] |  [-] |  [-] |  [x] |
| **Quản lý tài khoản & Phân quyền**|  [-] |  [-] |  [-] |  [x] |
| **Xem Báo cáo Doanh thu** |  [-] |  [-] |  [-] |  [x] |

---

## 3. Use Case Hệ thống và Đặc tả Chi tiết

### 3.1. Bảng tổng hợp Danh sách Use Case

| STT | TÊN USE CASE | TÁC NHÂN CHÍNH | MÔ TẢ TỔNG QUAN HÀNH VI |
| :---: | :--- | :--- | :--- |
| **1** | Tra cứu & Lọc xe | Khách vãng lai, Khách hàng | Tìm kiếm danh sách xe theo loại, thương hiệu, giá thuê và số chỗ |
| **2** | Đăng ký & Đăng nhập | Khách vãng lai, Khách hàng | Khởi tạo tài khoản mới và xác thực đăng nhập vào hệ thống |
| **3** | Đặt xe trực tuyến | Khách hàng | Chọn thời gian, địa điểm, dịch vụ bổ sung và tạo đơn đặt xe |
| **4** | Tải hồ sơ xác minh | Khách hàng | Tải ảnh CCCD (2 mặt) và Giấy phép lái xe để nhà xe thẩm định |
| **5** | Ký hợp đồng điện tử | Khách hàng | Xem nội dung hợp đồng thuê xe tự lái và ký xác nhận trực tuyến |
| **6** | Thanh toán trực tuyến | Khách hàng | Thanh toán cọc hoặc tất toán hóa đơn qua VietQR, VNPay, MoMo |
| **7** | Thẩm định hồ sơ | Quản lý, Admin | Xem hình ảnh CCCD/GPLX khách hàng tải lên để Phê duyệt/Từ chối |
| **8** | Phê duyệt đơn hàng | Quản lý, Admin | Xác nhận đơn đặt xe hợp lệ hoặc hủy đơn nếu không đáp ứng |
| **9** | Lập biên bản Bàn giao | Quản lý, Admin | Ghi nhận ODO, % xăng lúc giao (Pickup) và lúc nhận lại xe (Return) |
| **10** | Quản lý Đội xe | Quản lý, Admin | Thêm mới xe, cập nhật thông tin, thay đổi trạng thái hoạt động xe |
| **11** | Báo cáo Doanh thu | Quản trị viên (Admin) | Xem biểu đồ doanh thu, thống kê tỷ lệ cho thuê và hiệu suất |

---

## 4. Biểu đồ Hoạt động (Activity Diagrams)

### 4.1. Biểu đồ Hoạt động: Quy trình Đặt xe & Thanh toán đặt cọc
Quy trình thể hiện luồng làm việc từ khi Khách hàng chọn xe, nhập khoảng thời gian thuê, chọn dịch vụ đi kèm. Hệ thống kiểm tra điều kiện trùng lịch, tính toán tổng chi phí và tiền cọc, sau đó chuyển sang giao diện thanh toán trực tuyến.

### 4.2. Biểu đồ Hoạt động: Quy trình Bàn giao xe (Pickup) & Trả xe (Return)
Quy trình thể hiện công việc của nhân viên Quản lý khi tiến hành giao xe cho khách (ghi nhận ODO, % nhiên liệu ban đầu) và khi nhận lại xe (đối soát ODO, lượng nhiên liệu còn lại, tính phụ phí quá km/trễ giờ/thiếu xăng tự động và phát hành hóa đơn tất toán).

---

## 5. Biểu đồ Tuần tự (Sequence Diagrams)

Các biểu đồ tuần tự mô tả chi tiết sự tương tác theo trình tự thời gian giữa thành phần Giao diện (Client), Máy chủ ứng dụng (Server) và Cơ sở dữ liệu (Database) đối với các nghiệp vụ chính như: Đăng nhập xác thực, Tạo đơn đặt xe và Lập biên bản bàn giao xe.

---

## 6. Thiết kế Cơ sở Dữ liệu và Từ điển Dữ liệu (Data Dictionary)

### 6.1. Sơ đồ Thực thể Liên kết (ERD Overview)
Cơ sở dữ liệu của hệ thống được chuẩn hóa bao gồm các thực thể trung tâm: `Users`, `Documents`, `Vehicles`, `Bookings`, `HandoverRecords`, `Payments` và `Reviews`.

### 6.2. Từ điển Dữ liệu các Bảng chính (Data Dictionary)

* **Bảng Users (Tài khoản Người dùng):**
  * `id`: Khóa chính (Int, Auto Increment).
  * `full_name`: Họ tên người dùng (Varchar 255).
  * `email`: Địa chỉ Email duy nhất (Varchar 191).
  * `password_hash`: Chuỗi mật khẩu băm mã hóa Bcrypt (Varchar 255).
  * `phone`: Số điện thoại liên hệ (Varchar 20).
  * `role`: Vai trò người dùng (Enum: 'CUSTOMER', 'MANAGER', 'ADMIN').
  * `is_verified`: Trạng thái thẩm định giấy tờ (Boolean).

* **Bảng Vehicles (Danh mục Đội xe):**
  * `id`: Khóa chính (Int).
  * `name`: Tên mẫu xe (Varchar 255, ví dụ: Toyota Camry 2.5Q).
  * `brand`: Hãng sản xuất (Varchar 100).
  * `seats`: Số chỗ ngồi (Int: 4, 5, 7).
  * `transmission`: Loại hộp số (Enum: 'AUTO', 'MANUAL').
  * `fuel_type`: Loại nhiên liệu (Enum: 'GASOLINE', 'DIESEL', 'ELECTRIC').
  * `price_per_day`: Đơn giá thuê theo ngày (Decimal).
  * `deposit_amount`: Số tiền đặt cọc định mức (Decimal).
  * `status`: Trạng thái xe (Enum: 'AVAILABLE', 'RENTED', 'MAINTENANCE').

* **Bảng Bookings (Đơn đặt xe):**
  * `id`: Khóa chính (Int).
  * `booking_code`: Mã đơn hàng duy nhất (Varchar 50).
  * `user_id`: Khóa ngoại liên kết bảng Users.
  * `vehicle_id`: Khóa ngoại liên kết bảng Vehicles.
  * `start_date`: Thời điểm nhận xe (Datetime).
  * `end_date`: Thời điểm trả xe (Datetime).
  * `total_amount`: Tổng tiền thuê xe (Decimal).
  * `deposit_paid`: Tiền cọc đã thanh toán (Decimal).
  * `status`: Trạng thái đơn (Enum: 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED').

---

# Chương IV. CHI TIẾT DỰ ÁN VÀ GIAO DIỆN HỆ THỐNG

## 4.0. Quy chuẩn Thiết kế Giao diện (UI/UX Design System)

Hệ thống được thiết kế tuân thủ bộ quy chuẩn giao diện hiện đại chuẩn doanh nghiệp:
* **Tông màu chủ đạo (Color Palette):** Sử dụng sắc xanh lam (*Primary Blue `#1890ff`*) đại diện cho sự tin cậy, chuyên nghiệp của thương hiệu Da Nang Travel Car, kết hợp với các tông màu phụ trợ (*Success Green `#52c41a`*, *Warning Amber `#faad14`*, *Error Red `#ff4d4f`*).
* **Kiểu chữ (Typography):** Font chữ không chân *Inter / Roboto* mượt mà, chuẩn hóa kích thước tiêu đề và văn bản hiển thị rõ ràng.
* **Độ tương thích (Responsive Breakpoints):** Thiết kế tự động co giãn tối ưu trên các dòng màn hình Desktop (>= 1200px), Tablet (768px - 1199px) và Smartphone (< 768px).

---

## 4.1. Giao diện Phân hệ Khách hàng (Customer & Guest Interface)

### 4.1.1. Trang chủ và Thanh tìm kiếm xe nhanh

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Trang chủ được thiết kế theo phong cách hiện đại với tông màu xanh lam thương hiệu Da Nang Travel Car, hỗ trợ hiển thị tối ưu trên cả máy tính và thiết bị di động.
  * Thanh tìm kiếm xe nhanh đặt tại vị trí trung tâm cho phép người dùng chọn khoảng thời gian thuê (ngày/giờ nhận xe - ngày/giờ trả xe), địa điểm nhận xe tại Đà Nẵng (Sân bay Đà Nẵng, Văn phòng nhà xe, Giao tận nơi...) và bấm "Tìm kiếm xe ngay".
  * Khu vực giới thiệu các mảng dịch vụ nổi bật, quy trình 4 bước thuê xe đơn giản và danh mục các dòng xe hot được thuê nhiều nhất.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|            [ CHÈN HÌNH 4.1: GIAO DIỆN TRANG CHỦ VÀ THANH TÌM KIẾM XE NHANH ]        |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.1: Giao diện Trang chủ và Thanh tìm kiếm xe nhanh (Da Nang Travel Car)
```

---

### 4.1.2. Màn hình Danh sách xe và Bộ lọc nâng cao

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Màn hình hiển thị toàn bộ danh sách phương tiện đang ở trạng thái sẵn sàng phục vụ.
  * Bộ lọc bên trái giúp khách hàng nhanh chóng thu hẹp kết quả theo các tiêu chí: Số chỗ ngồi (4 chỗ, 5 chỗ, 7 chỗ), Thương hiệu (Toyota, Mazda, Hyundai, Kia, Ford...), Loại nhiên liệu (Xăng, Dầu, Điện), Loại hộp số (Số tự động, Số sàn) và Khoảng giá thuê/ngày.
  * Mỗi thẻ xe (*Vehicle Card*) trình bày rõ ràng hình ảnh thực tế xe, tên mẫu xe, đơn giá thuê/ngày, mức tiền đặt cọc yêu cầu và nút "Xem chi tiết & Đặt xe".

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|           [ CHÈN HÌNH 4.2: GIAO DIỆN DANH SÁCH XE VÀ BỘ LỌC TÌM KIẾM NÂNG CAO ]    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.2: Giao diện Danh sách xe và Bộ lọc tìm kiếm nâng cao
```

---

### 4.1.3. Màn hình Chi tiết xe và Bảng tính giá thuê

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Cung cấp góc nhìn toàn diện về chiếc xe với bộ bộ sưu tập hình ảnh ngoại quan/nội thất xe sắc nét.
  * Bảng thông số kỹ thuật chi tiết trình bày các thông tin: Năm sản xuất, mức tiêu thụ nhiên liệu (lít/100km), định mức km giới hạn theo ngày, mức phụ phí quá km và phụ phí trễ giờ.
  * Công cụ tính giá tự động: Khi khách hàng chọn ngày nhận và trả xe, màn hình sẽ tự động tính toán tổng số ngày thuê và hiển thị minh bạch bài toán chi phí: Tổng tiền thuê + Tiền cọc yêu cầu.
  * Khu vực xem các phản hồi, đánh giá sao từ những khách hàng đã thuê chiếc xe này trước đó.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|           [ CHÈN HÌNH 4.3: GIAO DIỆN CHI TIẾT XE VÀ BẢNG TÍNH GIÁ THUÊ TỰ ĐỘNG ]    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.3: Giao diện Chi tiết xe và Bảng tính giá thuê tự động
```

---

### 4.1.4. Màn hình Đăng ký tài khoản khách hàng

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Cho phép người dùng mới tạo tài khoản cá nhân để tham gia đặt xe trên hệ thống.
  * Biểu mẫu đăng ký bao gồm các ô nhập liệu: Họ và tên, Số điện thoại liên lạc, Địa chỉ Email và Mật khẩu đăng nhập (kèm xác nhận mật khẩu).
  * Biểu mẫu kiểm tra tính hợp lệ bề mặt trực quan, hiển thị cảnh báo ngay lập tức nếu email đúng định dạng hoặc số điện thoại chưa chuẩn.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|               [ CHÈN HÌNH 4.4: GIAO DIỆN ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG ]           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.4: Giao diện Đăng ký tài khoản khách hàng
```

---

### 4.1.5. Màn hình Đăng nhập hệ thống

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Màn hình xác thực tài khoản cho Khách hàng, Nhân viên Quản lý và Admin.
  * Giao diện gọn gàng với ô nhập Email/Số điện thoại và Mật khẩu, nút "Đăng nhập" và tùy chọn "Ghi nhớ phiên đăng nhập".
  * Sau khi đăng nhập thành công, hệ thống tự động nhận diện vai trò tài khoản để điều hướng đến giao diện làm việc tương ứng.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                  [ CHÈN HÌNH 4.5: GIAO DIỆN ĐĂNG NHẬP HỆ THỐNG ]                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.5: Giao diện Đăng nhập hệ thống
```

---

### 4.1.6. Màn hình Đặt xe và Lựa chọn dịch vụ bổ sung

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Đây là bước khách hàng thiết lập chi tiết hành trình thuê xe.
  * Cho phép tùy chọn Địa điểm nhận xe (tại showroom Da Nang Travel Car hoặc giao xe tận nơi theo địa chỉ yêu cầu).
  * Danh sách Dịch vụ bổ sung đi kèm khách hàng có thể chọn thêm: Bảo hiểm chuyến đi toàn diện, Ghế an toàn cho trẻ em, Thiết bị phát Wi-Fi di động, Thêm tài xế phụ...
  * Tóm tắt đơn hàng hiển thị minh bạch tổng giá trị thanh toán tạm tính trước khi chuyển sang bước đặt cọc.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|       [ CHÈN HÌNH 4.6: GIAO DIỆN TẠO ĐƠN ĐẶT XE VÀ CHỌN DỊCH VỤ BỔ SUNG ]          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.6: Giao diện Tạo đơn đặt xe và Chọn dịch vụ bổ sung
```

---

### 4.1.7. Màn hình Xác nhận đơn và Thanh toán cọc trực tuyến

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Hiển thị bảng tổng hợp đơn hàng chi tiết: Mã đơn hàng, tên xe, lịch trình thuê, tổng chi phí thuê và số tiền cọc bắt buộc phải thanh toán để giữ xe.
  * Tích hợp 4 tùy chọn kênh thanh toán linh hoạt:
    1. **Quét mã VietQR:** Hiển thị mã QR ngân hàng tự động kèm nội dung chuyển khoản chuẩn hóa.
    2. **Cổng thanh toán VNPay:** Chuyển hướng sang giao diện thẻ ATM/IBanking/VNPay QR.
    3. **Ví điện tử MoMo:** Mở mã thanh toán MoMo tiện lợi.
    4. **Thanh toán tiền mặt:** Dành cho khách chọn nộp tiền trực tiếp tại showroom.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|         [ CHÈN HÌNH 4.7: GIAO DIỆN XÁC NHẬN ĐƠN VÀ THANH TOÁN CỌC TRỰC TUYẾN ]     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.7: Giao diện Xác nhận đơn và Thanh toán cọc trực tuyến
```

---

### 4.1.8. Màn hình Tải ảnh và Quản lý Giấy tờ xác minh (CCCD / GPLX)

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Khách hàng tải ảnh hồ sơ pháp lý lên hệ thống để nhà xe thẩm định trước thời điểm nhận xe.
  * Khu vực tải ảnh phân chia rõ ràng: Upload ảnh Căn cước công dân (Mặt trước & Mặt sau) và Upload ảnh Giấy phép lái xe (Mặt trước).
  * Tính năng xem trước ảnh (*Image Preview*) giúp khách kiểm tra độ nét và nhãn trạng thái thẩm định từ nhà xe (*Chờ duyệt / Đã phê duyệt / Yêu cầu tải lại*).

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|      [ CHÈN HÌNH 4.8: GIAO DIỆN TẢI ĐẢM BẢO VÀ XÁC MINH GIẤY TỜ CCCD / GPLX ]     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.8: Giao diện Tải ảnh và Xác minh giấy tờ CCCD / GPLX
```

---

### 4.1.9. Màn hình Xem và Ký Hợp đồng điện tử trực tuyến

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Trình bày mẫu Hợp đồng cho thuê xe ô tô tự lái điện tử đầy đủ các điều khoản pháp lý, quyền hạn và trách nhiệm hai bên.
  * Khách hàng xem qua nội dung hợp đồng, kiểm tra các thông tin cá nhân và chi tiết phương tiện thuê.
  * Khung chữ ký điện tử (*Digital Signature Pad*) cho phép khách hàng ký tên xác nhận trực tiếp bằng chuột hoặc màn hình cảm ứng, sau đó bấm "Xác nhận ký hợp đồng".

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|          [ CHÈN HÌNH 4.9: GIAO DIỆN XEM VÀ KÝ HỢP ĐỒNG ĐIỆN TỬ TRỰC TUYẾN ]        |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.9: Giao diện Xem và Ký hợp đồng điện tử trực tuyến
```

---

### 4.1.10. Màn hình Quản lý Lịch sử đơn thuê và Trạng thái chuyến đi

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Nơi khách hàng quản lý và theo dõi toàn bộ danh sách các chuyến thuê xe của mình.
  * Phân loại đơn thuê trực quan theo các nhãn trạng thái (*Badge Color*):
    * **CHỜ XÁC NHẬN (PENDING):** Đơn mới tạo chờ nhà xe duyệt.
    * **ĐÃ ĐẶT CỌC (CONFIRMED):** Đơn đã cọc thành công, sẵn sàng nhận xe.
    * **ĐANG THUÊ (ACTIVE):** Khách đang sử dụng xe thực tế.
    * **HOÀN THÀNH (COMPLETED):** Đã trả xe và tất toán xong.
  * Các nút thao tác nhanh: Xem hợp đồng, Xem biên bản giao xe, Xem chi tiết hóa đơn.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|      [ CHÈN HÌNH 4.10: GIAO DIỆN QUẢN LÝ LỊCH SỬ ĐƠN THUÊ VÀ TRẠNG THÁI ]          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.10: Giao diện Quản lý Lịch sử đơn thuê và Trạng thái chuyến đi
```

---

### 4.1.11. Màn hình Đánh giá và Gửi phản hồi dịch vụ

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Sau khi hoàn tất chuyến đi, màn hình gợi ý khách hàng để lại phản hồi chất lượng.
  * Chọn mức độ hài lòng theo thang điểm từ 1 đến 5 sao.
  * Khung nhập ý kiến nhận xét chi tiết về tình trạng xe, thái độ phục vụ của nhân viên và cảm nhận chuyến đi, giúp Da Nang Travel Car liên tục cải thiện dịch vụ.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|            [ CHÈN HÌNH 4.11: GIAO DIỆN ĐÁNH GIÁ VÀ GỬI PHẢN HỒI DỊCH VỤ ]         |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.11: Giao diện Đánh giá và Gửi phản hồi dịch vụ
```

---

## 4.2. Giao diện Phân hệ Quản trị và Vận hành (Admin & Manager Interface)

### 4.2.1. Màn hình Dashboard Tổng quan và Báo cáo Doanh thu

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Bảng điều khiển trung tâm dành cho Quản lý và Admin theo dõi toàn bộ sức khỏe kinh doanh của nhà xe.
  * Các thẻ thống kê KPI tổng quan: Total Revenue (Tổng doanh thu), Total Bookings (Tổng lượt thuê), Active Vehicles (Số xe đang lưu thông), Maintenance (Số xe đang bảo trì).
  * Biểu đồ đường (*Line Chart*) và biểu đồ cột (*Bar Chart*) minh họa biến động doanh thu theo ngày/tháng và tỷ lệ lấp đầy đội xe.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|       [ CHÈN HÌNH 4.12: GIAO DIỆN DASHBOARD TỔNG QUAN VÀ BÁO CÁO DOANH THU ]       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.12: Giao diện Dashboard Tổng quan và Báo cáo Doanh thu Quản trị
```

---

### 4.2.2. Màn hình Quản lý Danh mục và Thông tin Đội xe

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Cung cấp giao diện dạng bảng dữ liệu (*Table*) danh sách toàn bộ các phương tiện thuộc sở hữu nhà xe.
  * Hiển thị đầy đủ thông tin: Biển số xe, tên mẫu xe, hãng sản xuất, giá thuê/ngày, mức cọc và trạng thái hoạt động (*Sẵn sàng / Đang cho thuê / Đang bảo dưỡng*).
  * Các công cụ thao tác: Thêm xe mới vào hệ thống, Cập nhật thông tin/giá thuê, Thay đổi trạng thái xe và Xóa xe khỏi hệ thống.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|         [ CHÈN HÌNH 4.13: GIAO DIỆN QUẢN LÝ DANH MỤC VÀ THÔNG TIN ĐỘI XE ]        |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.13: Giao diện Quản lý Danh mục và Thông tin Đội xe
```

---

### 4.2.3. Màn hình Thẩm định và Duyệt Hồ sơ Giấy tờ Khách hàng

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Cho phép nhân viên nhà xe kiểm tra đối soát tính hợp lệ của ảnh CCCD và Giấy phép lái xe do khách hàng tải lên.
  * Giao diện soi ảnh phóng to sắc nét, kiểm tra trùng khớp thông tin cá nhân.
  * Nhân viên thực hiện bấm nút **"Phê duyệt hồ sơ"** để xác thực tài khoản khách hàng hoặc nút **"Từ chối"** kèm việc nhập lý do (ví dụ: *Ảnh mờ, Giấy phép lái xe hết hạn...*) để hệ thống gửi thông báo yêu cầu khách tải lại.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|     [ CHÈN HÌNH 4.14: GIAO DIỆN THẨM ĐỊNH VÀ DUYỆT HỒ SƠ GIẤY TỜ KHÁCH HÀNG ]     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.14: Giao diện Thẩm định và Duyệt hồ sơ giấy tờ khách hàng
```

---

### 4.2.4. Màn hình Quản lý và Phê duyệt Đơn đặt xe

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Bảng tập trung theo dõi tất cả các đơn đặt xe từ khách hàng gửi về.
  * Bộ lọc đơn hàng thông minh theo trạng thái, ngày đặt hoặc tìm kiếm theo tên/số điện thoại khách hàng.
  * Nhân viên xem chi tiết lịch trình, kiểm tra tiền đặt cọc đã về tài khoản và thực hiện bấm **"Phê duyệt đơn"** để giữ xe cho khách hoặc **"Hủy đơn"** nếu xe gặp sự cố kỹ thuật đột xuất.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|          [ CHÈN HÌNH 4.15: GIAO DIỆN QUẢN LÝ VÀ PHÊ DUYỆT ĐƠN ĐẶT XE ]            |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.15: Giao diện Quản lý và Phê duyệt đơn đặt xe
```

---

### 4.2.5. Màn hình Lập Biên bản Bàn giao xe khi giao (Pickup Record)

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Thực hiện tại thời điểm giao xe thực tế cho khách hàng tại bãi xe hoặc điểm hẹn.
  * Biểu mẫu ghi nhận các chỉ số ban đầu:
    * Chỉ số đồng hồ đo quãng đường ODO ban đầu (km).
    * Phần trăm nhiên liệu thực tế có trong bình (%).
    * Tải lên ảnh chụp 4 góc vỏ xe thực tế để ghi nhận các vết trầy xước sẵn có.
  * Bấm "Lưu biên bản Giao xe", hệ thống tự động chuyển trạng thái đơn hàng thành **ACTIVE (Đang thuê)** và chuyển xe thành **RENTED (Đang cho thuê)**.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|     [ CHÈN HÌNH 4.16: GIAO DIỆN LẬP BIÊN BẢN BÀN GIAO XE KHI GIAO - PICKUP ]     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.16: Giao diện Lập Biên bản Bàn giao xe khi giao (Pickup Record)
```

---

### 4.2.6. Màn hình Lập Biên bản Nhận lại xe và Tự động Tính phụ phí (Return Record)

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Thực hiện khi khách hàng hoàn tất chuyến đi và mang xe về trả.
  * Nhân viên nhập chỉ số ODO lúc trả và % nhiên liệu còn lại lúc trả.
  * **Cơ chế tính toán tự động:** Hệ thống tự động đối sánh với thông số lúc giao (Pickup) và tự động tính toán minh bạch các khoản phụ phí (nếu có):
    * *Phụ phí vượt giới hạn km.*
    * *Phụ phí trễ giờ trả xe.*
    * *Phụ phí thiếu hụt nhiên liệu.*
  * Phát hành Hóa đơn tất toán tổng thể, hoàn trả tiền cọc hoặc thu thêm phụ phí phát sinh.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   [ CHÈN HÌNH 4.17: GIAO DIỆN LẬP BIÊN BẢN NHẬN LẠI XE VÀ TÍNH PHỤ PHÍ - RETURN ]  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.17: Giao diện Lập Biên bản Nhận lại xe và Tự động tính phụ phí (Return Record)
```

---

### 4.2.7. Màn hình Quản lý Lịch Bảo dưỡng và Chi phí Vận hành xe

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Quản lý nhật ký bảo trì, bảo dưỡng định kỳ và sửa chữa hỏng hóc cho từng đầu xe.
  * Cho phép lên lịch bảo trì tiếp theo (dựa trên số km ODO hoặc mốc thời gian), ghi nhận các hạng mục thay thế (thay dầu, thay lốp, bảo dưỡng phanh) và tổng chi phí thực hiện.
  * Chuyển trạng thái xe sang **MAINTENANCE (Đang bảo trì)** để tạm ngưng xe khỏi danh sách cho thuê trên website, tránh việc khách đặt nhầm.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|     [ CHÈN HÌNH 4.18: GIAO DIỆN QUẢN LÝ LỊCH BẢO DƯỠNG VÀ CHI PHÍ VẬN HÀNH XE ]   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.18: Giao diện Quản lý Lịch bảo dưỡng và Chi phí vận hành xe
```

---

### 4.2.8. Màn hình Quản lý Tài khoản Người dùng và Phân quyền Hệ thống

* **Mô tả chức năng & Trải nghiệm bề mặt:**
  * Giao diện dành riêng cho Admin quản trị tài khoản người dùng trên toàn hệ thống.
  * Hiển thị danh sách khách hàng và nhân viên vận hành (Manager).
  * Cho phép Admin thực hiện phân quyền truy cập, khởi tạo tài khoản cho nhân viên mới hoặc thực hiện **Tạm khóa / Mở khóa** tài khoản đối với các trường hợp vi phạm quy định thuê xe.

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   [ CHÈN HÌNH 4.19: GIAO DIỆN QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG VÀ PHÂN QUYỀN HỆ THỐNG ]|
|                                                                                   |
+-----------------------------------------------------------------------------------+
Hình 4.19: Giao diện Quản lý Tài khoản người dùng và Phân quyền hệ thống
```

---

# KẾT LUẬN

## 1. Đánh giá Mức độ Hoàn thiện Chức năng (Requirements Traceability Matrix - RTM)

Bảng tổng kết đánh giá đối soát mức độ hoàn thiện các yêu cầu tính năng đặt ra ban đầu đối với hệ thống Da Nang Travel Car:

| STT | TÊN HẠNG MỤC TÍNH NĂNG | MỤC TIÊU BAN ĐẦU | MỨC ĐỘ HOÀN THÀNH | ĐÁNH GIÁ MỨC ĐỘ |
| :---: | :--- | :--- | :---: | :---: |
| **1** | Tra cứu & Lọc xe đa tiêu chí | Tìm xe theo số chỗ, giá, nhiên liệu | **100%** | Hoàn thành xuất sắc |
| **2** | Đăng ký & Đăng nhập mã hóa JWT | Bảo mật tài khoản, phân quyền RBAC | **100%** | Hoàn thành xuất sắc |
| **3** | Đặt xe & Tính giá tự động | Kiểm tra trùng lịch xe 24/7 | **100%** | Hoàn thành xuất sắc |
| **4** | Upload & Thẩm định CCCD/GPLX | Duyệt ảnh giấy tờ khách hàng online | **100%** | Hoàn thành xuất sắc |
| **5** | Ký Hợp đồng điện tử trực tuyến | Ký xác nhận trực tiếp trên Web | **100%** | Hoàn thành xuất sắc |
| **6** | Thanh toán đa cổng (Strategy) | VietQR, VNPay, MoMo, Tiền mặt | **100%** | Hoàn thành xuất sắc |
| **7** | Biên bản Pickup / Return điện tử | Tự động tính phụ phí quá km/xăng | **100%** | Hoàn thành xuất sắc |
| **8** | Quản lý Đội xe & Lịch bảo trì | Cập nhật thông tin xe, bảo dưỡng | **100%** | Hoàn thành xuất sắc |
| **9** | Dashboard Báo cáo Doanh thu | Biểu đồ doanh thu, KPI kinh doanh | **100%** | Hoàn thành xuất sắc |

---

## 2. Kết quả đạt được

Sau thời gian nghiên cứu, thực tập thực tế và phát triển, đề tài **"Xây dựng hệ thống quản lý dịch vụ cho thuê xe tại Da Nang Travel Car"** đã hoàn thành đầy đủ các mục tiêu đề ra:

### 2.1. Về mặt Kỹ thuật và Kiến trúc Hệ thống
* Xây dựng thành công ứng dụng Web hoàn chỉnh theo mô hình Client - Server hiện đại, tách biệt giữa Front-end (React.js, TypeScript, Ant Design) và Back-end RESTful API (Node.js, Express.js, MySQL, Prisma ORM).
* Áp dụng thành công các mẫu thiết kế phần mềm (*Strategy Pattern cho thanh toán*, *State Pattern cho vòng đời đơn xe*) giúp hệ thống hoạt động ổn định, linh hoạt và dễ mở rộng.
* Chuẩn hóa thành công hệ thống Cơ sở dữ liệu quan hệ với độ tin cậy cao, đảm bảo tính toàn vẹn dữ liệu giữa các thực thể Khách hàng, Xe, Đơn hàng, Biên bản bàn giao và Hợp đồng.
* Tích hợp thành công cơ chế xác thực bảo mật JWT, mã hóa mật khẩu Bcrypt và mô hình thanh toán đa cổng trực tuyến (VietQR, VNPay, MoMo).

### 2.2. Về mặt Nghiệp vụ và Quản lý Doanh nghiệp
* **Số hóa toàn bộ luồng vận hành:** Giải quyết triệt để các hạn chế của phương thức thủ công cũ tại Da Nang Travel Car, loại bỏ hoàn toàn rủi ro đặt trùng lịch xe (*Double Booking*).
* **Minh bạch phụ phí bàn giao:** Quy trình lập biên bản Giao xe (Pickup) và Nhận lại xe (Return) điện tử hỗ trợ tự động tính toán phụ phí quá km, trễ giờ và thiếu xăng một cách chính xác, minh bạch, tránh gây tranh cãi với khách hàng.
* **Tối ưu hóa quản trị:** Cung cấp cho chủ nhà xe bộ công cụ Dashboard báo cáo doanh thu thời gian thực, quản lý tình trạng đội xe và theo dõi lịch bảo dưỡng bài bản.

---

## 3. Hạn chế của hệ thống

Mặc dù đã đạt được nhiều kết quả tích cực, hệ thống vẫn tồn tại một số hạn chế nhất định cần tiếp tục cải thiện:
* **Hệ thống gợi ý chưa sâu:** Chưa tích hợp các thuật toán trí tuệ nhân tạo (AI/Machine Learning) để đề xuất mẫu xe phù hợp dựa trên thói quen tìm kiếm và lịch sử thuê xe của khách hàng.
* **Tương thích di động (Mobile App):** Hiện tại hệ thống vận hành trên nền tảng Responsive Web, chưa phát triển ứng dụng di động thuần (*Native Mobile App*) trên iOS/Android để tối ưu trải nghiệm thông báo đẩy (*Push Notification*).
* **Đa ngôn ngữ:** Hệ thống mới chỉ hỗ trợ giao diện tiếng Việt, chưa hỗ trợ chuyển đổi đa ngôn ngữ (Tiếng Anh, Tiếng Hàn, Tiếng Trung) để phục vụ lượng khách du lịch quốc tế đông đảo tại Đà Nẵng.

---

## 4. Hướng phát triển

Trong giai đoạn tiếp theo, đề tài hướng tới các mục tiêu nâng cấp nâng cao:
1. **Xây dựng Ứng dụng Di động (Mobile App):** Triển khai ứng dụng di động dành riêng cho Khách hàng và Nhân viên giao nhận xe nhằm tối ưu hóa việc chụp ảnh tình trạng xe và quét mã QR bàn giao tại chỗ.
2. **Tích hợp Công nghệ AI OCR:** Tự động đọc và trích xuất thông tin từ ảnh chụp CCCD và Giấy phép lái xe của khách hàng để rút ngắn thời gian thẩm định hồ sơ.
3. **Mở rộng đa ngôn ngữ (Multi-language):** Bổ sung ngôn ngữ Tiếng Anh và Tiếng Hàn nhằm tiếp cận đối tượng du khách quốc tế đến Đà Nẵng.
4. **Kết nối thiết bị định vị GPS:** Kết nối dữ liệu định vị GPS thực tế trên xe để tự động ghi nhận số km di chuyển thực tế mà không cần nhập tay thủ công.

---

# TÀI LIỆU THAM KHẢO

1. **React Documentation:** *React – A JavaScript library for building user interfaces*, Meta Open Source. Truy cập tại: [https://react.dev/](https://react.dev/)
2. **Node.js & Express.js Guides:** *Express - Fast, unopinionated, minimalist web framework for Node.js*. Truy cập tại: [https://expressjs.com/](https://expressjs.com/)
3. **Ant Design Component Library:** *An enterprise-class UI design language and React UI library*. Truy cập tại: [https://ant.design/](https://ant.design/)
4. **Prisma ORM Documentation:** *Prisma - Next-generation ORM for Node.js & TypeScript*. Truy cập tại: [https://www.prisma.io/docs](https://www.prisma.io/docs)
5. **MySQL 8.0 Reference Manual:** *Oracle Corporation*, 2024. Truy cập tại: [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
6. **W3Schools Online Web Tutorials:** *HTML, CSS, JavaScript and Web Development Concepts*. Truy cập tại: [https://www.w3schools.com/](https://www.w3schools.com/)
7. **Stack Overflow Developer Survey & Community:** *Software Architecture & Web Engineering Solutions*. Truy cập tại: [https://stackoverflow.com/](https://stackoverflow.com/)
