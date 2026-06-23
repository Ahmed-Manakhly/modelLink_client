import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const ordersUrl              = 'orders';
const createPaymentIntentUrl = `${ordersUrl}/create-payment-intent`;

// These functions accept pre-built `headers` because they are called from React Router
// action handlers (e.g. onDeletingModelAction) where headers are assembled upstream.

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createOrderReq  = (data, headers)     => API.post(createPaymentIntentUrl, data, { headers });
export const confirmOrderReq = (id, data, headers) => API.patch(`${ordersUrl}/${id}/deliver`, data, { headers });
export const cancelOrderReq  = (id, headers)       => API.patch(`${ordersUrl}/${id}/cancel`, {}, { headers });
export const refundOrderReq  = (id, headers)       => API.patch(`${ordersUrl}/${id}/refund`, {}, { headers });
