import {origin} from './api'
import axios from 'axios'


const API = axios.create({ baseURL: origin });
// api/notification


export const createOtp = (data) => API.post('api/auth/create-email-token', data); // to get OTP sent to email
export const validateOtp = (data) => API.post('api/auth/verify-email', data); // to validate OTP


