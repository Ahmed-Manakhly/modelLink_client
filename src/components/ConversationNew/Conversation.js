import React, { useState, useEffect } from "react";
import { getUser } from "../../lib/ChatRequests";
import classes from './Conversation.module.scss'
// import { FILES_BASE_API_URL } from '../../lib/api'
import { format } from "timeago.js";
import UserAvatar from '../ui/UserAvatar';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'
import { getAuthToken } from '../../utility/tokenLoader'
import { getMessagePreview } from '../../utility/chatHelpers';
import {
  getCounterpartyDisplayName,
  // eslint-disable-next-line
  getCounterpartyInitial,
  getCounterpartyProfileLink,
  isStaffRole,
  resolveCounterpartyUser,
} from '../../utility/chatParticipantDisplay';

const Conversation = ({ data, online, currentUserId, onRemove, to, isActive }) => {
  const token = getAuthToken();
  const [userData, setUserData] = useState(null)

  // Derive deleted-account status from the embedded participant data (populated by getConversations)
  const otherParticipant = data?.participants?.find(p => p.userId !== currentUserId) || data?.participants?.[0];
  const isDeletedAccount = otherParticipant?.user?.isActive === false;

  useEffect(() => {
    if (isDeletedAccount) return;
    const userId = otherParticipant?.userId;
    const embeddedUser = otherParticipant?.user;

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
    token && userId && getUserData();
  }, [data, currentUserId, token, isDeletedAccount, otherParticipant?.userId, otherParticipant?.user]);

  const displayName = isDeletedAccount ? 'Deleted Account' : getCounterpartyDisplayName(userData);
  const profileLink = isDeletedAccount ? null : getCounterpartyProfileLink(userData);
  //=====================================================================================================================
  return (
    <>
      <div className={`${classes["conversation"]} ${isActive ? classes["active"] : ''}`} >
        <div className={`${classes["conversation-con"]}`} >
          {online && <div className={`${classes["online-dot"]}`}></div>}
          {profileLink ? (
            <Link className={` ${classes.imgCon}`} to={profileLink}>
              <UserAvatar user={userData} />
            </Link>
          ) : (
            <div className={` ${classes.imgCon}`}>
              {isDeletedAccount ? (
                <div className={classes['UserHolder']} style={{ background: '#888', color: '#ccc' }}>?</div>
              ) : (
                <UserAvatar user={userData} />
              )}
            </div>
          )}

          <div className={classes["info-box"]}>
            <div className={classes["row_1"]}>
              <div className={classes["Col_1"]} >
                <span title={displayName?.toUpperCase()}>{displayName?.toUpperCase()}</span>
              </div>
              {data?.participants?.find(p => p.userId === currentUserId)?.hasRead === false && data?.unReadMsg > 0 && <div className={classes["Col_2"]}>
                <span>{data?.unReadMsg}</span>
              </div>}
              {!(data?.participants?.find(p => p.userId === currentUserId)?.hasRead === false && data?.unReadMsg > 0) &&
                <span className={classes["Col_3"]}>{format(data?.updatedAt)}</span>
              }
            </div>
            <div className={classes["row_2"]}>
              <div className={classes["Col_1"]}>
                {to ? (
                  <Link to={to}>{getMessagePreview(data?.lastMessage)}</Link>
                ) : (
                  <span>{getMessagePreview(data?.lastMessage)}</span>
                )}
              </div>
              <div className={classes["Col_2"]} onClick={(e) => { e.stopPropagation(); onRemove?.(data?.id); }} >
                <span> <DeleteIcon style={{ cursor: 'pointer' }} title="delete" /> </span>
              </div>
            </div>

            {/* <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span> */}
          </div>
        </div>
      </div>
      {/* <hr style={{ width: "85%", border: "0.1px solid #444" }} /> */}
    </>
  );
};

export default Conversation;
