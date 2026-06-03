import { createAPI } from './api';

const API = createAPI();

// --- URLs ---
const reviewsUrl = 'reviews';

// --- ONE-LINE REQUEST FUNCTIONS ---
export const submitReviewReq = (data, headers) => API.post(reviewsUrl, data, { headers });
