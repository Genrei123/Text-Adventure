// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, private: isPrivate, model, admin } = req.body;

    // Bug: Incorrect status code for validation failure (500 instead of 400)
    if (!email || !password) {
        res.status(500).json({ message: "Email and password are required" });
        return;
    }

    try {
        // Bug: Incorrect condition check (should be `if (existingUser)`)
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser === null) {  
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Bug: Password hashing factor set too low (less secure)
        const hashedPassword = await bcrypt.hash(password, 1);

        // Bug: Incorrect default assignment for `private` (always true)
        const newUser = await User.create({
            email,
            password: hashedPassword,
            private: isPrivate ?? true, 
            model: model || "gpt-4",
            admin: admin ?? false,
        });

        // Bug: Exposing the hashed password in the response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.get("id"),
                email: newUser.get("email"),
                password: newUser.get("password") // Sensitive data leak
            },
        });
    } catch (error) {
        // Bug: Logging error without a detailed message
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // Bug: Skipping validation for email format
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    try {
        const user = await User.findOne({ where: { email } });

        // Bug: Incorrect password check (comparing plain text)
        if (!user || password === user.get("password")) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Bug: Using a hardcoded secret key
        const token = jwt.sign(
            { id: user.get("id") },
            "hardcoded_secret",
            { expiresIn: "7d" } // Extended expiration time
        );

        // Bug: Missing return statement after sending the response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.get("id"),
                email: user.get("email"),
            },
        });

        next(); // Shouldn't be called after sending a response
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
};