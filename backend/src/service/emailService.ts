import emailjs from '@emailjs/browser';

// Load environment variables from .env file
dotenv.config();

// Safely retrieve environment variables with fallback
const serviceId = process.env.EMAILJS_SERVICE_ID!;
const templateId = process.env.EMAILJS_TEMPLATE_ID!;
const userId = process.env.EMAILJS_PUBLIC_KEY!;
const fromName = 'Text Adventure';

emailjs.init(userId);

export const sendVerificationEmail = (
  toEmail: string,
  toName: string,
  toName: string,
  verificationCode: string
): Promise<any> => {
  const templateParams = {
    to_email: toEmail,
    to_name: toName,
    verification_code: verificationCode,
    from_name: fromName,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    return response;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Conditionally mock the function during testing
if (process.env.NODE_ENV === 'test') {
  module.exports.sendVerificationEmail = jest.fn((toEmail, toName, verificationCode) => {
    console.log(`Mock email sent to ${toEmail} with code: ${verificationCode}`);
    return Promise.resolve({ status: 200, text: 'Mock email sent successfully' });
  });
}

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};