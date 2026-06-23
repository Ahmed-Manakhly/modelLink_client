import { createAPI } from './api';

const API = createAPI();
const walletUrl = 'wallets';

export const getWalletMeReq = (token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    return API.get(`${walletUrl}/me`, { headers });
};

export const getWalletTransactionsReq = (query = '', token) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = query
        ? `${walletUrl}/transactions${query.startsWith('?') ? query : `?${query}`}`
        : `${walletUrl}/transactions`;
    return API.get(url, { headers });
};
