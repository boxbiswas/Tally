import "dotenv/config";
import express from 'express';

import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import cors from 'cors';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import salesRoutes from './routes/salesRoutes.js';

import { prisma } from "./lib/prisma.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Import routes
app.use('/', authRoutes);
app.use('/', companyRoutes);
app.use('/', ledgerRoutes);
app.use('/', stockRoutes);
app.use('/', purchaseRoutes);
app.use('/', salesRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});