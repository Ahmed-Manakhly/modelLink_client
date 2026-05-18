import {origin} from './api'
import axios from 'axios'


const API = axios.create({ baseURL: origin });
// api/conversations
export const createChat = (data) => API.post('api/conversations', data);

export const userChats = (id) => API.get(`api/conversations/${id}`);
export const removeChat = (id) => API.delete(`api/conversations/${id}`);





export const getUser = (userId , token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return API.get(`api/users-me/${userId}`,{headers})
}; //here 1

