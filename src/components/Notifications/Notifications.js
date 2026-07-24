import React, { useState, useEffect } from "react";
import { getUser } from "../../lib/ChatRequests";
import classes from './Notifications.module.scss'
import { format } from "timeago.js";
import UserAvatar from '../ui/UserAvatar';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import { getAuthToken } from '../../utility/tokenLoader'
import { getNotificationType, getNotificationTypeLabel } from '../../utility/chatHelpers';
import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from '../../store/UI-slice';

const resolveActionLink = (link, role) => {
  if (role === 'CLIENT' && link === '/dashboard/orders') {
    return '/orders-client';
  }
  return link;
};

const Notifications = ({ data, onRemove, onUpdate }) => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const userRole = useSelector((state) => state.auth.userData?.role);
  const [userData, setUserData] = useState(null)
  const notifType = getNotificationType(data);
  const typeLabel = getNotificationTypeLabel(notifType);
  const actionLink = resolveActionLink(data?.actionLink, userRole);

  useEffect(() => {
    let userId = data?.senderId
    if (!userId) {
      setUserData({
        first_name: "SYSTEM",
        org_username: "SYSTEM",
        role: "SYSTEM",
        avatar: null
      });
      return;
    }
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId, token)
        setUserData(data?.data?.user)
      } catch (error) {
        const isForbidden = error?.response?.status === 403;
        
        if (!isForbidden) {
          dispatch(uiActions.notificationDataChanged({
            status: 'error',
            title: 'Error',
            message: error?.response?.data?.message || 'Failed to fetch user data',
          }));
          dispatch(uiActions.showNotification(true));
        }
        
        setUserData({
          first_name: "SYSTEM",
          org_username: "SYSTEM",
          role: "SYSTEM",
          avatar: null
        });
      }
    }
    token && getUserData();
  }, [data, token])
  //=====================================================================================================================
  return (
    <>
      <div className={`${classes["conversation"]} ${data?.unRead === true ? classes.active : ''}`} >
        <div className={`${classes["conversation-con"]}`} >
          <Link className={` ${classes.imgCon}`} to={`/profile/${userData?.id}`} >
            <UserAvatar user={userData} />
          </Link>

          <div className={classes["info-box"]}>
            <div className={classes["row_1"]}>
              <div className={classes["Col_1"]}>
                <span>{userData?.first_name ? userData?.first_name?.toUpperCase()?.slice(0, 9) : userData?.org_username?.toUpperCase()?.slice(0, 9)}</span>
                <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.75 }}>{typeLabel}</span>
              </div>
              <div className={classes["Col_2"]}>
                <span>{format(data?.createdAt)}</span>
              </div>
            </div>
            <div className={classes["row_2"]}>
              <div className={classes["Col_1"]}>
                <Link to={actionLink} onClick={onUpdate?.bind(null, data?.id)}  >{data?.actionDesc && data?.actionDesc}</Link>
              </div>
              <div className={classes["Col_2"]} onClick={onRemove?.bind(null, data?.id)} >
                <span> <DeleteIcon style={{ cursor: 'pointer' }} title="delete" /> </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <hr style={{ width: "85%", border: "0.1px solid #444" }} /> */}
    </>
  );
};

export default Notifications;
