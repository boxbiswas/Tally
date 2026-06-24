import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";


export const createItem = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const { name, sku, unit, purchasePrice, sellingPrice, openingQty, openingValue, gstRate } = req.body;
    const userEmail = req.user.email; // Assuming you have user information in the request object

    if (isNaN(companyId)) {
        return res.status(400).json({ message: 'Invalid company ID' });
    }
    if (!name || !sku) {
        return res.status(400).json({ message: 'name and sku are required' });
    }

    try {
        // Check if the company exists and belongs to the logged-in user
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } }, // Ensure the company belongs to the logged-in user
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Create the item
        let item = await prisma.stockItem.create({
            data: {
                name,
                sku,
                unit: unit || "PCS",
                purchasePrice: purchasePrice || 0.0,
                sellingPrice: sellingPrice || 0.0,
                openingQty: openingQty || 0.0,
                openingValue: openingValue || 0.0,
                quantity: openingQty || 0.0, // Current stock starts at opening quantity
                gstRate: gstRate || 0.0,
                companyId: companyId
            }
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getItems = async (req, res) => {
    const userEmail = req.user.email; // Assuming you have user information in the request object
    const companyId = parseInt(req.params.companyId);
    const { search } = req.query;

    if (isNaN(companyId)) {
        return res.status(400).json({ message: 'Invalid company ID' });
    }

    try {
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } }, // Ensure the company belongs to the logged-in user
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const whereClause = { companyId: companyId };
        // Add search functionality if a search query is provided
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
            ];
        }

        const items = await prisma.stockItem.findMany({
            where: whereClause,
            orderBy: { name: 'asc' } // Optional: Order items by name
        });
        res.status(200).send({ message: 'Items fetched successfully', items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getItemById = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const itemId = parseInt(req.params.id);
    const userEmail = req.user.email; // Assuming you have user information in the request object

    if (isNaN(companyId) || isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid company ID or item ID' });
    }

    try {
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } }, // Ensure the company belongs to the logged-in user
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found or does not belong to the user' });
        }

        const item = await prisma.stockItem.findFirst({
            where: { id: itemId, companyId: companyId },
        });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).send({ message: 'Item fetched successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



export const deleteItem = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const itemId = parseInt(req.params.id);
    const userEmail = req.user.email; // Assuming you have user information in the request object

    if (isNaN(companyId) || isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid company ID or item ID' });
    }

    try {
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } }, // Ensure the company belongs to the logged-in user
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found or does not belong to the user' });
        }

        const existingItem = await prisma.stockItem.findFirst({
            where: { id: itemId, companyId: companyId },
        });

        if (!existingItem) {
            return res.status(404).json({ message: 'Item not found or does not belong to the specified company' });
        }

        await prisma.stockItem.delete({
            where: { id: itemId },
        });
        res.status(200).send({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



export const updateItem = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const itemId = parseInt(req.params.id);
    const { name, sku, unit, purchasePrice, sellingPrice, openingQty, openingValue, gstRate } = req.body;
    const userEmail = req.user.email; // Assuming you have user information in the request object

    if (isNaN(companyId) || isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid company ID or item ID' });
    }

    try {
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } }, // Ensure the company belongs to the logged-in user
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found or does not belong to the user' });
        }

        const existingItem = await prisma.stockItem.findFirst({
            where: { id: itemId, companyId: companyId },
        });
        if (!existingItem) {
            return res.status(404).json({ message: 'Item not found or does not belong to the specified company' });
        }

        let updatedItem = await prisma.stockItem.update({
            where: { id: itemId },
            data: {
                name: name !== undefined ? name : existingItem.name,
                sku: sku !== undefined ? sku : existingItem.sku,
                unit: unit !== undefined ? unit : existingItem.unit,
                purchasePrice: purchasePrice !== undefined ? purchasePrice : existingItem.purchasePrice,
                sellingPrice: sellingPrice !== undefined ? sellingPrice : existingItem.sellingPrice,
                openingQty: openingQty !== undefined ? openingQty : existingItem.openingQty,
                openingValue: openingValue !== undefined ? openingValue : existingItem.openingValue,
                gstRate: gstRate !== undefined ? gstRate : existingItem.gstRate,
            },
        });
        res.status(200).json({ message: 'Item updated successfully', data: updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}