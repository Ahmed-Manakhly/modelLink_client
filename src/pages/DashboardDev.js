
import BoxWidgets from '../components/BoxWidgets'
import {useSubmit , Link}  from "react-router-dom";
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect , useState} from 'react' ;
import {useNavigate, useOutletContext  } from 'react-router-dom';
import WarningModal from '../components/layout/WarningModal'
import PageTable from '../components/layout/PageTable'
import PageTableSec from '../components/layout/PageTableSec'
import { Box } from "@mui/material";
//---------------------------------------icons
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {getModel , getOrder} from '../lib/loaders';
import {ALL_MODELS_BY_USER_URL , GET_ORDERS_BY_DEV_URL} from '../lib/api' ;


function DashboardDev() {
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
    },[id ,dispatch,navigate])
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
            const gettingData =(data)=>{
                setModels(data?data:[])
            }
            getModel(ALL_MODELS_BY_USER_URL+'/'+id, toastHandler , loadingState , notificationState , gettingData,'list of models!' )
            dispatch(uiActions.showNotification(false))
    },[dispatch , id])
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
        const gettingData =(data, resData)=>{
            setOrders(data?data:[])
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        getOrder(GET_ORDERS_BY_DEV_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Orders!' )
        dispatch(uiActions.showNotification(false))
    },[dispatch , id,token ])
    //==================================================================
    const [warning,setWarning] = useState({show:false , type : '' , message : '' , action : ''}) ;
    const [models,setModels] = useState([]) ;
    const [orders,setOrders] = useState([]) ;
    //----------------------------------
    const submit = useSubmit() ;
    //------------------actions
    const closeModal = ()=>{
    setWarning(prev => {
        return {...prev , show : false}
    })
    }
    //-----------------------
    const onAction = (id)=>{
        submit(null , {action : `/models/delete/${id}` , method : 'DELETE'}) ;
    closeModal();
    }
    //-------------
    function handleDelete(id) {
    setWarning({show:true , type : 'action' , message : 'Are you sure, You want to delete this Model?' , action :'Delete', id:id}) ;
    }
    //------------------------- columns
    const columns = [
    {field: "title", headerName: "Model Name" ,flex: 0.2},
    {field: "category",headerName: "Model Category", flex: 0.2,cellClassName: "name-column--cell"},
    {field: "price",headerName: "Model Price",flex: 0.2},
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
    {field: "actions",headerName: "Actions",flex: 0.2,
        renderCell: (params) => {
            return (
                <Box width="40%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
                    <Link to={"/models/view/" + params.row?.id} style={{textDecoration: "none"}}>
                        <VisibilityIcon style={{textDecoration: "none", color: '#5DB8DD'}} title="view"/>
                    </Link>
                    <Link to={"/models/edit/" + params.row.id} style={{textDecoration: "none"}}>
                        <BorderColorIcon style={{color: '#5DB8DD'}} title="edit"/>
                    </Link>
                    <div onClick={handleDelete.bind(null,params.row.id)}>
                        <DeleteIcon style={{color: '#5DB8DD' , cursor:'pointer'}} title="delete"/>
                    </div>
                </Box>
            )
        }
    }
    ];
  //--------------------------------------------------
  const columns_2 = [
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
            {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction}/>}
            <BoxWidgets totalOrders={orders.length} totalModels={models.length} msgCounter={msgCounter} notCounter={notCounter}/>
            <PageTable data={models} columns={columns}  tableTitle={'Manage Your Models'}/>
            <PageTableSec data={orders} columns={columns_2}  tableTitle={'Manage Your Orders'}/>
        </>
    )
}

export default DashboardDev