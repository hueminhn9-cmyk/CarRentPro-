export function generateContractHTML(contract) {
    const booking = contract.bookings;
    const user = booking.users;
    const vehicle = booking.vehicles;
    const signedDate = contract.signed_at
        ? new Date(contract.signed_at).toLocaleDateString('vi-VN')
        : 'Chưa ký';
    const createdDate = new Date(contract.created_at || new Date()).toLocaleDateString('vi-VN');
    const pickupDate = new Date(booking.pickup_datetime).toLocaleString('vi-VN');
    const returnDate = new Date(booking.return_datetime).toLocaleString('vi-VN');
    return `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Hợp đồng thuê xe - ${contract.contract_code}</title>
    <style>
      body {
        font-family: 'Times New Roman', Times, serif, Arial;
        margin: 40px;
        color: #333;
        line-height: 1.6;
        font-size: 14px;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        margin: 5px 0;
        font-size: 20px;
        text-transform: uppercase;
      }
      .header h2 {
        margin: 5px 0;
        font-size: 16px;
        text-transform: uppercase;
      }
      .header p {
        margin: 0;
        font-style: italic;
      }
      .section-title {
        font-weight: bold;
        text-transform: uppercase;
        margin-top: 20px;
        margin-bottom: 10px;
        border-bottom: 1px solid #333;
        font-size: 15px;
      }
      .info-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }
      .info-table td {
        padding: 6px 4px;
        vertical-align: top;
      }
      .info-table td.label {
        width: 30%;
        font-weight: bold;
      }
      .info-table td.value {
        width: 70%;
      }
      .terms-list {
        padding-left: 20px;
        margin: 10px 0;
      }
      .terms-list li {
        margin-bottom: 8px;
        text-align: justify;
      }
      .signatures {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
      }
      .signature-block {
        width: 45%;
        text-align: center;
      }
      .signature-space {
        height: 80px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #ccc;
        color: #888;
        font-style: italic;
      }
      .signature-signed {
        color: green;
        font-weight: bold;
        border: 2px solid green;
        padding: 5px;
        display: inline-block;
        border-radius: 4px;
        transform: rotate(-3deg);
        margin-top: 15px;
      }
      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 80px;
        color: rgba(200, 200, 200, 0.15);
        z-index: -1;
        user-select: none;
        text-transform: uppercase;
        font-weight: bold;
      }
      @media print {
        body {
          margin: 20px;
        }
        .signature-space {
          border: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="watermark">${contract.status}</div>

    <div class="header">
      <h2>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
      <p>Độc lập - Tự do - Hạnh phúc</p>
      <p>---o0o---</p>
      <br/>
      <h1>HỢP ĐỒNG THUÊ XE TỰ LÁI</h1>
      <p>Số: ${contract.contract_code} | Ngày tạo: ${createdDate}</p>
    </div>

    <p>Căn cứ vào Bộ luật Dân sự nước Cộng hòa Xã hội Chủ nghĩa Việt Nam và các văn bản hướng dẫn thi hành; Căn cứ vào nhu cầu và khả năng của hai Bên. Hôm nay, chúng tôi gồm có:</p>

    <div class="section-title">BÊN CHO THUÊ (BÊN A)</div>
    <table class="info-table">
      <tr>
        <td class="label">Tên đơn vị:</td>
        <td class="value">CÔNG TY CỔ PHẦN DỊCH VỤ VÀ THUÊ XE AUTORENT VIỆT NAM</td>
      </tr>
      <tr>
        <td class="label">Địa chỉ:</td>
        <td class="value">234 Đường Láng, Quận Đống Đa, Hà Nội</td>
      </tr>
      <tr>
        <td class="label">Số điện thoại:</td>
        <td class="value">1900 6868</td>
      </tr>
      <tr>
        <td class="label">Đại diện:</td>
        <td class="value">Ông Nguyễn Văn Tiến - Chức vụ: Giám đốc điều hành</td>
      </tr>
    </table>

    <div class="section-title">BÊN THUÊ XE (BÊN B)</div>
    <table class="info-table">
      <tr>
        <td class="label">Họ và tên khách hàng:</td>
        <td class="value">${user.full_name}</td>
      </tr>
      <tr>
        <td class="label">Địa chỉ Email:</td>
        <td class="value">${user.email}</td>
      </tr>
      <tr>
        <td class="label">Số điện thoại:</td>
        <td class="value">${user.phone || 'Chưa cung cấp'}</td>
      </tr>
    </table>

    <div class="section-title">ĐIỀU 1: THÔNG TIN PHƯƠNG TIỆN CHO THUÊ</div>
    <table class="info-table">
      <tr>
        <td class="label">Tên phương tiện:</td>
        <td class="value">${vehicle.brand} ${vehicle.name} (${vehicle.model})</td>
      </tr>
      <tr>
        <td class="label">Biển số kiểm soát:</td>
        <td class="value">${vehicle.license_plate}</td>
      </tr>
      <tr>
        <td class="label">Hộp số / Nhiên liệu:</td>
        <td class="value">${vehicle.transmission} / ${vehicle.fuel_type}</td>
      </tr>
      <tr>
        <td class="label">Màu sắc:</td>
        <td class="value">${vehicle.color || 'Không ghi nhận'}</td>
      </tr>
    </table>

    <div class="section-title">ĐIỀU 2: THỜI GIAN VÀ ĐỊA ĐIỂM GIAO NHẬN</div>
    <table class="info-table">
      <tr>
        <td class="label">Thời gian nhận xe:</td>
        <td class="value">${pickupDate}</td>
      </tr>
      <tr>
        <td class="label">Thời gian trả xe:</td>
        <td class="value">${returnDate}</td>
      </tr>
      <tr>
        <td class="label">Tổng số ngày thuê:</td>
        <td class="value">${booking.rental_days} ngày</td>
      </tr>
      <tr>
        <td class="label">Địa điểm giao xe:</td>
        <td class="value">${booking.pickup_location}</td>
      </tr>
      <tr>
        <td class="label">Địa điểm nhận lại xe:</td>
        <td class="value">${booking.return_location}</td>
      </tr>
    </table>

    <div class="section-title">ĐIỀU 3: CHI PHÍ VÀ PHƯƠNG THỨC THANH TOÁN</div>
    <table class="info-table">
      <tr>
        <td class="label">Giá thuê theo ngày:</td>
        <td class="value">${Number(vehicle.price_per_day).toLocaleString('vi-VN')} VND / ngày</td>
      </tr>
      <tr>
        <td class="label">Tiền thuê xe dự kiến:</td>
        <td class="value">${Number(booking.rental_fee).toLocaleString('vi-VN')} VND</td>
      </tr>
      <tr>
        <td class="label">Phí dịch vụ đi kèm:</td>
        <td class="value">${Number(booking.service_fee || 0).toLocaleString('vi-VN')} VND</td>
      </tr>
      <tr>
        <td class="label">Tiền đặt cọc thế chấp:</td>
        <td class="value">${Number(booking.deposit_amount).toLocaleString('vi-VN')} VND</td>
      </tr>
      <tr>
        <td class="label">Tổng giá trị hợp đồng:</td>
        <td class="value" style="font-weight: bold; color: #d32f2f;">${Number(booking.total_amount).toLocaleString('vi-VN')} VND</td>
      </tr>
      <tr>
        <td class="label">Phương thức thanh toán:</td>
        <td class="value">Thanh toán qua Ví điện tử (VNPay/MoMo), Chuyển khoản hoặc Tiền mặt</td>
      </tr>
    </table>

    <div class="section-title">ĐIỀU 4: TRÁCH NHIỆM CỦA CÁC BÊN</div>
    <ul class="terms-list">
      <li><strong>Bên A (Cho thuê):</strong> Đảm bảo xe hoạt động tốt, có đầy đủ giấy tờ hợp pháp, giao xe đúng giờ và địa điểm thỏa thuận.</li>
      <li><strong>Bên B (Thuê xe):</strong> Kiểm tra xe trước khi nhận, sử dụng xe đúng mục đích, không tự ý thay đổi linh kiện xe. Bên B cam kết tự chịu trách nhiệm về các khoản phạt vi phạm giao thông phát sinh trong thời gian thuê xe.</li>
      <li><strong>Trả xe trễ hạn:</strong> Bên B phải hoàn trả xe đúng giờ thỏa thuận. Trường hợp trả trễ sẽ tính phí phụ thu quá giờ theo quy định của hệ thống AutoRent.</li>
      <li><strong>Sự cố va quẹt:</strong> Nếu xảy ra va chạm gây hư hỏng phương tiện, Bên B có trách nhiệm thông báo ngay cho Bên A và bồi thường thiệt hại thực tế theo biên bản xác nhận lỗi.</li>
    </ul>

    <div class="signatures">
      <div class="signature-block">
        <strong>ĐẠI DIỆN BÊN A</strong><br/>
        (Ký và ghi rõ họ tên)
        <div class="signature-space">
          <div class="signature-signed">AUTORENT VIỆT NAM<br/>Đã ký điện tử</div>
        </div>
      </div>
      <div class="signature-block">
        <strong>ĐẠI DIỆN BÊN B</strong><br/>
        (Ký và ghi rõ họ tên)
        <div class="signature-space">
          ${contract.status === 'SIGNED'
        ? `<div class="signature-signed">${user.full_name.toUpperCase()}<br/>Đã ký điện tử<br/>${signedDate}</div>`
        : 'Đang chờ ký...'}
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}
