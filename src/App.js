/* eslint-disable */
import { createBrowserRouter, RouterProvider , Link , redirect , Navigate } from "react-router-dom";
import {useDispatch , useSelector} from 'react-redux'; 
import {authActions} from './store/Auth.-slice' ;
import {tokenLoader  } from './utility/tokenLoader' ;
import {LoginAction} from './lib/actions'
import {deletingModelAction} from './lib/actions'
import { userChats ,removeChat} from "./lib/ChatRequests";
import { userNotifications , updateNotification , removeNotification } from "./lib/notificationsRequests";
import {uiActions} from './store/UI-slice' ;
//-------------------------------
import './index.scss' ;
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
import {useEffect, useState} from 'react'
//--------------------------------------
import io from "socket.io-client";
import {origin} from './lib/api'

//-----------------------------------------
function App() {
  const [msg,setMsg]=useState() ;
  const [notify,setNotify]=useState() ;
  const [refresh,setRefresh]=useState() ;
  const [modelRefresh,setModelRefresh]=useState() ;

  const [onlineUsers,setOnlineUsers]=useState([]) ;

  const [chats, setChats] = useState([]);
  const [notifys, setNotifys] = useState([]);

  const [chatsUpdated, setChatsUpdated] = useState(true);
  const [notifysUpdated, setNotifysUpdated] = useState(true);

  const [counter, setCounter] = useState(0);
  const [notCounter, setNotCounter] = useState(0);

  const [modelsUpdated, setModelsUpdated] = useState(true);
  const [modelsUpdatedLink, setModelsUpdatedLink] = useState(null);


  const [searchByVal, setSearchByVal] = useState(null);
  const [searchVal, setSearchVal] = useState(null);
  

  //----------------------------
  const userData = JSON.parse(localStorage.getItem('userData'))
  const userId = useSelector(state => state.auth.userData)?.id
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  //------------
  useEffect(() => {
    if(userData){
      const socket = io.connect(origin)
      socket.on("connect", () => {
          socket.emit("joinRoom", userData?.id);
      });
      socket.on('receive_msg', (msg) => {
      setMsg(msg)
      });
      socket.on('get-users', (onlineUsers) => {
      setOnlineUsers(onlineUsers)
      });
      socket.on('new_model_created', () => {
        setModelsUpdated(true)
      });
      socket.on('receive_order', (data) => {
          setNotify(data)
      });
      socket.on('refresh', (data) => {
          setRefresh(data)
      });
      socket.on('modelRefresh', (data) => {
        setModelRefresh(data)
      });
    }else if(!userData){
      // console.log('_______out')
      return
    }
  }, [userData?.id]);
  //-------------------
  const onModelsUpdated = (bool)=>{
    setModelsUpdated(false)
    setSearchByVal(null)
    setSearchVal(null)
  }
  const onModelsUpdatedLink = (bool)=>{
    setModelsUpdatedLink(null)
  }
  //-------------------
  useEffect(()=>{
    if(msg){
      setChatsUpdated(true)
    }
  },[msg])
  //-------------------
  useEffect(()=>{
    if(notify){
      setNotifysUpdated(true)
    }
  },[notify])
  //-------------------
  useEffect(() => {
    if((userId > 0) && chatsUpdated){
      const getChats = async () => {
        try {
          const { data } = await userChats(userId);
          setChats(data?.data?.chats);
        } catch (error) {
          console.log(error.respons.data.message);
        }
      };
      getChats();
      setChatsUpdated(false)
    }
  }, [userId,chatsUpdated]);
  //-------------------
  useEffect(() => {
    if((userId > 0) && notifysUpdated){
      const getNotifications = async () => {
        try {
          const { data } = await userNotifications(userId);
          setNotifys(data?.data);
        } catch (error) {
          console.log(error.respons.data.message);
        }
      };
      getNotifications();
      setNotifysUpdated(false)
    }
  }, [userId,notifysUpdated]);
  //-------------------
  const onFeatchChats = (bool)=>{
    setChatsUpdated(true)
  }
  const onFeatchNotifications = (bool)=>{
    setNotifysUpdated(true)
  }
  //--------------------------
  const checkOnlineStatus = (chat) => {
    let chatMember
    if(userData?.role === 'CLIENT'){
      chatMember = chat?.developerId;
    }else {
      chatMember = chat?.clientId;
    }
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  //--------------------------

  //--------------------------
  const handleDeleteNotification = async(id) =>{
    try{
      const { data } = await removeNotification(id)
      setNotifysUpdated(true)
      setNotify(data)
    }catch(err){
      console.log(err.respons.data.message);
    }
  }
  //-------------------------------------
  const handleUpdateNotification = async(id) =>{
    try{
      const { data } = await updateNotification(id ,{unRead :  false})
      // console.log(data)
      setNotifysUpdated(true)
      setNotify(data)
    }catch(err){
      console.log(err.respons.data.message);
    }
  }
  //-------------------------------------
  const calcChats=(chats)=>{
    return (chats.reduce( (curNumber , item) => {
      return curNumber + item?.unReadMsg;
    } , 0) )
  }
  const calcNotifys=(Notifys)=>{
    return ( Notifys.filter(not => not.unRead === true))
  }
  //-------------------
  useEffect(()=>{
    if(chats || chatsUpdated){
      setCounter(calcChats(chats))
    }
  },[chats , chatsUpdated])
  //-------------------
  useEffect(()=>{
    if(notifys || notifysUpdated){
      setNotCounter(calcNotifys(notifys).length)
    }
  },[notifys , notifysUpdated])
  //--------------------------------
  const handleDeleteChat = async (id)=>{
    try{
      const { data } = await removeChat(id)
      setChatsUpdated(true)
      setMsg(data)
    }catch(err){
      console.log(err.respons.data.message);
    }
  }
  //=====================================================================================
  const dispatch = useDispatch();   
  //------------------------------------------------
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
  //------------------------------------------------
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
  const onClickLink=(title)=>{
    setModelsUpdatedLink(title)
  }
  //--------------------------------------------/routes
  const router = createBrowserRouter([
    {path: '/' , element : <RootLayout msgCounter={counter} notCounter={notCounter} notifys={notifys} handleDeleteNotification={handleDeleteNotification}
    handleUpdateNotification={handleUpdateNotification} chats={chats} checkOnlineStatus={checkOnlineStatus} handleDeleteChat={handleDeleteChat}
    getSearch={getSearch} onClickLink={onClickLink}/> 
        , errorElement : <ErrorPage/> ,id:'root',loader: tokenLoader ,children:[
        {index : true , element : <Home modelsUpdated={modelsUpdated} onModelsUpdated={onModelsUpdated} onClickLink={onClickLink} /> },
        {path: 'contact', element : <Contact/>},
        {path : 'auth' , element : <AuthPage/> , action: onLoginAction ,errorElement :
          <div style={{height:'60vh'}}>
            invalid user name or password!
            <Link className='' to='/auth?mode=login' >Kindly Click Here</Link>
          </div>},
        {path: 'dashboard-dev', element : !isLoggedIn ? <Navigate to="/auth?mode=login" /> :userData.role === 'CLIENT'? <Navigate to="/" /> : <DashboardDev/>   },
        {path: 'orders-client', element : !isLoggedIn ? <Navigate to="/auth?mode=login" /> :userData.role === 'DEVELOPER'? <Navigate to="/" /> : <OrdersClient/>},
        {path: 'profileSettings', element : isLoggedIn ? <ProfileSettings/> : <Navigate to="/auth?mode=login" />},
        {path: 'profile/:id', element : isLoggedIn ? <ProfileDev onlineUsers={onlineUsers} /> :  <Navigate to="/auth?mode=login" />},
        {path: 'cart', element :!isLoggedIn ? <Navigate to="/auth?mode=login" /> :userData.role === 'DEVELOPER'? <Navigate to="/" /> : <CartPage/>},
        {path: 'models', element : <Models searchByVal={searchByVal} searchVal={searchVal}
          modelsUpdated={modelsUpdated} onModelsUpdated={onModelsUpdated} modelsUpdatedLink={modelsUpdatedLink} onModelsUpdatedLink={onModelsUpdatedLink}/>},
        {path: 'models/new', element : !isLoggedIn ? <Navigate to="/auth?mode=login" />:userData.role === 'CLIENT'? <Navigate to="/" /> :<CreateModel/> },
        {path: 'models/edit/:id', element : !isLoggedIn ? <Navigate to="/auth?mode=login" />:userData.role === 'CLIENT'? <Navigate to="/" /> :<EditModel/>,},
        {path: 'models/view/:id', element : isLoggedIn ? <ModelView refresh={refresh} modelRefresh={modelRefresh} onlineUsers={onlineUsers} /> : <Navigate to="/auth?mode=login" />},
        {path: 'order/view/:id', element :isLoggedIn ?  <OrderView refresh={refresh}/> :  <Navigate to="/auth?mode=login"/>},
        {path: 'stripe', element :isLoggedIn ?   <Stripe/> :  <Navigate to="/auth?mode=login" />},
        {path: 'chat', element : isLoggedIn ?  <ChatNew  msg={msg} onlineUsers={onlineUsers} onFeatchChats={onFeatchChats} notify={notify} onFeatchNotifications={onFeatchNotifications} /> 
        :  <Navigate to="/auth?mode=login" />},
        //-----------------------------------------------------------------ACTIONS
        {path: 'models/delete/:id', action: onDeletingModelAction},
        ]
      }
    ]
  )
  //----------------------------------------------------/
  return (
    <>
        <RouterProvider router={router}/>
    </>
  );
}

export default App

