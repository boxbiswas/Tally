import { prisma } from "../lib/prisma.js";

// Note: To fully resolve the reporting performance issue as suggested, 
// the frontend must be updated to call these individual endpoints rather 
// than getReportsData(). I have provided the split endpoints below.

export const getCustomersOutstanding = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) return res.status(400).json({ message: "Invalid Company ID" });

    try {
        const customers = await prisma.ledger.findMany({
            where: { companyId, type: 'CUSTOMER' },
            select: { id: true, name: true, mobile: true, balance: true },
            orderBy: { name: 'asc' }
        });
        res.status(200).json({ customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSuppliersOutstanding = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) return res.status(400).json({ message: "Invalid Company ID" });

    try {
        const suppliers = await prisma.ledger.findMany({
            where: { companyId, type: 'SUPPLIER' },
            select: { id: true, name: true, mobile: true, balance: true },
            orderBy: { name: 'asc' }
        });
        res.status(200).json({ suppliers });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getStockSummary = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) return res.status(400).json({ message: "Invalid Company ID" });

    try {
        const stockItems = await prisma.stockItem.findMany({
            where: { companyId },
            select: { id: true, name: true, quantity: true, purchasePrice: true, unit: true },
            orderBy: { name: 'asc' }
        });
        
        const calculatedStock = stockItems.map(item => ({
            ...item,
            stockValue: item.quantity * item.purchasePrice 
        }));

        res.status(200).json({ stockItems: calculatedStock });
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSalesRegister = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) return res.status(400).json({ message: "Invalid Company ID" });

    try {
        const salesVouchers = await prisma.salesVoucher.findMany({
            where: { companyId },
            include: { customer: { select: { name: true } } },
            orderBy: { date: 'desc' }
        });
        res.status(200).json({ salesVouchers });
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPurchaseRegister = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) return res.status(400).json({ message: "Invalid Company ID" });

    try {
        const purchaseVouchers = await prisma.purchaseVoucher.findMany({
            where: { companyId },
            include: { supplier: { select: { name: true } } },
            orderBy: { date: 'desc' }
        });
        res.status(200).json({ purchaseVouchers });
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};