// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../model/user";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, private: isPrivate, model, admin } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            private: isPrivate || true, // Default to true if not provided
            model: model || "gpt-4",    // Default to "gpt-4" if not provided
            admin: admin || false,      // Default to false if not provided
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.get("id"),
                email: newUser.get("email")
            },
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }

    next();
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.get("password") as string);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Generate a token (e.g., JWT)
      const token = jwt.sign({ id: user.get("id") }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.get("id"),
          email: user.get("email")
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return;
    }
  
    next();
};