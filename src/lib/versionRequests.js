import { createAPI } from './api';

const API = createAPI();
const modelsUrl = 'aiModel';

const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const createVersionReq = (modelId, data, token) =>
    API.post(`${modelsUrl}/${modelId}/versions`, data, { headers: authHeaders(token) });

export const createAssetReq = (versionId, data, token) =>
    API.post(`${modelsUrl}/versions/${versionId}/assets`, data, { headers: authHeaders(token) });

export const updateAssetReq = (assetId, data, token) =>
    API.patch(`${modelsUrl}/assets/${assetId}`, data, { headers: authHeaders(token) });

export const deleteAssetReq = (assetId, token) =>
    API.delete(`${modelsUrl}/assets/${assetId}`, { headers: { Authorization: `Bearer ${token}` } });
