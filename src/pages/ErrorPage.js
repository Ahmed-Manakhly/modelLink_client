// eslint-disable-next-line 
/* eslint-disable */
import { useLoaderData ,useNavigate  , ScrollRestoration } from 'react-router-dom' ;
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
import { useDispatch , useSelector} from 'react-redux'; 
import {authActions} from '../store/Auth.-slice' ;
import {cartActions} from '../store/Cart-slice' ;
import {uiActions} from '../store/UI-slice' ;
import UpButton from '../components/layout/UpButton'
import { footerCategoriesData , mobNavData , mobNavData_2} from '../data'
import WarningModal from '../components/layout/WarningModal'
import {BASE_URL} from '../lib/api'

//=======================================================
import { RiRobot2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.scss";


import io from "socket.io-client";

let init = true

const ErrorPage = ({msgCounter , notCounter , notifys , handleDeleteNotification , handleUpdateNotification , chats , checkOnlineStatus , handleDeleteChat , getSearch,
    onClickLink}) => {
    //----------------------------------------
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
    const userData = JSON.parse(localStorage.getItem('userData'))
    const {status,message,title} = notificationData ;
    const isLoading = useSelector(state => state.ui.isLoading)
    //----------------------------------------

    const onAction = ()=>{
        setTimeExtanded(true)
        init = true
        closeModal();
    }
    //----------------
    const closeModal = ()=>{
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
    let token = getAuthToken() ;

    useEffect(()=>{
        if(timeExtanded){
            token = getAuthToken() ;
        }
    },[timeExtanded])
    //----------------------------------CART DATA
    useEffect(()=>{
        if(token){
            if(userData?.role === 'CLIENT'){ 
                const cartItems = localStorage.getItem('cartItems') ;
                if(cartItems){
                    dispatch(cartActions.onSetCart(JSON.parse(cartItems)))
                }
            }
        }
    },[token ,userData?.role ,dispatch])
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
            const socket = io(BASE_URL);
            socket.emit("leavingRoom", userData?.id); 
            dispatch(authActions.onLoginOut())
            navigate("/auth?mode=login",{replace :true});
            // console.log('EXPIRED')
        }
        if(token && init  ){
            if(timeExtanded){
                const userData = localStorage.getItem('userData') ;
                dispatch(authActions.onLogin(JSON.parse(userData)))
                const expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 40) ;
                localStorage.setItem('expiration' , expiration.toISOString()) ;
                const now = new Date() ;
                const tokenDuration = expiration.getTime() - now.getTime() ;
                setTimeout(()=>{
                    setWarning({show:true , type : 'action' , message : 'Your session will be expired in 5 seconds' , action :'Keep Me Login'}) ;
                },tokenDuration)
                setTimeExtanded(false)
                init = false
            }else if(token !== 'EXPIRED'){
                const userData = localStorage.getItem('userData') ;
                dispatch(authActions.onLogin(JSON.parse(userData)))
                const tokenDuration = getTokenDuration() ;
                setTimeout(()=>{
                    setWarning({show:true , type : 'action' , message : 'Your session will be expired in 5 seconds' , action :'Keep Me Login'}) ;
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
    //----------------------------------------

    return <>
            {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction}/>}
            {showNotification && <Toast close={onCloseNotificationHandler} status={status} title={title} message={message} onAnimationEnd={onCloseNotificationHandler}/>}
            <div className={`overlay  ${(menuOpen || isLoading) && 'active'}`}  onClick={onCloseHandler} ></div>
            {isLoading && <LoadingSpinner/>}
            <Topbar txt_1={'specializing in medical AI solutions for easy and global accessibility.'} txt_2={''} txt_3={'sign in'} txt_4={'Join'} />
            <TopNavBar getSearch={getSearch}/>
            <NavBar msgCounter={msgCounter} notCounter={notCounter} notifys={notifys} handleUpdateNotification={handleUpdateNotification} chats={chats}
                handleDeleteNotification={handleDeleteNotification}  checkOnlineStatus={checkOnlineStatus} handleDeleteChat={handleDeleteChat} 
                onClickLink={onClickLink} />
            <MobNav onClick={onClickHandler} txt_3={'sign in'} txt_4={'Join'} msgCounter={msgCounter} notCounter={notCounter}/>
            <MobNavMenu menuOpen={menuOpen}  onClose={onCloseHandler} NavData={token? mobNavData_2:mobNavData}  onClickLink={onClickLink}
            txt_1={'specializing in medical AI solutions for easy and global accessibility.'} txt_2={''} txt_3={'sign in'} txt_4={'Join'}
            />
            <main className={styles['container']}>
                <UpButton scroll={scroll} />
                <ScrollRestoration/>
                <Link to={'/'} className={styles._headding}>
                    <RiRobot2Line className={styles.iconImg} />
                    Something went wrong!
                </Link>
            </main>
        <Footer footerNavData={mobNavData_2} footerCategoriesData={footerCategoriesData}   onClickLink={onClickLink} />
    </>
} ;
export default ErrorPage ;