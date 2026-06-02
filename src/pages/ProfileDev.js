import {useParams}  from "react-router-dom";
import {useDispatch} from 'react-redux'; 
import {uiActions} from '../store/UI-slice' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect , useState} from 'react' ;
import {useNavigate , Link } from 'react-router-dom';
import ProfileBoxWidgetsDev from '../components/ProfileBoxWidgetsDev'
import {getModel , getOrder} from '../lib/loaders';
import {GET_USER_PROFILE_URL , ALL_MODELS_BY_USER_URL ,GET_ORDERS_BY_CLIENT_URL , origin} from '../lib/api' ;
import PopularServices from '../components/PopularServices'
import PageTableSec from '../components/layout/PageTableSec'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatCard from '../components/ChatCard'
import { Box } from "@mui/material";
import { Col  } from 'react-bootstrap'
// import {getAuthToken} from '../utility/tokenLoader'




function ProfileDev({onlineUsers}) {
    const token = getAuthToken() ;
    const thisUserRole = token? JSON.parse(localStorage.getItem('userData')).role : null
    const navigate = useNavigate();
    useEffect(() => {
        if(!token){
            navigate("/",{replace :true});
            return ;
        }
    },[token , navigate])
    const dispatch = useDispatch();  
    const [user,setUser] = useState({}) ;
    const [models,setModels] = useState([]) ;
    const [userUpdated,setUserUpdated] = useState(false) ;
    const [orders,setOrders] = useState([]) ;
    //------------------------------------------------------
    const { id } = useParams();
    const goUpHandler = ()=> {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    useEffect(()=>{
        goUpHandler()
    },[user])
    //------------------------------------------------

    useEffect(() => {
        const  headers = {
            'Content-Type': 'multipart/form-data', 
            'Authorization': `Bearer ${token}`,
        }
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
            setUser(data?data?.user:null)
            setUserUpdated(true)
        }
        getOrder(GET_USER_PROFILE_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'user!' )
        dispatch(uiActions.showNotification(false))
        // return redirect('');
    },[dispatch , id , token])
        //----------------------------------------------------
        useEffect(() => {
            if(userUpdated && user.role === 'DEVELOPER' ){
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
                setUserUpdated(false)
            }
        },[userUpdated , user , dispatch , id])
    //------------------------------------------
    useEffect(() => {
        if(userUpdated && user.role === 'CLIENT' ){
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
            getOrder(GET_ORDERS_BY_CLIENT_URL+'/'+id, headers ,toastHandler , loadingState , notificationState , gettingData,'Orders!' )
            dispatch(uiActions.showNotification(false))
            setUserUpdated(false)
        }
    },[userUpdated , user , dispatch , id ,token])
    //----------------------------------------------------------
    //img | title
    const columns = [
        {field: "title", headerName: "Model Name" ,flex: 0.2},
        {field: "img",headerName: "",flex: 0.4,
            renderCell: (params) => {
                return (
                    <Col xs={0} md lg className={` d-flex flex-column align-items-left w-100 P-5`} >
                        <img width='100px'  src={origin+params?.row?.img} alt={'Model Cover'} crossOrigin="anonymous" />
                    </Col>
                )
            }
        },
        {field: "price", headerName: "Model Price" ,flex: 0.2},
        {field: "viewModel",headerName: "View TheModel",flex: 0.2,
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
    return (
        <>
            { ((user.role === 'DEVELOPER') && (thisUserRole === 'CLIENT')) &&  <ChatCard onlineUsers={onlineUsers}  userData={user}/>}
            <ProfileBoxWidgetsDev user={user}/>
            {user.role === 'DEVELOPER' && <PopularServices models={models.slice(0,10)} title='Models Uploaded By This Developer'/>}
            {user.role === 'CLIENT' && <PageTableSec data={orders} columns={columns}  tableTitle={'Models Reviewed By This User'}/>}
        </>
    )
}

export default ProfileDev