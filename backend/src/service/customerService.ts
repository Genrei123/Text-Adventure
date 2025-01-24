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

interface CustomerData {
  reference_id: string;
  type: string;
  individual_detail: {
    given_names: string;
    surname: string;
  };
  email: string;
  mobile_number: string;
}

export const createCustomer = async (data: CustomerData) => {
  try {
    const response = await axiosInstance.post('/customers', data);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};