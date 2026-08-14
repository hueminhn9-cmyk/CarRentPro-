import { prisma } from '../config/prisma.js';

export class DashboardService {
  static async getStats() {
    // 1. Vehicle counts
    const totalVehicles = await prisma.vehicles.count();
    const rentedVehicles = await prisma.vehicles.count({ where: { status: 'RENTED' } });
    const maintenanceVehicles = await prisma.vehicles.count({ where: { status: 'MAINTENANCE' } });
    const availableVehicles = await prisma.vehicles.count({ where: { status: 'AVAILABLE' } });
    const availableRate = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0;

    // 2. Booking counts
    const totalBookings = await prisma.bookings.count();
    const pendingBookings = await prisma.bookings.count({ where: { status: 'PENDING' } });
    const activeRentals = await prisma.bookings.count({ where: { status: 'ACTIVE' } });

    // 3. Customers
    const totalCustomers = await prisma.users.count({ where: { role: 'CUSTOMER' } });

    // 4. Today's Revenue (confirmed payments today)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayRevenueAggregate = await prisma.payments.aggregate({
      where: {
        status: 'PAID',
        paid_at: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const todayRevenue = Number(todayRevenueAggregate._sum.amount || 0);

    // 5. Total revenue from completed/paid bookings
    const revenueAggregate = await prisma.bookings.aggregate({
      where: {
        payment_status: 'PAID',
      },
      _sum: {
        total_amount: true,
      },
    });
    const totalRevenue = Number(revenueAggregate._sum.total_amount || 0);

    // 6. Monthly revenue (group by month of the current year)
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    
    const paidBookings = await prisma.bookings.findMany({
      where: {
        payment_status: 'PAID',
        created_at: {
          gte: startOfYear,
        },
      },
      select: {
        total_amount: true,
        created_at: true,
      },
    });

    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      return { month: monthNames[index], revenue: 0, bookings: 0 };
    });

    paidBookings.forEach((b) => {
      if (b.created_at) {
        const monthIndex = new Date(b.created_at).getMonth();
        monthlyRevenue[monthIndex].revenue += Number(b.total_amount);
        monthlyRevenue[monthIndex].bookings += 1;
      }
    });

    // 7. Vehicle categories distribution & revenue
    const categories = await prisma.vehicle_categories.findMany({
      include: {
        _count: {
          select: { vehicles: true },
        },
        vehicles: {
          select: {
            bookings: {
              where: { payment_status: 'PAID' },
              select: { total_amount: true },
            },
          },
        },
      },
    });

    const categoryStats = categories.map((c) => {
      const revenue = c.vehicles.reduce((sum, v) => {
        const vehRev = v.bookings.reduce((bSum, b) => bSum + Number(b.total_amount), 0);
        return sum + vehRev;
      }, 0);

      let type = c.name;
      if (c.name === 'Pickup') type = 'Bán tải';
      if (c.name === 'Luxury') type = 'Xe sang';

      return {
        category: c.name,
        type,
        count: c._count.vehicles,
        value: c._count.vehicles,
        revenue,
      };
    });

    // 8. Recent bookings (last 5)
    const recentBookings = await prisma.bookings.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        users: { select: { id: true, full_name: true, email: true } },
        vehicles: { select: { id: true, name: true, license_plate: true } },
      },
    });

    // 9. Top Vehicles (most booked)
    const topVehicleGroups = await prisma.bookings.groupBy({
      by: ['vehicle_id'],
      _count: { vehicle_id: true },
      orderBy: {
        _count: { vehicle_id: 'desc' },
      },
      take: 5,
    });

    const topVehicles = await Promise.all(
      topVehicleGroups.map(async (group) => {
        const vehicle = await prisma.vehicles.findUnique({
          where: { id: group.vehicle_id },
          select: { id: true, name: true, brand: true, license_plate: true },
        });
        return {
          id: vehicle?.id,
          name: vehicle?.name,
          brand: vehicle?.brand,
          licensePlate: vehicle?.license_plate,
          bookingCount: group._count.vehicle_id,
        };
      })
    );

    // 10. Top Customers (highest spend)
    const topCustomerGroups = await prisma.bookings.groupBy({
      by: ['customer_id'],
      _count: { customer_id: true },
      _sum: { total_amount: true },
      orderBy: {
        _sum: { total_amount: 'desc' },
      },
      take: 5,
    });

    const topCustomers = await Promise.all(
      topCustomerGroups.map(async (group) => {
        const user = await prisma.users.findUnique({
          where: { id: group.customer_id },
          select: { id: true, full_name: true, email: true, phone: true },
        });
        return {
          id: user?.id,
          fullName: user?.full_name,
          email: user?.email,
          phone: user?.phone,
          bookingCount: group._count.customer_id,
          totalSpent: Number(group._sum.total_amount || 0),
        };
      })
    );

    // 11. Booking status distribution for chart
    const bookingStatusGroups = await prisma.bookings.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const bookingChart = bookingStatusGroups.map((g) => ({
      status: g.status,
      count: g._count.status,
    }));

    return {
      vehicles: {
        total: totalVehicles,
        rented: rentedVehicles,
        maintenance: maintenanceVehicles,
        available: availableVehicles,
        availableRate,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        activeRentals,
        chart: bookingChart,
      },
      customers: {
        total: totalCustomers,
      },
      revenue: {
        total: totalRevenue,
        today: todayRevenue,
        monthly: monthlyRevenue,
        types: categoryStats,
        fleetStatus: [
          { name: 'Có sẵn', value: availableVehicles, color: '#52c41a' },
          { name: 'Đang thuê', value: rentedVehicles, color: '#1677ff' },
          { name: 'Bảo dưỡng', value: maintenanceVehicles, color: '#faad14' },
        ],
      },
      topVehicles,
      topCustomers,
      recentBookings,
    };
  }
}
