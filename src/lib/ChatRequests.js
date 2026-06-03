import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const conversationsUrl = 'conversations';
const usersUrl         = 'users';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createChat = (data) => API.post(conversationsUrl, data);
export const userChats  = (id)   => API.get(`${conversationsUrl}/${id}`);
export const removeChat = (id)   => API.delete(`${conversationsUrl}/${id}`);

export const getUser = (userId, token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return API.get(`${usersUrl}/${userId}`, { headers });
};
