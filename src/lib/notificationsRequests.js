import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const notificationUrl = 'notification';
const usersUrl        = 'users';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createNotification = (data, token)       => API.post(notificationUrl, data, { headers: { Authorization: `Bearer ${token}` } });
export const userNotifications  = (id, token, query = '') => API.get(`${notificationUrl}/${id}${query}`, { headers: { Authorization: `Bearer ${token}` } });
export const removeNotification = (id, token)         => API.delete(`${notificationUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const updateNotification = (id, data, token)   => API.patch(`${notificationUrl}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const readAllNotificationsReq = (headers) => API.patch(`${notificationUrl}/read-all`, {}, { headers });

export const getUser = (userId, token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return API.get(`${usersUrl}/${userId}`, { headers });
};
