
import BoxWidgets from '../components/BoxWidgets'
import {  Link}  from "react-router-dom";
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect , useState} from 'react' ;
import {useNavigate, useOutletContext  } from 'react-router-dom';
import PageTableSec from '../components/layout/PageTableSec'
import { Box } from "@mui/material";
//---------------------------------------icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import {  getOrder} from '../lib/loaders';
import { GET_ORDERS_BY_CLIENT_URL} from '../lib/api' ;



function OrdersClient() {
    let id =  JSON.parse(localStorage.getItem('userData'))?.id

    
    const navigate = useNavigate();
    const token = getAuthToken() ;
    const dispatch = useDispatch();  
    const { msgCounter, notCounter } = useOutletContext();
    //---------------------------------------------
    useEffect(() => {
        if(!id){
            let toast = {status :'error',message:'you have no access for this!',title:'Access Denied'};
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            navigate("/",{replace :true});
            return ;
        }
    },[id ,dispatch ,navigate])
    //------------------------------------------------
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
        const gettingData =(data, resData)=>{
            setOrders(data?data:[])
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        getOrder(GET_ORDERS_BY_CLIENT_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Orders!' )
        dispatch(uiActions.showNotification(false))
        // return redirect('');
    },[dispatch ,id,token])
    //==================================================================
    const [orders,setOrders] = useState([]) ;
    //--------------------------------------------------
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
        {field: "viewModel",headerName: "View Related Model",flex: 0.2,
            renderCell: (params) => {
                return (
                    <Box width="40%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
                        <Link to={"/models/view/" + params.row?.aiModelId} style={{textDecoration: "none"}}>
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
            <BoxWidgets totalOrders={orders.length} msgCounter={msgCounter} notCounter={notCounter}/>
            <PageTableSec data={orders} columns={columns}  tableTitle={'Manage Your Orders'}/>
        </>
    )
}

export default OrdersClient