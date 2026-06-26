import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";

export const createLedger = async (req, res) => {
    const { name, type, address, mobile, gstNo, openingBalance } = req.body;
    const companyId = parseInt(req.params.companyId);
    const userEmail = req.user.email; // Get the email of the logged-in user from the request

    if (isNaN(companyId)) {
        return res.status(400).json({ error: 'Invalid company ID' });
    }

    try {
        // Check if the company exists and belongs to the logged-in user
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } },
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found or does not belong to the user' });
        }

        let ledger = await prisma.ledger.create({
            data: {
                name,
                type,  // Ensure this is Customer or Supplier
                address,
                mobile,
                gstNo,
                openingBalance: openingBalance || 0,
                balance: openingBalance || 0,
                companyId: companyId,
            },
        });

        res.status(201).send({ message: 'Ledger created successfully', ledger });
    } catch (error) {
        console.error('Error creating ledger:', error);
        if (error.code === 'P2002') {
            return res.status(400).send({ error: 'A ledger with this name already exists in this company' });
        }
        res.status(500).send({ error: 'An error occurred while creating the ledger' });
    }
};


export const getLedgers = async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const userEmail = req.user.email; // Get the email of the logged-in user from the request

    // Extract the search query parameter if it exists
    const { search } = req.query;

    if (isNaN(companyId)) {
        return res.status(400).json({ error: 'Invalid company ID' });
    }

    try {
        // Check if the company exists and belongs to the logged-in user
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } },
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found or does not belong to the user' });
        }

        // Build the where clause for the search functionality
        const whereClause = { companyId: companyId };

        //if search query is provided, add it to the where clause
        if (search) {
            whereClause.name = {
                contains: search,
            };
        }

        // Fetch ledgers for the company
        const ledgers = await prisma.ledger.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },      // Order by creation date descending
        });

        res.status(200).send({ message: 'Ledgers fetched successfully', ledgers });
    } catch (error) {
        console.error('Error fetching ledgers:', error);
        res.status(500).send({ error: 'An error occurred while fetching the ledgers' });
    }
};


export const getLedgerById = async (req, res) => {
    const userEmail = req.user.email; // Get the email of the logged-in user from the request
    const companyId = parseInt(req.params.companyId);
    const ledgerId = parseInt(req.params.id);

    if (isNaN(ledgerId) || isNaN(companyId)) {
        return res.status(400).json({ error: 'Invalid ledger ID or company ID' });
    }

    try {
        // 1. Verify that the company exists and belongs to the user
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } },
        });
        if (!company) {
            return res.status(404).json({ error: 'Company not found or does not belong to the user' });
        }

        // 2. Fetch the ledger by ID and ensure it belongs to the specified company
        const ledger = await prisma.ledger.findFirst({
            where: { id: ledgerId, companyId: companyId },
        });
        if (!ledger) {
            return res.status(404).json({ error: 'Ledger not found or does not belong to the specified company' });
        }

        res.status(200).send({ message: 'Ledger fetched successfully', ledger });
    } catch (error) {
        console.error('Error fetching ledger:', error);
        res.status(500).send({ error: 'An error occurred while fetching the ledger' });
    }
};


export const updateLedger = async (req, res) => {
    const userEmail = req.user.email; // Get the email of the logged-in user from the request
    const companyId = parseInt(req.params.companyId);
    const ledgerId = parseInt(req.params.id);
    const { name, type, address, mobile, gstNo, openingBalance } = req.body;

    if (isNaN(ledgerId) || isNaN(companyId)) {
        return res.status(400).json({ error: 'Invalid ledger ID or company ID' });
    }

    try {
        // 1. Verify that the company exists and belongs to the user
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } },
        });
        if (!company) {
            return res.status(404).json({ error: 'Company not found or does not belong to the user' });
        }

        // 2. Fetch the ledger by ID and ensure it belongs to the specified company
        const existingledger = await prisma.ledger.findFirst({
            where: { id: ledgerId, companyId: companyId },
        });
        if (!existingledger) {
            return res.status(404).json({ error: 'Ledger not found or does not belong to the specified company' });
        }

        // Calculate how much the opening balance changed
        const balanceDifference = openingBalance !== undefined ? (Number(openingBalance) - existingledger.openingBalance) : 0;

        let updatedLedger = await prisma.ledger.update({
            where: { id: ledgerId },
            data: {
                name: name !== undefined ? name : existingledger.name,
                type: type !== undefined ? type : existingledger.type,
                address: address !== undefined ? address : existingledger.address,
                mobile: mobile !== undefined ? mobile : existingledger.mobile,
                gstNo: gstNo !== undefined ? gstNo : existingledger.gstNo,
                openingBalance: openingBalance !== undefined ? Number(openingBalance) : existingledger.openingBalance,
                // Update the balance based on the change in opening balance
                balance: existingledger.balance + balanceDifference,
            },
        });

        res.status(200).send({ message: 'Ledger updated successfully', ledger: updatedLedger });
    } catch (error) {
        console.error('Error updating ledger:', error);
        if (error.code === 'P2002') {
            return res.status(400).send({ error: 'A ledger with this name already exists in this company' });
        }
        res.status(500).send({ error: 'An error occurred while updating the ledger' });
    }
};


export const deleteLedger = async (req, res) => {
    const userEmail = req.user.email;
    const companyId = parseInt(req.params.companyId);
    const ledgerId = parseInt(req.params.id);

    if (isNaN(ledgerId) || isNaN(companyId)) {
        return res.status(400).json({ error: 'Invalid ledger ID or company ID' });
    }

    try {
        // 1. Verify that the company exists and belongs to the user
        const company = await prisma.company.findFirst({
            where: { id: companyId, user: { email: userEmail } },
        });
        if (!company) {
            return res.status(404).json({ error: 'Company not found or does not belong to the user' });
        }

        // 2. Fetch the ledger by ID and ensure it belongs to the specified company
        const existingLedger = await prisma.ledger.findFirst({
            where: { id: ledgerId, companyId: companyId },
        });
        if (!existingLedger) {
            return res.status(404).json({ error: 'Ledger not found or does not belong to the specified company' });
        }

        // 3. Delete the ledger
        await prisma.ledger.delete({
            where: { id: ledgerId },
        });

        res.status(200).send({ message: 'Ledger deleted successfully' });
    } catch (error) {
        console.error('Error deleting ledger:', error);
        res.status(500).send({ error: 'An error occurred while deleting the ledger' });
    }
};
