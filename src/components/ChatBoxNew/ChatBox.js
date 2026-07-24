import { useEffect, useState, useRef } from "react";
import { getUser } from "../../lib/ChatRequests";
import classes from "./ChatBox.module.scss";
import { format } from "timeago.js";
import UserAvatar from '../ui/UserAvatar';
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import { FILES_BASE_API_URL } from '../../lib/api'
import { IoImagesOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { Link } from 'react-router-dom'
import { getAuthToken } from '../../utility/tokenLoader'
import { buildChatDisplayItems, getMessageReceipt } from '../../utility/chatHelpers';
import { socket } from '../../hooks/useSocket';
import { RiRobot2Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { uiActions } from '../../store/UI-slice';
import UserProfileStrip from '../UserProfileStrip';
import {
  getCounterpartyDisplayName,
  getCounterpartyProfileLink,
  isStaffRole,
  resolveCounterpartyUser,
} from '../../utility/chatParticipantDisplay';

const TYPING_DEBOUNCE_MS = 2000;

const ChatBox = ({ chat, currentUserRole, messages, currentUser, onHandleSend, onClose, online, isOtherTyping = false }) => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState()
  const [update, setUpdate] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => emitStopTyping(), []);

  useEffect(() => {
    emitStopTyping();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.id]);

  useEffect(() => {
    setUpdate(true)
  }, [messages])

  const handleChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    if (value.trim()) {
      emitTyping();
    } else {
      emitStopTyping();
    }
  }

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    emitTyping();
  };

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
          dispatch(uiActions.notificationDataChanged({
            status: 'error',
            title: 'Error',
            message: error?.response?.data?.message || 'Failed to fetch user data',
          }));
          dispatch(uiActions.showNotification(true));
        }
      }
    };

    getUserData();
  }, [chat, currentUser, embeddedUser, otherParticipant?.userId, token]);

  const displayName = getCounterpartyDisplayName(userData);
  const profileLink = getCounterpartyProfileLink(userData);


  // Send Message
  const onKeyDownHandler = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
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
      setShowEmojiPicker(false);
    }
  }

  const scroll = useRef(null);
  const imageRef = useRef();
  const emojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className={`${classes["ChatBox-container"]} ${messages === null ? classes.empty : ''}`}>
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
                        <Link className={`${classes["name"]} ${classes["gradientText"]}`} to={profileLink}>
                          <span title={displayName}>{displayName?.length > 15 ? displayName.toUpperCase().slice(0, 15) + '...' : displayName?.toUpperCase()}</span>
                        </Link>
                      ) : (
                        <span className={`${classes["name"]} ${classes["gradientText"]}`} title={displayName}>
                          {displayName?.length > 15 ? displayName.toUpperCase().slice(0, 15) + '...' : displayName?.toUpperCase()}
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
              <div className={classes.actionButtons}>
                <button className={classes.iconBtn} onClick={handleImgClick} type="button">
                  <IoImagesOutline />
                </button>
                <input name='attachment' type="file" onChange={handelFileChange} ref={imageRef} style={{ display: 'none' }} />

                <div ref={emojiRef}>
                  <button
                    className={classes.iconBtn}
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    type="button"
                  >
                    <BsEmojiSmile />
                  </button>
                  {showEmojiPicker && (
                    <div className={classes.emojiPickerWrapper}>
                      <EmojiPicker
                        theme="dark"
                        onEmojiClick={handleEmojiClick}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={classes.inputWrapper}>
                <textarea
                  className={classes.customChatInput}
                  value={newMessage}
                  onChange={handleChange}
                  onKeyDown={onKeyDownHandler}
                  placeholder="Synthesize message..."
                  rows={1}
                />
                <button
                  className={classes.sendBtn}
                  onClick={handleSend}
                  type="submit"
                  disabled={(newMessage.trim() === '') && (!file)}
                >
                  <IoSend />
                </button>
              </div>
            </div>

            {file && (
              <div className={`${classes["chat-sender-2"]}`}>
                <span className={`${classes["chat-sender-v"]}`}>
                  <img src={URL.createObjectURL(file)} alt="attachment" />
                  <span onClick={() => { setFile(null) }}>X</span>
                </span>
              </div>
            )}
          </>
        ) : (
          <span className={`${classes["chatbox-empty-message"]}`}>
            <RiRobot2Line className={classes.aiFaceIcon} style={{ fontSize: '100px', color: 'var(--primary)', filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))', marginBottom: '20px' }} />
            <h1 className={classes.gradientText}>Tap on a chat to start conversation...</h1>
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
