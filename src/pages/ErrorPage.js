import { useNavigate, ScrollRestoration } from 'react-router-dom';
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
import { Link } from 'react-router-dom';
import { RiRobot2Line } from "react-icons/ri";
import styles from './ErrorPage.module.scss';
import { getTokenDuration, getAuthToken } from '../utility/tokenLoader';
import { safeParseStorage } from '../utility/safeParseStorage';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/authSlice';
import { cartActions } from '../store/Cart-slice';
import { uiActions } from '../store/UI-slice';
import UpButton from '../components/layout/UpButton'
import { footerNavData } from '../constants/marketingData'
import WarningModal from '../components/layout/WarningModal'
import { socket } from '../hooks/useSocket';

const API = createAPI();

let warningTimeoutId = null;
let expireTimeoutId = null;
const SESSION_MINUTES = 45;

const ErrorPage = ({ msgCounter, notCounter, notifys, handleDeleteNotification, handleUpdateNotification, chats, checkOnlineStatus, handleDeleteChat, getSearch,
    onClickLink }) => {
    //----------------------------------------
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
    //----------------------------------------

    const onAction = async () => {
        try {
            const currentToken = getAuthToken();
            if (!currentToken || currentToken === 'EXPIRED') throw new Error("No token");

            const response = await API.get(`auth/refresh-token`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            const resData = response.data;
            const newToken = resData.token;

            localStorage.setItem('token', newToken);
            let userDataStorage = safeParseStorage('userData');
            if (userDataStorage) {
                userDataStorage.token = newToken;
                localStorage.setItem('userData', JSON.stringify(userDataStorage));
                dispatch(authActions.onLogin(userDataStorage));
            }

            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + SESSION_MINUTES);
            localStorage.setItem('expiration', expiration.toISOString());

            setSessionKey(prev => prev + 1);
            setWarning(prev => ({ ...prev, show: false }));
        } catch (error) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Session Expired',
                message: error?.response?.data?.message || 'Your session has expired. Please log in again.',
            }));
            dispatch(uiActions.showNotification(true));
            socket.emit("leavingRoom", userData?.id);
            dispatch(authActions.onLoginOut());
            navigate("/auth?mode=login", { replace: true });
            setWarning(prev => ({ ...prev, show: false }));
        }
    }
    //----------------
    const closeModal = () => {
        // Just hide the modal! Do NOT forcefully log out.
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
    let token = getAuthToken();
    //----------------------------------CART DATA
    useEffect(() => {
        // Hydrate cart for ALL users (Guests, Clients, etc)
        const cartItems = safeParseStorage('cartItems');
        if (cartItems && cartItems.length > 0) {
            const fetchCartModels = async () => {
                try {
                    const ids = cartItems.map(i => i.id).filter(id => !!id).join(',');
                    if (!ids) return;
                    const res = await API.get(`aiModel?id=${ids}`);
                    const models = res?.data?.data?.models || [];

                    const hydratedItems = [];
                    cartItems.forEach(cartItem => {
                        const model = models.find(m => String(m.id) === String(cartItem.id));
                        if (model) {
                            hydratedItems.push({ ...model, versionId: cartItem.versionId });
                        }
                    });
                    dispatch(cartActions.onSetCart(hydratedItems));
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err?.response?.data?.message || 'Failed to sync cart data from DB',
                    }));
                    dispatch(uiActions.showNotification(true));
                }
            };
            fetchCartModels();
        } else {
            dispatch(cartActions.onSetCart([]));
        }
    }, [dispatch])
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
            setWarning(prev => ({ ...prev, show: false }));
        }, tokenDuration);

        return () => {
            if (warningTimeoutId) clearTimeout(warningTimeoutId);
            if (expireTimeoutId) clearTimeout(expireTimeoutId);
        };
    }, [token, sessionKey, navigate, dispatch, userData?.id]);
    //----------------------------------------
    // Removed the secondary auto-logout useEffect entirely since expireTimeoutId now handles it!
    //----------------------------------------
    //----------------------------------------

    return <>
        {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction} />}
        {showNotification && <Toast close={onCloseNotificationHandler} status={status} title={title} message={message} onAnimationEnd={onCloseNotificationHandler} />}
        <div className={`overlay  ${(menuOpen || isLoading) && 'active'}`} onClick={onCloseHandler} ></div>
        {isLoading && <LoadingSpinner />}
        <Topbar txt_1={'Connecting AI developers with buyers worldwide.'} txt_2={''} txt_3={'sign in'} txt_4={'Join'} />
        <TopNavBar getSearch={getSearch} />
        <NavBar msgCounter={msgCounter} notCounter={notCounter} notifys={notifys} handleUpdateNotification={handleUpdateNotification} chats={chats}
            handleDeleteNotification={handleDeleteNotification} checkOnlineStatus={checkOnlineStatus} handleDeleteChat={handleDeleteChat}
            onClickLink={onClickLink} />
        <MobNav onClick={onClickHandler} txt_3={'sign in'} txt_4={'Join'} msgCounter={msgCounter} notCounter={notCounter} />
        <MobNavMenu menuOpen={menuOpen} onClose={onCloseHandler} onClickLink={onClickLink}
            txt_1={'Connecting AI developers with buyers worldwide.'} txt_2={''} txt_3={'sign in'} txt_4={'Join'}
        />
        <main className={styles['container']}>
            <UpButton scroll={scroll} />
            <ScrollRestoration />
            <Link to={'/'} className={styles._headding} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <RiRobot2Line className={styles.iconImg} style={{ fontSize: '180px', marginBottom: '20px', color: 'var(--primary)', filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.4))' }} />
                </div>
                <br />
                <span style={{ fontSize: '2rem', color: 'var(--main-color)' }}>Something went wrong!</span>
            </Link>
        </main>
        <Footer footerNavData={footerNavData} onClickLink={onClickLink} />
    </>
};
export default ErrorPage;