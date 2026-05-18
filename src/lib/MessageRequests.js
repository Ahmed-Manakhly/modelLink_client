import {origin} from './api'
import axios from 'axios'


const API = axios.create({ baseURL: origin });

export const getMessages = (id) => API.get(`api/messages/${id}`);

// export const addMessage = (data) => API.post('api/messages', data);
export const addMessage = (data) => {
    if(typeof data.desc.name === 'string'){
        const formdata = new FormData();
        formdata.append('attachment',data.desc)
        const {conversationId , userId} = data
        return API.post('api/messages', formdata , {params:{conversationId , userId}});
    }else if(typeof data.desc === 'string'){
        return API.post('api/messages', data);
    }
};