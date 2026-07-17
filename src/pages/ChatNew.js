import React, { useState, useEffect } from "react";
import classes from './Chat.module.scss';
import ChatBox from "../components/ChatBoxNew/ChatBox";
import Conversation from "../components/ConversationNew/Conversation";
import Notifications from "../components/Notifications/Notifications";
import WarningModal from '../components/layout/WarningModal'
import GlobalWrapper from '../components/layout/GlobalWrapper';
import CustomSelect from '../components/ui/CustomSelect';
import { userChats, createChat, removeChat } from "../lib/ChatRequests";
import { addMessage, getMessages, markMessagesAsReadReq } from "../lib/MessageRequests";
import { userNotifications, removeNotification, updateNotification, readAllNotificationsReq } from "../lib/notificationsRequests";
import { socket } from '../hooks/useSocket';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { realtimeActions } from '../store/realtimeSlice';
import { getAuthToken } from '../utility/tokenLoader';
import aiFace from '../assets/ai-face.png';
import { groupNotificationsByDay, NOTIFICATION_TYPE_OPTIONS, getNotificationType } from "../utility/chatHelpers";
import { dedupeChatsByCounterparty } from "../utility/chatParticipantDisplay";

const STAFF_ROLES = ['ADMIN', 'EMPLOYEE'];





