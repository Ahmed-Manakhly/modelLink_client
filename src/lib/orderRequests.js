import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const ordersUrl              = 'orders';
const createPaymentIntentUrl = `${ordersUrl}/create-payment-intent`;
const confirmOrderUrl        = `${ordersUrl}/confirm-order`;

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createOrderReq  = (data, headers)     => API.post(createPaymentIntentUrl, data, { headers });
export const confirmOrderReq = (id, data, headers) => API.patch(`${confirmOrderUrl}/${id}`, data, { headers });
