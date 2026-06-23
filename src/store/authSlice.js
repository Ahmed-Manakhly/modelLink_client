import {createSlice} from '@reduxjs/toolkit';


//=========================================
const uiInitialState =  { userData : {}, isLoggedIn : false}  ;

const syncUserToStorage = (userData) => {
    if (!userData || typeof userData !== 'object') return;
    const token = localStorage.getItem('token');
    localStorage.setItem('userData', JSON.stringify(token ? { ...userData, token } : userData));
};

//=================================================
const authReducer = createSlice({
    name : 'auth' ,
    initialState : uiInitialState ,
    reducers : {
        //--------------------------------------------------------------------------------
        onLogin(state, action) {
            state.isLoggedIn = true ;
            state.userData = {...action.payload}
            syncUserToStorage(state.userData);
        },
        updateUser(state, action) {
            state.userData = { ...state.userData, ...action.payload };
            syncUserToStorage(state.userData);
        },
        onLoginOut(state){
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            localStorage.removeItem('expiration');
            state.isLoggedIn = uiInitialState.isLoggedIn ;
            state.userData = uiInitialState.userData
        },
    }
}) ;
//----------------------------------

export const authActions = authReducer.actions ;
export default authReducer.reducer ;