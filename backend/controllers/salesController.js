import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";



export const createSales = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const { voucherNo, date, customerId, items } = req.body;

    try {
        const parsedCustomerId = parseInt(customerId);
        const parsedItems = Array.isArray(items)
            ? items.map(item => ({
                stockItemId: parseInt(item.stockItemId),
                quantity: Number(item.quantity),
                rate: Number(item.rate),
                amount: Number(item.amount),
            }))
            : [];

        if (isNaN(companyId) || isNaN(parsedCustomerId) || parsedItems.length === 0 || parsedItems.some(item => isNaN(item.stockItemId) || item.quantity <= 0 || isNaN(item.rate))) {
            return res.status(400).json({ message: 'Invalid sales voucher data' });
        }

        // Insufficient stock check
        const itemIds = parsedItems.map(item => item.stockItemId);

        // Fetch stock items from the database
        const currentStock = await prisma.stockItem.findMany({
            where: { id: { in: itemIds }, companyId },
        });

        const stockMap = new Map(currentStock.map(item => [item.id, item.quantity]));

        for (const item of parsedItems) {
            const availableQty = stockMap.get(item.stockItemId) || 0;
            if (item.quantity > availableQty) {
                return res.status(400).json({ message: `Insufficient stock for item ID ${item.stockItemId}. Available: ${availableQty}, Requested: ${item.quantity}` });
            }
        }

        // Start a transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Create the purchase record
            const totalAmount = parsedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);

            const voucher = await tx.salesVoucher.create({
                data: {
                    voucherNo,
                    date: date ? new Date(date) : new Date(),
                    total: totalAmount,
                    customerId: parsedCustomerId,
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

            // Decrease stock quantities and create inventory transactions
            for (const item of parsedItems) {
                await tx.stockItem.update({
                    where: { id: item.stockItemId },
                    data: { quantity: { decrement: item.quantity } },
                });

                await tx.inventoryTransaction.create({
                    data: {
                        type: 'OUT',
                        quantity: item.quantity,
                        stockItemId: item.stockItemId,
                        referenceType: 'SALE',
                        referenceId: voucher.id,
                    }
                });
            }
            return voucher;
        });

        res.status(201).json({ message: 'Sale created successfully', voucher: result });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getSales = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    try {
        const sales = await prisma.salesVoucher.findMany({
            where: { companyId },
            include: { items: { include: { stockItem: true } }, customer: true },
            orderBy: { date: 'desc' },
        });
        res.status(200).json({ sales });
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getSalesById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const sale = await prisma.salesVoucher.findUnique({
            where: { id },
            include: { items: { include: { stockItem: true } }, customer: true },
        });

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json({ sale });
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
