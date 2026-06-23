import { createAPI } from './api';

const API = createAPI();

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export const getStripeConnectStatusReq = (token) =>
    API.get('stripe/connect/status', { headers: authHeaders(token) });

export const onboardStripeConnectReq = (token) =>
    API.post('stripe/connect/onboard', {}, { headers: authHeaders(token) });

export const completeStripeConnectDemoReq = (token) =>
    API.post('stripe/connect/complete-demo', {}, { headers: authHeaders(token) });
