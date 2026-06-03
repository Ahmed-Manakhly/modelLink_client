import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const messagesUrl = 'messages';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const getMessages = (id)   => API.get(`${messagesUrl}/${id}`);

export const addMessage = (data) => {
    if (typeof data.desc.name === 'string') {
        const formdata = new FormData();
        formdata.append('attachment', data.desc);
        const { conversationId, userId } = data;
        return API.post(messagesUrl, formdata, { params: { conversationId, userId } });
    } else if (typeof data.desc === 'string') {
        return API.post(messagesUrl, data);
    }
};