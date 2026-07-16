/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import classes from './MobNavMenu.module.scss';
import UserAvatar from '../ui/UserAvatar';
import { FiSettings, FiGrid, FiStar, FiCreditCard, FiPackage, FiShield, FiUser, FiLock, FiHome, FiInfo, FiMail, FiLogOut } from 'react-icons/fi';

import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';
import { uiActions } from '../../store/UI-slice';
import styles from './Topbar.module.scss';
import chat_bot from '../../assets/ai-face.png';
// import {FILES_BASE_API_URL} from '../../lib/api'
import { getCategoriesReq } from '../../lib/loaders';
import { buildCategoriesList } from '../../lib/categoryHelpers';
import { menuList } from '../../constants/marketingData';
//----------------------------------------------------------------------------
const AccordionLink = ({ menuTitle, menuItems, onClick, img }) => {  //  onClick={onClickLink?.bind(null,item.title)}
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className={classes["menu-category"]}>
      <button className={`${classes['accordion-menu']} ${isOpen && classes.active}`} onClick={() => { setIsOpen(prev => !prev) }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          {img && <img src={img} alt={menuTitle} style={{width: menuTitle.toLowerCase() === 'ai models' ? '30px' : '24px', height: menuTitle.toLowerCase() === 'ai models' ? '30px' : '24px', objectFit: 'contain', filter: 'brightness(0) invert(0.9)'}} />}
          <p className={classes["menu-title"]}>{menuTitle}</p>
        </div>
        <div>
          {!isOpen && <ion-icon name="add-outline" className={classes["add-icon"]}></ion-icon>}
          {isOpen && <ion-icon name="remove-outline" className={classes["remove-icon"]}></ion-icon>}
        </div>
      </button>
      <ul className={`${classes['submenu-category-list']} ${isOpen && classes.active}`}>
        {menuItems.map((item, index) => {
          return (
            <li className={classes["submenu-category"]} key={index}>
              <Link to={item.to} className={classes["submenu-title"]} onClick={onClick?.bind(null, item.title)} >{item.title}</Link>
            </li>
          )
        })}
      </ul>
    </li>
  )
}
//-------------------------------------
const SingleLink = ({ title, onClick, to, icon }) => {
  return (
    <li className={classes["menu-category"]}>
      <Link to={to} className={classes["menu-title"]} onClick={onClick} style={{display: 'flex', alignItems: 'center', gap: '15px'}} >
          {icon} {title}
      </Link>
    </li>
  )
}

