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
import { FiSettings, FiGrid, FiStar, FiCreditCard, FiPackage, FiShield, FiUser, FiLock, FiLogOut } from 'react-icons/fi';
import GlobalWrapper from './GlobalWrapper';




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
        <div className={` ${classes.imgCon} `} >
          {/* <img src={UserHolder} alt="UserHolder" /> */}
          <UserAvatar user={userData} />
        </div>
        <ul className={classes["dropdown-list"]}>
          <li className={` ${classes.item_}   ${classes['dropdown-item']}`}>
            <div className={` ${classes.imgCon} `} >
              {/* <img src={UserHolder} alt="UserHolder" /> */}
              <UserAvatar user={userData} />
            </div>
            {first_name && <h4>{first_name?.toUpperCase()?.slice(0, 9)}</h4>}
            {!first_name && <h4>{org_username?.toUpperCase()?.slice(0, 9)}</h4>}
            <h6>{role}</h6>
          </li>
          <hr />
          <li className={` ${classes.item_2}   ${classes['dropdown-item']} `}>
            <Link to={`/profileSettings`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiSettings /> Profile Settings</Link>
          </li>
          {role === 'DEVELOPER' && (
            <>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/dashboard-dev`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiGrid /> My Dashboard</Link>
              </li>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/reviews-dev`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiStar /> My Reviews</Link>
              </li>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/wallet`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiCreditCard /> My Wallet</Link>
              </li>
            </>
          )}
          {role === 'CLIENT' && (
            <>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/orders-client`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiPackage /> My Orders</Link>
              </li>
              <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
                <Link to={`/reviews-client`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiStar /> My Reviews</Link>
              </li>
            </>
          )}
          {(role === 'ADMIN' || role === 'EMPLOYEE') &&
            <li className={` ${classes.item_2}  ${classes['dropdown-item']}`}>
              <Link to={`/admin`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiShield /> Admin Dashboard</Link>
            </li>
          }
          <li className={` ${classes.item_2}   ${classes['dropdown-item']} `}>
            <Link to={`/profile/${userID}`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiUser /> My Profile</Link>
          </li>
          <li className={` ${classes.item_2}   ${classes['dropdown-item']} `}>
            <Link to={`/change-password`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiLock /> Change Password</Link>
          </li>
          <hr />
          <li className={` ${classes.item_2} ${classes['dropdown-item']}`} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={logoutAction} className="btn-glass-logout" style={{ width: '100%' }}>
              <FiLogOut />
              <span>Logout</span>
            </button>
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
      <GlobalWrapper>
        <div className={classes["topbar-flex"]}>
          <ul className={classes["header-social-container"]}>
            <li>
              <Link to="/" className={classes["social-link"]}>
                <ion-icon name="logo-facebook"></ion-icon>
              </Link>
            </li>
            <li>
              <Link to="/" className={classes["social-link"]} style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" style={{ fill: 'currentColor' }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
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
          <div className={classes["header-alert-news"]} style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
            <p style={{ margin: 0 }}>
              <b >{txt_1}</b>{' '}
              {txt_2}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/policy" className="legal-link" style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                <FiShield style={{ marginRight: '5px', fontSize: '1rem' }} />
                Policies
              </Link>
            </div>
          </div>
          <div className={classes["header-top-actions"]}>
            {!isLoggedIn && pageActions}
            {isLoggedIn && userActions}
          </div>
        </div>
      </GlobalWrapper>
    </div>
  )
}

export default Topbar