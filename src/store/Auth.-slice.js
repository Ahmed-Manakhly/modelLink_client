import {createSlice} from '@reduxjs/toolkit';


//=========================================
const uiInitialState =  { userData : {}, isLoggedIn : false}  ;
//=================================================
const authReducer = createSlice({
    name : 'auth' ,
    initialState : uiInitialState ,
    reducers : {
        //--------------------------------------------------------------------------------
        onLogin(state, action) {
            state.isLoggedIn = true ;
            state.userData = {...action.payload}
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