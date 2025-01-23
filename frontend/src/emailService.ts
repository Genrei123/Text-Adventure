import emailjs from '@emailjs/browser';

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