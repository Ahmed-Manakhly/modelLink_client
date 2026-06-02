
import {useParams}  from "react-router-dom";
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect , useState} from 'react' ;
import {useNavigate } from 'react-router-dom';
import OrderBoxWidgets from '../components/OrderBoxWidgets'
import FeedbackForm from '../components/FeedbackForm'
import FeedbackList from '../components/FeedbackList'
import {getOrder} from '../lib/loaders';
import {CONFIRM_ORDER_URL} from '../lib/api' ;
import {GET_ORDER_URL  ,REV_URL , REV_BY_ORDER_URL} from '../lib/api' ;
import axios from 'axios'
import {createNotification} from '../lib/notificationsRequests'
//=-----------------------------
import io from "socket.io-client";
import {origin} from '../lib/api'


//==========================


function OrderView({refresh}) {
    const navigate = useNavigate();
    const token = getAuthToken() ;
    const thisUserRole = token? JSON.parse(localStorage.getItem('userData')).role : null
    const avatar = token? JSON.parse(localStorage.getItem('userData')).avatar : null
    const org_username = token? JSON.parse(localStorage.getItem('userData')).org_username : null
    const firstName  = token? JSON.parse(localStorage.getItem('userData')).first_name  : null



    const dispatch = useDispatch();  
    const [order,setOrder] = useState({}) ;
    const [review,setReview] = useState({}) ;
    const [updated,setUpdated] = useState(false) 
    const { id } = useParams();
    //------------------------------------------------
    useEffect(()=>{
        if(refresh){
            setUpdated(true)
        }
    },[refresh])
    useEffect(() => {
        if(+order?.clientData?.id >0 ){
            const isBuyer = order?.clientData?.id ===  JSON.parse(localStorage.getItem('userData'))?.id ;
            const isSeller =order?.developerData?.id ===   JSON.parse(localStorage.getItem('userData'))?.id ;
            if(isBuyer === false && isSeller === false){
                let toast = {status :'error',message:'you have no access for this!',title:'Access Denied'};
                dispatch(uiActions.notificationDataChanged(toast))
                dispatch(uiActions.showNotification(true))
                navigate("/",{replace :true});
            }
        }
    },[order , dispatch, navigate])
    //==================================================

    useEffect(() => {

        const toastHandler =(toast)=>{
            dispatch(uiActions.notificationDataChanged(toast))
        } 
        const loadingState = (state)=>{
            dispatch(uiActions.showLoading(state))
        }
        const notificationState =(state)=>{
            dispatch(uiActions.showNotification(state))
        }
        const gettingData =(data)=>{
            setOrder(data || null)
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        getOrder(GET_ORDER_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Order!' )
        dispatch(uiActions.showNotification(false))
    },[dispatch , id , token])
    //------------------------------------------
    useEffect(() => {
        if(updated){
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            const notificationState =(state)=>{
                dispatch(uiActions.showNotification(state))
            }
            const gettingData =(data)=>{
                setOrder(data || null)
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            getOrder(GET_ORDER_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Order!' )
            dispatch(uiActions.showNotification(false))
            setUpdated(false)
        }
    },[updated , dispatch ,id , token])
    //------------------------------------------
    useEffect(() => {
        if(order){
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            const notificationState =(state)=>{
                dispatch(uiActions.showNotification(state))
            }
            const gettingData =(data)=>{
                setReview(data?.review?data.review:null)
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            getOrder(REV_BY_ORDER_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Review!' )
            dispatch(uiActions.showNotification(false))
        }
    },[order , dispatch , id , token])
    //------------------------------------------
    useEffect(() => {
        if(order){
            if(updated){
                const toastHandler =(toast)=>{
                    dispatch(uiActions.notificationDataChanged(toast))
                } 
                const loadingState = (state)=>{
                    dispatch(uiActions.showLoading(state))
                }
                const notificationState =(state)=>{
                    dispatch(uiActions.showNotification(state))
                }
                const gettingData =(data)=>{
                    setReview(data?.review?data.review:null)
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                getOrder(REV_BY_ORDER_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Review!' )
                dispatch(uiActions.showNotification(false))
                setUpdated(false)
            }
        }
    },[order , updated ,dispatch , id , token])
    //------------------------------------------

    const confirmOrdeerHandler =()=>{
        const socket = io(origin);
        async function onConfirmOrdeerHandler (toastHandler , loadingState ) {
            let toast = {status :'', title :'', message:''}
            loadingState(true)
            //---------------------------------------------
            const formdata = new FormData();
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                try{
                    const response = await axios.patch(CONFIRM_ORDER_URL+'/'+id, formdata ,{headers} );
                    const resData =  response?.data ;
                    loadingState(false)
                    toast= {status :resData.status,message:"Order Confirmed successfully",title:'Confirm Order'}
                    toastHandler(toast);
                    const notificationData ={
                        actionDesc :`Developer has confirmed Your Order!`,
                        to : order?.clientData?.id,
                        from : order?.developerData?.id,
                        actionLink : `/order/view/${order?.id}`,
                    }
                    const { data } = await createNotification(notificationData);
                    socket.emit("order_created", data?.data?.newNotification);
                    navigate(`/order/view/${resData.order.id}`,{replace :true});
                }catch(err){
                    loadingState(false)
                    toast = {status :'error',message:err.response?.data?.message,title:'Confirm Order failed'};
                    toastHandler(toast);
                }
        } 
        const toastHandler =(toast)=>{
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
        } 
        const loadingState = (state)=>{
            dispatch(uiActions.showLoading(state))
        }
        onConfirmOrdeerHandler(toastHandler , loadingState )
        dispatch(uiActions.showNotification(false))
    }
    //==================================================================================== soon
    // const deleteOrdeerHandler =()=>{

    //     async function onDeleteOrdeerHandler (toastHandler , loadingState ,gettingData ) {
    //         let toast = {status :'', title :'', message:''}
    //         loadingState(true)
    //         //---------------------------------------------
    //             const formdata = new FormData();
    //             const headers = {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             };
    //             try{
    //                 const response = await axios.delete(GET_ORDER_URL+'/'+id, formdata ,{headers} );
    //                 const resData =  response.data ;
    //                 loadingState(false)
    //                 toast= {status :resData.status,message:"Order Removed successfully",title:'Removed Order'}
    //                 toastHandler(toast);
    //                 gettingData(resData.data.order)
    //             }catch(err){
    //                 loadingState(false)
    //                 toast = {status :'error',message:err.response.data.message,title:'Removed Order failed'};
    //                 toastHandler(toast);
    //             }
    //     } 
    //     const toastHandler =(toast)=>{
    //         dispatch(uiActions.notificationDataChanged(toast))
    //         dispatch(uiActions.showNotification(true))
    //     } 
    //     const loadingState = (state)=>{
    //         dispatch(uiActions.showLoading(state))
    //     }
    //     onDeleteOrdeerHandler(toastHandler , loadingState )
    //     dispatch(uiActions.showNotification(false))
    // }
    const onSubmitFeedback =(feedback , rate)=>{
        const socket = io(origin);
        if(order){
            async function onSubmitFeedbackHandler (toastHandler , loadingState ) {
                let toast = {status :'', title :'', message:''}
                loadingState(true)
                //---------------------------------------------
                    const formdata = new FormData();
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                    formdata.append('aiModelId',order?.aiModelId)
                    formdata.append('orderId' , id)
                    formdata.append('desc' , feedback)
                    formdata.append('star' , rate)
                    try{
                        const response = await axios.post(REV_URL, formdata ,{headers} );
                        const resData =  response?.data ;
                        loadingState(false)
                        toast= {status :resData.status,message:"review Submitted successfully",title:'Submit review'}
                        toastHandler(toast);
                        const notificationData ={
                            actionDesc :`New Review For Your Work!`,
                            to : order?.developerData?.id,
                            from : order?.clientData?.id,
                            actionLink : `/order/view/${order?.id}`,
                        }
                        const { data } = await createNotification(notificationData);
                        socket.emit("order_created", data?.data?.newNotification);
                    }catch(err){
                        loadingState(false)
                        toast = {status :'error',message:err.response?.data?.message,title:'Submit review failed'};
                        toastHandler(toast);
                    }
            } 
            const toastHandler =(toast)=>{
                dispatch(uiActions.notificationDataChanged(toast))
                dispatch(uiActions.showNotification(true))
            } 
            const loadingState = (state)=>{
                dispatch(uiActions.showLoading(state))
            }
            onSubmitFeedbackHandler(toastHandler , loadingState )
            dispatch(uiActions.showNotification(false))
        }
    }
    //======================================================================================================================
    return (
        <>

            <OrderBoxWidgets order={order} confirmOrdeerHandler={confirmOrdeerHandler}/>
            {review && <FeedbackList  rev={[review]} formTitle='Review Made on This Order' />}
            {(!review && (thisUserRole === 'CLIENT')) && 
            <FeedbackForm avatar={avatar} orgUsername={org_username} firstName={firstName} thisUserRole={thisUserRole}
            onSubmitFeedback={onSubmitFeedback} formTitle='Submit your Review regarding this Order'/>
            }
        </>
    )
}

export default OrderView