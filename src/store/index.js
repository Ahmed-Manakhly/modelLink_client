import { configureStore } from "@reduxjs/toolkit";
import uiReducer from './UI-slice' ;
import authReducer from './Auth.-slice' ;
import cartReducer from './Cart-slice' ;


const store = configureStore({reducer : {ui : uiReducer , auth : authReducer , cart : cartReducer} } ) ;

export default store ;