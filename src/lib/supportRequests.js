import { createAPI } from './api';

const API = createAPI();
const supportUrl = 'support';

export const submitContactReq = (data, token) => {
    const headers = token && token !== 'EXPIRED'
        ? { Authorization: `Bearer ${token}` }
        : {};
    return API.post(`${supportUrl}/contact`, data, { headers });
};
