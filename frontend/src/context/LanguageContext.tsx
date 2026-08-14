import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Navbar
    'nav.home': 'Trang chủ',
    'nav.vehicles': 'Đội xe',
    'nav.enterprise': 'Doanh nghiệp',
    'nav.pricing': 'Bảng giá',
    'nav.support': 'Hỗ trợ 24/7',
    'nav.contact': 'Liên hệ',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.rentNow': 'ĐẶT XE NGAY',
    'nav.portal': 'Vào Portal',

    // Hero
    'hero.badge1': '★ ĐỘI XE CAO CẤP HÀNG ĐẦU',
    'hero.title1': 'Hệ Thống Thuê Xe Doanh Nghiệp & Tự Lái Chuẩn Quốc Tế',
    'hero.subtitle1': 'Quản lý hạm đội xe, hợp đồng ký số, tài xế, thanh toán cọc và lịch trình trên một nền tảng duy nhất.',
    'hero.car1': 'BMW X5 M-Sport 2026',

    'hero.badge2': '✦ SANG TRỌNG & ĐẲNG CẤP',
    'hero.title2': 'Hạm Đội Xe Doanh Nhân & Đưa Đón VIP',
    'hero.subtitle2': 'Trải nghiệm Mercedes-Benz GLE 450 và S-Class phục vụ lãnh đạo và đối tác doanh nghiệp.',
    'hero.car2': 'Mercedes-Benz GLE 450 4MATIC',

    'hero.badge3': '🔥 BẢO HIỂM VẬT CHẤT 2 CHIỀU',
    'hero.title3': 'Vận Hành Êm Ái & Chinh Phục Mọi Nẻo Đường',
    'hero.subtitle3': 'Các dòng xe 7 chỗ gầm cao Audi Q7 Quattro, Fortuner Legender cho hành trình dài an toàn.',
    'hero.car3': 'Audi Q7 55 TFSI Quattro',

    'hero.badge4': '⚡ ĐỘI XE ĐIỆN THÔNG MINH ADAS',
    'hero.title4': 'Xe Điện VinFast VF 9 & VF 8 Tự Lái ADAS',
    'hero.subtitle4': 'Công nghệ trợ lái thông minh Level 2+, Pininfarina đẳng cấp và tiết kiệm 100% nhiên liệu.',
    'hero.car4': 'VinFast VF 9 Pininfarina ADAS',

    'hero.badge5': '✦ THỦ TỤC 100% ONLINE',
    'hero.title5': 'Dịch Vụ Thuê Xe Sang Trọng Cho Doanh Nghiệp',
    'hero.subtitle5': 'Giao xe tận nhà trong 30 phút, duyệt hồ sơ GPLX online và ký hợp đồng điện tử tiện lợi.',
    'hero.car5': 'Porsche Cayenne Turbo GT',

    'hero.btnRentNow': 'ĐẶT XE NGAY',
    'hero.btnExplore': 'Khám Phá Đội Xe',

    // Search Panel
    'search.location': 'Địa điểm nhận xe',
    'search.pickupDate': 'Ngày/Giờ nhận xe',
    'search.returnDate': 'Ngày/Giờ trả xe',
    'search.type': 'Dòng xe mong muốn',
    'search.btn': 'TÌM XE NGAY',
    'search.allTypes': 'Tất cả dòng xe',

    // Stats
    'stats.vehicles': 'Đầu Xe Cao Cấp Sẵn Có',
    'stats.customers': 'Khách Hàng Hài Lòng',
    'stats.companies': 'Doanh Nghiệp Đối Tác',
    'stats.rating': 'Đánh Giá Chất Lượng 5★',

    // Categories
    'cat.tag': '✦ ĐỘI XE ĐA DẠNG',
    'cat.title': 'Khám Phá Theo Dòng Xe Nổi Bật',
    'cat.subtitle': 'Lựa chọn chiếc xe phù hợp cho chuyến công tác doanh nghiệp hoặc du lịch gia đình',

    // Featured Fleet
    'fleet.tag': '🔥 ĐƯỢC THUÊ NHIỀU NHẤT',
    'fleet.title': 'Đội Xe Cao Cấp Nổi Bật',
    'fleet.viewAll': 'Xem Tất Cả Đội Xe',
    'fleet.dailyRate': 'Giá thuê theo ngày',
    'fleet.bookNow': 'ĐẶT NGAY',
    'fleet.seats': 'chỗ',

    // Why Choose Us
    'why.tag': '✦ ĐẲNG CẤP DOANH NGHIỆP',
    'why.title': 'Tại Sao Hơn 50,000+ Khách Hàng Chọn AutoRent?',
    'why.subtitle': 'Chuẩn mực vận hành thuê xe tự lái và quản lý đội xe doanh nghiệp hàng đầu Việt Nam',
    'why.fastBooking': 'Đặt Xe 100% Online',
    'why.fastBookingDesc': 'Hoàn tất đặt giữ xe trực tuyến trong 2 phút với xác nhận ngay lập tức.',
    'why.verified': 'Kiểm Định 150 Tiêu Chí',
    'why.verifiedDesc': 'Tất cả các đầu xe được kiểm tra kỹ thuật và bảo dưỡng định kỳ khắt khe.',
    'why.support': 'Hỗ Trợ Sự Cố 24/7',
    'why.supportDesc': 'Đội ngũ CSKH và cứu hộ giao thông sẵn sàng ứng cứu 24/7 toàn quốc.',
    'why.insurance': 'Bảo Hiểm 2 Chiều',
    'why.insuranceDesc': 'Bao gồm bảo hiểm vật chất 2 chiều cao cấp giúp bạn hoàn toàn an tâm lái xe.',
    'why.digitalContract': 'Hợp Đồng Điện Tử',
    'why.digitalContractDesc': 'Ký số hợp đồng minh bạch giữa Manager và Khách hàng không cần giấy tờ.',
    'why.gpsTracking': 'Giám Sát GPS & ADAS',
    'why.gpsTrackingDesc': 'Hệ thống định vị toàn cầu và công nghệ cảnh báo an toàn thông minh.',

    // Timeline
    'step.tag': 'QUY TRÌNH 5 BƯỚC ĐƠN GIẢN',
    'step.title': 'Thuê Xe Dễ Dàng Chỉ Trong Vài Phút',
    'step1.title': 'Chọn Xe Ứng Ý',
    'step1.desc': 'Tìm chọn dòng xe phù hợp với nhu cầu di chuyển cá nhân hoặc công tác.',
    'step2.title': 'Đặt Cọc Online',
    'step2.desc': 'Thanh toán cọc an toàn qua VNPAY, Thẻ tín dụng hoặc Chuyển khoản.',
    'step3.title': 'Duyệt GPLX & Ký Số',
    'step3.desc': 'Tải GPLX xác minh nhanh và ký hợp đồng điện tử minh bạch.',
    'step4.title': 'Bàn Giao Xe',
    'step4.desc': 'Nhận xe tại chi nhánh hoặc yêu cầu giao xe tận nhà trong 30 phút.',
    'step5.title': 'Trả Xe & Hoàn Cọc',
    'step5.desc': 'Lái xe trải nghiệm trọn vẹn và bàn giao trả xe nhanh gọn.',

    // Testimonials
    'testi.tag': '★ ĐÁNH GIÁ THỰC TẾ',
    'testi.title': 'Khách Hàng & Doanh Nghiệp Nói Gì Về AutoRent?',

    // Partners
    'partners.title': 'ĐỐI TÁC HÃNG XE HÀNG ĐẦU VIỆT NAM & THẾ GIỚI',

    // Bottom CTA
    'cta.tag': 'BẮT ĐẦU HÀNH TRÌNH NGAY',
    'cta.title': 'Sẵn Sàng Cho Chuyến Đi Tiếp Theo Của Bạn?',
    'cta.subtitle': 'Đặt xe ngay hôm nay để trải nghiệm dịch vụ thuê xe tiêu chuẩn 5 sao với ưu đãi giảm 15% cho lần thuê đầu tiên.',
    'cta.btnLogin': 'Đăng Nhập Portal System'
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.vehicles': 'Vehicles',
    'nav.enterprise': 'Enterprise',
    'nav.pricing': 'Pricing',
    'nav.support': 'Support 24/7',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.rentNow': 'RENT NOW',
    'nav.portal': 'Go to Portal',

    // Hero
    'hero.badge1': '★ ULTIMATE LUXURY FLEET',
    'hero.title1': 'Enterprise Car Rental Made Fast & Professional',
    'hero.subtitle1': 'Manage vehicles, contracts, drivers, payments and reservations on one platform.',
    'hero.car1': 'BMW X5 M-Sport 2026',

    'hero.badge2': '✦ GERMAN ENGINEERING EXCELLENCE',
    'hero.title2': 'Executive Business Fleets & VIP Mobility',
    'hero.subtitle2': 'Experience world-class Mercedes-Benz GLE 450 and S-Class tailored for enterprise leaders.',
    'hero.car2': 'Mercedes-Benz GLE 450 4MATIC',

    'hero.badge3': '🔥 QUATTRO ALL-WHEEL DRIVE',
    'hero.title3': 'Quattro Performance & All-Terrain Luxury',
    'hero.subtitle3': 'Unmatched comfort, adaptive suspension, and 7-seat elegance for corporate trips.',
    'hero.car3': 'Audi Q7 55 TFSI Quattro',

    'hero.badge4': '⚡ ZERO EMISSION ELECTRIC FLEET',
    'hero.title4': 'Smart Autonomous Electric Mobility',
    'hero.subtitle4': 'VinFast VF9 & Tesla Model X equipped with ADAS Level 2+ intelligent self-driving assistance.',
    'hero.car4': 'VinFast VF 9 Pininfarina ADAS',

    'hero.badge5': '✦ CORPORATE VIP MOBILITY',
    'hero.title5': 'Urban Prestige & Corporate Express Shuttle',
    'hero.subtitle5': 'Sleek Range Rover and Porsche Cayenne for seamless urban commuting and executive travel.',
    'hero.car5': 'Porsche Cayenne Turbo GT',

    'hero.btnRentNow': 'RENT NOW',
    'hero.btnExplore': 'Explore Fleet',

    // Search Panel
    'search.location': 'Pickup Location',
    'search.pickupDate': 'Pickup Date/Time',
    'search.returnDate': 'Return Date/Time',
    'search.type': 'Vehicle Type',
    'search.btn': 'SEARCH FLEET',
    'search.allTypes': 'All Categories',

    // Stats
    'stats.vehicles': 'Luxury Fleet Vehicles',
    'stats.customers': 'Satisfied Customers',
    'stats.companies': 'Enterprise Companies',
    'stats.rating': 'Customer Rating 5★',

    // Categories
    'cat.tag': '✦ FLEET CATEGORIES',
    'cat.title': 'Browse By Vehicle Category',
    'cat.subtitle': 'Select your desired vehicle class for individual travel or corporate fleet operations',

    // Featured Fleet
    'fleet.tag': '🔥 FEATURED FLEET',
    'fleet.title': 'Popular Luxury Rental Cars',
    'fleet.viewAll': 'View Full Fleet',
    'fleet.dailyRate': 'Daily Rate',
    'fleet.bookNow': 'BOOK NOW',
    'fleet.seats': 'Seats',

    // Why Choose Us
    'why.tag': '✦ WHY CHOOSE AUTORENT',
    'why.title': 'Built for Luxury & Commercial Fleet Standard',
    'why.subtitle': 'Experience seamless car rental operations engineered for luxury standards',
    'why.fastBooking': 'Fast Booking',
    'why.fastBookingDesc': 'Reserve your luxury vehicle online in less than 2 minutes with instant confirmation.',
    'why.verified': 'Verified Vehicles',
    'why.verifiedDesc': 'Every car undergoes a rigorous 150-point technical and safety inspection.',
    'why.support': '24/7 Support',
    'why.supportDesc': 'Dedicated 24/7 concierge and roadside emergency response team nationwide.',
    'why.insurance': 'Insurance Included',
    'why.insuranceDesc': 'Comprehensive 2-way material insurance included for maximum peace of mind.',
    'why.digitalContract': 'Digital Contract',
    'why.digitalContractDesc': 'Legal e-signatures for Manager and Customer without physical paperwork.',
    'why.gpsTracking': 'GPS & ADAS Tracking',
    'why.gpsTrackingDesc': 'Real-time telemetry, remote diagnostics, and intelligent ADAS safety.',

    // Timeline
    'step.tag': 'HOW IT WORKS',
    'step.title': '5 Steps To Drive Your Dream Car',
    'step1.title': 'Choose Car',
    'step1.desc': 'Select from our fleet of 520+ luxury sedans, SUVs, and electric vehicles.',
    'step2.title': 'Book Online',
    'step2.desc': 'Specify dates, choose pickup location, and complete secure deposit.',
    'step3.title': 'Digital Sign',
    'step3.desc': 'Upload driver license and sign the legal digital contract via E-Sign.',
    'step4.title': 'Pick Up',
    'step4.desc': 'Receive vehicle at showroom or request home delivery in 30 minutes.',
    'step5.title': 'Enjoy & Return',
    'step5.desc': 'Drive with total confidence and return hassle-free at any branch.',

    // Testimonials
    'testi.tag': '★ TESTIMONIALS',
    'testi.title': 'Trusted By Executive Directors & Personal Drivers',

    // Partners
    'partners.title': 'WORLD-CLASS AUTOMOTIVE PARTNERS & FLEET MANUFACTURERS',

    // Bottom CTA
    'cta.tag': 'START YOUR JOURNEY TODAY',
    'cta.title': 'Ready To Experience Million-Dollar Mobility?',
    'cta.subtitle': 'Reserve your luxury vehicle today and enjoy a 15% discount for your first rental. Full insurance & 24/7 roadside assistance guaranteed.',
    'cta.btnLogin': 'System Login Portal'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('autorent_language') as Language;
    return saved === 'en' ? 'en' : 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('autorent_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
