-- =====================================================================
-- HỆ THỐNG QUẢN LÝ DỊCH VỤ CHO THUÊ XE TẠI DA NANG TRAVEL CAR (AUTORENT)
-- CÂU LỆNH SQL DÙNG ĐỂ IMPORT TRỰC TIẾP VÀO DRAW.IO (ERD)
-- Cách dùng trên Draw.io:
-- 1. Mở https://app.diagrams.net/
-- 2. Chọn menu: Arrange -> Insert -> Advanced -> SQL (hoặc dấu + -> Advanced -> SQL)
-- 3. Dán toàn bộ mã SQL dưới đây và bấm "Insert"
-- =====================================================================

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE customer_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    date_of_birth DATE,
    address TEXT,
    citizen_id VARCHAR(20) UNIQUE,
    driver_license_number VARCHAR(20) UNIQUE,
    driver_license_expiry DATE,
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE vehicle_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP
);

CREATE TABLE locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL UNIQUE,
    city VARCHAR(100) DEFAULT 'Đà Nẵng',
    district VARCHAR(100),
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP
);

CREATE TABLE vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    location_id BIGINT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacture_year INT,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    color VARCHAR(50),
    seat_count INT NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    current_mileage INT DEFAULT 0,
    price_per_day DECIMAL(12,2) NOT NULL,
    deposit_amount DECIMAL(12,2) NOT NULL,
    included_km_per_day INT DEFAULT 200,
    extra_km_fee DECIMAL(12,2) DEFAULT 3000.00,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES vehicle_categories(id),
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    return_datetime DATETIME NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    return_location VARCHAR(255) NOT NULL,
    rental_days INT NOT NULL,
    rental_fee DECIMAL(12,2) NOT NULL,
    service_fee DECIMAL(12,2) DEFAULT 0.00,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    deposit_amount DECIMAL(12,2) NOT NULL,
    surcharge_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    payment_status VARCHAR(30) DEFAULT 'UNPAID',
    customer_note TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE booking_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE contracts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL UNIQUE,
    contract_code VARCHAR(50) NOT NULL UNIQUE,
    contract_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'PENDING_SIGN',
    signed_at TIMESTAMP,
    created_at TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE handover_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    record_type VARCHAR(20) NOT NULL,
    recorded_by BIGINT NOT NULL,
    recorded_at TIMESTAMP,
    mileage INT NOT NULL,
    fuel_level INT NOT NULL,
    vehicle_condition VARCHAR(20) DEFAULT 'GOOD',
    damage_description TEXT,
    late_fee DECIMAL(12,2) DEFAULT 0.00,
    extra_km_fee DECIMAL(12,2) DEFAULT 0.00,
    fuel_fee DECIMAL(12,2) DEFAULT 0.00,
    cleaning_fee DECIMAL(12,2) DEFAULT 0.00,
    damage_fee DECIMAL(12,2) DEFAULT 0.00,
    total_surcharge DECIMAL(12,2) DEFAULT 0.00,
    refundable_deposit DECIMAL(12,2) DEFAULT 0.00,
    note TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_code VARCHAR(30) NOT NULL UNIQUE,
    booking_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_reference VARCHAR(255),
    paid_at TIMESTAMP,
    created_at TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE maintenance_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id BIGINT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    mileage_at_service INT,
    cost DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    description TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    rating INT NOT NULL,
    content TEXT,
    status VARCHAR(20) DEFAULT 'APPROVED',
    created_at TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50),
    entity_id BIGINT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
