const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.SITE_URL}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Text Adventure!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" 
           style="display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #4CAF50; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  margin: 15px 0;">
          Verify Email Address
        </a>
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account with us, you can safely ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

module.exports = { sendVerificationEmail };