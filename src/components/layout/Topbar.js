/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';
import { uiActions } from '../../store/UI-slice';
import classes from './Topbar.module.scss';
// import { FILES_BASE_API_URL } from '../../lib/api'
import { socket } from '../../hooks/useSocket';
import UserAvatar from '../ui/UserAvatar';




function Topbar({ txt_1, txt_2, txt_3, txt_4 }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const userData = useSelector(state => state.auth.userData);
  // eslint-disable-next-line
  const { org_username, role, id: userID, avatar, first_name } = userData;
  const logoutAction = () => {
    socket.emit("leavingRoom", userID);
    const toast = { status: 'success', message: 'come back soon', title: 'logged out' };
    dispatch(authActions.onLoginOut());
    dispatch(uiActions.notificationDataChanged(toast));
    dispatch(uiActions.showNotification(true));
    navigate('/');
  }
  //---------------------------------------------------------
  const pageActions = <>
    <Link to="./auth?mode=login" className={`btn-glass-primary`}>{txt_3}</Link>
    <Link to="./auth?mode=signup" className={`btn-glass-outline`} style={{ marginLeft: '10px' }}>{txt_4}</Link>
  </>
  //---------------------------------------------------------
  const userActions = <>
    {/* {============================================} */}
    <div className={classes['desktop-menu-category-list']}>
      <li className={` ${classes.container_} ${classes['menu-category']} `}>
        <div className={` ${classes.imgCon} ${classes['menu-title']} `} >
          {/* <img src={UserHolder} alt="UserHolder" /> */}
          <UserAvatar user={userData} />
        </div>
        <ul className={classes["dropdown-list"]}>
          <li className={` ${classes.item_}   ${classes['dropdown-item']}`}>
            <div className={` ${classes.imgCon} ${classes['menu-title']}  `} >
              {/* <img src={UserHolder} alt="UserHolder" /> */}
              <UserAvatar user={userData} />
            </div>
            {first_name && <h4>{first_name?.toUpperCase()?.slice(0, 9)}</h4>}
            {!first_name && <h4>{org_username?.toUpperCase()?.slice(0, 9)}</h4>}
            <h6>{role}</h6>
          </li>
          <hr />
          <li className={` ${classes.item_2}   ${classes['dropdown-item']} `}>
            <Link to={`/profileSettings`}>Profile Settings</Link>
          </li>
          {role === 'DEVELOPER' && (
            <>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/dashboard-dev`} >My Dashboard</Link>
              </li>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/reviews-dev`} >My Reviews</Link>
              </li>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/wallet`} >My Wallet</Link>
              </li>
            </>
          )}
          {role === 'CLIENT' &&
            <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
              <Link to={`/orders-client`} >My Orders</Link>
            </li>
          }
          {(role === 'ADMIN' || role === 'EMPLOYEE') &&
            <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
              <Link to={`/admin`} >Admin Dashboard</Link>
            </li>
          }
          <li className={` ${classes.item_2}   ${classes['dropdown-item']} `}>
            <Link to={`/profile/${userID}`}>My Profile</Link>
          </li>
          <li className={` ${classes.item_2}   ${classes['dropdown-item']} `}>
            <Link to={`/change-password`}>Change Password</Link>
          </li>
          <hr />
          <li className={` ${classes.item_2} ${classes['dropdown-item']}`} style={{ alignItems: 'center' }}>
            <button onClick={logoutAction} className={`btn-glass-primary`} >{'Logout'}</button>
          </li>
        </ul>
      </li>
    </div>
    {/* {============================================} */}
    {role === 'DEVELOPER' &&
      <Link to="/models/new" className="btn-glass-primary"> {'Create Model'} </Link>
    }
    {role === 'CLIENT' &&
      <Link to="/orders-client" className="btn-glass-primary"> {'My Orders'} </Link>
    }
    {(role === 'ADMIN' || role === 'EMPLOYEE') &&
      <Link to="/admin" className="btn-glass-primary"> {'Dashboard'} </Link>
    }
  </>
  //---------------------------------------------------------
  return (
    <div className={classes["header-top"]} >
      <div className={classes["container"]}>
        <ul className={classes["header-social-container"]}>
          <li>
            <Link to="/" className={classes["social-link"]}>
              <ion-icon name="logo-facebook"></ion-icon>
            </Link>
          </li>
          <li>
            <Link to="/" className={classes["social-link"]}>
              <ion-icon name="logo-twitter"></ion-icon>
            </Link>
          </li>
          <li>
            <Link to="/" className={classes["social-link"]}>
              <ion-icon name="logo-instagram"></ion-icon>
            </Link>
          </li>
          <li>
            <Link to="/" className={classes["social-link"]}>
              <ion-icon name="logo-linkedin"></ion-icon>
            </Link>
          </li>
        </ul>
        <div className={classes["header-alert-news"]}>
          <p >
            <b >{txt_1}</b>{' '}
            {txt_2}
          </p>
        </div>
        <div className={classes["header-top-actions"]}>
          {!isLoggedIn && pageActions}
          {isLoggedIn && userActions}
        </div>
      </div>
    </div>
  )
}

export default Topbar