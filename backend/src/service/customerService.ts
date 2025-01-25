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

// Validation function for customer data
const validateCustomerData = (customerData: any) => {
  if (!customerData.reference_id) {
    throw new Error('Missing required field: reference_id');
  }
  if (!customerData.type || !['INDIVIDUAL', 'BUSINESS'].includes(customerData.type)) {
    throw new Error('Missing or invalid required field: type');
  }
  if (customerData.type === 'INDIVIDUAL' && (!customerData.individual_detail || !customerData.individual_detail.given_names || !customerData.individual_detail.surname)) {
    throw new Error('Missing required field: individual_detail with given_names and surname');
  }
  if (!customerData.email) {
    throw new Error('Missing required field: email');
  }
  if (!customerData.mobile_number) {
    throw new Error('Missing required field: mobile_number');
  }
  // Additional validation can be added here (e.g., email format, phone number format)
};

export const createCustomer = async (customerData: any) => {
  try {
    // Validate customer data
    validateCustomerData(customerData);

    const response = await axiosInstance.post('/customers', customerData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error creating customer:', error.response.data);
    } else {
      console.error('Error creating customer:', error.message);
    }
    throw error;
  }
};