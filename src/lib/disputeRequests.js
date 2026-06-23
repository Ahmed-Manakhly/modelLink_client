import { createAPI } from './api';

const API = createAPI();
const disputeUrl = 'disputes';

export const createDisputeReq  = (data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.post(disputeUrl, data, { headers });
};

export const getDisputesReq = (query = '', token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = query ? `${disputeUrl}${query.startsWith('?') ? query : `?${query}`}` : disputeUrl;
    return API.get(url, { headers });
};

export const resolveDisputeReq = (id, data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.patch(`${disputeUrl}/${id}/resolve`, data, { headers });
};
