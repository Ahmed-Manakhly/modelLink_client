import { createSlice } from '@reduxjs/toolkit';

const calcUnreadChats = (chats = [], userId) => {
    if (!userId) return 0;
    return chats.reduce((count, item) => {
        const me = item.participants?.find((p) => p.userId === userId);
        if (me && !me.hasRead && item.unReadMsg > 0) {
            return count + item.unReadMsg;
        }
        return count;
    }, 0);
};

const calcUnreadNotifications = (notifications = []) =>
    notifications.filter((n) => n.unRead === true).length;

const initialState = {
    chats: [],
    notifications: [],
    onlineUsers: [],
    chatsUpdated: true,
    chatRefreshTick: 0,
    notificationsUpdated: true,
    notify: null,
    refresh: null,
    modelRefresh: null,
    modelsUpdated: true,
};

const realtimeSlice = createSlice({
    name: 'realtime',
    initialState,
    reducers: {
        setChats(state, action) {
            state.chats = action.payload || [];
            state.chatsUpdated = false;
        },
        setNotifications(state, action) {
            state.notifications = action.payload || [];
            state.notificationsUpdated = false;
        },
        addNotification(state, action) {
            if (action.payload) {
                state.notifications = [action.payload, ...state.notifications];
            }
        },
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload || [];
        },
        setChatsUpdated(state, action) {
            state.chatsUpdated = action.payload ?? true;
        },
        bumpChatListRefresh(state) {
            state.chatRefreshTick += 1;
        },
        setNotificationsUpdated(state, action) {
            state.notificationsUpdated = action.payload ?? true;
        },
        setNotify(state, action) {
            state.notify = action.payload;
            if (action.payload) {
                state.notificationsUpdated = true;
            }
        },
        setRefresh(state, action) {
            state.refresh = action.payload;
        },
        setModelRefresh(state, action) {
            state.modelRefresh = action.payload;
        },
        setModelsUpdated(state, action) {
            state.modelsUpdated = action.payload ?? true;
        },
        markChatRead(state, action) {
            const conversationId = action.payload;
            state.chats = state.chats.map((chat) =>
                chat.id === conversationId
                    ? {
                        ...chat,
                        unReadMsg: 0,
                        participants: chat.participants?.map((p) => ({ ...p, hasRead: true })),
                    }
                    : chat
            );
        },
        markNotificationRead(state, action) {
            const id = action.payload;
            state.notifications = state.notifications.map((n) =>
                n.id === id ? { ...n, unRead: false } : n
            );
        },
        markAllNotificationsRead(state) {
            state.notifications = state.notifications.map((n) => ({ ...n, unRead: false }));
        },
        removeChat(state, action) {
            state.chats = state.chats.filter((c) => c.id !== action.payload);
        },
        removeNotification(state, action) {
            state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        },
        resetRealtime(state) {
            Object.assign(state, initialState);
        },
    },
});

export const selectUnreadChats = (state) =>
    calcUnreadChats(state.realtime.chats, state.auth.userData?.id);

export const selectUnreadNotifications = (state) =>
    calcUnreadNotifications(state.realtime.notifications);

export const selectOnlineUsers = (state) => state.realtime.onlineUsers;

export const selectChats = (state) => state.realtime.chats;

export const selectNotifications = (state) => state.realtime.notifications;

export const checkOnlineStatus = (chat, userId, onlineUsers = []) => {
    const chatMember = chat?.participants?.find((p) => p.userId !== userId)?.userId;
    return Boolean(onlineUsers.find((user) => user.userId === chatMember));
};

export const realtimeActions = realtimeSlice.actions;
export default realtimeSlice.reducer;
