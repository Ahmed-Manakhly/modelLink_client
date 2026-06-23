import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { getAuthToken } from '../utility/tokenLoader'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileBoxWidgetsDev from '../components/ProfileBoxWidgetsDev'
import { getData, getUserProfileReq, getUserPublicProfileReq, getModelsByUserReq, getMyOrdersReq } from '../lib/loaders';
// import { FILES_BASE_API_URL } from '../lib/api';
import PopularServices from '../components/PopularServices'
import PageTableSec from '../components/layout/PageTableSec'
import { getOrderColumns } from '../utility/tableColumns';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatCard from '../components/ChatCard'
// import { Box } from "@mui/material";
// import { Col  } from 'react-bootstrap'
// import {getAuthToken} from '../utility/tokenLoader'




function ProfileDev({ onlineUsers }) {
    const token = getAuthToken();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const { role: thisUserRole, id: thisUserId } = useSelector(state => state.auth.userData) || {};
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState({});
    const [models, setModels] = useState([]);
    const [userUpdated, setUserUpdated] = useState(false);
    const [orders, setOrders] = useState([]);
    //------------------------------------------------------
    const { id } = useParams();
    const isOwnProfile = String(id) === String(thisUserId);
    const goUpHandler = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    useEffect(() => {
        goUpHandler()
    }, [user])
    //------------------------------------------------

    useEffect(() => {
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast))
        }
        const loadingState = (state) => {
            dispatch(uiActions.showLoading(state))
        }
        const notificationState = (state) => {
            dispatch(uiActions.showNotification(state))
        }
        const gettingData = (data) => {
            setUser(data?.user ?? data ?? null)
            setUserUpdated(true)
        }
        if (token) {
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            };
            getData(() => getUserProfileReq(id, headers), toastHandler, loadingState, notificationState, gettingData, 'user!');
        } else {
            getData(() => getUserPublicProfileReq(id), toastHandler, loadingState, notificationState, gettingData, 'user!');
        }
        dispatch(uiActions.showNotification(false))
    }, [dispatch, id, token])
    //----------------------------------------------------
    useEffect(() => {
        if (userUpdated && user.role === 'DEVELOPER') {
            const toastHandler = (toast) => {
                dispatch(uiActions.notificationDataChanged(toast))
            }
            const loadingState = (state) => {
                dispatch(uiActions.showLoading(state))
            }
            const notificationState = (state) => {
                dispatch(uiActions.showNotification(state))
            }
            const gettingData = (data) => {
                setModels(data ? data : [])
            }
            const headers = token ? {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            } : {};
            getData(() => getModelsByUserReq(id, '', headers), toastHandler, loadingState, notificationState, gettingData, 'list of models!')
            dispatch(uiActions.showNotification(false))
            setUserUpdated(false)
        }
    }, [userUpdated, user, dispatch, id, token])
    //------------------------------------------
    useEffect(() => {
        if (userUpdated && user.role === 'CLIENT' && isOwnProfile && token) {
            const toastHandler = (toast) => {
                dispatch(uiActions.notificationDataChanged(toast))
            }
            const loadingState = (state) => {
                dispatch(uiActions.showLoading(state))
            }
            const notificationState = (state) => {
                dispatch(uiActions.showNotification(state))
            }
            const gettingData = (data) => {
                setOrders(Array.isArray(data) ? data : (data?.orders || []))
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            getData(() => getMyOrdersReq('', headers), toastHandler, loadingState, notificationState, gettingData, 'Orders!')
            dispatch(uiActions.showNotification(false))
        }
        if (userUpdated) {
            setUserUpdated(false)
        }
    }, [userUpdated, user, dispatch, id, token, isOwnProfile])
    //----------------------------------------------------------
    return (
        <>
            {!token && user?.role === 'DEVELOPER' && (
                <div className="alert alert-info mx-auto my-3" style={{ maxWidth: '1140px', width: '95%' }}>
                    <Link to="/auth?mode=login">Sign in</Link> to message this developer.
                </div>
            )}
            {user?.role === 'DEVELOPER' && isLoggedIn && !isOwnProfile && (
                <ChatCard onlineUsers={onlineUsers} userData={user} userId={user?.id} />
            )}
            <ProfileBoxWidgetsDev
                user={user}
                modelCount={user.role === 'DEVELOPER' ? models.length : undefined}
                totalOrders={user.role === 'DEVELOPER' ? user.total_orders : undefined}
            />
            {user.role === 'DEVELOPER' && <PopularServices models={models.slice(0, 10)} title='Models Uploaded By This Developer' />}
            {user.role === 'CLIENT' && isOwnProfile && <PageTableSec data={orders} columns={getOrderColumns()} tableTitle={'Order History'} />}
        </>
    )
}

export default ProfileDev