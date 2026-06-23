/* eslint-disable */
import { createBrowserRouter, RouterProvider , Link , redirect , Navigate } from "react-router-dom";
import {useDispatch , useSelector} from 'react-redux';
import {authActions} from './store/authSlice' ;
import {tokenLoader, getAuthToken} from './utility/tokenLoader' ;
import {LoginAction} from './lib/actions'
import {deletingModelAction} from './lib/actions'
import { userChats ,removeChat} from "./lib/ChatRequests";
import { userNotifications , updateNotification , removeNotification, readAllNotificationsReq } from "./lib/notificationsRequests";
import {uiActions} from './store/UI-slice' ;
import { realtimeActions, selectOnlineUsers } from './store/realtimeSlice';
//-------------------------------
import './index.scss' ;
import './styles/tokens.css' ;
//========================
import Home from './pages/Home';
import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/ErrorPage';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import ProfileSettings from './pages/ProfileSettings';
import ProfileDev from './pages/ProfileDev';
import CreateModel from './pages/CreateModel';
import EditModel from './pages/EditModel';
import ModelView from './pages/ModelView';
import Stripe from './pages/Stripe';
import OrderView from './pages/OrderView';
import DashboardDev from './pages/DashboardDev';
import OrdersClient from './pages/OrdersClient';
import CartPage from './pages/CartPage';
import Models from './pages/Models';
import ChatNew from './pages/ChatNew';
import WalletPage from './pages/WalletPage';
import AdminDashboard from './pages/AdminDashboard';
import ReviewsClient from './pages/ReviewsClient';
import ReviewsDev from './pages/ReviewsDev';
import ForgotPassword from './components/layout/auth/ForgotPassword';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';
import {useEffect, useState, useCallback} from 'react'
import useSocket from './hooks/useSocket';
import { socket } from './hooks/useSocket';
import { getMeReq } from './lib/loaders';

