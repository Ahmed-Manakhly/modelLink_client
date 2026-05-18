import {origin} from './api'
import axios from 'axios'


const API = axios.create({ baseURL: origin });
// api/notification


export const createOtp = (data) => API.post('api/emailToken', data); // to get OTP sent to email
export const validateOtp = (data) => API.get('api/emailToken', {params:data}); // to validate OTP


