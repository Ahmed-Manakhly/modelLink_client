import { configureStore } from "@reduxjs/toolkit";
import uiReducer from './UI-slice' ;
import authReducer from './authSlice' ;
import cartReducer from './Cart-slice' ;
import realtimeReducer from './realtimeSlice' ;


const store = configureStore({reducer : {ui : uiReducer , auth : authReducer , cart : cartReducer , realtime : realtimeReducer} } ) ;

export default store ;