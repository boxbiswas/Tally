import "dotenv/config";
import { prisma } from "../lib/prisma.js";

export const getDashboardMetrics = async (req, res) => {
    const companyId = parseInt(req.params.companyId);

    if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid Company ID" });
    }

    try {
        // 1. Fetch all aggregates AND raw voucher data concurrently
        const [
            totalCustomers,
            totalSuppliers,
            totalProducts,
            purchaseAggregate,
            salesAggregate,
            lowStockItems,
            allSales,
            allPurchases
        ] = await Promise.all([
            prisma.ledger.count({ where: { companyId: companyId, type: 'CUSTOMER' } }),
            prisma.ledger.count({ where: { companyId: companyId, type: 'SUPPLIER' } }),
            prisma.stockItem.count({ where: { companyId } }),
            prisma.purchaseVoucher.aggregate({ where: { companyId }, _sum: { total: true } }),
            prisma.salesVoucher.aggregate({ where: { companyId }, _sum: { total: true } }),
            prisma.stockItem.findMany({
                where: { companyId, quantity: { lt: 10 } },
                select: { id: true, name: true, quantity: true }
            }),
            // Fetch dates and totals for the monthly charts
            prisma.salesVoucher.findMany({ where: { companyId }, select: { date: true, total: true } }),
            prisma.purchaseVoucher.findMany({ where: { companyId }, select: { date: true, total: true } })
        ]);

        // 2. --- DYNAMIC MONTHLY AGGREGATION (Last 6 Months) ---
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyDataMap = {};
        const today = new Date();

        // Initialize the last 6 months with 0 so the chart always looks clean
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
            monthlyDataMap[monthKey] = {
                month: monthNames[d.getMonth()],
                sales: 0,
                purchase: 0,
                sortKey: d.getTime()
            };
        }

        // Add real Sales to their respective months
        allSales.forEach(sale => {
            const d = new Date(sale.date);
            const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
            if (monthlyDataMap[monthKey]) monthlyDataMap[monthKey].sales += sale.total;
        });

        // Add real Purchases to their respective months
        allPurchases.forEach(purchase => {
            const d = new Date(purchase.date);
            const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
            if (monthlyDataMap[monthKey]) monthlyDataMap[monthKey].purchase += purchase.total;
        });

        // Convert the map back to an array sorted by date
        const monthlyData = Object.values(monthlyDataMap).sort((a, b) => a.sortKey - b.sortKey).map(item => ({
            month: item.month,
            sales: item.sales,
            purchase: item.purchase
        }));

        // 3. Send everything to the React Frontend
        res.status(200).json({
            metrics: {
                totalCustomers,
                totalSuppliers,
                totalProducts,
                totalPurchaseAmount: purchaseAggregate._sum.total || 0,
                totalSalesAmount: salesAggregate._sum.total || 0,
                lowStockItems, // Sends the array of low stock items
                monthlyData // Sends the dynamic chart data!
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ message: 'Internal server error while loading Dashboard' });
    }
};