import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";


export const createCompany = async (req, res) => {
    const { name, gstNo, financialYear } = req.body;
    const userEmail = req.user.email;   // req.user was attached by the isLoggedIn middleware

    try {
        const currentUser = await prisma.user.findUnique({
            where: { email: userEmail },
            include: { companies: true } // Including companies to count them
        });

        if (!currentUser) {
            return res.status(404).send({ message: "User not found." });
        }

        // 1 User -> Only 5 Companies
        if (currentUser.companies.length >= 5) {
            return res.status(403).send({
                message: "You have reached the maximum limit of 5 companies per user."
            });
        }

        const cleanGstNo = (gstNo && gstNo.trim() !== "") ? gstNo : null;
        let newCompany = await prisma.company.create({
            data: {
                name,
                gstNo: cleanGstNo,
                financialYear,
                user: { 
                    connect: { id: currentUser.id } 
                }
            }
        });
        res.status(201).send({ message: "Company created successfully", company: newCompany });

    } catch (err) {
        console.error("CREATE COMPANY ERROR:", err);
        if (err.code === 'P2002') {
            return res.status(400).send({ message: "A company with this GST number already exists." });
        }
        res.status(500).send({ message: "Something went wrong while creating the company." });
    }
}


export const getCompanies = async (req, res) => {
    // req.user is attached by the isLoggedIn middleware
    const userEmail = req.user.email;
    try {
        // Find the user by email and include their companies
        const userCompanies = await prisma.company.findMany({
            where: {
                user: {
                    email: userEmail
                }
            },
            orderBy: {
                createdAt: 'desc' // Sorts them so the newest company is at the top!
            }
        });
        res.status(200).send({ companies: userCompanies, message: "Companies fetched successfully" });
    } catch (err) {
        console.error("GET COMPANIES ERROR:", err);
        res.status(500).send({ message: "Something went wrong while fetching the companies." });
    }
}


export const getCompanyById = async (req, res) => {
    // req.user is attached by the isLoggedIn middleware
    const userEmail = req.user.email;
    const companyId = parseInt(req.params.id); // Extract the ID from the URL parameters and convert it to a Number
    if (isNaN(companyId)) {
        return res.status(400).send({ message: "Invalid company ID." });
    }

    try {
        // Find the company by ID and ensure it belongs to the logged-in user
        const company = await prisma.company.findFirst({
            where: {
                id: companyId,
                user: {
                    email: userEmail
                }
            }
        });

        // If no company is found, it either doesn't exist or doesn't belong to the user
        if (!company) {
            return res.status(404).send({ message: "Company not found or you do not have access to it." });
        }
        res.status(200).send({ company, message: "Company fetched successfully" });
    } catch (err) {
        console.error("GET COMPANY BY ID ERROR:", err);
        res.status(500).send({ message: "Something went wrong while fetching the company." });
    }
}


export const deleteCompany = async (req, res) => {
    const userEmail = req.user.email;
    const companyId = parseInt(req.params.id); // Extract the ID from the URL parameters and convert it to a Number
    if (isNaN(companyId)) {
        return res.status(400).send({ message: "Invalid company ID." });
    }

    try {
        // Find the company by ID and ensure it belongs to the logged-in user
        const company = await prisma.company.findFirst({
            where: {
                id: companyId,
                user: {
                    email: userEmail
                }
            }
        });
        if (!company) {
            return res.status(404).send({ message: "Company not found or you do not have access to it." });
        }

        await prisma.company.delete({
            where: { id: companyId }
        });
        res.status(200).send({ message: "Company deleted successfully" });
    } catch (err) {
        console.error("DELETE COMPANY ERROR:", err);
        res.status(500).send({ message: "Something went wrong while deleting the company." });
    }
}


export const updateCompany = async (req, res) => {
    const userEmail = req.user.email;
    const companyId = parseInt(req.params.id); // Extract the ID from the URL parameters and convert it to a Number
    const { name, gstNo, financialYear } = req.body;

    if (isNaN(companyId)) {
        return res.status(400).send({ message: "Invalid company ID." });
    }

    try {
        // Find the company by ID and ensure it belongs to the logged-in user
        const company = await prisma.company.findFirst({
            where: {
                id: companyId,
                user: {
                    email: userEmail
                }
            }
        });
        if (!company) {
            return res.status(404).send({ message: "Company not found or you do not have access to it." });
        }

        // Start by assuming we will keep the old gstNo
        let finalGstNo = company.gstNo;

        // If the user actually typed "gstNo" in Postman, then we update it
        if (gstNo !== undefined) {
            finalGstNo = (gstNo && gstNo.trim() !== "") ? gstNo : null;
        }

        // Update the company details
        let updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: {
                name: name || company.name,
                gstNo: finalGstNo,
                financialYear: financialYear || company.financialYear
            }
        });
        res.status(200).send({ message: "Company updated successfully", company: updatedCompany });
    } catch (err) {
        console.error("UPDATE COMPANY ERROR:", err);
        res.status(500).send({ message: "Something went wrong while updating the company." });
    }
}