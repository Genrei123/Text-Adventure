import * as React from 'react';
import { Html, Head, Body, Container, Text, Section } from '@react-email/components';

interface ResetPasswordEmailProps {
  token: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ token }) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', padding: '20px 0' }}>
        <Container>
          <Section style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '5px' }}>
            <Text>Click the link below to reset your password:</Text>
            <Text style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '20px 0',
              letterSpacing: '5px'
            }}>
              <a href={resetLink}>Reset Password</a>
            </Text>
            <Text>This link will expire in 1 hour.</Text>
            <Text>If you didn't request this, please ignore this email.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};