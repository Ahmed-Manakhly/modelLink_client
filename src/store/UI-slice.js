import {createSlice} from '@reduxjs/toolkit';

//=========================================
const uiInitialState =  { notificationData:{}, showNotification : false ,isLoading : false}  ;
//=================================================
const uiReducer = createSlice({
    name : 'ui' ,
    initialState : uiInitialState ,
    reducers : {
        //--------------------------------------------------------------------------------
        showNotification(state, action){
            state.showNotification = action.payload ;
        },
        notificationDataChanged(state, action) {
            state.notificationData = {...action.payload}
        },
        showLoading(state, action){
            state.isLoading = action.payload ;
        },
        // refreshData(state, action){
        //     state.dataIsUpdated = action.payload ;
        // },
    }
}) ;
//---------------------------------- 

export const uiActions = uiReducer.actions ;
export default uiReducer.reducer ;