import { prisma } from '../config/db';

export class DashboardService {
    static getDashboardSummary = async () => {
        const [
            totalSales,
            salesByMonth,
            salesByDay,
            salesByYear,
            totalPurchases,
            purchasesByMonth,
            purchasesByDay,
            purchasesByYear,
            lastSale,
            lastPurchase,
        ] = await Promise.all([
            DashboardService.getTotal('Sales'),
            DashboardService.getByMonth('Sales'),
            DashboardService.getByDay('Sales'),
            DashboardService.getByYear('Sales'),
            DashboardService.getTotal('Purchases'),
            DashboardService.getByMonth('Purchases'),
            DashboardService.getByDay('Purchases'),
            DashboardService.getByYear('Purchases'),
            DashboardService.getLastTransaction('Sales'),
            DashboardService.getLastTransaction('Purchases'),
        ]);

        return {
            sales: {
                total: totalSales[0]?.total || 0,
                byMonth: salesByMonth,
                byDay: salesByDay,
                byYear: salesByYear,
                lastTransaction: lastSale[0] || null,
            },
            purchases: {
                total: totalPurchases[0]?.total || 0,
                byMonth: purchasesByMonth,
                byDay: purchasesByDay,
                byYear: purchasesByYear,
                lastTransaction: lastPurchase[0] || null,
            },
        };
    };

    private static getTotal = (table: string) => {
        const query = `SELECT SUM(total) AS total FROM "${table}"`;
        return prisma.$queryRawUnsafe<{ total: number }[]>(query);
    };

    private static getByMonth = (table: string) => {
        const query = `
            SELECT DATE_TRUNC('month', "date") AS month, SUM(total) AS total 
            FROM "${table}" 
            GROUP BY month 
            ORDER BY month
        `;
        return prisma.$queryRawUnsafe<{ month: Date; total: number }[]>(query);
    };

    private static getByYear = (table: string) => {
        const query = `
            SELECT DATE_TRUNC('year', "date") AS year, SUM(total) AS total 
            FROM "${table}" 
            GROUP BY year 
            ORDER BY year
        `;
        return prisma.$queryRawUnsafe<{ year: Date; total: number }[]>(query);
    };

    private static getByDay = (table: string) => {
        const query = `
            WITH days AS (
                SELECT day::date
                FROM generate_series(
                    DATE_TRUNC('month', CURRENT_DATE),
                    (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
                    '1 day'
                ) AS day
            ),
            per_day AS (
                SELECT DATE_TRUNC('day', "date")::date AS day, SUM(total) AS total
                FROM "${table}"
                WHERE "date" >= DATE_TRUNC('month', CURRENT_DATE)
                  AND "date" < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
                GROUP BY day
            )
            SELECT days.day, COALESCE(per_day.total, 0) AS total
            FROM days
            LEFT JOIN per_day ON days.day = per_day.day
            ORDER BY days.day
        `;
        return prisma.$queryRawUnsafe<{ day: Date; total: number }[]>(query);
    };

    private static getLastTransaction = (table: string) => {
        const query = `
            SELECT id, "date", "invoiceNumber", total 
            FROM "${table}" 
            ORDER BY "date" DESC 
            LIMIT 1
        `;
        return prisma.$queryRawUnsafe<
            { id: number; date: Date; total: number }[]
        >(query);
    };
}
