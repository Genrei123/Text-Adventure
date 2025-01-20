import request from 'supertest';
import app from '../index';  // Adjust the path based on your project structure
import User from '../model/user';
import bcrypt from 'bcrypt';

jest.mock('../model/user'); // Mock the User model to avoid database interaction

describe('AuthController Tests - Failing Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Register Endpoint - Failing Tests', () => {
        it('should fail when email is already taken', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce({});  // Simulate user already existing

            const response = await request(app).post('/api/register').send({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });

        it('should fail when no password is provided', async () => {
            const response = await request(app).post('/api/register').send({
                email: 'test@example.com'
            });

            expect(response.status).toBe(500);  // Server error due to missing password
        });
    });

    describe('Login Endpoint - Failing Tests', () => {
        it('should fail with incorrect password', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce({
                get: () => bcrypt.hashSync('password123', 10) // Simulated hashed password
            });

            const response = await request(app).post('/api/login').send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should fail when email is not found', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(null);  // No user found

            const response = await request(app).post('/api/login').send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });
    });
});
