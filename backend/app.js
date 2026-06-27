import "dotenv/config";
import express from 'express';

import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import { prisma } from "./lib/prisma.js";

const app = express();

// Cors configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://smarterp-one.vercel.app"
    ],
    credentials: true, // This allows the cookies to be sent back and forth
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie']
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
app.use('/', authRoutes);
app.use('/', companyRoutes);
app.use('/', ledgerRoutes);
app.use('/', stockRoutes);
app.use('/', purchaseRoutes);
app.use('/', salesRoutes);
app.use('/', dashboardRoutes);
app.use('/', reportRoutes);


const PORT = process.env.PORT || 8080;

// Explicitly bind to 0.0.0.0 so Railway's proxy can route traffic to it
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});