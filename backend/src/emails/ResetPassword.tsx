// src/emails/ResetPasswordEmail.tsx

import * as React from 'react';
import { 
  Html, 
  Head, 
  Preview, 
  Body, 
  Container, 
  Text, 
  Button, 
  Section,
  Hr 
} from '@react-email/components';

interface ResetPasswordEmailProps {
  token: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ token }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Text Adventure password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>Text Adventure</Text>
            <Text style={subtitle}>Password Reset Request</Text>
            <Text style={paragraph}>
              We received a request to reset your Text Adventure password. 
              Use the code below to reset your password. If you didn't request this, 
              you can safely ignore this email.
            </Text>
            <Section style={codeContainer}>
              <Text style={code}>{token}</Text>
            </Section>
            <Text style={paragraph}>
              This code will expire in 60 minutes.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              This email was sent from Text Adventure. If you'd rather not receive these 
              emails, you can unsubscribe at any time.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const title = {
  fontSize: '32px',
  fontWeight: '700',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const subtitle = {
  color: '#525f7f',
  fontSize: '24px',
  fontWeight: '500',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  margin: '20px 0',
};

const codeContainer = {
  background: '#f4f4f4',
  borderRadius: '5px',
  margin: '16px 0',
  padding: '20px',
  textAlign: 'center' as const,
};

const code = {
  color: '#000',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '6px',
  lineHeight: '36px',
  margin: '0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};