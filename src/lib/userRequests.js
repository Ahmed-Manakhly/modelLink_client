import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const usersUrl = 'users';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const updateMyProfileReq = (data, config) => API.patch(usersUrl, data, config);