const ChatNew = ({ onlineUsers, onFeatchChats, notify, onFeatchNotifications }) => {
  const token = getAuthToken();
  const [warning, setWarning] = useState({ show: false, type: '', message: '', action: '' });
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const showErrorToast = (msg) => {
    dispatch(uiActions.notificationDataChanged({
      status: 'error',
      title: 'Error',
      message: msg || 'Something went wrong!'
    }));
    dispatch(uiActions.showNotification(true));
  };

  const contact = searchParams.get('contact');
  const linkTo = searchParams.get('to');
  //---------------------------------------
  const [chats, setChats] = useState(null);
  const [chatsUpdated, setChatsUpdated] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatUpdate, setCurrentChatUpdate] = useState(false);
  const [messages, setMessages] = useState(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingClearRef = React.useRef(null);

  const [notifications, setNotifications] = useState(null);
  const [notificationsUpdated, setNotificationsUpdated] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  //-------------------------
  const [searchedValueChat, setSearchedValueChat] = useState('');
  const [searchedValueNo, setSearchedValueNo] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const [filteredNo, setFilteredNo] = useState([]);


  const [show, setShow] = useState('chats')
  useEffect(() => {
    if (contact) {
      setShow('currentChat')
    } else if (linkTo === 'notification') {
      setShow('notifications')
    } else {
      setShow('chats')
      setCurrentChat(null)
      setMessages(null)
    }
  }, [contact, linkTo])

  useEffect(() => {
    let list = notifications;
    if (showUnreadOnly) {
      list = notifications?.filter((n) => n.unRead) || [];
    }
    if (typeFilter) {
      list = (list || []).filter((n) => getNotificationType(n) === typeFilter);
    }
    setFilteredNo(list)
    setFilteredChats(chats)
  }, [notifications, chats, showUnreadOnly, typeFilter])

  useEffect(() => {
    if (searchedValueNo === '') {
      setFilteredNo(notifications)
    }
    if (searchedValueChat === '') {
      setFilteredChats(chats)
    }
  }, [searchedValueChat, searchedValueNo, chats, notifications])

  const handleSChangeChat = (event) => {
    setSearchedValueChat(event.target.value);
  };
  const handleSChangeNo = (event) => {
    setSearchedValueNo(event.target.value);
  };
  const handleSChat = () => {
    if (chats?.length > 0) {
      if (searchedValueChat !== '') {
        const filteredChatsInit = chats.filter(ch => {
          return ch.lastMessage?.toLowerCase().includes(searchedValueChat.toLowerCase())
        })
        setFilteredChats(filteredChatsInit)
      } else {
        setFilteredChats(chats)
      }
    }
  }
  const handleSNo = () => {
    if (notifications?.length > 0) {
      if (searchedValueNo !== '') {
        const filteredNoti = notifications.filter(no => {
          return no.actionDesc?.toLowerCase().includes(searchedValueNo.toLowerCase())
        })
        setFilteredNo(filteredNoti)
      } else {
        setFilteredNo(notifications)
      }
    }
  }
  //==============================================
  let user = null
  user = useSelector(state => state.auth.userData);
  //============================================================================= effects
  useEffect(() => {
    const handleReceiveMsg = (incoming) => {
      if (!incoming?.conversationId) return;

      const incomingConvId = Number(incoming.conversationId);
      const openConvId = currentChat?.id != null && currentChat.id !== 'DUMMY-CHAT'
        ? Number(currentChat.id)
        : null;

      if (openConvId != null && incomingConvId === openConvId) {
        setOtherUserTyping(false);
        setMessages((prev) => {
          const list = prev ?? [];
          if (list.some((m) => m.id === incoming.id)) return list;
          return [...list, incoming];
        });

        // The user is actively viewing this chat, so mark the new message as read immediately
        markMessagesAsReadReq(incomingConvId, token)
          .catch(() => {})
          .finally(() => {
            setChatsUpdated(true);
            onFeatchChats(true);
          });
      } else {
        setChatsUpdated(true);
      }
    };

    const handleTyping = ({ conversationId, fromUserId }) => {
      const openConvId = currentChat?.id != null && currentChat.id !== 'DUMMY-CHAT'
        ? Number(currentChat.id)
        : null;
      if (openConvId == null || Number(conversationId) !== openConvId) return;
      if (fromUserId === user?.id) return;
      setOtherUserTyping(true);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      typingClearRef.current = setTimeout(() => setOtherUserTyping(false), 3000);
    };

    const handleStopTyping = ({ conversationId, fromUserId }) => {
      const openConvId = currentChat?.id != null && currentChat.id !== 'DUMMY-CHAT'
        ? Number(currentChat.id)
        : null;
      if (openConvId == null || Number(conversationId) !== openConvId) return;
      if (fromUserId === user?.id) return;
      setOtherUserTyping(false);
    };

    const handleMessagesRead = ({ conversationId }) => {
      const openConvId = currentChat?.id != null && currentChat.id !== 'DUMMY-CHAT'
        ? Number(currentChat.id)
        : null;
      if (openConvId == null || Number(conversationId) !== openConvId) return;
      setMessages((prev) => (prev ?? []).map((m) =>
        m.userId === user?.id ? { ...m, status: 'READ' } : m
      ));
    };

    socket.on('receive_msg', handleReceiveMsg);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);
    socket.on('messages_read', handleMessagesRead);
    return () => {
      socket.off('receive_msg', handleReceiveMsg);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
      socket.off('messages_read', handleMessagesRead);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?.id, onFeatchChats, user?.id]);
  //========================================
  useEffect(() => {
    if (notify) {
      setNotificationsUpdated(true)
    }
  }, [notify])
  //========================================
  useEffect(() => {
    if ((user?.id) && chatsUpdated) {
      const getChats = async () => {
        try {
          const { data } = await userChats(user.id, token);
          setChats(dedupeChatsByCounterparty(data?.data?.chats, user.id));
        } catch (error) {
          showErrorToast(error?.response?.data?.message || error?.message);
        }
      };
      getChats();
      setChatsUpdated(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, chatsUpdated]);
  //============================================================
  useEffect(() => {
    setNotificationsUpdated(true);
  }, [showUnreadOnly]);
  //============================================================
  useEffect(() => {
    if ((user?.id) && notificationsUpdated) {
      const getNotifications = async () => {
        try {
          const query = showUnreadOnly ? '?unRead=true' : '';
          const { data } = await userNotifications(user.id, token, query);
          setNotifications(data?.data);
        } catch (error) {
          showErrorToast(error?.response?.data?.message || error?.message);
        }
      };
      getNotifications();
      setNotificationsUpdated(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, notificationsUpdated, showUnreadOnly, token]);
  //============================================================
  useEffect(() => {
    if (!contact || chats === null) return;

    const matchChat = (chat) =>
      chat.participants?.some((p) => String(p.userId) === String(contact));

    if (chats.length > 0) {
      const exChat = chats.find(matchChat);
      if (exChat) {
        if (String(currentChat?.id) !== String(exChat.id)) {
          setOtherUserTyping(false);
          setCurrentChat(exChat);
          setCurrentChatUpdate(true);
        }
        setShow('currentChat');
        return;
      }
    }

    if (String(currentChat?.id) !== 'DUMMY-CHAT') {
      setOtherUserTyping(false);
      setCurrentChat({
        participants: [{ userId: contact }, { userId: user?.id }],
        id: 'DUMMY-CHAT',
      });
      setCurrentChatUpdate(true);
      setShow('currentChat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, contact, user?.id]);
  //====================================================================================================
  useEffect(() => {
    if (currentChatUpdate) {
      if (currentChat?.id === 'DUMMY-CHAT') {
        setMessages([])
      } else if (+currentChat?.id > 0) {
        const gettingMsg = async () => {
          try {
            const { data } = await getMessages(currentChat?.id, token);
            setMessages(data?.data?.messages);
            // Mark as read then refresh sidebar + navbar so badge clears in one shot
            markMessagesAsReadReq(currentChat.id, token)
              .catch(() => { }) // non-fatal — badge will clear on next poll
              .finally(() => {
                setChatsUpdated(true);
                onFeatchChats(true);
              });
          } catch (error) {
            showErrorToast(error?.response?.data?.message || error?.message);
          }
        }
        gettingMsg()
      }
      setCurrentChatUpdate(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatUpdate, currentChat?.id, onFeatchChats])
  //============================================================================= actions

  const closeModal = () => {
    setWarning(prev => {
      return { ...prev, show: false }
    })
  }
  //-------------------------------------
  const handleDeleteNotification = async (id) => {
    try {
      await removeNotification(id, token)
      setNotificationsUpdated(true)
      onFeatchNotifications(true)
    } catch (err) {
      showErrorToast(err?.response?.data?.message || err?.message);
    }
  }
  //-------------------------------------
  const handleUpdateNotification = async (id) => {
    try {
      await updateNotification(id, { unRead: false }, token)
      setNotificationsUpdated(true)
      onFeatchNotifications(true)
    } catch (err) {
      showErrorToast(err?.response?.data?.message || err?.message);
    }
  }
  //-------------------------------------
  const handleReadAllNotifications = async () => {
    try {
      await readAllNotificationsReq({ Authorization: `Bearer ${token}` });
      dispatch(realtimeActions.markAllNotificationsRead());
      setNotificationsUpdated(true);
      onFeatchNotifications(true);
    } catch (err) {
      showErrorToast(err?.response?.data?.message || err?.message);
    }
  };
  //-------------------------------------
  const onAction = async (id) => {
    try {
      await removeChat(id, token)
      setChatsUpdated(true)
      setMessages(null)
      setCurrentChat(null)
      onFeatchChats(true)
    } catch (err) {
      showErrorToast(err?.response?.data?.message || err?.message);
    }
    closeModal();
  }
  //-------------------------------------
  function handleDelete(id) {
    setWarning({ show: true, type: 'action', message: 'Are you sure, You want to delete this Conversation?', action: 'Delete', id: id });
  }
  //-------------------------------------
  const onClose = () => {
    setCurrentChat(null);
    setMessages(null);
    setShow('chats');
    const next = new URLSearchParams(searchParams);
    next.delete('contact');
    next.delete('to');
    setSearchParams(next, { replace: true });
  };
  const buildOptimisticMessage = (desc, conversationId) => ({
    id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId: user.id,
    desc,
    conversationId,
    createdAt: new Date().toISOString(),
    status: 'SENT',
    _optimistic: true,
  });

  const reconcileSavedMessage = (tempId, saved) => {
    if (!saved) return;
    setMessages((prev) => (prev ?? []).map((m) => (m.id === tempId ? saved : m)));
  };

  //-------------------------------------
  const onHandleSend = (msg) => {
    if (currentChat.id === 'DUMMY-CHAT') {
      const sendAndCreate = async () => {
        try {
          const isClient = user.role === 'CLIENT';
          const isStaff = STAFF_ROLES.includes(user.role);
          const createPayload = isStaff
            ? { staffId: user.id, clientId: contact }
            : isClient
              ? { clientId: user.id, developerId: contact }
              : { clientId: contact, developerId: user.id };
          const { data } = await createChat(createPayload, token);
          const newChat = data?.data?.conversation;
          const message = buildOptimisticMessage(msg, newChat.id);
          setMessages((prev) => [...(prev ?? []), message]);
          onFeatchChats(true);
          const res = await addMessage(message, token);
          const saved = res.data?.data?.newMsg;
          reconcileSavedMessage(message.id, saved);
          setCurrentChat(newChat);
          setChatsUpdated(true);
          socket.emit("msg_created", { message: saved || message, forId: contact });
        }
        catch (err) {
          showErrorToast(err?.response?.data?.message || err?.message);
        }
      }
      sendAndCreate()
    } else {
      const message = buildOptimisticMessage(msg, currentChat.id);
      setMessages((prev) => [...(prev ?? []), message]);
      onFeatchChats(true);
      const forId = currentChat?.participants?.find(p => p.userId !== user?.id)?.userId;
      const sendMsg = async () => {
        try {
          const res = await addMessage(message, token);
          const saved = res.data?.data?.newMsg;
          reconcileSavedMessage(message.id, saved);
          setChatsUpdated(true);
          socket.emit("msg_created", { message: saved || message, forId });
        }
        catch (err) {
          showErrorToast(err?.response?.data?.message || err?.message);
        }
      }
      sendMsg()
    }
  }
  //-------------------------------
  const setCurrentChatActive = (chat) => {
    const counterpartyId = chat?.participants?.find(
      (p) => String(p.userId) !== String(user?.id)
    )?.userId;

    if (counterpartyId == null) return;

    if (
      String(contact) === String(counterpartyId)
      && String(currentChat?.id) === String(chat.id)
    ) {
      setShow('currentChat');
      return;
    }

    setShow('currentChat');
    const next = new URLSearchParams(searchParams);
    next.set('contact', String(counterpartyId));
    next.delete('to');
    setSearchParams(next, { replace: true });
  };
  //-----------------------------------------------------
  const checkOnlineStatus = (chat) => {
    let chatMember = chat?.participants?.find(p => p.userId !== user?.id)?.userId;
    const online = onlineUsers.find((u) => u.userId === chatMember);
    return online ? true : false;
  };
  //====================================================================================================
  return (

    <GlobalWrapper className="global-banner-spacing global-page-margin-top">
      <div className={classes["Chat"]}>
        <div className={`${classes["tabsCon"]}`}>
        <button onClick={() => { setShow('chats') }} className={`${show === 'chats' && classes["active"]}`} >Chats</button>
        <button onClick={() => { setShow('currentChat') }} className={`${show === 'currentChat' && classes["active"]}`} >Conversation</button>
        <button onClick={() => { setShow('notifications') }} className={`${show === 'notifications' && classes["active"]}`} >Notifications</button>
      </div>
      {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction} />}
      {/* Left Side */}
      <div className={`${classes["Left-side-chat"]} ${show === 'chats' && classes["show"]}`}>
        <div className={classes["Chat-container"]}>
          <div className={classes["header-search-container"]}>
            <input type="search" name="search" className={classes["search-field"]} placeholder="Search By Last Message..."
              onChange={handleSChangeChat}
              value={searchedValueChat} />
            <button className={classes["search-btn"]} onClick={handleSChat}>
              <ion-icon name="search-outline"></ion-icon>
            </button>
          </div>

          <div className={`${classes["Chat-list"]}`}>
            {(chats?.length > 0) && (filteredChats?.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setCurrentChatActive(chat)}
              >
                <Conversation
                  onRemove={handleDelete}
                  currentUserId={user?.id}
                  data={chat}
                  online={checkOnlineStatus(chat)}
                  isActive={String(currentChat?.id) === String(chat.id)}
                />
              </div>
            )))}
            {(filteredChats?.length === 0) &&
              <span className={`${classes["chatbox-empty-message"]}`}>
                <img src={aiFace} alt="AI Face" className={classes.aiFaceIcon} />
                <h1 className={classes.gradientText}>No Chats available yet!</h1>
              </span>
            }
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className={`${classes["Right-side-chat"]} ${show === 'currentChat' && classes["show"]}`}>
        <ChatBox
          onClose={onClose}
          currentUser={user.id}
          chat={currentChat}
          currentUserRole={user.role}
          onHandleSend={onHandleSend}
          messages={messages}
          online={checkOnlineStatus(currentChat)}
          isOtherTyping={otherUserTyping}
        />
      </div>
      <div className={`${classes["notification-right-side"]} ${show === 'notifications' && classes["show"]} `}>
        <div className={classes["notification-container"]}>
          <div className={classes["notification-toolbar"]}>
            <div className={classes["toolbar-row"]}>
              <div style={{ width: '100%' }}>
                <CustomSelect
                  options={NOTIFICATION_TYPE_OPTIONS}
                  value={typeFilter}
                  onChange={(val) => setTypeFilter(val)}
                  placeholder="All Types"
                />
              </div>
            </div>
            <div className={classes["toolbar-row"]}>
              <label className={classes["unread-toggle"]}>
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                />
                Unread only
              </label>
              <button
                type="button"
                className={classes["mark-all-read-btn"]}
                onClick={handleReadAllNotifications}
                disabled={!notifications?.some((n) => n.unRead)}
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className={classes["header-search-container"]}>
            <input type="search" name="search" className={classes["search-field"]} placeholder="Search By Description..."
              onChange={handleSChangeNo}
              value={searchedValueNo} />
            <button className={classes["search-btn"]} onClick={handleSNo}>
              <ion-icon name="search-outline"></ion-icon>
            </button>
          </div>
          <div className={`${classes["notifi-list"]}`}>
            {(filteredNo?.length > 0) && groupNotificationsByDay(filteredNo).map((group) => (
              <div key={group.label}>
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', margin: '10px 0' }}>{group.label}</div>
                {group.items.map((notify, i) => (
                  <div key={`${group.label}-${notify.id ?? i}`}>
                    <Notifications
                      onRemove={handleDeleteNotification}
                      onUpdate={handleUpdateNotification}
                      data={notify}
                    />
                  </div>
                ))}
              </div>
            ))}
            {(filteredNo?.length === 0) &&
              <span className={`${classes["chatbox-empty-message"]}`}>
                <img src={aiFace} alt="AI Face" className={classes.aiFaceIcon} />
                <h1 className={classes.gradientText}>{showUnreadOnly ? 'No unread notifications' : 'No notifications available yet!'}</h1>
              </span>
            }
          </div>
        </div>
      </div>
    </div>
  </GlobalWrapper>
);
};

export default ChatNew;
