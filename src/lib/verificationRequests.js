import { createAPI } from './api';

const API = createAPI();
const verificationsUrl = 'verifications';

export const submitVerificationReq = (data, token) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    };
    return API.post(`${verificationsUrl}/submit`, data, { headers });
};

export const getVerificationMeReq = (token) => {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    return API.get(`${verificationsUrl}/me`, { headers });
};

export const getAllVerificationsReq = (query = '', token) => {
    const headers = { Authorization: `Bearer ${token}` };
    const url = query ? `${verificationsUrl}${query.startsWith('?') ? query : `?${query}`}` : verificationsUrl;
    return API.get(url, { headers });
};

export const approveVerificationReq = (id, token) => {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    return API.patch(`${verificationsUrl}/${id}/approve`, {}, { headers });
};

export const rejectVerificationReq = (id, data, token) => {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    return API.patch(`${verificationsUrl}/${id}/reject`, data, { headers });
};
