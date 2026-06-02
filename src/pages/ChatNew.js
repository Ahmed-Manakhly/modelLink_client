import React, { useState , useEffect} from "react";
import classes from './Chat.module.scss';
import ChatBox from "../components/ChatBoxNew/ChatBox";
import Conversation from "../components/CoversationNew/Conversation";
import Notifications from "../components/Notifications/Notifications";
import WarningModal from '../components/layout/WarningModal'
import { userChats , createChat , removeChat} from "../lib/ChatRequests";
import { addMessage, getMessages } from "../lib/MessageRequests";
import { userNotifications ,removeNotification , updateNotification} from "../lib/notificationsRequests";
import {origin} from '../lib/api'
import { useSearchParams } from 'react-router-dom';
import { useSelector} from 'react-redux'; 
import io from "socket.io-client";
import { RiRobot2Line } from "react-icons/ri";





const ChatNew = ({msg , onlineUsers , onFeatchChats ,notify , onFeatchNotifications}) => {
  const [warning,setWarning] = useState({show:false , type : '' , message : '' , action : ''}) ;
  const [SearchParams]=useSearchParams() ;
  const contact = SearchParams.get('contact');
  const linkTo = SearchParams.get('to');
  //---------------------------------------
  const [chats, setChats] = useState(null);
  const [chatsUpdated, setChatsUpdated] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatUpdate, setCurrentChatUpdate] = useState(false);
  const [messages, setMessages] =  useState(null);

  const [notifications, setNotifications] = useState(null);
  const [notificationsUpdated, setNotificationsUpdated] = useState(true);

  //-------------------------
  const [searchedValueChat, setSearchedValueChat] = useState('');
  const [searchedValueNo, setSearchedValueNo] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const [filteredNo, setFilteredNo] = useState([]);


  const [show,setShow] =useState('chats')
  useEffect(()=>{
    if(contact){
      setShow('currentChat')
    }
  },[contact])

  useEffect(()=>{
    if(linkTo === 'notification'){
      setShow('notifications')
    }
  },[linkTo])

  useEffect(()=>{
    setFilteredChats(chats)
    setFilteredNo(notifications)
  },[notifications ,chats])

  useEffect(()=>{
    if(searchedValueNo === ''){
      setFilteredNo(notifications)
    }
    if(searchedValueChat === ''){
      setFilteredChats(chats)
    }
  },[searchedValueChat ,searchedValueNo ,chats ,notifications])

  const handleSChangeChat = (event) => {
    setSearchedValueChat(event.target.value);
  };
  const handleSChangeNo = (event) => {
    setSearchedValueNo(event.target.value);
  };
  const handleSChat = () => {
    if(chats?.length >0 ) {
      if(searchedValueChat !== ''){
        const filteredChatsInit = chats.filter(ch => {
          return  ch.lastMessage?.toLowerCase().includes(searchedValueChat.toLowerCase())
      })
      setFilteredChats(filteredChatsInit)
      }else{
        setFilteredChats(chats)
      }
    }
  }
  const handleSNo = () => {
    if(notifications?.length >0 ) {
      if(searchedValueNo !== ''){
        const filteredNoti = notifications.filter(no => {
          return  no.actionDesc?.toLowerCase().includes(searchedValueNo.toLowerCase())
      })
      setFilteredNo(filteredNoti)
      }else{
        setFilteredNo(notifications)
      }
    }
  }
  //==============================================
  let user =  null
  user = useSelector(state => state.auth.userData) ;
  //============================================================================= effects
  useEffect(()=>{
    if(msg){
      setChatsUpdated(true)
      setCurrentChat(prev => prev)
      setCurrentChatUpdate(true)
    }
  },[msg])
  //========================================
  useEffect(()=>{
    if(notify){
      setNotificationsUpdated(true)
    }
  },[notify])
  //========================================
  useEffect(() => {
    if((user?.id) && chatsUpdated){
      const getChats = async () => {
        try {
          const { data } = await userChats(user.id);
          setChats(data?.data?.chats);
        } catch (error) {
          console.log(error?.respons?.data?.message) ;
        }
      };
      getChats();
      setChatsUpdated(false)
    }
  }, [user,chatsUpdated]);
  //============================================================
  useEffect(() => {
    if((user?.id) && notificationsUpdated){
      const getNotifications = async () => {
        try {
          const { data } = await userNotifications(user.id);
          setNotifications(data?.data);
        } catch (error) {
          console.log(error?.respons?.data?.message) ;
        }
      };
      getNotifications();
      setNotificationsUpdated(false)
    }
  }, [user,notificationsUpdated]);
  //============================================================
  useEffect(()=>{
    if(contact && chats && (currentChat === null)){
      if(chats?.length > 0){
        let exChat
        if(user?.role === 'CLIENT'){
            exChat = chats.find(chat=> chat?.developerId === contact)
        }else {
          exChat = chats.find(chat=> chat?.clientId === contact)
        }
        if(exChat){
          setCurrentChat(exChat);
          setCurrentChatUpdate(true)
        }else{
          setCurrentChat({developerId : contact ,clientId: user?.id , id: 'DUMMY-CHAT'});
          setCurrentChatUpdate(true)
        }
      }else{
        setCurrentChat({developerId : contact ,clientId: user?.id , id: 'DUMMY-CHAT'});
        setCurrentChatUpdate(true)
      }
    }
  },[chats ,contact , currentChat , user?.id ,user?.role ])
  //====================================================================================================
  useEffect(()=>{
    if(currentChatUpdate){
      if(currentChat?.id === 'DUMMY-CHAT'){
        setMessages([])
      }else if(+currentChat?.id > 0){
        const gettingMsg = async()=>{
          try {
            const { data } = await getMessages(currentChat?.id);
            setChatsUpdated(true)
            setMessages(data?.data?.messages);
            onFeatchChats(true)
          } catch (error) {
            console.log(error?.respons?.data?.message) ;
          }
        }
        gettingMsg()
      }
      setCurrentChatUpdate(false)
    }
  },[currentChatUpdate ,currentChat?.id , onFeatchChats])
   //============================================================================= actions

  const closeModal = ()=>{
    setWarning(prev => {
        return {...prev , show : false}
    })
  }
  //-------------------------------------
  const handleDeleteNotification = async(id) =>{
    try{
      await removeNotification(id)
      setNotificationsUpdated(true)
      onFeatchNotifications(true)
    }catch(err){
      console.log(err?.respons?.data?.message);
    }
  }
  //-------------------------------------
  const handleUpdateNotification = async(id) =>{
    try{
      await updateNotification(id ,{unRead :  false})
      setNotificationsUpdated(true)
      onFeatchNotifications(true)
    }catch(err){
      console.log(err?.respons?.data?.message);
    }
  }
  //-------------------------------------
  const onAction = async (id)=>{
    try{
      await removeChat(id)
      setChatsUpdated(true)
      setMessages(null)
      setCurrentChat(null)
      onFeatchChats(true)
    }catch(err){
      console.log(err?.respons?.data?.message);
    }
    closeModal();
  }
  //-------------------------------------
  function handleDelete(id) {
  setWarning({show:true , type : 'action' , message : 'Are you sure, You want to delete this Conversation?' , action :'Delete', id:id}) ;
  }
  //-------------------------------------
  const onClose =()=>{
    setCurrentChat(null)
    setMessages(null)
  }
  //-------------------------------------
  const onHandleSend=(msg)=>{
    if(currentChat.id === 'DUMMY-CHAT'){
      const sendAndCreate = async ()=>{
        const socket = io(origin);
        try {
          const { data } = await createChat({clientId:user.id ,developerId: contact});
          const newChat = data?.data?.clientCopy ;
          const message = {
            userId : user.id,
            desc: msg,
            conversationId: newChat.id,
          }
          setMessages(prev =>[...prev , message])
          onFeatchChats(true)
          await addMessage(message);
          setCurrentChat(newChat)
          setCurrentChatUpdate(true)
          setChatsUpdated(true)
          socket.emit("msg_created", {message, forId:newChat.developerId});
        }
        catch(err){
          console.log(err?.respons?.data?.message);
        }
      }
      sendAndCreate()
    }else{
      const message = {
        userId : user.id,
        desc: msg,
        conversationId: currentChat.id,
      }
      setMessages(prev =>[...prev , message])
      onFeatchChats(true)
      let forId
      if(user?.role === 'CLIENT'){
        forId = currentChat?.developerId;
      }else {
        forId = currentChat?.clientId;
      }
      const sendMsg = async ()=>{
        const socket = io(origin);
        try {
          await addMessage(message);
          setCurrentChat(prev=>prev)
          setCurrentChatUpdate(true)
          setChatsUpdated(true)
          socket.emit("msg_created", {message, forId});
        }
        catch(err){
          console.log(err?.response?.data?.message);
        }
      }
      sendMsg()
    }
  }
  //-------------------------------
  const setCurrentChatActive = (chat)=>{
    setCurrentChat(chat);
    setCurrentChatUpdate(true) ;
    setShow('currentChat')
  }
  //-----------------------------------------------------
  const checkOnlineStatus = (chat) => {
    let chatMember
    if(user?.role === 'CLIENT'){
      chatMember = chat?.developerId;
    }else {
      chatMember = chat?.clientId;
    }
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  //====================================================================================================
  return (
    
    <div className={classes["Chat"]}>
      <div className={`${classes["tabsCon"]}`}>
        <button onClick={()=>{setShow('chats')}} className={`${ show === 'chats' && classes["active"]}`} >Chats</button>
        <button onClick={()=>{setShow('currentChat')}} className={`${ show === 'currentChat' && classes["active"]}`} >Conversation</button>
        <button onClick={()=>{setShow('notifications')}} className={`${ show === 'notifications' && classes["active"]}`} >Notifications</button>
      </div>
      {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction}/>}
      {/* Left Side */}
      <div className={`${classes["Left-side-chat"]} ${show === 'chats' && classes["show"]}`}>

            <div className={classes["header-search-container"]}>
              <input type="search" name="search" className={classes["search-field"]} placeholder="Search By Last Message..."
                  onChange={handleSChangeChat}
                  value={searchedValueChat}/>
              <button className={classes["search-btn"]} onClick={handleSChat}>
                <ion-icon name="search-outline"></ion-icon>
              </button>
            </div>

        <div className={classes["Chat-container"]}>
          <div className={`${classes["Chat-list"]}`}>
            {(chats?.length >0 ) && (filteredChats?.map((chat , i) => (
              <div
              key={i}
              onClick={setCurrentChatActive.bind(null,chat)}
              >
                <Conversation
                  onRemove={handleDelete}
                  currentUserRole={user.role}
                  data={chat}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            )))}
            {(filteredChats?.length === 0 ) && 
              <span className={`${classes["chatbox-empty-message"]}`}>
                <RiRobot2Line className={classes.iconImg} />
                <h1>No Chats available yet!</h1>
              </span>
            }
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className={`${classes["Right-side-chat"]} ${show === 'currentChat' &&  classes["show"]}`}>
        <ChatBox
          onClose={onClose}
          currentUser={user.id}
          chat={currentChat}
          currentUserRole={user.role}
          onHandleSend={onHandleSend}
          messages={messages}
          online={checkOnlineStatus(currentChat)}
        />
      </div>
      <div className={`${classes["notification-right-side"]} ${show === 'notifications' &&  classes["show"]} `}>

          <div className={classes["header-search-container"]}>
            <input type="search" name="search" className={classes["search-field"]} placeholder="Search By Description..."
              onChange={handleSChangeNo}
              value={searchedValueNo}/>
            <button className={classes["search-btn"]} onClick={handleSNo}>
              <ion-icon name="search-outline"></ion-icon>
            </button>
          </div>
        <div className={classes["notification-container"]}>
          <div className={`${classes["notifi-list"]}`}>
            {(notifications?.length >0 ) && (filteredNo?.map((notify , i) => (
              <div
              key={i}
              >
                <Notifications
                  onRemove={handleDeleteNotification}
                  onUpdate={handleUpdateNotification}
                  data={notify}
                />
              </div>
            )))}
            {(filteredNo?.length === 0 ) && 
              <span className={`${classes["chatbox-empty-message"]}`}>
                <RiRobot2Line className={classes.iconImg} />
                <h1>No notifications available yet!</h1>
              </span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatNew;
