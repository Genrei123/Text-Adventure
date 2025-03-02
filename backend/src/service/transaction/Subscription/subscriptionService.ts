    import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const secretApiKey = process.env.XENDIT_SECRET_KEY!;
const xenditBaseURL = 'https://api.xendit.co';

const axiosInstance = axios.create({
    baseURL: xenditBaseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(secretApiKey + ':').toString('base64')}`
    }
});

export const createSubscriptionPlan = async (planData: any) => {
    try {
        const response = await axiosInstance.post('/recurring/plans', planData);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Error creating subscription plan:', error.response.data);
        } else {
            console.error('Error creating subscription plan:', error.message);
        }
        throw error;
    }
};