function MobNavMenu({ onClose, menuOpen, NavData, txt_1, txt_2, txt_3, txt_4 }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const userData = useSelector(state => state.auth.userData);
  // eslint-disable-next-line
  const { org_username, role, id: userID, avatar, first_name } = userData;
  const logoutAction = () => {
    const toast = { status: 'success', message: 'come back soon', title: 'logged out' };
    dispatch(authActions.onLoginOut());
    dispatch(uiActions.notificationDataChanged(toast));
    dispatch(uiActions.showNotification(true));
    navigate('/');
    onClose()
  }

  const [categoriesList, setCategoriesList] = useState([]);
  useEffect(() => {
    getCategoriesReq('?parentId=null&limit=12')
      .then((res) => {
        const dbCategories = res.data?.data?.categories || [];
        setCategoriesList(buildCategoriesList(dbCategories));
      })
      .catch((err) => console.error('Failed to load mobnav categories:', err));
  }, []);

  //---------------------------------
  const pageActions = <>
    <div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
      <img src={chat_bot} alt="AI Avatar" style={{width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3.5px solid var(--primary)'}} />
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: '15px', padding: '0 20px'}}>
      <Link onClick={onClose} to="./auth?mode=login" className={`btn-glass-primary`} style={{textAlign: 'center'}}>{txt_3}</Link>
      <Link onClick={onClose} to="./auth?mode=signup" className={`btn-glass-outline`} style={{textAlign: 'center'}}>{txt_4}</Link>
    </div>
    <br />
  </>
  //---------------------------------------------------------
  const onClickNavLink = () => {
    onClose()
  }
  const userActions = <>
    {/* {============================================} */}
    <li className={` ${styles.container_} ${styles['menu-category']} `} style={{display: 'flex', justifyContent: 'center', margin: '15px 0'}}>
      <div className={` ${styles.imgCon} ${styles['menu-title']} `} style={{width: '90px', height: '90px'}} >
        <UserAvatar user={userData} />
      </div>
    </li>
    <li className={` ${styles.container_} ${styles['menu-category']} `} style={{textAlign: 'center'}}>
      {first_name && <h4>{first_name?.toUpperCase()?.slice(0, 9)}</h4>}
      {!first_name && <h4>{org_username?.toUpperCase()?.slice(0, 9)}</h4>}
      <h6 style={{color: 'var(--sonic-silver)', marginTop: '5px'}}>{role}</h6>
    </li>
    <li style={{padding: '10px 20px 25px 20px'}}>
        <button onClick={logoutAction} className="btn-glass-logout" style={{width: '100%'}}>
          <FiLogOut />
          <span>Logout</span>
        </button>
    </li>
    <hr />
    <li className={` ${styles.container_} ${styles['menu-category']} `}>
      <Link onClick={onClose} to={`/profileSettings`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiSettings /> Profile Settings</Link>
    </li>

    {role === 'DEVELOPER' &&
      <>
        <li className={` ${styles.container_} ${styles['menu-category']} `}>
          <Link onClick={onClose} to={`/dashboard-dev`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiGrid /> My Dashboard</Link>
        </li>
        <li className={` ${styles.container_} ${styles['menu-category']} `}>
          <Link onClick={onClose} to={`/reviews-dev`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiStar /> My Reviews</Link>
        </li>
        <li className={` ${styles.container_} ${styles['menu-category']} `}>
          <Link onClick={onClose} to={`/wallet`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiCreditCard /> My Wallet</Link>
        </li>
      </>
    }
    {role === 'CLIENT' &&
      <li className={` ${styles.container_} ${styles['menu-category']} `}>
        <Link onClick={onClose} to={`/orders-client`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiPackage /> My Orders</Link>
      </li>
    }
    {(role === 'ADMIN' || role === 'EMPLOYEE') &&
      <li className={` ${styles.container_} ${styles['menu-category']} `}>
        <Link onClick={onClose} to={`/admin`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiShield /> Admin Dashboard</Link>
      </li>
    }
    <li className={` ${styles.container_} ${styles['menu-category']} `}>
      <Link onClick={onClose} to={`/profile/${userID}`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiUser /> My Profile</Link>
    </li>
    <li className={` ${styles.container_} ${styles['menu-category']} `}>
      <Link onClick={onClose} to={`/change-password`} style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FiLock /> Change Password</Link>
    </li>
    <br />
    <hr />
    <br />
    <div className={styles['desktop-menu-category-list']}>
      <ul>
      </ul>
    </div>
    {/* {============================================} */}
  </>
  //------------------------
  return (
    <nav className={`${classes['mobile-navigation-menu']}  has-scrollbar ${menuOpen && classes.active} `} >
      <div className={classes["menu-top"]} style={{borderBottom: 'none'}}>
        <button className={classes["menu-close-btn"]} onClick={onClose} style={{marginLeft: 'auto'}}>
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
      <ul className={classes["mobile-menu-category-list"]}>

        {/* <div className={styles["header-top-actions"]}> */}
        {!isLoggedIn && pageActions}
        {isLoggedIn && userActions}
        {/* </div> */}

        <SingleLink title='Home' to='/' onClick={onClose} icon={<FiHome />} />
        {/* {======================================} */}
        {categoriesList.map((item, index) => {
          return (
            <AccordionLink key={index} menuTitle={`${item.title}`} menuItems={item.items} img={item.img} onClick={onClickNavLink} />
          )
        })}
        {!isLoggedIn && menuList.map((item, index) => {
          return (
            <AccordionLink key={`menu_${index}`} menuTitle={`${item.title}`} menuItems={item.items} onClick={onClickNavLink} />
          )
        })}
        {/* {======================================} */}
        <SingleLink title='About Us' to='/about' onClick={onClose} icon={<FiInfo />} />
        <SingleLink title='Contact Us' to='/contact' onClick={onClose} icon={<FiMail />} />
      </ul>
      <div className={classes["menu-bottom"]}>
        <ul className={classes["menu-social-container"]}>
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
        <br />
        <div className={classes["header-alert-news"]}>
          <p >
            <b >{txt_1}</b>{' '}
            {txt_2}
          </p>
        </div>
      </div>
    </nav>
  )
}

export default MobNavMenu