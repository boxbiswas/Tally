import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";



export const createPurchase = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const userEmail = req.user.email;
    const { voucherNo, date, supplierId, items } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Create the purchase record
            const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.rate) * parseFloat(item.quantity)), 0);

            const voucher = await tx.purchaseVoucher.create({
                data: {
                    voucherNo,
                    date: date ? new Date(date) : new Date(),
                    total: totalAmount,
                    supplierId,
                    companyId,
                    items: {
                        create: items.map(item => ({
                            qty: parseFloat(item.quantity),
                            rate: parseFloat(item.rate),
                            amount: parseFloat(item.quantity) * parseFloat(item.rate),
                            stockItemId: parseInt(item.stockItemId)
                        })),
                    },
                },
            });

            // Update stock quantities
            for (const item of items) {
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
        res.status(500).json({ message: 'Internal server error' });
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