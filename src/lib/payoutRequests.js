import { createAPI } from './api';

const API = createAPI();
const payoutUrl = 'payouts';

export const requestPayoutReq = (data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.post(`${payoutUrl}/request`, data, { headers });
};

export const getMyPayoutsReq = (query = '', token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = query
        ? `${payoutUrl}/me${query.startsWith('?') ? query : `?${query}`}`
        : `${payoutUrl}/me`;
    return API.get(url, { headers });
};

export const getAllPayoutsReq = (query = '', token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = query ? `${payoutUrl}${query.startsWith('?') ? query : `?${query}`}` : payoutUrl;
    return API.get(url, { headers });
};

export const approvePayoutReq = (id, data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.patch(`${payoutUrl}/${id}/approve`, data, { headers });
};

export const rejectPayoutReq = (id, data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.patch(`${payoutUrl}/${id}/reject`, data, { headers });
};

export const cancelPayoutReq = (id, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.patch(`${payoutUrl}/${id}/cancel`, {}, { headers });
};
