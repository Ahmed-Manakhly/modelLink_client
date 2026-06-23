import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const conversationsUrl = 'conversations';
const usersUrl         = 'users';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createChat = (data, token) => API.post(conversationsUrl, data, { headers: { Authorization: `Bearer ${token}` } });
export const userChats  = (id, token)   => API.get(`${conversationsUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const removeChat = (id, token)   => API.delete(`${conversationsUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const getUser = (userId, token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return API.get(`${usersUrl}/${userId}`, { headers });
};
