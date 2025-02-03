import emailjs from '@emailjs/browser';

const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID!;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID!;
const userId = process.env.REACT_APP_EMAILJS_PUBLIC_KEY!;
const fromName = 'Text Adventure';

export const sendVerificationEmail = async (
  toEmail: string,
  verificationCode: string
): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: toEmail,
        verification_code: verificationCode,
        from_name: fromName
      },
      userId
    );
    return response.status === 200;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};