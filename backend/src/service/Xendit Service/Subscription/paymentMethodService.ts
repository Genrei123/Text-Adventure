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

interface PaymentMethodData {
  type: string;
  reusability: string;
  ewallet: {
    channel_code: string;
    channel_properties: {
      success_return_url: string;
      failure_return_url: string;
    };
  };
  customer_id: string;
  metadata: object;
  context: 'buy_item' | 'subscription';
}

export const createPaymentMethod = async (data: PaymentMethodData) => {
  try {
    const response = await axiosInstance.post('/v2/payment_methods', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};