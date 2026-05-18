import React, { useState , useEffect } from "react";
import { getUser } from "../../lib/ChatRequests";
import classes from './Conversation.module.scss'
import {origin} from '../../lib/api'
 // eslint-disable-next-line 
import { format } from "timeago.js";
import DeleteIcon from '@mui/icons-material/Delete';
import {Link} from 'react-router-dom'
import {getAuthToken} from '../../utility/tokenLoader'

const Conversation = ({ data, online ,currentUserRole , onRemove , to}) => {
  const token = getAuthToken() ;
  const [userData, setUserData] = useState(null)
  useEffect(()=> {
    let userId
    if(currentUserRole === 'CLIENT'){
      userId = data?.developerId;
    }else {
      userId = data?.clientId;
    }
    const getUserData = async ()=> {
      try
      {
          const {data} =await getUser(userId , token)
          setUserData(data?.data?.user)
      }
      catch(error)
      {
        console.log(error?.respons?.data?.message);
      }
    }
    token && getUserData();
  }, [data , currentUserRole , token])
  //=====================================================================================================================
  return (
    <>
      <div className={`${classes["conversation"]}`} >
        <div className={`${classes["conversation-con"]}`} >
          {online && <div className={`${classes["online-dot"]}`}></div>}
          <Link  className={` ${classes.imgCon}`} to={`/profile/${userData?.id}`}>
            {userData?.avatar &&<img src={origin+userData?.avatar} alt="User Avatar" crossOrigin="anonymous"  />}
            {!userData?.avatar &&  <div className={classes['UserHolder']} >{userData?.org_username&&userData?.org_username[0]?.toUpperCase()}</div>}
          </Link>

          <div className={classes["info-box"]}>
            <div className={classes["row_1"]}>
              <div className={classes["Col_1"]} >
                <span>{userData?.first_name ? userData?.first_name?.toUpperCase()?.slice(0, 9) :userData?.org_username?.toUpperCase()?.slice(0, 9) }</span>
              </div>
              {data?.unReadMsg > 0 && <div className={classes["Col_2"]}>
                <span>{data?.unReadMsg}</span>
              </div>}
              {data?.unReadMsg === 0 &&
                <span className={classes["Col_3"]}>{format(data?.updatedAt)}</span>
              }
            </div>
            <div className={classes["row_2"]}>
              <div className={classes["Col_1"]}>
              <Link to={to? to : null}>{data?.lastMessage ? data?.lastMessage?.slice(0, 20)+' ...' : '' }</Link>
              </div>
              <div className={classes["Col_2"]}  onClick={onRemove.bind(null,data?.id)} >
                <span> <DeleteIcon style={{cursor:'pointer'}} title="delete"  /> </span>
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
