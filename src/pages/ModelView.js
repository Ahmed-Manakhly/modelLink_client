
import {  Link ,useParams}  from "react-router-dom";
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect , useState} from 'react' ;
import {useNavigate } from 'react-router-dom';
import ModelData from '../components/ModelData'
import ModelDataTop from '../components/ModelDataTop'
import ModelBoxWidgets from '../components/ModelBoxWidgets'
import FeedbackList from '../components/FeedbackList'
import VisibilityIcon from '@mui/icons-material/Visibility';
import {getModel , getOrder} from '../lib/loaders';
import {ALL_MODELS_URL } from '../lib/api' ;
import {CREATE_ORDER_URL,GET_ORDERS_BY_MODEL_URL ,ALL_MODELS_BY_USER_URL , GET_REVIEWS_BY_MODEL_URL} from '../lib/api' ;
import axios from 'axios'
import PageTableSec from '../components/layout/PageTableSec'
import { Box } from "@mui/material";
import PopularServices from '../components/PopularServices'
import ChatCard from '../components/ChatCard'
import {createNotification} from '../lib/notificationsRequests'
//=-----------------------------
import io from "socket.io-client";
import {origin} from '../lib/api'


//==========================


function ModelView({onlineUsers , refresh , modelRefresh}) {
    const navigate = useNavigate();
    const token = getAuthToken() ;
    const thisUserRole = token? JSON.parse(localStorage.getItem('userData')).role : null
    const thisUserId = token? JSON.parse(localStorage.getItem('userData')).id : null
    const org_ipAddress = token? JSON.parse(localStorage.getItem('userData')).org_ipAddress : null

   
    useEffect(() => {
        if(!token ){
            navigate("/auth?mode=login",{replace :true});
            return ;
        }
    },[token ,navigate])

    const dispatch = useDispatch();  
    const [model,setModel] = useState({}) ;
    const [orders,setOrders] = useState([]) ;
    const [models,setModels] = useState([]) ;
    const [reviews,setReviews] = useState([]) ;
    const [updated,setUpdated] = useState(false) ;
    const [modelUpdated,setModelUpdated] = useState(false) ;
    const [singleModelUpdated,setSingleModelUpdated] = useState(false) ;
    const { id } = useParams();


    //------------------------------------------------
    let clientOrders, isBuyer , isSeller , otherDev , otherClient , profileNotCompleted;
    if(orders && model){
        clientOrders = orders.filter(order=>order.clientId === thisUserId)
        isBuyer= clientOrders.length > 0 ;
        isSeller = model.userId === thisUserId ;
        otherDev = !isSeller && thisUserRole === 'DEVELOPER'
        otherClient = !isBuyer && thisUserRole === 'CLIENT'
    }
    if(otherClient && !org_ipAddress){
        profileNotCompleted=true
    }

    const goUpHandler = ()=> {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    useEffect(()=>{
        goUpHandler()
    },[model])

    useEffect(()=>{
        if(refresh){
            setUpdated(true)
        }
    },[refresh])
    useEffect(()=>{
        if(modelRefresh){
            setSingleModelUpdated(true)
        }
    },[modelRefresh])

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
            setModel(data?data:null)
            setModelUpdated(true)
        }
        getModel(ALL_MODELS_URL+'/'+id, toastHandler , loadingState , notificationState , gettingData,'model!' )
        dispatch(uiActions.showNotification(false))
    },[id , dispatch])
    //------------------------------------------
    useEffect(() => {
        if(singleModelUpdated){
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
                setModel(data?data:null)
                setModelUpdated(true)
            }
            getModel(ALL_MODELS_URL+'/'+id, toastHandler , loadingState , notificationState , gettingData,'model!' )
            dispatch(uiActions.showNotification(false))
            setSingleModelUpdated(false)
        }
    },[singleModelUpdated , id , dispatch])
    //------------------------------------------
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
            setOrders(data?data?.orders:[])
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        getOrder(GET_ORDERS_BY_MODEL_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Orders!' )
        dispatch(uiActions.showNotification(false))
    },[dispatch , id ,token ])
    //----------------------------------------------------
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
            setReviews(data?data?.allReviews:[])
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        getOrder(GET_REVIEWS_BY_MODEL_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Reviews!' )
        dispatch(uiActions.showNotification(false))
    },[token , id ,dispatch ])
    //----------------------------------------------------
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
                setReviews(data?data?.allReviews:[])
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            getOrder(GET_REVIEWS_BY_MODEL_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Reviews!' )
            dispatch(uiActions.showNotification(false))
            setUpdated(false)
        }
        
    },[dispatch , id , token , updated])
    //----------------------------------------------------
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
                setOrders(data?data?.orders:[])
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            getOrder(GET_ORDERS_BY_MODEL_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Orders!' )
            dispatch(uiActions.showNotification(false))
            setUpdated(false)
        }
    },[updated , id ,dispatch ,token])
    //----------------------------------------------------
    useEffect(() => {
        if(modelUpdated){
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
                setModels(data?data:[])
            }
            getModel(ALL_MODELS_BY_USER_URL+'/'+model?.userId, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
            setModelUpdated(false)
        }
    },[modelUpdated , dispatch , model?.userId ,])
    //---------------------------------------------------------------------
    const orderRequestHandler =()=>{
        const socket = io(origin);
        async function onOrderRequestHandler (toastHandler , loadingState ,gettingData) {
            let toast = {status :'', title :'', message:''}
            loadingState(true)
            //---------------------------------------------
                const formdata = new FormData();
                formdata.append('id',id)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                try{
                    const response = await axios.post(CREATE_ORDER_URL,formdata, {headers} );
                    const resData =  response.data ;
                    loadingState(false)
                    toast= {status :resData.status,message:"Order Created Successfully",title:'Creating Order'}
                    toastHandler(toast);
                    gettingData(resData.data.order)
                    const notificationData ={
                        actionDesc :`You have Got a New Order!`,
                        to : model?.userId,
                        from : thisUserId,
                        actionLink : `/order/view/${resData?.data?.order?.id}`,
                    }
                    const { data } = await createNotification(notificationData);
                    socket.emit("order_created", data.data.newNotification);
                }catch(err){
                    loadingState(false)
                    toast = {status :'error',message:err.response.data.message,title:'Creating Order failed'};
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
        const gettingData =(data)=>{
            setUpdated(true)
        }
        onOrderRequestHandler(toastHandler , loadingState ,gettingData)
        dispatch(uiActions.showNotification(false))
    }
    //------------------------- columns
    const columns = [
        {field: "createdAt",headerName: "Created At",flex: 0.4,
            renderCell: (params) => {
                return (
                    <p>{`${new Date(params?.row?.createdAt).toLocaleString('en-US')}`}</p>
                )
            }
        },
        {field: "updatedAt",headerName: "Updated At",flex: 0.4,
            renderCell: (params) => {
                return (
                    <p>{`${new Date(params?.row?.updatedAt).toLocaleString('en-US')}`}</p>
                )
            }
        },
        {field: "status",headerName: "Order Status",flex: 0.5,cellClassName: "name-column--cell",
            renderCell: (params) => {
                return (
                    <p>{`${params.row?.isCompleted? 'pending on payment' :'Waiting for seller confirmation'}`}</p>
                )
            }
        },
        {field: "view",headerName: "View Order Details",flex: 0.2,
            renderCell: (params) => {
                return (
                    <Box width="40%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
                        <Link to={"/order/view/" + params.row?.id} style={{textDecoration: "none"}}>
                            <VisibilityIcon style={{textDecoration: "none", color: '#5DB8DD'}} title="view"/>
                        </Link>
                    </Box>
                )
            }
        },
    ];
    //--------------------------------------------------
    return (
        <>
            {(model && (thisUserRole !== 'DEVELOPER')) && <ChatCard userData={model.userData} userId={model.userId} onlineUsers={onlineUsers} />}
            <ModelDataTop formTitle={'Model Details..'} model={model}  />
            <ModelData  formTitle={''} model={model} />
            <ModelBoxWidgets model={model} orderRequestHandler={orderRequestHandler} isBuyer={isBuyer} otherDev={otherDev} isSeller={isSeller} profileNotCompleted={profileNotCompleted}/>
            {isSeller&&<PageTableSec data={orders} columns={columns}  tableTitle={'Orders Made On This Model'}/>}
            {isBuyer && <PageTableSec data={clientOrders} columns={columns}  tableTitle={'Orders You Made On This Model'}/>}
            {(reviews.length > 0) && <FeedbackList  rev={reviews} formTitle='Check Reviews made on this model' />}
            <PopularServices models={models.slice(0,10)} title='More Models Made By This Developer'/>
        </>
    )
}

export default ModelView