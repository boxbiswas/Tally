import "dotenv/config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from "../lib/prisma.js";



// Authentication routes
export const registerUser = (req, res) => {
    let { name, email, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).send('Something went wrong generating salt');
        }
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                return res.status(500).send('Something went wrong hashing password');
            }
            try {
                let createUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hash
                    }
                });
                let token = jwt.sign({ email }, process.env.JWT_SECRET);
                res.cookie('token', token);
                res.send({ message: 'User registered successfully', token });
            } catch (err) {
                console.error("REGISTER ERROR:", err);
                res.status(400).send({ message: 'Something went wrong' });
            }
        });
    });
};


export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
    // res.status(200).send({ message: 'Logged out successfully' });
};


export const loginUser = async (req, res) => {
    try {
        let user = await prisma.user.findUnique({ where: { email: req.body.email } });

        if (!user) {
            return res.status(400).send({ message: 'Something went wrong' });
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                res.cookie('token', token);
                res.send({ message: 'Login successful', token });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        })
    } catch (err) {
        res.status(400).send({ message: 'Something went wrong' });
    }
};
