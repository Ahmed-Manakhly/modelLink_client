import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { BASE_URL } from '../lib/api';
import { getAuthToken } from '../utility/tokenLoader';
import { uiActions } from '../store/UI-slice';

export const socket = io(BASE_URL, { autoConnect: false });

const useSocket = (userId, handlers = {}) => {
    const dispatch = useDispatch();
    const isConnected = useRef(false);
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        if (!userId) {
            if (isConnected.current) {
                socket.disconnect();
                isConnected.current = false;
            }
            return;
        }

        if (!isConnected.current) {
            socket.auth = { token: getAuthToken() };
            socket.connect();
            isConnected.current = true;
        }

        const onConnect = () => {
            socket.auth = { token: getAuthToken() };
            socket.emit('joinRoom', userId);
        };

        const onGetUsers = (onlineUsers) => {
            handlersRef.current.setOnlineUsers?.(onlineUsers);
        };

        const onNewModel = () => {
            handlersRef.current.setModelsUpdated?.(true);
        };

        const onReceiveOrder = (data) => {
            handlersRef.current.setNotify?.(data);
            if (data && data.actionDesc) {
                dispatch(uiActions.notificationDataChanged({
                    status: 'success',
                    title: 'New Notification',
                    message: data.actionDesc
                }));
                dispatch(uiActions.showNotification(true));
                setTimeout(() => {
                    dispatch(uiActions.showNotification(false));
                }, 4000);
            }
        };

        const onRefresh = (data) => {
            handlersRef.current.setRefresh?.(data);
        };

        const onModelRefresh = (data) => {
            handlersRef.current.setModelRefresh?.(data);
        };

        const onReceiveMsg = (data) => {
            handlersRef.current.onReceiveMsg?.(data);
        };

        socket.on('connect', onConnect);
        socket.on('get-users', onGetUsers);
        socket.on('new_model_created', onNewModel);
        socket.on('receive_order', onReceiveOrder);
        socket.on('refresh', onRefresh);
        socket.on('modelRefresh', onModelRefresh);
        socket.on('receive_msg', onReceiveMsg);

        return () => {
            socket.off('connect', onConnect);
            socket.off('get-users', onGetUsers);
            socket.off('new_model_created', onNewModel);
            socket.off('receive_order', onReceiveOrder);
            socket.off('refresh', onRefresh);
            socket.off('modelRefresh', onModelRefresh);
            socket.off('receive_msg', onReceiveMsg);
        };
    }, [userId, dispatch]);

    return socket;
};

export default useSocket;
