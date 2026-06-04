import axios from "axios";

const rawBaseUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_API_DEV
    : process.env.REACT_APP_BASE_API_PROD;

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
export const FILES_BASE_API_URL = process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "docker_development"
    ? process.env.REACT_APP_FILES_BASE_API_DEV
    : process.env.REACT_APP_FILES_BASE_API_PROD;


//------------------------------------------------------
export const createAPI = () => {
    // Determine base URL at runtime (Note: Create React App requires REACT_APP_ prefix)

    return axios.create({
        baseURL: `${BASE_URL}/api/`,
        withCredentials: true,
    });
};
