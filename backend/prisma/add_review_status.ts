import { prisma } from '../src/config/prisma.js';

async function main() {
  try {
    const cols: any[] = await prisma.$queryRawUnsafe(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'reviews' AND COLUMN_NAME = 'status'
    `);
    if (cols.length === 0) {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE reviews ADD COLUMN status VARCHAR(20) DEFAULT 'APPROVED'
      `);
      console.log('Successfully added status column to reviews table');
    } else {
      console.log('Column status already exists in reviews table');
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
