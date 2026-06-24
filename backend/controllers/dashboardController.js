import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";



export const getDashboardMetrics = async (req, res) => {
    const companyId = parseInt(req.params.companyId);

    try {
        // all the metric for the dashboard
        const [totalCustomers, totalSuppliers, totalProducts, purchaseAggregate, salesAggregate, lowStockItems] = await Promise.all([
            // Count total customers
            prisma.ledger.count({
                where: { companyId: companyId, type: 'CUSTOMER' },
            }),

            // Count total suppliers
            prisma.ledger.count({
                where: { companyId: companyId, type: 'SUPPLIER' },
            }),

            // Count total products
            prisma.stockItem.count({
                where: { companyId },
            }),

            // Total purchase amount
            prisma.purchaseVoucher.aggregate({
                where: { companyId },
                _sum: { total: true },
            }),

            // Total sales amount
            prisma.salesVoucher.aggregate({
                where: { companyId },
                _sum: { total: true },
            }),

            // Low stock items
            prisma.stockItem.findMany({
                where: {
                    companyId,
                    quantity: {
                        lt: 10, // Assuming low stock is defined as less than 10 units
                    }
                },
                select: { id: true, name: true, quantity: true }
            })
        ]);
        
        res.status(200).json({
            metrics: {
                totalCustomers,
                totalSuppliers,
                totalProducts,
                totalPurchaseAmount: purchaseAggregate._sum.total || 0,
                totalSalesAmount: salesAggregate._sum.total || 0,
                lowStockItems: lowStockItems.length,
                lowStockItems
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
