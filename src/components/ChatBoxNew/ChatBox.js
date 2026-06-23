import React, { useEffect, useState, useRef } from "react";
import { getUser } from "../../lib/ChatRequests";
import classes from "./ChatBox.module.scss";
// eslint-disable-next-line
import { format } from "timeago.js";
import UserAvatar from '../ui/UserAvatar';
import InputEmoji from 'react-input-emoji'
import { FILES_BASE_API_URL } from '../../lib/api'
import { IoImagesOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { Link } from 'react-router-dom'
import { getAuthToken } from '../../utility/tokenLoader'
import { buildChatDisplayItems, getMessageReceipt } from '../../utility/chatHelpers';
import { socket } from '../../hooks/useSocket';
import UserProfileStrip from '../UserProfileStrip';
import {
  getCounterpartyDisplayName,
  getCounterpartyInitial,
  getCounterpartyProfileLink,
  isStaffRole,
  resolveCounterpartyUser,
} from '../../utility/chatParticipantDisplay';

const TYPING_DEBOUNCE_MS = 2000;

const ChatBox = ({ chat, currentUserRole, messages, currentUser, onHandleSend, onClose, online, isOtherTyping = false }) => {
  const token = getAuthToken();
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState()
  const [update, setUpdate] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const getRecipientId = () => chat?.participants?.find((p) => p.userId !== currentUser)?.userId;

  const emitStopTyping = () => {
    const forId = getRecipientId();
    const conversationId = chat?.id;
    if (!forId || !conversationId || conversationId === 'DUMMY-CHAT') return;
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('stopTyping', { conversationId, forId });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const emitTyping = () => {
    const forId = getRecipientId();
    const conversationId = chat?.id;
    if (!forId || !conversationId || conversationId === 'DUMMY-CHAT') return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing', { conversationId, forId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(emitStopTyping, TYPING_DEBOUNCE_MS);
  };

  useEffect(() => () => emitStopTyping(), []);

  useEffect(() => {
    emitStopTyping();
  }, [chat?.id]);

  useEffect(() => {
    setUpdate(true)
  }, [messages])

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
    if (newMessage.trim()) {
      emitTyping();
    } else {
      emitStopTyping();
    }
  }

  const otherParticipant = chat?.participants?.find((p) => p.userId !== currentUser);
  const embeddedUser = otherParticipant?.user;

  useEffect(() => {
    const userId = otherParticipant?.userId;
    if (!chat || !userId) {
      setUserData(null);
      return;
    }

    if (embeddedUser && isStaffRole(embeddedUser.role)) {
      setUserData(resolveCounterpartyUser(embeddedUser, null));
      return;
    }

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId, token);
        setUserData(resolveCounterpartyUser(embeddedUser, data?.data?.user));
      } catch (error) {
        const isForbidden = error?.response?.status === 403;
        setUserData(resolveCounterpartyUser(embeddedUser, null, { apiForbidden: isForbidden }));
        if (!isForbidden) {
          console.log(error?.response?.data?.message);
        }
      }
    };

    getUserData();
  }, [chat, currentUser, embeddedUser, otherParticipant?.userId, token]);

  const displayName = getCounterpartyDisplayName(userData);
  const profileLink = getCounterpartyProfileLink(userData);


  // Send Message
  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      handleSend();
    }
  };

  const handleSend = async (e) => {
    if ((newMessage.trim() === '') && (!file)) {
      return
    } else if (file) {
      onHandleSend(file)
      setFile(null)
    } else if (newMessage.trim() !== '') {
      emitStopTyping();
      onHandleSend(newMessage)
      setNewMessage('')
    }
  }

  const scroll = useRef(null);
  const imageRef = useRef();
  const handleImgClick = () => {
    imageRef.current.click();
  }
  const handelFileChange = (e) => {
    setFile(e.target.files[0])
  }

  useEffect(() => {
    if (update) {
      scroll.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
      setUpdate(false)
    }
  }, [update])

  return (
    <>
      <div className={`${classes["ChatBox-container"]}`}>
        {messages !== null ? (
          <>
            {/* chat-header */}
            <div className={`${classes["chat-header"]}`}>
              <div className={classes.user}>
                <div className={classes["avatar-row"]}>
                  <div className={classes["left-group"]}>
                    {profileLink ? (
                      <Link className={` ${classes.imgCon}`} to={profileLink}>
                        <UserAvatar user={userData} />
                      </Link>
                    ) : (
                      <div className={` ${classes.imgCon}`}>
                        <UserAvatar user={userData} />
                      </div>
                    )}

                    <div className={`${classes["info"]}`}>
                      {profileLink ? (
                        <Link className={`${classes["name"]}`} to={profileLink}>
                          <span title={displayName}>{displayName?.length > 15 ? displayName.slice(0, 15) + '...' : displayName}</span>
                        </Link>
                      ) : (
                        <span className={`${classes["name"]}`} title={displayName}>
                          {displayName?.length > 15 ? displayName.slice(0, 15) + '...' : displayName}
                        </span>
                      )}

                      {online ? (
                        <span className={`${classes["online"]}`}>● online</span>
                      ) : (
                        <span className={`${classes["offline"]}`}>● offline</span>
                      )}
                    </div>
                  </div>

                  <span className={`${classes["close"]}`} onClick={onClose}>X</span>
                </div>
              </div>
            </div>
            {/* chat-body */}
            <div className={`${classes["chat-body"]}`}  >

              <div className={classes["profile-strip-wrapper"]}>
                <div className={classes["profile-strip-inner"]}>
                  <UserProfileStrip
                    user={userData}
                    variant="public"
                    showViewProfileLink={Boolean(profileLink)}
                    profileLinkTo={profileLink}
                  />
                  {userData?.isPlatformAccount && userData?.subtitle && (
                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '8px' }}>
                      {userData.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {messages.length > 0 && buildChatDisplayItems(messages).map((item) => {
                if (item.type === 'date') {
                  return (
                    <div key={item.key} style={{ textAlign: 'center', margin: '12px 0', fontSize: '12px', color: '#888' }}>
                      <span>{item.label}</span>
                    </div>
                  );
                }

                const message = item.message;
                return (
                  <div
                    key={item.key}
                    ref={scroll}
                    className={
                      message.userId === currentUser
                        ? `${classes["message"]} ${classes["own"]}`
                        : classes["message"]
                    }
                    style={item.isGrouped ? { marginTop: '2px' } : undefined}
                  >
                    {typeof message?.desc?.name === 'string' &&
                      <span>
                        <img src={URL.createObjectURL(message?.desc)} alt="attachment" />
                      </span>}
                    {typeof message?.desc === 'string' && !message?.desc?.startsWith('messages/') &&
                      <span>{message.desc}</span>}
                    {typeof message?.desc === 'string' && message?.desc?.startsWith('messages/') &&
                      <span >
                        <a href={FILES_BASE_API_URL + message?.desc} target={"_self"} >
                          <img src={FILES_BASE_API_URL + message?.desc} crossOrigin="anonymous" alt="attachment" />
                        </a>
                      </span>
                    }
                    {" "}
                    <span>{format(message.createdAt)}</span>
                    {message.userId === currentUser && (
                      <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.8 }}>
                        {getMessageReceipt(message, true)}
                      </span>
                    )}
                  </div>
                );
              })}
              {isOtherTyping && (
                <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', padding: '4px 8px' }}>
                  typing…
                </div>
              )}
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

              <button className={`${classes["feature-btn"]} `} onClick={handleSend} type="submit"
                disabled={(newMessage.trim() === '') && (!file)}
              ><IoSend /></button>
            </div>

            <div className={`${classes["chat-sender-2"]}`}>
              {/* <button  className={`${classes["feature-btn"]} `} onClick = {handleSend} type="submit"
              disabled={(newMessage.trim() === '') && (!file)}
              ><IoSend /></button> */}
              <span className={`${classes["chat-img"]}`} onClick={handleImgClick}><IoImagesOutline style={{ cursor: 'pointer' }} /></span>
              <input name='attachment' type="file" onChange={handelFileChange} ref={imageRef} style={{ display: 'none' }} />
              {file && <span className={`${classes["chat-sender-v"]}`}>
                <img src={URL.createObjectURL(file)} alt="attachment" />
                <span onClick={() => { setFile(null) }}>X</span>
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
