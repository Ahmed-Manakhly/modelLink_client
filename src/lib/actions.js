import { createAPI } from './api';
import { deleteModelReq } from './modelRequests';

const API = createAPI();

const authUrl = 'auth';
const loginUrl = `${authUrl}/login`;
const signupUrl = `${authUrl}/register`;

const loginRequest = (data) => API.post(loginUrl, data);
const signupRequest = (data) => API.post(signupUrl, data);


// Match server ACCESS_TOKEN_EXPIRATION (2700000 ms = 45 min)
const SESSION_MINUTES = 45;

//------------------------------------------------------
export async function LoginAction(request, actions, toastHandler, loadingState) {
    let toast = { status: '', title: '', message: '' }
    //---------------------------------------------
    const searchParams = new URL(request.url).searchParams;
    const mode = searchParams.get('mode') || null;
    const role = searchParams.get('role') || null;
    //---------------------------------------------
    const data = await request.formData();
    //---------------------------------------------
    if (mode === 'login') {
        loadingState(true)
        const authData = { email: data.get('email'), password: data.get('password') };
        try {
            const response = await loginRequest(authData);
            const resData = response.data;
            loadingState(false)
            //------ store user data
            const token = resData.token;
            const userData = { ...resData.data.user, token }
            actions(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            //-----------------------------------
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + SESSION_MINUTES);
            localStorage.setItem('expiration', expiration.toISOString());
            toast = { status: 'success', message: `Well Come Back ${userData.org_username}`, title: 'logged in' }
            toastHandler(toast);
        } catch (error) {
            loadingState(false)
            toast = { status: 'error', message: error?.response?.data?.message || 'Authentication failed', title: 'Authentication failed' };
            toastHandler(toast);
        }
        //------------------------------------
    } else if ((mode !== 'forgotPassword')) {
        loadingState(true)
        const authData = {
            email: data.get('email'),
            org_name: data.get('org_name'),
            org_username: data.get('email'),
            org_phone: data.get('org_phone'),
            password: data.get('password'),
            passwordConfirm: data.get('passwordConfirm'),
            country: data.get('country'),

            role: role === 'client' ? 'CLIENT' : (role === 'developer' && 'DEVELOPER'),
            org_desc: '',
            rule_id: 0,
            target_id: 0,
            module_id: 0
        }
        try {
            const response = await signupRequest(authData);
            const resData = response.data;
            loadingState(false)
            //------ store user data
            const token = resData.token;
            const userData = { ...resData.data.user, token }
            actions(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            //-----------------------------------
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + SESSION_MINUTES);
            localStorage.setItem('expiration', expiration.toISOString());
            toast = { status: 'success', message: `Welcome on board, We Have logged You In Now!`, title: 'account is registered' }
            toastHandler(toast);
        } catch (error) {
            loadingState(false)
            toast = { status: 'error', message: error?.response?.data?.message || 'registration failed', title: 'registration failed' };
            toastHandler(toast);
        }
    }
}


//-------------------------------------------------------------------------

export async function deletingModelAction(request, toastHandler, loadingState, params) {
    let toast = { status: '', title: '', message: '' }
    loadingState(true)
    //---------------------------------------------
    if (params.id) {
        const id = params.id
        const token = localStorage.getItem('token');
        try {
            const response = await deleteModelReq(id, token);
            if (response.status === 204) {
                loadingState(false);
                toast = { status: 'success', message: "Model has been Deleted", title: 'Delete Model' };
                toastHandler(toast);
                return;
            }
            const resData = response.data;
            loadingState(false)
            toast = { status: resData.status, message: resData.message || "Model has been Deleted", title: 'Delete Model' }
            toastHandler(toast);
        } catch (err) {
            loadingState(false)
            toast = { status: 'error', message: err?.response?.data?.message || err.message, title: 'Deleting Model failed' };
            toastHandler(toast);
        }
    }
}


