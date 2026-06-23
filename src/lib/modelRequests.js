import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const aiModelUrl = 'aiModel';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const createModelReq = (data, token) => {
    return API.post(aiModelUrl, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const updateModelReq = (id, data, token) => {
    return API.patch(`${aiModelUrl}/${id}`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const deleteModelReq = (id, token) => {
    return API.delete(`${aiModelUrl}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};
