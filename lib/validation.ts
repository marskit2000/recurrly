export interface ValidationError {
  [key: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};

export const validatePasswordConfirmation = (
  password: string,
  confirmation: string,
): string | null => {
  if (!confirmation) {
    return "Please confirm your password";
  }
  if (password !== confirmation) {
    return "Passwords do not match";
  }
  return null;
};

export const validateSignUpForm = (
  email: string,
  password: string,
  passwordConfirmation: string,
): ValidationError => {
  const errors: ValidationError = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmError = validatePasswordConfirmation(
    password,
    passwordConfirmation,
  );
  if (confirmError) {
    errors.passwordConfirmation = confirmError;
  }

  return errors;
};

export const validateSignInForm = (
  email: string,
  password: string,
): ValidationError => {
  const errors: ValidationError = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};
