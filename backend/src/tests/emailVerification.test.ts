import request from 'supertest';
import app from '../index';  // Adjust the path based on your project structure
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

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Registration successful! A verification email has been sent to your email address.');
        expect(sendVerificationEmail).toHaveBeenCalledWith(
            mockUser.email,
            mockUser.username,
            expect.any(String) // Verification code
        );

        // Extract the verification code from the mock call
        const verificationCode = (sendVerificationEmail as jest.Mock).mock.calls[0][2];

        // Verify the user using the verification code
        const verifyResponse = await request(app).get(`/api/verify-email/${verificationCode}`);

        expect(verifyResponse.status).toBe(200);
        expect(verifyResponse.body.message).toBe('Email verified successfully!');

        // Check if the user is marked as verified in the database
        const user = await User.findOne({ where: { email: mockUser.email } });
        expect(user).not.toBeNull();
        expect(user?.verificationCode).toBeUndefined();
        expect(user?.verificationExpiry).toBeUndefined();
    });
});