import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const authUrl          = 'auth';
const createOtpUrl     = `${authUrl}/create-email-token`;
const validateOtpUrl   = `${authUrl}/verify-email`;
const resetPasswordUrl = `${authUrl}/reset-password`;
const changePasswordUrl = `users/change-password`;

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createOtp        = (data) => API.post(createOtpUrl, data);      // send OTP to email
export const validateOtp      = (data) => API.post(validateOtpUrl, data);    // validate OTP
export const resetPasswordReq = (data) => API.patch(resetPasswordUrl, data); // reset password
export const changePasswordReq = (data, token) => API.patch(changePasswordUrl, data, { headers: { Authorization: `Bearer ${token}` } });
