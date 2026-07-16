// eslint-disable-next-line
/* eslint-disable */
import {Outlet  ,useLoaderData ,useNavigate  , ScrollRestoration } from 'react-router-dom' ;
import Topbar from '../components/layout/Topbar' ;
import TopNavBar from '../components/layout/TopNavBar' ;
import NavBar from '../components/layout/NavBar' ;
import MobNav from '../components/layout/MobNav' ;
import Footer from '../components/layout/Footer' ;
import MobNavMenu from '../components/layout/MobNavMenu' ;
import Toast from '../components/layout/Toast' ;
import LoadingSpinner from '../components/layout/LoadingSpinner' ;
//-----------------------------------------
import {useState , useEffect} from 'react'
import { getTokenDuration , getAuthToken } from '../utility/tokenLoader';
import { safeParseStorage } from '../utility/safeParseStorage';
import { useDispatch , useSelector} from 'react-redux';
import {authActions} from '../store/authSlice' ;
import {cartActions} from '../store/Cart-slice' ;
import {uiActions} from '../store/UI-slice' ;
import UpButton from '../components/layout/UpButton'
import {  footerCategoriesData , mobNavData , mobNavData_2} from '../constants/marketingData'
import WarningModal from '../components/layout/WarningModal'
import { socket } from '../hooks/useSocket';
import {
    selectUnreadChats,
    selectUnreadNotifications,
    selectChats,
    selectNotifications,
    selectOnlineUsers,
    checkOnlineStatus as checkChatOnlineStatus,
} from '../store/realtimeSlice';

let init = true
// Match server ACCESS_TOKEN_EXPIRATION (2700000 ms = 45 min)
const SESSION_MINUTES = 45;



