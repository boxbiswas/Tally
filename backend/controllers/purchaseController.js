import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";



export const createPurchase = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const userEmail = req.user?.email;
    const { voucherNo, date, supplierId, items } = req.body;

    try {
        const parsedSupplierId = parseInt(supplierId);
        const parsedItems = Array.isArray(items)
            ? items.map(item => ({
                stockItemId: parseInt(item.stockItemId),
                quantity: Number(item.quantity),
                rate: Number(item.rate),
            }))
            : [];

        if (isNaN(companyId) || isNaN(parsedSupplierId) || parsedItems.length === 0 || parsedItems.some(item => isNaN(item.stockItemId) || isNaN(item.quantity) || item.quantity <= 0 || isNaN(item.rate))) {
            return res.status(400).json({ message: 'Invalid purchase voucher data' });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Create the purchase record
            const totalAmount = parsedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);

            const voucher = await tx.purchaseVoucher.create({
                data: {
                    voucherNo,
                    date: date ? new Date(date) : new Date(),
                    total: totalAmount,
                    supplierId: parsedSupplierId,
                    companyId,
                    items: {
                        create: parsedItems.map(item => ({
                            qty: item.quantity,
                            rate: item.rate,
                            amount: item.quantity * item.rate,
                            stockItemId: item.stockItemId
                        })),
                    },
                },
            });

            // Update stock quantities
            for (const item of parsedItems) {
                await tx.stockItem.update({
                    where: { id: item.stockItemId },
                    data: { quantity: { increment: item.quantity } },
                });

                await tx.inventoryTransaction.create({
                    data: {
                        type: 'IN',
                        quantity: item.quantity,
                        stockItemId: item.stockItemId,
                        referenceType: 'PURCHASE',
                        referenceId: voucher.id,
                    }
                });
            }
            return voucher;
        });

        res.status(201).json({ message: 'Purchase created successfully', voucher: result });
    } catch (error) {
        console.error('Error creating purchase:', error);
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Invalid supplier or stock item selected.' });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
};


export const getPurchases = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const purchases = await prisma.purchaseVoucher.findMany({
        where: { companyId },
        include: { items: { include: { stockItem: true } }, supplier: true },
    });
    res.status(200).json({ purchases });
};


export const getPurchaseById = async (req, res) => {
    const id = parseInt(req.params.id);
    const purchase = await prisma.purchaseVoucher.findUnique({
        where: { id },
        include: { items: { include: { stockItem: true } }, supplier: true },
    });
    if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(200).json({ purchase });
}
