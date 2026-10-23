import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const counts = await prisma.bookings.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  console.log('--- BOOKINGS BY STATUS ---');
  counts.forEach(c => console.log(`${c.status}: ${c._count.id}`));

  const today = new Date().toISOString().split('T')[0];
  console.log('\n--- TODAY\'S OPERATIONS ---');
  const readyPickupToday = await prisma.bookings.findMany({
    where: {
      status: 'READY_FOR_PICKUP',
      pickup_datetime: {
        gte: new Date(`${today}T00:00:00.000Z`),
        lte: new Date(`${today}T23:59:59.999Z`),
      }
    },
    include: { vehicles: true }
  });
  console.log(`READY_FOR_PICKUP today: ${readyPickupToday.length}`);
  readyPickupToday.forEach(b => console.log(`  - #${b.booking_code}: ${b.vehicles?.name} (${b.vehicles?.license_plate})`));

  const activeReturnToday = await prisma.bookings.findMany({
    where: {
      status: 'ACTIVE',
      return_datetime: {
        gte: new Date(`${today}T00:00:00.000Z`),
        lte: new Date(`${today}T23:59:59.999Z`),
      }
    },
    include: { vehicles: true, handover_records: true }
  });
  console.log(`ACTIVE return today: ${activeReturnToday.length}`);
  activeReturnToday.forEach(b => {
    const pu = b.handover_records.find(h => h.record_type === 'PICKUP');
    console.log(`  - #${b.booking_code}: ${b.vehicles?.name} (${b.vehicles?.license_plate}), pickup odo: ${pu?.mileage}`);
  });

  const pendingGPLX = await prisma.customer_profiles.findMany({
    where: { verification_status: 'PENDING' },
    include: { users: true }
  });
  console.log(`\n--- PENDING GPLX VERIFICATIONS (${pendingGPLX.length}) ---`);
  pendingGPLX.forEach(p => console.log(`  - ${p.users?.full_name} (${p.driver_license_number})`));

  const maintenance = await prisma.maintenance_records.groupBy({
    by: ['status'],
    _count: { id: true }
  });
  console.log('\n--- MAINTENANCE BY STATUS ---');
  maintenance.forEach(m => console.log(`${m.status}: ${m._count.id}`));

  const reviews = await prisma.reviews.groupBy({
    by: ['status'],
    _count: { id: true }
  });
  console.log('\n--- REVIEWS BY STATUS ---');
  reviews.forEach(r => console.log(`${r.status}: ${r._count.id}`));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
