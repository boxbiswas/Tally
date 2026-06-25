import { prisma } from "../lib/prisma.js";

export const getReportsData = async (req, res) => {
    const companyId = parseInt(req.params.companyId);

    if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid Company ID" });
    }

    try {
        const [customers, suppliers, stockItems, salesVouchers, purchaseVouchers] = await Promise.all([
            // 1. Customer Outstanding
            prisma.ledger.findMany({
                where: { companyId, type: 'CUSTOMER' },
                select: { id: true, name: true, mobile: true, balance: true },
                orderBy: { name: 'asc' }
            }),
            // 2. Supplier Outstanding
            prisma.ledger.findMany({
                where: { companyId, type: 'SUPPLIER' },
                select: { id: true, name: true, mobile: true, balance: true },
                orderBy: { name: 'asc' }
            }),
            // 3. Stock Summary (Value is calculated as Quantity * Purchase Rate)
            prisma.stockItem.findMany({
                where: { companyId },
                select: { id: true, name: true, quantity: true, purchasePrice: true, unit: true },
                orderBy: { name: 'asc' }
            }),
            // 4. Sales Register
            prisma.salesVoucher.findMany({
                where: { companyId },
                include: { customer: { select: { name: true } } },
                orderBy: { date: 'desc' }
            }),
            // 5. Purchase Register
            prisma.purchaseVoucher.findMany({
                where: { companyId },
                include: { supplier: { select: { name: true } } },
                orderBy: { date: 'desc' }
            })
        ]);

        res.status(200).json({
            customers,
            suppliers,
            stockItems: stockItems.map(item => ({
                ...item,
                stockValue: item.quantity * item.purchasePrice // Calculate stock valuation
            })),
            salesVouchers,
            purchaseVouchers
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error while loading reports' });
    }
};