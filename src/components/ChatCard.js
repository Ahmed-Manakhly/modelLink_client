/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import classes from './ChatCard.module.scss'
// import {FILES_BASE_API_URL} from '../lib/api';
import UserAvatar from './ui/UserAvatar';

function ChatCard({ userData, onlineUsers, userId }) {
  const checkOnlineStatus = (theUserId) => {
    const online = onlineUsers.find((user) => user.userId === theUserId);
    return online ? true : false;
  };
  const online = checkOnlineStatus(userData?.id ? userData?.id : userId)
  return (
    <div className={`${classes["conversation"]}`} >
      <div className={`${classes["conversation-con"]}`} >
        {online && <div className={`${classes["online-dot"]}`}></div>}
        <div className={` ${classes.imgCon}`} >
          <UserAvatar user={userData} />
        </div>
        <div className={classes["info-box"]}>
          <div className={classes["row_1"]}>
            <span>{userData?.first_name ? userData?.first_name?.toUpperCase()?.slice(0, 9) : userData?.org_username?.toUpperCase()?.slice(0, 9)}</span>
          </div>
          <div className={classes["row_2"]}>
            <Link to={`/chat?contact=${userData?.id ? userData?.id : userId}`} className={`${classes.up}`} >
              Contact Me...
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatCard
