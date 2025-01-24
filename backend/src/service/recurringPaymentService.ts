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

interface RecurringPaymentData {
  reference_id: string;
  customer_id: string;
  recurring_action: string;
  currency: string;
  amount: number;
  schedule: object;
  immediate_action_type?: string;
  notification_config?: object;
  failed_cycle_action?: string;
  metadata?: object | null;
  description?: string;
  items?: object[];
  success_return_url?: string;
  failure_return_url?: string;
}

export const createRecurringPayment = async (data: RecurringPaymentData) => {
  try {
    const response = await axiosInstance.post('/recurring/plans', data);
    return response.data;
  } catch (error) {
    console.error('Error creating recurring payment:', error);
    throw error;
  }
};

export const updateRecurringPayment = async (id: string, data: Partial<RecurringPaymentData>) => {
  try {
    const response = await axiosInstance.patch(`/recurring/plans/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating recurring payment:', error);
    throw error;
  }
};

export const stopRecurringPayment = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/recurring/plans/${id}/stop`);
    return response.data;
  } catch (error) {
    console.error('Error stopping recurring payment:', error);
    throw error;
  }
};