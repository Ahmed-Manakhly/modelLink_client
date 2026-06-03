import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const notificationUrl = 'notification';
const usersUrl        = 'users';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createNotification = (data)       => API.post(notificationUrl, data);
export const userNotifications  = (id)         => API.get(`${notificationUrl}/${id}`);
export const removeNotification = (id)         => API.delete(`${notificationUrl}/${id}`);
export const updateNotification = (id, data)   => API.patch(`${notificationUrl}/${id}`, data);

export const getUser = (userId, token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return API.get(`${usersUrl}/${userId}`, { headers });
};
