import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const messagesUrl = 'messages';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const getMessages = (id, token) => API.get(`${messagesUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const markMessagesAsReadReq = (conversationId, token) =>
    API.patch(`${messagesUrl}/read/${conversationId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const addMessage = (data, token) => {
    const headers = { Authorization: `Bearer ${token}` };
    if (typeof data.desc.name === 'string') {
        const formdata = new FormData();
        formdata.append('attachment', data.desc);
        const { conversationId, userId } = data;
        return API.post(messagesUrl, formdata, { headers, params: { conversationId, userId } });
    } else if (typeof data.desc === 'string') {
        return API.post(messagesUrl, data, { headers });
    }
};