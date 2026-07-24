import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/authSlice';
import { uiActions } from '../store/UI-slice';
import { realtimeActions, selectOnlineUsers } from '../store/realtimeSlice';
import { getMeReq } from '../lib/loaders';
import { userChats, removeChat } from '../lib/ChatRequests';
import { userNotifications, updateNotification, removeNotification, readAllNotificationsReq } from '../lib/notificationsRequests';
import useSocket from './useSocket';

const useRealtimeSession = (userId, token) => {
    const dispatch = useDispatch();
    const chatsUpdated = useSelector(state => state.realtime.chatsUpdated);
    const chatRefreshTick = useSelector(state => state.realtime.chatRefreshTick);
    const notificationsUpdated = useSelector(state => state.realtime.notificationsUpdated);
    const notify = useSelector(state => state.realtime.notify);
    const refresh = useSelector(state => state.realtime.refresh);
    const modelRefresh = useSelector(state => state.realtime.modelRefresh);
    const onlineUsers = useSelector(selectOnlineUsers);

    const refreshSessionUser = useCallback(async () => {
        if (!token || token === 'EXPIRED') return;
        try {
            const { data } = await getMeReq({ Authorization: `Bearer ${token}` });
            if (data?.data?.user) {
                dispatch(authActions.updateUser(data.data.user));
            }
        } catch (_) { }
    }, [token, dispatch]);

    useSocket(userId, {
        setNotify: (data) => dispatch(realtimeActions.setNotify(data)),
        setRefresh: (data) => dispatch(realtimeActions.setRefresh(data)),
        setModelRefresh: (data) => dispatch(realtimeActions.setModelRefresh(data)),
        setOnlineUsers: (users) => dispatch(realtimeActions.setOnlineUsers(users)),
        setModelsUpdated: (value) => dispatch(realtimeActions.setModelsUpdated(value)),
        onReceiveMsg: () => dispatch(realtimeActions.bumpChatListRefresh()),
        onUserVerified: refreshSessionUser,
    });

    useEffect(() => {
        const onFocus = () => refreshSessionUser();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [refreshSessionUser]);

    useEffect(() => {
        if (notify) {
            dispatch(realtimeActions.setNotificationsUpdated(true));
        }
    }, [notify, dispatch]);

    useEffect(() => {
        if (!userId) return;
        const getChats = async () => {
            try {
                const { data } = await userChats(userId, token);
                dispatch(realtimeActions.setChats(data?.data?.chats || []));
            } catch (error) {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error',
                    title: 'Error',
                    message: error?.response?.data?.message || 'Failed to fetch chats',
                }));
                dispatch(uiActions.showNotification(true));
            }
        };
        if (chatsUpdated || chatRefreshTick > 0) {
            getChats();
        }
    }, [userId, chatsUpdated, chatRefreshTick, token, dispatch]);

    useEffect(() => {
        if ((userId) && notificationsUpdated) {
            const getNotifications = async () => {
                try {
                    const { data } = await userNotifications(userId, token);
                    dispatch(realtimeActions.setNotifications(data?.data || []));
                } catch (error) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: error?.response?.data?.message || 'Failed to fetch notifications',
                    }));
                    dispatch(uiActions.showNotification(true));
                }
            };
            getNotifications();
        }
    }, [userId, notificationsUpdated, token, dispatch]);

    const onFeatchChats = () => dispatch(realtimeActions.setChatsUpdated(true));
    const onFeatchNotifications = () => dispatch(realtimeActions.setNotificationsUpdated(true));

    const handleDeleteNotification = async (id) => {
        try {
            const { data } = await removeNotification(id, token);
            dispatch(realtimeActions.setNotificationsUpdated(true));
            dispatch(realtimeActions.setNotify(data));
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to delete notification',
            }));
            dispatch(uiActions.showNotification(true));
        }
    };

    const handleUpdateNotification = async (id) => {
        try {
            const { data } = await updateNotification(id, { unRead: false }, token);
            dispatch(realtimeActions.markNotificationRead(id));
            dispatch(realtimeActions.setNotificationsUpdated(true));
            dispatch(realtimeActions.setNotify(data));
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to update notification',
            }));
            dispatch(uiActions.showNotification(true));
        }
    };

    const handleReadAllNotifications = async () => {
        try {
            await readAllNotificationsReq({ Authorization: `Bearer ${token}` });
            dispatch(realtimeActions.markAllNotificationsRead());
            dispatch(realtimeActions.setNotificationsUpdated(true));
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to mark all as read',
            }));
            dispatch(uiActions.showNotification(true));
        }
    };

    const handleDeleteChat = async (id) => {
        try {
            await removeChat(id, token);
            dispatch(realtimeActions.removeChat(id));
            dispatch(realtimeActions.setChatsUpdated(true));
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to delete chat',
            }));
            dispatch(uiActions.showNotification(true));
        }
    };

    return {
        onlineUsers,
        notify,
        refresh,
        modelRefresh,
        onFeatchChats,
        onFeatchNotifications,
        handleDeleteNotification,
        handleUpdateNotification,
        handleReadAllNotifications,
        handleDeleteChat,
    };
};

export default useRealtimeSession;
