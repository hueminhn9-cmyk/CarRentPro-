import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 [seed_admin_live] Bắt đầu nạp bổ sung dữ liệu thực tế cho Phân hệ Admin...');

  // ==========================================
  // 1. CẬP NHẬT CẤU HÌNH HỆ THỐNG (SETTINGS)
  // ==========================================
  console.log('⚙️ 1. Nạp các tham số cài đặt hệ thống (Settings)...');
  const defaultSettings = [
    { key: 'company_name', value: 'AutoRent Việt Nam - Nền tảng Cho thuê xe Tự lái SaaS', description: 'Tên thương hiệu doanh nghiệp' },
    { key: 'companyName', value: 'AutoRent Việt Nam - Nền tảng Cho thuê xe Tự lái SaaS', description: 'Tên thương hiệu doanh nghiệp (alias)' },
    { key: 'hotline', value: '1900 6868', description: 'Hotline tổng đài CSKH 24/7' },
    { key: 'email', value: 'info@autorent.vn', description: 'Email tiếp nhận liên hệ nghiệp vụ' },
    { key: 'address', value: 'Lô C15, Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng', description: 'Địa chỉ trụ sở chính' },
    { key: 'deposit_minimum', value: '15000000', description: 'Mức tiền cọc giữ xe tối thiểu (VND)' },
    { key: 'depositRate', value: '15000000', description: 'Mức tiền cọc giữ xe tối thiểu (VND alias)' },
    { key: 'insurance_fee_daily', value: '100000', description: 'Phí bảo hiểm vật chất xe tiêu chuẩn theo ngày (VND)' },
    { key: 'insuranceFee', value: '100000', description: 'Phí bảo hiểm vật chất xe tiêu chuẩn theo ngày (VND alias)' },
    { key: 'serviceFee', value: '100000', description: 'Phí vệ sinh bàn giao xe mặc định (VND)' },
    { key: 'cancellation_penalty_rate', value: '30', description: 'Tỷ lệ phạt hủy đơn thuê trong vòng 24 giờ (%)' },
    { key: 'cancelPenaltyRate', value: '30', description: 'Tỷ lệ phạt hủy đơn thuê trong vòng 24 giờ (% alias)' }
  ];

  for (const s of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s
    });
  }
  console.log('✅ Đã nạp thành công 12 tham số cài đặt hệ thống.');

  // ==========================================
  // 2. LẤY DANH SÁCH USERS VÀ XE CÓ SẴN
  // ==========================================
  const customers = await prisma.users.findMany({
    where: { role: 'CUSTOMER' },
    take: 10
  });

  const managers = await prisma.users.findMany({
    where: { role: 'MANAGER' },
    take: 5
  });

  const admin = await prisma.users.findFirst({
    where: { role: 'ADMIN' }
  });

  const vehicles = await prisma.vehicles.findMany({
    take: 10
  });

  if (customers.length === 0 || vehicles.length === 0) {
    console.error('❌ Cần có ít nhất 1 khách hàng và 1 phương tiện trong DB để tạo đơn hàng!');
    return;
  }

  const managerUser = managers.length > 0 ? managers[0] : (admin || customers[0]);

  // ==========================================
  // 3. NẠP 18 ĐƠN THUÊ PHÂN BỔ ĐỦ TRẠNG THÁI
  // ==========================================
  console.log('📋 2. Nạp bổ sung 18 đơn hàng mẫu (4 PENDING, 4 CONFIRMED, 3 READY, 4 ACTIVE, 3 COMPLETED)...');

  const liveBookings = [
    // 4 Đơn PENDING (Chờ duyệt)
    {
      code: 'BK-LIVE-PENDING-01',
      status: 'PENDING' as const,
      payment_status: 'UNPAID' as const,
      custIdx: 0,
      vehIdx: 0,
      days: 3,
      pickupDaysOffset: 2,
      note: 'Khách yêu cầu lắp thêm ghế trẻ em và giao xe tại Sân bay Quốc tế Đà Nẵng',
      signed: false
    },
    {
      code: 'BK-LIVE-PENDING-02',
      status: 'PENDING' as const,
      payment_status: 'UNPAID' as const,
      custIdx: 1,
      vehIdx: 1,
      days: 4,
      pickupDaysOffset: 3,
      note: 'Khách muốn kiểm tra xe kỹ trước khi nhận lúc 8h sáng',
      signed: false
    },
    {
      code: 'BK-LIVE-PENDING-03',
      status: 'PENDING' as const,
      payment_status: 'UNPAID' as const,
      custIdx: 2,
      vehIdx: 2,
      days: 2,
      pickupDaysOffset: 1,
      note: 'Khách đi công tác Hội An, cần hỗ trợ xuất hóa đơn VAT công ty',
      signed: false
    },
    {
      code: 'BK-LIVE-PENDING-04',
      status: 'PENDING' as const,
      payment_status: 'UNPAID' as const,
      custIdx: 3 % customers.length,
      vehIdx: 3 % vehicles.length,
      days: 5,
      pickupDaysOffset: 4,
      note: 'Đơn thuê xe gia đình 7 chỗ đi du lịch Bà Nà Hills - Lăng Cô',
      signed: false
    },

    // 4 Đơn CONFIRMED (Đã duyệt, chờ khách ký hợp đồng)
    {
      code: 'BK-LIVE-CONFIRMED-01',
      status: 'CONFIRMED' as const,
      payment_status: 'PAID' as const,
      custIdx: 0,
      vehIdx: 4 % vehicles.length,
      days: 5,
      pickupDaysOffset: 2,
      note: 'Đã xác minh GPLX hợp lệ, đã thanh toán đủ tiền cọc 15.000.000đ qua VietQR',
      signed: false
    },
    {
      code: 'BK-LIVE-CONFIRMED-02',
      status: 'CONFIRMED' as const,
      payment_status: 'PAID' as const,
      custIdx: 1,
      vehIdx: 0,
      days: 3,
      pickupDaysOffset: 3,
      note: 'Khách đã cọc qua cổng VNPay, đang chờ khách hoàn tất ký số hợp đồng điện tử',
      signed: false
    },
    {
      code: 'BK-LIVE-CONFIRMED-03',
      status: 'CONFIRMED' as const,
      payment_status: 'PAID' as const,
      custIdx: 2,
      vehIdx: 1,
      days: 7,
      pickupDaysOffset: 5,
      note: 'Khách thuê dài ngày đi cung đường ven biển miền Trung Đà Nẵng - Quy Nhơn',
      signed: false
    },
    {
      code: 'BK-LIVE-CONFIRMED-04',
      status: 'CONFIRMED' as const,
      payment_status: 'PAID' as const,
      custIdx: 3 % customers.length,
      vehIdx: 2,
      days: 2,
      pickupDaysOffset: 2,
      note: 'Đã hoàn tất thanh toán cọc, quản lý chi nhánh đã phân công xe sẵn sàng',
      signed: false
    },

    // 3 Đơn READY_FOR_PICKUP (Đã ký hợp đồng số, sẵn sàng giao xe)
    {
      code: 'BK-LIVE-READY-01',
      status: 'READY_FOR_PICKUP' as const,
      payment_status: 'PAID' as const,
      custIdx: 0,
      vehIdx: 1,
      days: 3,
      pickupDaysOffset: 1,
      note: 'Đã hoàn tất ký số hợp đồng điện tử và kiểm tra vệ sinh sạch sẽ',
      signed: true
    },
    {
      code: 'BK-LIVE-READY-02',
      status: 'READY_FOR_PICKUP' as const,
      payment_status: 'PAID' as const,
      custIdx: 1,
      vehIdx: 2,
      days: 4,
      pickupDaysOffset: 1,
      note: 'Xe đã sạc 100% pin, kỹ thuật viên chi nhánh đã kiểm tra lốp và phanh an toàn',
      signed: true
    },
    {
      code: 'BK-LIVE-READY-03',
      status: 'READY_FOR_PICKUP' as const,
      payment_status: 'PAID' as const,
      custIdx: 2,
      vehIdx: 3 % vehicles.length,
      days: 2,
      pickupDaysOffset: 0,
      note: 'Khách hẹn lấy xe vào 14h chiều nay tại Showroom Hải Châu',
      signed: true
    },

    // 4 Đơn ACTIVE (Đang thuê, xe đang lưu thông trên đường)
    {
      code: 'BK-LIVE-ACTIVE-01',
      status: 'ACTIVE' as const,
      payment_status: 'PAID' as const,
      custIdx: 3 % customers.length,
      vehIdx: 4 % vehicles.length,
      days: 4,
      pickupDaysOffset: -2,
      note: 'Khách đang di chuyển tại cung đường Huế - Đà Nẵng, xe vận hành rất tốt',
      signed: true
    },
    {
      code: 'BK-LIVE-ACTIVE-02',
      status: 'ACTIVE' as const,
      payment_status: 'PAID' as const,
      custIdx: 4 % customers.length,
      vehIdx: 0,
      days: 6,
      pickupDaysOffset: -3,
      note: 'Hành trình Bà Nà Hills - Hội An, đồng hồ ODO tăng 280km',
      signed: true
    },
    {
      code: 'BK-LIVE-ACTIVE-03',
      status: 'ACTIVE' as const,
      payment_status: 'PAID' as const,
      custIdx: 0,
      vehIdx: 1,
      days: 3,
      pickupDaysOffset: -1,
      note: 'Dự kiến trả xe lúc 18:00 ngày mai tại Showroom Sân Bay Quốc tế',
      signed: true
    },
    {
      code: 'BK-LIVE-ACTIVE-04',
      status: 'ACTIVE' as const,
      payment_status: 'PAID' as const,
      custIdx: 1,
      vehIdx: 2,
      days: 5,
      pickupDaysOffset: -2,
      note: 'Xe đang di chuyển công tác tại KCN Điện Nam - Điện Ngọc',
      signed: true
    },

    // 3 Đơn COMPLETED (Đã hoàn tất chuyến đi)
    {
      code: 'BK-LIVE-COMPLETED-01',
      status: 'COMPLETED' as const,
      payment_status: 'PAID' as const,
      custIdx: 0,
      vehIdx: 2,
      days: 3,
      pickupDaysOffset: -7,
      note: 'Đã hoàn tất tiếp nhận xe, hoàn trả 100% cọc sau khi kiểm tra không trầy xước',
      signed: true
    },
    {
      code: 'BK-LIVE-COMPLETED-02',
      status: 'COMPLETED' as const,
      payment_status: 'PAID' as const,
      custIdx: 1,
      vehIdx: 3 % vehicles.length,
      days: 5,
      pickupDaysOffset: -10,
      note: 'Khách đánh giá 5 sao về chất lượng xe và dịch vụ giao nhận tận nơi',
      signed: true
    },
    {
      code: 'BK-LIVE-COMPLETED-03',
      status: 'COMPLETED' as const,
      payment_status: 'PAID' as const,
      custIdx: 2,
      vehIdx: 4 % vehicles.length,
      days: 2,
      pickupDaysOffset: -5,
      note: 'Chuyến đi an toàn, xe đã được vệ sinh và đưa lại danh mục sẵn sàng cho thuê',
      signed: true
    }
  ];

  const now = new Date();

  for (const item of liveBookings) {
    const cust = customers[item.custIdx];
    const veh = vehicles[item.vehIdx];

    const pickupDate = new Date(now.getTime() + item.pickupDaysOffset * 24 * 60 * 60 * 1000);
    const returnDate = new Date(pickupDate.getTime() + item.days * 24 * 60 * 60 * 1000);

    const pricePerDay = Number(veh.price_per_day);
    const rentalFee = pricePerDay * item.days;
    const serviceFee = 100000;
    const depositAmount = 15000000;
    const totalAmount = rentalFee + serviceFee;

    const booking = await prisma.bookings.upsert({
      where: { booking_code: item.code },
      update: {
        status: item.status,
        payment_status: item.payment_status,
        customer_note: item.note,
        rental_days: item.days,
        rental_fee: rentalFee,
        service_fee: serviceFee,
        deposit_amount: depositAmount,
        total_amount: totalAmount,
      },
      create: {
        booking_code: item.code,
        customer_id: cust.id,
        vehicle_id: veh.id,
        pickup_datetime: pickupDate,
        return_datetime: returnDate,
        pickup_location: 'Showroom Trung Tâm - Hải Châu, Đà Nẵng',
        return_location: 'Showroom Trung Tâm - Hải Châu, Đà Nẵng',
        rental_days: item.days,
        rental_fee: rentalFee,
        service_fee: serviceFee,
        discount_amount: 0,
        deposit_amount: depositAmount,
        total_amount: totalAmount,
        status: item.status,
        payment_status: item.payment_status,
        customer_note: item.note,
        created_at: new Date(pickupDate.getTime() - 2 * 24 * 60 * 60 * 1000)
      }
    });

    // 2. Tạo Hợp đồng điện tử tương ứng
    await prisma.contracts.upsert({
      where: { booking_id: booking.id },
      update: {
        status: item.signed ? 'SIGNED' : 'PENDING_SIGN',
        signed_at: item.signed ? new Date(pickupDate.getTime() - 12 * 60 * 60 * 1000) : null
      },
      create: {
        booking_id: booking.id,
        contract_code: `CTR-${item.code}`,
        contract_url: `https://autorent.vn/contracts/${item.code}.pdf`,
        status: item.signed ? 'SIGNED' : 'PENDING_SIGN',
        signed_at: item.signed ? new Date(pickupDate.getTime() - 12 * 60 * 60 * 1000) : null
      }
    });

    // 3. Tạo bản ghi thanh toán nếu đã PAID
    if (item.payment_status === 'PAID') {
      const txnCode = `TXN-${item.code}`;
      const existingPayment = await prisma.payments.findUnique({
        where: { transaction_code: txnCode }
      });
      if (!existingPayment) {
        await prisma.payments.create({
          data: {
            transaction_code: txnCode,
            booking_id: booking.id,
            customer_id: cust.id,
            transaction_type: 'DEPOSIT',
            amount: depositAmount,
            payment_method: 'VNPAY',
            status: 'PAID',
            payment_reference: `VNPAY_${item.code}_REF`,
            paid_at: new Date(pickupDate.getTime() - 24 * 60 * 60 * 1000)
          }
        });
      }
    }

    // 4. Tạo Biên bản bàn giao (Handover Records) cho các đơn ACTIVE & COMPLETED
    if (item.status === 'ACTIVE' || item.status === 'COMPLETED') {
      const existingHandover = await prisma.handover_records.findFirst({
        where: { booking_id: booking.id, record_type: 'PICKUP' }
      });
      if (!existingHandover) {
        await prisma.handover_records.create({
          data: {
            booking_id: booking.id,
            record_type: 'PICKUP',
            recorded_by: managerUser.id,
            mileage: 12450,
            fuel_level: 100,
            vehicle_condition: 'EXCELLENT',
            damage_description: 'Không có trầy xước. Đầy đủ phụ kiện theo xe.',
            refundable_deposit: depositAmount,
            note: 'Photos: [https://images.unsplash.com/photo-1555215695-3004980ad54e, https://images.unsplash.com/photo-1541899481282-d53bffe3c35d]',
            recorded_at: pickupDate
          }
        });
      }
    }

    if (item.status === 'COMPLETED') {
      const existingReturn = await prisma.handover_records.findFirst({
        where: { booking_id: booking.id, record_type: 'RETURN' }
      });
      if (!existingReturn) {
        await prisma.handover_records.create({
          data: {
            booking_id: booking.id,
            record_type: 'RETURN',
            recorded_by: managerUser.id,
            mileage: 12850,
            fuel_level: 100,
            vehicle_condition: 'GOOD',
            damage_description: 'Xe bàn giao nguyên vẹn, nội thất sạch sẽ.',
            refundable_deposit: depositAmount,
            note: 'Hoàn trả đầy đủ 100% tiền cọc 15.000.000đ cho khách hàng.',
            recorded_at: returnDate
          }
        });
      }
    }
  }

  console.log('✅ Đã nạp thành công 18 đơn hàng mẫu (4 PENDING, 4 CONFIRMED, 3 READY, 4 ACTIVE, 3 COMPLETED) kèm Hợp đồng và Biên bản bàn giao.');

  // ==========================================
  // 4. NẠP ĐÁNH GIÁ (REVIEWS) ĐẦY ĐỦ CÁC TRẠNG THÁI
  // ==========================================
  console.log('⭐ 3. Cập nhật các đánh giá (Reviews) phân bổ đủ PENDING, APPROVED, HIDDEN...');

  const completedBookings = await prisma.bookings.findMany({
    where: { status: 'COMPLETED' },
    take: 12
  });

  const sampleReviews = [
    { rating: 5, content: 'Xe rất mới, nội thất sạch sẽ thơm tho. Thủ tục nhận xe nhanh chóng chỉ mất 5 phút tại sân bay Đà Nẵng. 10/10!', status: 'APPROVED' },
    { rating: 5, content: 'VinFast VF 8 tăng tốc cực kỳ ấn tượng, pin dùng được lâu và trạm sạc phủ rộng khắp các tuyến du lịch.', status: 'APPROVED' },
    { rating: 4, content: 'Xe vận hành êm ái, nhân viên giao xe nhiệt tình hướng dẫn các tính năng lái tự động.', status: 'APPROVED' },
    { rating: 5, content: 'Dịch vụ hỗ trợ trực tuyến 24/7 tuyệt vời. Tôi sẽ tiếp tục thuê xe của AutoRent trong chuyến công tác tới.', status: 'APPROVED' },
    { rating: 5, content: 'Giá cả minh bạch, không phụ phí phát sinh, hợp đồng điện tử ký số cực kỳ tiện lợi!', status: 'APPROVED' },
    // PENDING (Chờ Admin duyệt)
    { rating: 5, content: 'Chất lượng xe tuyệt hảo, gia đình tôi đã có một kỳ nghỉ thật tuyệt vời tại Hội An và Bà Nà!', status: 'PENDING' },
    { rating: 4, content: 'Xe chạy đầm chắc, tiết kiệm nhiên liệu. Cần cải thiện thêm thời gian hỗ trợ đổi xe nếu có yêu cầu.', status: 'PENDING' },
    { rating: 5, content: 'Cảm ơn AutoRent đã chuẩn bị sẵn ghế em bé chu đáo đúng như cam kết trong ghi chú đơn thuê.', status: 'PENDING' },
    // HIDDEN (Đã ẩn)
    { rating: 1, content: 'Spam quảng cáo: Vui lòng truy cập website xyz-vaytien.com để nhận ưu đãi lãi suất 0%!', status: 'HIDDEN' },
    { rating: 2, content: 'Khách hàng bức xúc phản hồi vì lý do thời tiết mưa bão không đi được nhưng không được hủy miễn phí.', status: 'HIDDEN' }
  ];

  for (let i = 0; i < Math.min(completedBookings.length, sampleReviews.length); i++) {
    const b = completedBookings[i];
    const r = sampleReviews[i];

    await prisma.reviews.upsert({
      where: { booking_id: b.id },
      update: {
        rating: r.rating,
        content: r.content,
        status: r.status
      },
      create: {
        booking_id: b.id,
        customer_id: b.customer_id,
        vehicle_id: b.vehicle_id,
        rating: r.rating,
        content: r.content,
        status: r.status
      }
    });
  }

  console.log('✅ Đã nạp và phân bổ thành công danh sách đánh giá: APPROVED, PENDING, HIDDEN.');

  // ==========================================
  // 5. NẠP NHẬT KÝ KIỂM TOÁN (AUDIT LOGS) PHONG PHÚ
  // ==========================================
  console.log('🔍 4. Nạp ít nhất 16 bản ghi Nhật ký Kiểm toán (Audit Logs) có Before/After JSON...');

  if (admin) {
    const detailedAuditLogs = [
      {
        user_id: admin.id,
        action: 'UPDATE_VEHICLE_PRICE',
        entity_name: 'vehicles',
        entity_id: 1n,
        old_values: JSON.stringify({ price_per_day: 1200000, holiday_surcharge: 0 }),
        new_values: JSON.stringify({ price_per_day: 1500000, holiday_surcharge: 200000 }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0.0.0 Safari/537.36'
      },
      {
        user_id: admin.id,
        action: 'APPROVE_BOOKING',
        entity_name: 'bookings',
        entity_id: 61n,
        old_values: JSON.stringify({ status: 'PENDING', payment_status: 'UNPAID' }),
        new_values: JSON.stringify({ status: 'CONFIRMED', payment_status: 'PAID' }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'REJECT_BOOKING',
        entity_name: 'bookings',
        entity_id: 62n,
        old_values: JSON.stringify({ status: 'PENDING', reject_reason: null }),
        new_values: JSON.stringify({ status: 'REJECTED', reject_reason: 'GPLX khách hàng không hợp lệ, phát hiện chỉnh sửa ảnh' }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'VERIFY_CUSTOMER_LICENSE',
        entity_name: 'customer_profiles',
        entity_id: 5n,
        old_values: JSON.stringify({ verification_status: 'PENDING', driver_license: 'B2-889921' }),
        new_values: JSON.stringify({ verification_status: 'VERIFIED', verified_by: 'ADMIN', driver_license: 'B2-889921' }),
        ip_address: '14.162.88.90',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'UPDATE_SYSTEM_SETTINGS',
        entity_name: 'settings',
        entity_id: 1n,
        old_values: JSON.stringify({ deposit_minimum: '10000000', insurance_fee_daily: '80000' }),
        new_values: JSON.stringify({ deposit_minimum: '15000000', insurance_fee_daily: '100000' }),
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'EMERGENCY_OVERRIDE',
        entity_name: 'bookings',
        entity_id: 64n,
        old_values: JSON.stringify({ status: 'ACTIVE', flag: 'NORMAL' }),
        new_values: JSON.stringify({ status: 'CANCELLED', flag: 'EMERGENCY_FROZEN', reason: 'Phát hiện xe bị giữ tại chốt kiểm tra' }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'SCHEDULE_MAINTENANCE',
        entity_name: 'vehicles',
        entity_id: 2n,
        old_values: JSON.stringify({ status: 'AVAILABLE', odo_km: 39800 }),
        new_values: JSON.stringify({ status: 'MAINTENANCE', odo_km: 40150, service: 'Bảo dưỡng cấp 40.000km' }),
        ip_address: '14.162.88.90',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'CONFIRM_DEPOSIT_PAYMENT',
        entity_name: 'payments',
        entity_id: 10n,
        old_values: JSON.stringify({ status: 'PENDING', amount: 15000000 }),
        new_values: JSON.stringify({ status: 'PAID', amount: 15000000, method: 'VNPAY' }),
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'REFUND_SECURITY_DEPOSIT',
        entity_name: 'payments',
        entity_id: 12n,
        old_values: JSON.stringify({ deposit_status: 'HOLDING', amount: 15000000 }),
        new_values: JSON.stringify({ deposit_status: 'REFUNDED', amount: 15000000, fee_deducted: 0 }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'APPROVE_REVIEW',
        entity_name: 'reviews',
        entity_id: 4n,
        old_values: JSON.stringify({ status: 'PENDING' }),
        new_values: JSON.stringify({ status: 'APPROVED' }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'HIDE_INAPPROPRIATE_REVIEW',
        entity_name: 'reviews',
        entity_id: 9n,
        old_values: JSON.stringify({ status: 'APPROVED' }),
        new_values: JSON.stringify({ status: 'HIDDEN', reason: 'Chứa nội dung spam link cá cược' }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'ASSIGN_MANAGER_BRANCH',
        entity_name: 'users',
        entity_id: 2n,
        old_values: JSON.stringify({ branch: 'Hà Nội' }),
        new_values: JSON.stringify({ branch: 'Showroom Hải Châu - Đà Nẵng' }),
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'FREEZE_SUSPICIOUS_ACCOUNT',
        entity_name: 'users',
        entity_id: 8n,
        old_values: JSON.stringify({ status: 'ACTIVE' }),
        new_values: JSON.stringify({ status: 'BLOCKED', reason: 'Có dấu hiệu gian lận thanh toán thẻ quốc tế' }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'OVERRIDE_CONTRACT_TERMS',
        entity_name: 'contracts',
        entity_id: 3n,
        old_values: JSON.stringify({ daily_km_limit: 300 }),
        new_values: JSON.stringify({ daily_km_limit: 450, note: 'Khách VIP hợp đồng dài hạn' }),
        ip_address: '113.190.234.12',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'UPDATE_BRANCH_HOTLINE',
        entity_name: 'locations',
        entity_id: 1n,
        old_values: JSON.stringify({ phone: '0236 3888 999' }),
        new_values: JSON.stringify({ phone: '1900 6868' }),
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        user_id: admin.id,
        action: 'COMPLETE_HANDOVER_PICKUP',
        entity_name: 'handover_records',
        entity_id: 5n,
        old_values: JSON.stringify({ status: 'DRAFT', verified: false }),
        new_values: JSON.stringify({ status: 'COMPLETED', verified: true, odo: 12450 }),
        ip_address: '14.162.88.90',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    ];

    for (const log of detailedAuditLogs) {
      await prisma.audit_logs.create({
        data: log
      });
    }
    console.log(`✅ Đã nạp thành công ${detailedAuditLogs.length} bản ghi nhật ký kiểm toán (Audit Logs).`);
  }

  console.log('🎉 [seed_admin_live] Hoàn tất nạp toàn bộ seed data sống động 100% MySQL cho Phân hệ Quản trị viên!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi nạp seed admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
