import axios from "axios";

const isDev = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_ENV !== 'production';

const rawBaseUrl = isDev
    ? (process.env.REACT_APP_BASE_API_DEV || 'http://127.0.0.1:8000')
    : (process.env.REACT_APP_BASE_API_PROD || 'https://www.modellink.com');

// Helper to normalize the base URL (strips trailing slashes and /api prefix if present)
const getNormalizedBaseUrl = (url) => {
    if (!url) return "";
    let cleanUrl = url.trim().replace(/\/+$/, ""); // Remove trailing slashes
    if (cleanUrl.endsWith("/api")) {
        cleanUrl = cleanUrl.substring(0, cleanUrl.length - 4);
    }
    return cleanUrl;
};

export const BASE_URL = getNormalizedBaseUrl(rawBaseUrl);

// ---------------------------------------------------
export const FILES_BASE_API_URL = isDev
    ? (process.env.REACT_APP_FILES_BASE_API_DEV || 'http://127.0.0.1:8000/public/')
    : (process.env.REACT_APP_FILES_BASE_API_PROD || 'https://api.modellink.com/public/');


//------------------------------------------------------
export const createAPI = () => {
    // Determine base URL at runtime (Note: Create React App requires REACT_APP_ prefix)

    return axios.create({
        baseURL: `${BASE_URL}/api/`,
        withCredentials: true,
    });
};
