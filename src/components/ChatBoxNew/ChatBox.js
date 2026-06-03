import React, { useEffect, useState ,useRef } from "react";
import { getUser  } from "../../lib/ChatRequests";
import classes from "./ChatBox.module.scss";
 // eslint-disable-next-line 
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'
import {FILES_BASE_API_URL} from '../../lib/api'
import { IoImagesOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import {Link} from 'react-router-dom'
import {getAuthToken} from '../../utility/tokenLoader'

const ChatBox = ({ chat,currentUserRole, messages  ,currentUser ,onHandleSend , onClose , online}) => {
  const token = getAuthToken() ;
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [file,setFile] = useState() 
  const [update,setUpdate] = useState(false) ;


  useEffect(()=>{
    setUpdate(true)
  },[messages] )
  
  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  useEffect(() => {
    let userId
    if(currentUserRole === 'CLIENT'){
      userId = chat?.developerId;
    }else {
      userId = chat?.clientId;
    }
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId , token);
        setUserData(data?.data?.user);
      } catch (error) {
        console.log(error?.respons?.data?.message);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUserRole ,token]);


  // Send Message
  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      handleSend();
    }
  };

  const handleSend = async(e)=> {
    if((newMessage.trim() === '') && (!file)){
      return
    }else if(file){
      onHandleSend(file)
      setFile(null)
    }else if(newMessage.trim() !== ''){
      onHandleSend(newMessage)
      setNewMessage('')
    }
  }

  const scroll = useRef(null);
  const imageRef = useRef();
  const handleImgClick=()=>{
    imageRef.current.click();
  }
  const handelFileChange = (e)=>{
    setFile(e.target.files[0])
  }

  useEffect(()=> {
    if(update){
      scroll.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
      setUpdate(false)
    }
  },[update])

  return (
    <>
      <div className={`${classes["ChatBox-container"]}`}>
        {messages !== null ? (
          <>
            {/* chat-header */}
            <div className={`${classes["chat-header"]}`}>
              <span  className={`${classes["close"]}`} onClick={onClose}>X</span>
                <div className={classes.user}>
                  <Link  className={` ${classes.imgCon}`} to={`/profile/${userData?.id}`}>
                    {userData?.avatar &&<img src={FILES_BASE_API_URL+userData?.avatar} alt="User Avatar" crossOrigin="anonymous"  />}
                    {!userData?.avatar &&  <div className={classes['UserHolder']} >{userData?.org_username&&userData?.org_username[0]?.toUpperCase()}</div>}
                  </Link>
                  <div className={`${classes["info"]}`}>
                    <Link className={`${classes["name"]}`} style={{ fontSize: "0.9rem" }} to={`/profile/${userData?.id}`}>
                      <span>{userData?.first_name ? userData?.first_name?.toUpperCase()?.slice(0, 9) :userData?.org_username?.toUpperCase()?.slice(0, 9) }</span>
                    </Link>
                    {online && <span className={`${classes["online"]}`}>online</span>}
                    {!online && <span className={`${classes["offline"]}`}>offline</span>}
                  </div>
              </div>
            </div>
            {/* chat-body */}
            <div className={`${classes["chat-body"]}`}  >

              {messages.length > 0 && messages.map((message , i) => (
                  <div 
                    key={i}
                    ref={scroll}  
                    className={
                      message.userId === currentUser
                        ? `${classes["message"]}  ${classes["own"]}`
                        : classes["message"]
                    }
                  >
                    {typeof message?.desc?.name === 'string' && 
                      <span>
                        <img src={URL.createObjectURL(message?.desc)} alt="attachment" />
                      </span>}
                    { typeof message?.desc === 'string' && !message?.desc?.startsWith('attachment_IMG_') &&
                      <span>{message.desc}</span>}
                    {typeof message?.desc === 'string' && message?.desc?.startsWith('attachment_IMG_') &&
                      <span >
                        <a href={FILES_BASE_API_URL+message?.desc} target={"_self"} >
                          <img src={FILES_BASE_API_URL+message?.desc} crossOrigin="anonymous"  alt="attachment" />
                        </a>
                      </span>
                      }
                    {" "}
                    <span >{format(message.createdAt)}</span>
                  </div>
              ))}
            </div>
            {/* chat-sender */}


            <div className={`${classes["chat-sender"]}`}>
              <InputEmoji
                background={'white'}
                theme='light'
                value={newMessage}
                onChange={handleChange}
                // cleanOnEnter
                // onEnter={handleSend}
                onKeyDown={onKeyDownHandler}
                placeholder="Type a message"
              />

              <button  className={`${classes["feature-btn"]} `} onClick = {handleSend} type="submit"
              disabled={(newMessage.trim() === '') && (!file)} 
              ><IoSend /></button>
              </div>

            <div className={`${classes["chat-sender-2"]}`}>
              {/* <button  className={`${classes["feature-btn"]} `} onClick = {handleSend} type="submit"
              disabled={(newMessage.trim() === '') && (!file)} 
              ><IoSend /></button> */}
              <span className={`${classes["chat-img"]}`} onClick={handleImgClick}><IoImagesOutline  style={{cursor:'pointer'}}  /></span>
              <input name='attachment'type="file" onChange={handelFileChange} ref={imageRef} style={{display : 'none'}}/>
              {file&&<span className={`${classes["chat-sender-v"]}`}>
                  <img src={URL.createObjectURL(file)} alt="attachment" />
                  <span onClick={()=>{setFile(null)}}>X</span>
                </span>
              }
            </div>
          </>
        ) : (
          <span className={`${classes["chatbox-empty-message"]}`}>
            <RiRobot2Line className={classes.iconImg} />
            <h1>Tap on a chat to start conversation...</h1>
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
