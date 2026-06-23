import { createAPI } from './api';

const API = createAPI();
const base = 'taxonomy';

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export const getCategoriesManageReq = (token) =>
    API.get(`${base}/categories/manage`, { headers: authHeaders(token) });

export const getCategoryImpactReq = (id, token) =>
    API.get(`${base}/categories/${id}/impact`, { headers: authHeaders(token) });

export const createCategoryReq = (formData, token) =>
    API.post(`${base}/categories`, formData, {
        headers: { ...authHeaders(token), 'Content-Type': 'multipart/form-data' },
    });

export const updateCategoryReq = (id, formData, token) =>
    API.patch(`${base}/categories/${id}`, formData, {
        headers: { ...authHeaders(token), 'Content-Type': 'multipart/form-data' },
    });

export const deleteCategoryReq = (id, data, token) =>
    API.delete(`${base}/categories/${id}`, { headers: authHeaders(token), data });

export const getModalitiesManageReq = (token) =>
    API.get(`${base}/modalities/manage`, { headers: authHeaders(token) });

export const getModalityImpactReq = (id, token) =>
    API.get(`${base}/modalities/${id}/impact`, { headers: authHeaders(token) });

export const createModalityReq = (data, token) =>
    API.post(`${base}/modalities`, data, { headers: authHeaders(token) });

export const updateModalityReq = (id, data, token) =>
    API.patch(`${base}/modalities/${id}`, data, { headers: authHeaders(token) });

export const deleteModalityReq = (id, data, token) =>
    API.delete(`${base}/modalities/${id}`, { headers: authHeaders(token), data });

export const getBodyPartsManageReq = (token) =>
    API.get(`${base}/bodyparts/manage`, { headers: authHeaders(token) });

export const getBodyPartImpactReq = (id, token) =>
    API.get(`${base}/bodyparts/${id}/impact`, { headers: authHeaders(token) });

export const createBodyPartReq = (data, token) =>
    API.post(`${base}/bodyparts`, data, { headers: authHeaders(token) });

export const updateBodyPartReq = (id, data, token) =>
    API.patch(`${base}/bodyparts/${id}`, data, { headers: authHeaders(token) });

export const deleteBodyPartReq = (id, data, token) =>
    API.delete(`${base}/bodyparts/${id}`, { headers: authHeaders(token), data });

export const slugify = (value = '') =>
    String(value)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
