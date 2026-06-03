import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
// baseURL already includes /api/ — paths start from the resource name
const modelsUrl  = 'aiModel';
const ordersUrl  = 'orders';
const reviewsUrl = 'reviews';
const usersUrl   = 'users';

// --- ONE-LINE REQUEST FUNCTIONS ---

// Models
export const getAllModelsReq     = (query = '') => API.get(`${modelsUrl}${query}`);
export const getModelByIdReq    = (id)         => API.get(`${modelsUrl}/${id}`);
export const getModelsByUserReq = (id)         => API.get(`${modelsUrl}/byUser/${id}`);

// Orders
export const getOrderByIdReq      = (id, headers) => API.get(`${ordersUrl}/${id}`, { headers });
export const getOrdersByClientReq = (id, headers) => API.get(`${ordersUrl}/byClient/${id}`, { headers });
export const getOrdersByDevReq    = (id, headers) => API.get(`${ordersUrl}/byDev/${id}`, { headers });
export const getOrdersByModelReq  = (id, headers) => API.get(`${ordersUrl}/byModel/${id}`, { headers });

// Reviews
export const getReviewsByModelReq = (id, headers) => API.get(`${reviewsUrl}/byModel/${id}`, { headers });
export const getReviewByOrderReq  = (id, headers) => API.get(`${reviewsUrl}/byOrder/${id}`, { headers });

// Users
export const getUserProfileReq = (id, headers) => API.get(`${usersUrl}/${id}`, { headers });

// --- WRAPPER FUNCTION ---
export async function getData(requestFn, toastHandler, loadingState, notificationState, gettingData, item) {
    let toast = {status :'', title :'', message:''}
    if (loadingState) loadingState(true);
    
    try{
        const response = await requestFn();
        const resData = response.data;
        if (loadingState) loadingState(false);
        
        const data = resData?.data?.models || resData?.data?.model || resData?.data?.orders || resData?.data?.order || resData?.data;
        if (gettingData) gettingData(data, resData);
    }catch(err){
        if (loadingState) loadingState(false);
        toast = {status :'error',message:err?.response?.data?.message || err.message || `Could not get ${item}!`,title:'Getting data failed'};
        if (toastHandler) toastHandler(toast);
        if (notificationState) notificationState(true);
    }
}