const RootLayout = ({ handleDeleteNotification , handleUpdateNotification , handleReadAllNotifications , handleDeleteChat , getSearch}) => {
    const [menuOpen , setMenuOpen]=useState(false) ;
    const [warning,setWarning] = useState({show:false , type : '' , message : '' , action : ''}) ;
    const [timeExtanded,setTimeExtanded] = useState(false) ;

    const onClickHandler = ()=>{
        setMenuOpen(true)
    }
    const onCloseHandler = ()=>{
        setMenuOpen(false)
    }
    //----------------------------------------
    const notificationData = useSelector(state => state.ui.notificationData)
    const showNotification = useSelector(state => state.ui.showNotification)
    const userData = useSelector(state => state.auth.userData) || {}
    const {status,message,title} = notificationData ;
    const isLoading = useSelector(state => state.ui.isLoading)
    const msgCounter = useSelector(selectUnreadChats)
    const notCounter = useSelector(selectUnreadNotifications)
    const chats = useSelector(selectChats)
    const notifys = useSelector(selectNotifications)
    const onlineUsers = useSelector(selectOnlineUsers)
    const checkOnlineStatus = (chat) => checkChatOnlineStatus(chat, userData?.id, onlineUsers)
    //----------------------------------------

    const onAction = ()=>{
        setTimeExtanded(true)
        init = true
        closeModal();
    }
    //----------------
    const closeModal = ()=>{
        if (warning.cancelText === 'Logout') {
            socket.emit("leavingRoom", userData?.id);
            dispatch(authActions.onLoginOut());
            navigate("/auth?mode=login", { replace: true });
        }
        setWarning(prev => {
            return {...prev , show : false}
        })
    }
    //----------------------------------------
    const onCloseNotificationHandler = ()=>{
        dispatch(uiActions.showNotification(false))
    }
    //----------------------------------------
    const dispatch = useDispatch();
    //----------------------------------------
    let token = useLoaderData() ;

    useEffect(()=>{
        if(timeExtanded){
            token = getAuthToken() ;
        }
    },[timeExtanded , token])
    //----------------------------------CART DATA
    useEffect(()=>{
        if(token){
            if(userData?.role === 'CLIENT'){
                const cartItems = safeParseStorage('cartItems');
                if (cartItems) {
                    dispatch(cartActions.onSetCart(cartItems))
                }
            }
        }
    },[token , dispatch , userData?.role ])
    //----------------------------------------
    const navigate = useNavigate();
    const [scroll,setScroll]=useState(false)
    const scrollHandler =()=>{
        window.scrollY > 90 ? setScroll(true):setScroll(false) ;
    }
    window.addEventListener('scroll', scrollHandler)

    useEffect(() => {
        if(!token){
            return ;
        }
        //-----------------------------------------------------
        if(token === 'EXPIRED' && !timeExtanded) {
            socket.emit("leavingRoom", userData?.id);
            dispatch(authActions.onLoginOut())
            navigate("/auth?mode=login",{replace :true});
            // console.log('EXPIRED')
        }
        if(token && init  ){
            if(timeExtanded){
                const storedUserData = safeParseStorage('userData');
                if (storedUserData) {
                    dispatch(authActions.onLogin(storedUserData))
                }
                const expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + SESSION_MINUTES) ;
                localStorage.setItem('expiration' , expiration.toISOString()) ;
                const now = new Date() ;
                const tokenDuration = expiration.getTime() - now.getTime() ;
                setTimeout(()=>{
                    setWarning({show:true , type : 'action' , message : 'Your Session Will Be Expired In 5 Seconds' , action :'Keep Me Login', cancelText: 'Logout'}) ;
                },tokenDuration)
                setTimeExtanded(false)
                init = false
            }else if(token !== 'EXPIRED'){
                const storedUserData = safeParseStorage('userData');
                if (storedUserData) {
                    dispatch(authActions.onLogin(storedUserData))
                }
                const tokenDuration = getTokenDuration() ;
                setTimeout(()=>{
                    setWarning({show:true , type : 'action' , message : 'Your Session Will Be Expired In 5 Seconds' , action :'Keep Me Login', cancelText: 'Logout'}) ;
                },tokenDuration)
                init = false
            }
        }
    }, [token  , navigate , dispatch , init ,timeExtanded ,userData ]);
    //----------------------------------------
    useEffect(()=>{
        if(warning.show === true){

                if(!timeExtanded){
                    setTimeout(()=>{
                        closeModal();
                        init = true;
                    },5000)
                }else{
                    return
                }
        }
    },[warning.show , timeExtanded])
    return (
        <>
            {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction}/>}
            {showNotification && <Toast close={onCloseNotificationHandler} status={status} title={title} message={message} onAnimationEnd={onCloseNotificationHandler}/>}
            <div className={`overlay  ${(menuOpen || isLoading) && 'active'}`}  onClick={onCloseHandler} ></div>
            {isLoading && <LoadingSpinner/>}
            <Topbar txt_1={'Connecting AI developers with buyers worldwide. 🌍'} txt_2={''} txt_3={'sign in'} txt_4={'Join'} />
            <TopNavBar getSearch={getSearch}/>
            <NavBar handleUpdateNotification={handleUpdateNotification} handleReadAllNotifications={handleReadAllNotifications}
                handleDeleteNotification={handleDeleteNotification} handleDeleteChat={handleDeleteChat} />
            <MobNav onClick={onClickHandler} txt_3={'sign in'} txt_4={'Join'} />
            <MobNavMenu menuOpen={menuOpen}  onClose={onCloseHandler} NavData={token? mobNavData_2:mobNavData}  
            txt_1={'Connecting AI developers with buyers worldwide. 🌍'} txt_2={''} txt_3={'sign in'} txt_4={'Join'}
            />
            <main >
                <UpButton scroll={scroll} />
                <ScrollRestoration/>
                <Outlet context={{ msgCounter, notCounter }} />
            </main>
            <Footer footerNavData={mobNavData_2} footerCategoriesData={footerCategoriesData}   />
        </>
    )
} ;
export default RootLayout ;