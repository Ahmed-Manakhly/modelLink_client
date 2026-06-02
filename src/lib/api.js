import axios from "axios";

export const createAPI = () => {
    // Determine base URL at runtime (Note: Create React App requires REACT_APP_ prefix)
    const BASE_URL = process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_BASE_API_DEV
        : process.env.REACT_APP_BASE_API_PROD;

    return axios.create({
        baseURL: BASE_URL || "http://127.0.0.1:8000/",
        withCredentials: true,
    });
};

// ---------------------------------------------- for files
export const FILES_BASE_API_URL = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_FILES_BASE_API_DEV
    : process.env.REACT_APP_FILES_BASE_API_PROD;

// ------------------------------------ this is will be changed later (temporary)
export const origin = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_API_DEV
    : process.env.REACT_APP_BASE_API_PROD;
// ----------------------------------------------------------------------

export const LOGIN_URL = `${origin}api/auth/login`;
export const SIGNUP_URL = `${origin}api/auth/register`;
export const ALL_MODELS_URL = `${origin}api/aiModel`;
export const ALL_MODELS_BY_USER_URL = `${origin}api/aiModel/byUser`;
export const GET_USER_PROFILE_URL = `${origin}api/users`;
export const UPDATE_MY_PROFILE_URL = `${origin}api/users`;
export const RESET_PASSWORD_URL = `${origin}api/auth/reset-password`;
// export const UPLOAD_FILES_URL = `${origin}upload` ;
export const CREATE_ORDER_URL = `${origin}api/orders/create-payment-intent/`;
export const CONFIRM_ORDER_URL = `${origin}api/orders/confirm-order`;
export const GET_ORDER_URL = `${origin}api/orders`;
export const GET_ORDERS_BY_MODEL_URL = `${origin}api/orders/byModel`;
export const GET_ORDERS_BY_DEV_URL = `${origin}api/orders/byDev`;
export const GET_ORDERS_BY_CLIENT_URL = `${origin}api/orders/byClient`;
export const REV_URL = `${origin}api/reviews`;
export const REV_BY_ORDER_URL = `${origin}api/reviews/byOrder`;
export const GET_REVIEWS_BY_MODEL_URL = `${origin}api/reviews/byModel`;