import ChangePasswordPage from './pages/ChangePasswordPage';
function App() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userData)?.id
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const chatsUpdated = useSelector(state => state.realtime.chatsUpdated)
  const chatRefreshTick = useSelector(state => state.realtime.chatRefreshTick)
  const notificationsUpdated = useSelector(state => state.realtime.notificationsUpdated)
  const notify = useSelector(state => state.realtime.notify)
  const refresh = useSelector(state => state.realtime.refresh)
  const modelRefresh = useSelector(state => state.realtime.modelRefresh)
  const onlineUsers = useSelector(selectOnlineUsers)
  const userData = useSelector(state => state.auth.userData) || {};
  const userRole = userData.role;
  const isPlatformStaff = userRole === 'ADMIN' || userRole === 'EMPLOYEE';
  const token = getAuthToken();
  const hasSession = isLoggedIn || (token && token !== 'EXPIRED');

  const [modelsUpdated, setModelsUpdated] = useState(true);
  const [searchByVal, setSearchByVal] = useState(null);
  const [searchVal, setSearchVal] = useState(null);

  useSocket(userData?.id, {
    setNotify: (data) => dispatch(realtimeActions.setNotify(data)),
    setRefresh: (data) => dispatch(realtimeActions.setRefresh(data)),
    setModelRefresh: (data) => dispatch(realtimeActions.setModelRefresh(data)),
    setOnlineUsers: (users) => dispatch(realtimeActions.setOnlineUsers(users)),
    setModelsUpdated: (value) => dispatch(realtimeActions.setModelsUpdated(value)),
    onReceiveMsg: () => dispatch(realtimeActions.bumpChatListRefresh()),
  });

  const onModelsUpdated = () => {
    setModelsUpdated(false)
    setSearchByVal(null)
    setSearchVal(null)
  }

  const refreshSessionUser = useCallback(async () => {
    if (!token || token === 'EXPIRED') return;
    try {
      const { data } = await getMeReq({ Authorization: `Bearer ${token}` });
      if (data?.data?.user) {
        dispatch(authActions.updateUser(data.data.user));
      }
    } catch (_) {}
  }, [token, dispatch]);

  useEffect(() => {
    if (!userId) return;
    const onUserVerified = () => {
      refreshSessionUser();
    };
    socket.on('user_verified', onUserVerified);
    return () => socket.off('user_verified', onUserVerified);
  }, [userId, refreshSessionUser]);

  useEffect(() => {
    const onFocus = () => refreshSessionUser();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshSessionUser]);

  useEffect(() => {
    if(notify){
      dispatch(realtimeActions.setNotificationsUpdated(true))
    }
  },[notify, dispatch])

  useEffect(() => {
    if (!userId) return;
    const getChats = async () => {
      try {
        const { data } = await userChats(userId, token);
        dispatch(realtimeActions.setChats(data?.data?.chats || []));
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };
    if (chatsUpdated || chatRefreshTick > 0) {
      getChats();
    }
  }, [userId, chatsUpdated, chatRefreshTick, token, dispatch]);

  useEffect(() => {
    if((userId) && notificationsUpdated){
      const getNotifications = async () => {
        try {
          const { data } = await userNotifications(userId, token);
          dispatch(realtimeActions.setNotifications(data?.data || []));
        } catch (error) {
          console.log(error?.response?.data?.message);
        }
      };
      getNotifications();
    }
  }, [userId, notificationsUpdated, token, dispatch]);

  const onFeatchChats = () => dispatch(realtimeActions.setChatsUpdated(true))
  const onFeatchNotifications = () => dispatch(realtimeActions.setNotificationsUpdated(true))

  const handleDeleteNotification = async(id) =>{
    try{
      const { data } = await removeNotification(id, token)
      dispatch(realtimeActions.setNotificationsUpdated(true))
      dispatch(realtimeActions.setNotify(data))
    }catch(err){
      console.log(err?.response?.data?.message);
    }
  }

  const handleUpdateNotification = async(id) =>{
    try{
      const { data } = await updateNotification(id ,{unRead :  false}, token)
      dispatch(realtimeActions.markNotificationRead(id))
      dispatch(realtimeActions.setNotificationsUpdated(true))
      dispatch(realtimeActions.setNotify(data))
    }catch(err){
      console.log(err?.response?.data?.message);
    }
  }

  const handleReadAllNotifications = async () => {
    try {
      await readAllNotificationsReq({ Authorization: `Bearer ${token}` });
      dispatch(realtimeActions.markAllNotificationsRead());
      dispatch(realtimeActions.setNotificationsUpdated(true));
    } catch (err) {
      console.log(err?.response?.data?.message);
    }
  };

  const handleDeleteChat = async (id)=>{
    try{
      await removeChat(id, token)
      dispatch(realtimeActions.removeChat(id))
      dispatch(realtimeActions.setChatsUpdated(true))
    }catch(err){
      console.log(err?.response?.data?.message);
    }
  }

  const onLoginAction =  ({request}) =>{
    const toastHandler =(toast)=>{
      dispatch(uiActions.notificationDataChanged(toast))
      dispatch(uiActions.showNotification(true))
    }
    const actions =(data)=>{
      dispatch(authActions.onLogin(data))
    }
    const loadingState = (state)=>{
      dispatch(uiActions.showLoading(state))
    }
    LoginAction(request ,actions , toastHandler , loadingState )
    dispatch(uiActions.showNotification(false))
    return redirect('/');
  }

  const onDeletingModelAction =  ({request,params}) =>{
    const toastHandler =(toast)=>{
      dispatch(uiActions.notificationDataChanged(toast))
      dispatch(uiActions.showNotification(true))
    }
    const loadingState = (state)=>{
      dispatch(uiActions.showLoading(state))
    }
    deletingModelAction(request  , toastHandler , loadingState ,params)
    dispatch(uiActions.showNotification(false))
    return redirect(`/dashboard-dev`);
  }
  const getSearch =(searchByVal , searchVal)=>{
    setSearchByVal(searchByVal)
    setSearchVal(searchVal)
    setModelsUpdated(true)
  }

  const router = createBrowserRouter([
    {path: '/' , element : <RootLayout
    handleDeleteNotification={handleDeleteNotification}
    handleUpdateNotification={handleUpdateNotification}
    handleReadAllNotifications={handleReadAllNotifications}
    handleDeleteChat={handleDeleteChat}
    getSearch={getSearch} />
        , errorElement : <RouteErrorBoundary><ErrorPage/></RouteErrorBoundary> ,id:'root',loader: tokenLoader ,children:[
        {index : true , element : <RouteErrorBoundary><Home modelsUpdated={modelsUpdated} onModelsUpdated={onModelsUpdated} /></RouteErrorBoundary> },
        {path: 'contact', element : <RouteErrorBoundary><Contact/></RouteErrorBoundary>},
        {path : 'auth' , element : <RouteErrorBoundary><AuthPage/></RouteErrorBoundary> , action: onLoginAction ,errorElement :
          <RouteErrorBoundary>
          <div style={{height:'60vh'}}>
            invalid user name or password!
            <Link className='' to='/auth?mode=login' >Kindly Click Here</Link>
          </div>
          </RouteErrorBoundary>},
        {path: 'change-password', element: <RouteErrorBoundary>{isLoggedIn ? <ChangePasswordPage /> : <Navigate to="/auth?mode=login" />}</RouteErrorBoundary>},
        {path: 'dashboard-dev', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole !== 'DEVELOPER' ? <Navigate to={userRole === 'ADMIN' || userRole === 'EMPLOYEE' ? '/admin' : '/'} /> : <DashboardDev/>}</RouteErrorBoundary>   },
        {path: 'orders-client', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER'? <Navigate to="/" /> : <OrdersClient/>}</RouteErrorBoundary>},
        {path: 'reviews-client', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER' ? <Navigate to="/reviews-dev" /> : <ReviewsClient/>}</RouteErrorBoundary>},
        {path: 'reviews-dev', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole !== 'DEVELOPER' ? <Navigate to="/" /> : <ReviewsDev/>}</RouteErrorBoundary>},
        {path: 'profileSettings', element : <RouteErrorBoundary>{isLoggedIn ? <ProfileSettings/> : <Navigate to="/auth?mode=login" />}</RouteErrorBoundary>},
        {path: 'profile/:id', element : <RouteErrorBoundary><ProfileDev onlineUsers={onlineUsers} /></RouteErrorBoundary>},
        {path: 'cart', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER'? <Navigate to="/" /> : <CartPage/>}</RouteErrorBoundary>},
        {path: 'models', element : <RouteErrorBoundary><Models searchByVal={searchByVal} searchVal={searchVal}
          modelsUpdated={modelsUpdated} onModelsUpdated={onModelsUpdated} /></RouteErrorBoundary>},
        {path: 'models/new', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'CLIENT'? <Navigate to="/" /> :<CreateModel/>}</RouteErrorBoundary> },
        {path: 'models/edit/:id', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'CLIENT'? <Navigate to="/" /> :<EditModel/>}</RouteErrorBoundary>,},
        {path: 'models/view/:id', element : <RouteErrorBoundary><ModelView refresh={refresh} modelRefresh={modelRefresh} onlineUsers={onlineUsers} /></RouteErrorBoundary>},
        {path: 'order/view/:id', element : <RouteErrorBoundary>{hasSession ?  <OrderView refresh={refresh}/> :  <Navigate to="/auth?mode=login"/>}</RouteErrorBoundary>},
        {path: 'stripe', element : <RouteErrorBoundary>{isLoggedIn ?   <Stripe/> :  <Navigate to="/auth?mode=login" />}</RouteErrorBoundary>},
        {path: 'chat', element : <RouteErrorBoundary>{isLoggedIn ?  <ChatNew  onlineUsers={onlineUsers} onFeatchChats={onFeatchChats} notify={notify} onFeatchNotifications={onFeatchNotifications} />
        :  <Navigate to="/auth?mode=login" />}</RouteErrorBoundary>},
        {path: 'wallet', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER' ? <WalletPage /> : <Navigate to="/" />}</RouteErrorBoundary>},
        {path: 'admin', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : !isPlatformStaff ? <Navigate to="/" replace /> : <AdminDashboard />}</RouteErrorBoundary>},
        {path: 'admin/disputes', element : <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : !isPlatformStaff ? <Navigate to="/" replace /> : <AdminDashboard />}</RouteErrorBoundary>},
        {path: 'models/delete/:id', action: onDeletingModelAction},
        {path: '*', element: <RouteErrorBoundary><NotFoundPage /></RouteErrorBoundary>}
        ]
      }
    ]
  )

  return (
    <>
        <RouterProvider router={router}/>
    </>
  );
}

export default App
