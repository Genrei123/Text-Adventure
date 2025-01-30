// src/emails/VerificationEmail.tsx

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

interface VerificationEmailProps {
  code: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({ code }) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your Text Adventure email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>Text Adventure</Text>
            <Text style={subtitle}>Verify your email address</Text>
            <Text style={paragraph}>
              Thanks for signing up for Text Adventure! Before you can start your adventure,
              we need to verify your email address. Please enter the verification code below
              in the application.
            </Text>
            <Section style={codeContainer}>
              <Text style={code}>{code}</Text>
            </Section>
            <Text style={paragraph}>
              This code will expire in 60 minutes. If you didn't create an account with 
              Text Adventure, please ignore this email.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              This is an automated email from Text Adventure. Please do not reply to this email.
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