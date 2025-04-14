export const ValidationUtils = {

  username: (value: string): { isValid: boolean; message: string } => {
    if (!value) {
      return { isValid: false, message: 'Username is required' };
    }
    return { isValid: true, message: '' };
  },

  email: (value: string): { isValid: boolean; message: string } => {
    if (!value) {
      return { isValid: false, message: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    const lastDotIndex = value.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === value.length - 1) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true, message: '' };
  },

  login_password: (value: string): { isValid: boolean; message: string } => {
    if (!value) {
      return { isValid: false, message: 'Password is required' };
    }
    return { isValid: true, message: '' };
  },

  password: (value: string): { isValid: boolean; message: string } => {
    if (!value) {
      return { isValid: false, message: 'Password is required' };
    }
    if (value.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(value)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!/(?=.*[!@#$%^&*\-_])/.test(value)) {
      return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*\-_])' };
    }
    return { isValid: true, message: '' };
  },

  verifyPassword: (password: string, confirmPassword: string): { isValid: boolean; message: string } => {
    if (!confirmPassword) {
      return { isValid: false, message: 'Please confirm your password' };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Passwords do not match' };
    }
    return { isValid: true, message: '' };
  }
}; 

// Backend Validation auth/check-username

// {
//     available: boolean;
//     suggestions?: string[];  // e.g., ["Mika523", "Mika_3", "Mika.20"]
// }
