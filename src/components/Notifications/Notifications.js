import React, { useState , useEffect } from "react";
import { getUser } from "../../lib/ChatRequests";
import classes from './Notifications.module.scss'
import {origin} from '../../lib/api'
 // eslint-disable-next-line 
import { format } from "timeago.js";
import DeleteIcon from '@mui/icons-material/Delete';
import {Link} from 'react-router-dom'
import {getAuthToken} from '../../utility/tokenLoader'

const Notifications = ({ data, onRemove , onUpdate}) => {
  const token = getAuthToken() ;
  const [userData, setUserData] = useState(null)
  useEffect(()=> {
    let userId = data?.from
    const getUserData = async ()=> {
      try{
        const {data} =await getUser(userId , token)
        setUserData(data?.data?.user)
      }catch(error)
      {
        console.log(error?.respons?.data?.message);
      }
    }
    token && getUserData();
  }, [data , token])
  //=====================================================================================================================
  return (
    <>
      <div className={`${classes["conversation"]} ${ data?.unRead === true ? classes.active : ''}`} >
        <div className={`${classes["conversation-con"]}`} >
          <Link  className={` ${classes.imgCon}`} to={`/profile/${userData?.id}`} >
            {userData?.avatar &&<img src={origin+userData?.avatar} alt="User Avatar" crossOrigin="anonymous"  />}
            {!userData?.avatar &&  <div className={classes['UserHolder']} >{userData?.org_username&&userData?.org_username[0]?.toUpperCase()}</div>}
          </Link>

          <div className={classes["info-box"]}>
            <div className={classes["row_1"]}>
              <div className={classes["Col_1"]}>
                <span>{userData?.first_name ? userData?.first_name?.toUpperCase()?.slice(0, 9) :userData?.org_username?.toUpperCase()?.slice(0, 9) }</span>
              </div>
                <div className={classes["Col_2"]}>
                  <span>{format(data?.createdAt)}</span>
                </div>
            </div>
            <div className={classes["row_2"]}>
              <div className={classes["Col_1"]}>
                <Link to={data?.actionLink} onClick={onUpdate.bind(null,data?.id)}  >{data?.actionDesc && data?.actionDesc }</Link>
              </div>
              <div className={classes["Col_2"]}  onClick={onRemove.bind(null,data?.id)} >
                <span> <DeleteIcon style={{cursor:'pointer'}} title="delete"  /> </span>
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
