// eslint-disable-next-line
/* eslint-disable */
import { Outlet, useLoaderData, useNavigate, ScrollRestoration } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import TopNavBar from '../components/layout/TopNavBar';
import NavBar from '../components/layout/NavBar';
import MobNav from '../components/layout/MobNav';
import Footer from '../components/layout/Footer';
import MobNavMenu from '../components/layout/MobNavMenu';
import Toast from '../components/layout/Toast';
import LoadingSpinner from '../components/layout/LoadingSpinner';
//-----------------------------------------
import { useState, useEffect } from 'react'
import { createAPI } from '../lib/api';
const API = createAPI();
import { getTokenDuration, getAuthToken } from '../utility/tokenLoader';
import { safeParseStorage } from '../utility/safeParseStorage';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/authSlice';
import { cartActions } from '../store/Cart-slice';
import { uiActions } from '../store/UI-slice';
import UpButton from '../components/layout/UpButton'
import { footerCategoriesData, mobNavData, mobNavData_2 } from '../constants/marketingData'
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

let warningTimeoutId = null;
let expireTimeoutId = null;
// Match server ACCESS_TOKEN_EXPIRATION (2700000 ms = 45 min)
const SESSION_MINUTES = 45;



const RootLayout = ({ handleDeleteNotification, handleUpdateNotification, handleReadAllNotifications, handleDeleteChat, getSearch }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [warning, setWarning] = useState({ show: false, type: '', message: '', action: '' });
    const [sessionKey, setSessionKey] = useState(0);

    const onClickHandler = () => {
        setMenuOpen(true)
    }
    const onCloseHandler = () => {
        setMenuOpen(false)
    }
    //----------------------------------------
    const notificationData = useSelector(state => state.ui.notificationData)
    const showNotification = useSelector(state => state.ui.showNotification)
    const userData = useSelector(state => state.auth.userData) || {}
    const { status, message, title } = notificationData;
    const isLoading = useSelector(state => state.ui.isLoading)
    const msgCounter = useSelector(selectUnreadChats)
    const notCounter = useSelector(selectUnreadNotifications)
    const chats = useSelector(selectChats)
    const notifys = useSelector(selectNotifications)
    const onlineUsers = useSelector(selectOnlineUsers)
    const checkOnlineStatus = (chat) => checkChatOnlineStatus(chat, userData?.id, onlineUsers)
    //----------------------------------------

    const onAction = async () => {
        try {
            // Get current token to pass as Bearer (if needed by protect middleware)
            const currentToken = getAuthToken();
            if (!currentToken || currentToken === 'EXPIRED') throw new Error("No token");

            // 1. Call backend to get a fresh 45-min token
            const response = await API.get(`auth/refresh-token`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            const resData = response.data;
            const newToken = resData.token;

            // 2. Update local storage with the new token
            localStorage.setItem('token', newToken);
            let userDataStorage = safeParseStorage('userData');
            if (userDataStorage) {
                userDataStorage.token = newToken;
                localStorage.setItem('userData', JSON.stringify(userDataStorage));
                // Update redux with new token to trigger UI sync
                dispatch(authActions.onLogin(userDataStorage));
            }
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + SESSION_MINUTES);
            localStorage.setItem('expiration', expiration.toISOString());

            setSessionKey(prev => prev + 1);
            // Directly hide the modal instead of calling closeModal (which forcefully logs out)
            setWarning(prev => ({ ...prev, show: false }));
        } catch (error) {
            console.error("Session refresh failed:", error);
            // If it fails, log out
            socket.emit("leavingRoom", userData?.id);
            dispatch(authActions.onLoginOut());
            navigate("/auth?mode=login", { replace: true });
            setWarning(prev => ({ ...prev, show: false }));
        }
    }
    //----------------
    const closeModal = () => {
        // Just hide the modal! Do NOT forcefully log out. 
        // The expireTimeoutId will naturally handle the logout when the session actually reaches 0.
        setWarning(prev => {
            return { ...prev, show: false }
        })
    }
    //----------------------------------------
    const onCloseNotificationHandler = () => {
        dispatch(uiActions.showNotification(false))
    }
    //----------------------------------------
    const dispatch = useDispatch();
    //----------------------------------------
    let token = useLoaderData();
    //----------------------------------CART DATA
    useEffect(() => {
        if (token) {
            if (userData?.role === 'CLIENT') {
                const cartItems = safeParseStorage('cartItems');
                if (cartItems) {
                    dispatch(cartActions.onSetCart(cartItems))
                }
            }
        }
    }, [token, dispatch, userData?.role])
    //----------------------------------------
    const navigate = useNavigate();
    const [scroll, setScroll] = useState(false)
    const scrollHandler = () => {
        window.scrollY > 90 ? setScroll(true) : setScroll(false);
    }
    window.addEventListener('scroll', scrollHandler)

    useEffect(() => {
        if (!token) return;

        if (token === 'EXPIRED') {
            socket.emit("leavingRoom", userData?.id);
            dispatch(authActions.onLoginOut());
            navigate("/auth?mode=login", { replace: true });
            return;
        }

        const storedUserData = safeParseStorage('userData');
        if (storedUserData && storedUserData.id !== userData?.id) {
            dispatch(authActions.onLogin(storedUserData));
        }

        const tokenDuration = getTokenDuration();
        if (tokenDuration <= 0) {
            socket.emit("leavingRoom", userData?.id);
            dispatch(authActions.onLoginOut());
            navigate("/auth?mode=login", { replace: true });
            return;
        }

        const warningTime = Math.max(0, tokenDuration - 300000); 
        
        if (warningTimeoutId) clearTimeout(warningTimeoutId);
        warningTimeoutId = setTimeout(() => {
            setWarning({ show: true, type: 'action', message: 'Your Session Will Be Expired Soon', action: 'Keep Me Login', cancelText: 'Close' });
        }, warningTime);

        if (expireTimeoutId) clearTimeout(expireTimeoutId);
        expireTimeoutId = setTimeout(() => {
            socket.emit("leavingRoom", userData?.id);
            dispatch(authActions.onLoginOut());
            navigate("/auth?mode=login", { replace: true });
            setWarning(prev => ({...prev, show: false}));
        }, tokenDuration);

        return () => {
            if (warningTimeoutId) clearTimeout(warningTimeoutId);
            if (expireTimeoutId) clearTimeout(expireTimeoutId);
        };
    }, [token, sessionKey, navigate, dispatch, userData?.id]);
    //----------------------------------------
    // Removed the secondary auto-logout useEffect entirely since expireTimeoutId now handles it!
    //----------------------------------------
    return (
        <>
            {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction} />}
            {showNotification && <Toast close={onCloseNotificationHandler} status={status} title={title} message={message} onAnimationEnd={onCloseNotificationHandler} />}
            <div className={`overlay  ${(menuOpen || isLoading) && 'active'}`} onClick={onCloseHandler} ></div>
            {isLoading && <LoadingSpinner />}
            <Topbar txt_1={'Connecting AI developers with buyers worldwide. 🌍'} txt_2={''} txt_3={'sign in'} txt_4={'Join'} />
            <TopNavBar getSearch={getSearch} />
            <NavBar handleUpdateNotification={handleUpdateNotification} handleReadAllNotifications={handleReadAllNotifications}
                handleDeleteNotification={handleDeleteNotification} handleDeleteChat={handleDeleteChat} />
            <MobNav onClick={onClickHandler} txt_3={'sign in'} txt_4={'Join'} />
            <MobNavMenu menuOpen={menuOpen} onClose={onCloseHandler} NavData={token ? mobNavData_2 : mobNavData}
                txt_1={'Connecting AI developers with buyers worldwide. 🌍'} txt_2={''} txt_3={'sign in'} txt_4={'Join'}
            />
            <main >
                <UpButton scroll={scroll} />
                <ScrollRestoration />
                <Outlet context={{ msgCounter, notCounter }} />
            </main>
            <Footer footerNavData={mobNavData_2} footerCategoriesData={footerCategoriesData} />
        </>
    )
};
export default RootLayout;