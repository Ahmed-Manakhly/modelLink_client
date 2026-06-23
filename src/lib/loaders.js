import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const modelsUrl   = 'aiModel';
const taxonomyUrl = 'taxonomy';
const ordersUrl   = 'orders';
const reviewsUrl  = 'reviews';
const usersUrl    = 'users';

// --- ONE-LINE REQUEST FUNCTIONS ---

// Models
export const getAllModelsReq     = (query = '', headers = {}) => API.get(`${modelsUrl}${query}`, { headers });
export const getModelByIdReq    = (id, headers = {}) => API.get(`${modelsUrl}/${id}`, { headers });
export const updateModelStatusReq = (id, data, headers) => API.patch(`${modelsUrl}/${id}`, data, { headers });
export const bulkUpdateModelsReq  = (data, headers) => API.patch(`${modelsUrl}/bulk-status`, data, { headers });
export const restoreModelReq    = (id, headers) => API.patch(`${modelsUrl}/${id}`, { restore: true }, { headers });
export const deleteModelReq     = (id, headers) => API.delete(`${modelsUrl}/${id}`, { headers });
export const getModelsByUserReq = (id, query = '', headers = {}) => API.get(`${modelsUrl}/byUser/${id}${query}`, { headers });
export const getFiltersReq      = ()           => API.get(`${modelsUrl}/filters`);

// Taxonomy (ApiFeatures-backed)
export const getCategoriesReq   = (query = '') => API.get(`${taxonomyUrl}/categories${query}`);
export const getModalitiesReq   = (query = '') => API.get(`${taxonomyUrl}/modalities${query}`);
export const getBodyPartsReq    = (query = '') => API.get(`${taxonomyUrl}/bodyparts${query}`);
export const getTagsReq         = (search = '', limit = 10) =>
    API.get(`${taxonomyUrl}/tags?search=${encodeURIComponent(search)}&limit=${limit}`);
export const getFeaturesReq     = (search = '', limit = 10) =>
    API.get(`${taxonomyUrl}/features?search=${encodeURIComponent(search)}&limit=${limit}`);
export const getMetricsReq      = (search = '', limit = 10) =>
    API.get(`${taxonomyUrl}/metrics?search=${encodeURIComponent(search)}&limit=${limit}`);

// Orders
export const getOrderByIdReq      = (id, headers) => API.get(`${ordersUrl}/${id}`, { headers });
export const getOrdersByClientReq = (id, query = '', headers) => API.get(`${ordersUrl}?clientId=${id}${query.replace('?', '&')}`, { headers });
export const getOrdersByDevReq    = (id, query = '', headers) => API.get(`${ordersUrl}?developerId=${id}${query.replace('?', '&')}`, { headers });
export const getOrdersByModelReq  = (id, query = '', headers) => API.get(`${ordersUrl}?aiModelId=${id}${query.replace('?', '&')}`, { headers });
export const getMyOrdersReq       = (query = '', headers) => API.get(`${ordersUrl}${query}`, { headers });

// Reviews
export const getReviewsByModelReq = (id, headers) => API.get(`${reviewsUrl}/byModel/${id}`, { headers });
export const getReviewByOrderReq  = (id, headers) => API.get(`${reviewsUrl}/byOrder/${id}`, { headers });
export const getAllReviewsReq     = (query = '', headers) => API.get(`${reviewsUrl}${query}`, { headers });

// Users
export const getMeReq = (headers) => API.get(`${usersUrl}`, { headers });
export const getUserProfileReq = (id, headers) => API.get(`${usersUrl}/${id}`, { headers });
export const getUserPublicProfileReq = (id) => API.get(`${usersUrl}/${id}/public`);
export const getPublicDevelopersReq = (query) => API.get(`${usersUrl}/developers/public${query ? `?${query}` : ''}`);

// --- WRAPPER FUNCTION ---
export async function getData(requestFn, toastHandler, loadingState, notificationState, gettingData, item, options = {}) {
    let toast = { status: '', title: '', message: '' };
    if (loadingState) loadingState(true);

    try {
        const response = await requestFn();
        const resData = response.data;
        if (loadingState) loadingState(false);

        const data = resData?.data?.models || resData?.data?.model || resData?.data?.orders || resData?.data?.order || resData?.data;
        if (gettingData) gettingData(data, resData);
    } catch (err) {
        if (loadingState) loadingState(false);
        if (options.onError?.(err)) {
            return;
        }
        if (!options.silent) {
            toast = { status: 'error', message: err?.response?.data?.message || err.message || `Could not get ${item}!`, title: 'Getting data failed' };
            if (toastHandler) toastHandler(toast);
            if (notificationState) notificationState(true);
        }
    }
}
