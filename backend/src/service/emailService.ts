import emailjs from '@emailjs/browser';

const serviceId = process.env.EMAILJS_SERVICE_ID!;
const templateId = process.env.EMAILJS_TEMPLATE_ID!;
const userId = process.env.EMAILJS_USER_ID!;

export const sendVerificationEmail = (
  toEmail: string,
  toName: string,
  verificationCode: string
) => {
  const templateParams = {
    to_email: toEmail,
    to_name: toName,
    verification_code: verificationCode,
    from_name: 'Text Adventure',
  };

  return emailjs.send(serviceId, templateId, templateParams, userId);
};