import {origin} from './api'
import axios from 'axios'


const API = axios.create({ baseURL: origin });
// api/notification


export const createNotification = (data) => API.post('api/notification', data); // object
export const userNotifications = (id) => API.get(`api/notification/${id}`); // user
export const removeNotification = (id) => API.delete(`api/notification/${id}`); // notification
export const updateNotification = (id , data) => API.patch(`api/notification/${id}` , data); // notification


export const getUser = (userId , token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return API.get(`api/users/${userId}`,{headers})
}; //here 1

