import request from  'supertest';
import app from '../index';  // Adjust the path based on your  project structure
import User from '../model/user';
import { sendVerificationEmail } from '../service/emailService';
import bcrypt from 'bcrypt';

jest.mock('../service/emailService'); // Mock the email service

describe('Email Verification Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a user and send a verification email', async () => {
        const mockUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            private: true,
            model: 'gpt-4',
            admin: false
        };

        const response = await request(app).post('/register').send(mockUser);

        console.log(response.body); // Log the response body for debugging

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Registration successful! A verification email has been sent to your email address.');
        expect(sendVerificationEmail).toHaveBeenCalledWith(
            mockUser.email,
            mockUser.username,
            expect.any(String) // Verification code
        );
    });
});