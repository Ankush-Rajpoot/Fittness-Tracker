export const VERIFICATION_EMAIL_TEMPLATE = `
  <p>Dear User,</p>
  <p>Please verify your email by using the following code: <strong>{verificationCode}</strong></p>
  <p>Best regards,<br>Your Company</p>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
  <p>Dear User,</p>
  <p>Please reset your password by clicking the following link: <a href="{resetURL}">{resetURL}</a></p>
  <p>Best regards,<br>Your Company</p>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
  <p>Dear User,</p>
  <p>Your password has been successfully reset.</p>
  <p>Best regards,<br>Your Company</p>
`;