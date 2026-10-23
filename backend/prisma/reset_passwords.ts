import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Đang mã hóa mật khẩu mới: 123456...');
  const newHash = await bcrypt.hash('123456', 10);

  console.log('🔄 Đang cập nhật mật khẩu cho toàn bộ người dùng trong cơ sở dữ liệu...');
  const updateResult = await prisma.users.updateMany({
    data: {
      password_hash: newHash
    }
  });

  console.log(`✅ Đã cập nhật thành công mật khẩu cho ${updateResult.count} người dùng!`);

  const allUsers = await prisma.users.findMany({
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      status: true
    },
    orderBy: { id: 'asc' }
  });

  console.log('\n📋 Danh sách tài khoản đã được đổi mật khẩu thành "123456":');
  allUsers.forEach((u) => {
    console.log(` - ID: ${u.id} | ${u.role.padEnd(8)} | Email: ${u.email.padEnd(30)} | Họ tên: ${u.full_name}`);
  });
}

main()
  .catch((err) => {
    console.error('❌ Lỗi khi cập nhật mật khẩu:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
