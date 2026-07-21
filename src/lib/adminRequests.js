import { createAPI } from './api';

const API = createAPI();
const adminUsersUrl = 'admin/users';

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

const withQuery = (baseUrl, query = '') => {
    if (!query) return baseUrl;
    return `${baseUrl}${query.startsWith('?') ? query : `?${query}`}`;
};

export const getAllUsersReq = (query = '', token) => {
    return API.get(withQuery(adminUsersUrl, query), { headers: authHeaders(token) });
};

export const updateUserReq = (id, data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.patch(`${adminUsersUrl}/${id}`, data, { headers });
};

export const deleteUserReq = (id, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.delete(`${adminUsersUrl}/${id}`, { headers });
};

export const createAdminReq = (data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.post(`${adminUsersUrl}/admins`, data, { headers });
};

export const createEmployeeReq = (data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.post(`${adminUsersUrl}/employees`, data, { headers });
};

export const getAuditLogsReq = (query = '', token) => {
    return API.get(withQuery('admin/audit-logs', query), { headers: authHeaders(token) });
};

export const getSettingsReq = (token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.get('admin/settings', { headers });
};

export const updateSettingsReq = (data, token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.patch('admin/settings', data, { headers });
};

export const getAllTransactionsReq = (query = '', token) => {
    return API.get(withQuery('admin/transactions', query), { headers: authHeaders(token) });
};

export const getWebhookEventsReq = (query = '', token) => {
    return API.get(withQuery('admin/webhooks', query), { headers: authHeaders(token) });
};

export const getAllOrdersReq = (query = '', token) => {
    return API.get(withQuery('orders', query), { headers: authHeaders(token) });
};

export const getAdminPendingCountsReq = (token) => {
    return API.get('admin/pending-counts', { headers: authHeaders(token) });
};
