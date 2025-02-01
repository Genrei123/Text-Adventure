import * as React from 'react';
import { Html, Head, Body, Container, Text, Section } from '@react-email/components';

interface VerificationEmailProps {
  code: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({ code }) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', padding: '20px 0' }}>
        <Container>
          <Section style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '5px' }}>
            <Text>Welcome! Here is your verification code:</Text>
            <Text style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '20px 0',
              letterSpacing: '5px'
            }}>
              {code}
            </Text>
            <Text>This code will expire in 1 hour.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};