import {createSlice} from '@reduxjs/toolkit';

//=========================================
const cartInitialState =  {quantity :0, totalAmount : 0,items : [] } ;
//=================================================
const cartReducer = createSlice({
    name : 'cart' ,
    initialState : cartInitialState ,
    reducers : {
        addToCart(state, action) {
            const ex = state?.items?.find(i => i.id === action?.payload?.id)
            if(ex){
                return;
            }else{
                state.items = [...state.items,action.payload]
                state.quantity ++
                localStorage.setItem('cartItems' , JSON.stringify(state.items)) ;
            }
        },
        //----------------------------------
        removeFromCart(state, action) {
            state.items =state.items.filter(i => i.id !== action?.payload?.id)
            state.quantity --
            localStorage.setItem('cartItems' , JSON.stringify(state.items)) ;
        },
        //----------------------------------
        onSetCart(state, action) {
                state.items = [...action.payload]
                state.quantity =action.payload.length
        },
        //----------------------------------
    }
}) ;
//---------------------------------- 

export const cartActions = cartReducer.actions ;
export default cartReducer.reducer ;