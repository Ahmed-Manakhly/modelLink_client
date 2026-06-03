/* eslint-disable react/prop-types */
import {useState} from 'react' ;
import classes from './MobNavMenu.module.scss'

import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'; 
import { useDispatch} from 'react-redux'; 
import {authActions} from '../../store/Auth.-slice' ;
import {uiActions} from '../../store/UI-slice' ;
import styles from './Topbar.module.scss' ;
import {FILES_BASE_API_URL} from '../../lib/api' 
//----------------------------------------------------------------------------
const AccordionLink =({menuTitle,menuItems , onClick})=>{  //  onClick={onClickLink?.bind(null,item.title)}
  const [isOpen,setIsOpen]=useState(false) ;
  return(
  <li className={classes["menu-category"]}>
    <button className={`${classes['accordion-menu']} ${isOpen && classes.active}`} onClick={()=>{setIsOpen(prev=>!prev)}}>
      <p className={classes["menu-title"]}>{menuTitle}</p>
      <div>
        {!isOpen && <ion-icon name="add-outline" className={classes["add-icon"]}></ion-icon>}
        {isOpen &&<ion-icon name="remove-outline" className={classes["remove-icon"]}></ion-icon>}
      </div>
    </button>
    <ul className={`${classes['submenu-category-list']} ${isOpen && classes.active}`}>
      {menuItems.map((item,index)=>{return(
      <li className={classes["submenu-category"]} key={index}>
        <Link to={item.to} className={classes["submenu-title"]} onClick={onClick?.bind(null,item.title)} >{item.title}</Link>
      </li>
      )})}
    </ul>
  </li>
  )
}
//-------------------------------------
const SingleLink = ({title , onClick, to})=>{
  return(
  <li className={classes["menu-category"]}>
    <Link to={to} className={classes["menu-title"]} onClick={onClick} >{title}</Link>
  </li>
  )
}

function MobNavMenu({onClose ,menuOpen ,NavData , txt_1 , txt_2 , txt_3 , txt_4 , onClickLink}) {
  const navigate = useNavigate()
  const dispatch = useDispatch();   
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn) ;
  const userData = useSelector(state => state.auth.userData) ;
  const {org_username , role, id:userID , avatar , first_name} = userData;
  const logoutAction = ()=> {
    const toast = {status :'success',message: 'come back soon',title:'logged out'};
    dispatch(authActions.onLoginOut());
    dispatch(uiActions.notificationDataChanged(toast));
    dispatch(uiActions.showNotification(true));
    navigate('/') ;
    onClose()
  }
    //---------------------------------
    const pageActions = <> 
    <br />
    <Link onClick={onClose}  to="./auth?mode=login" className={`${styles["banner-btn"]} ${styles.signIn}`}>{txt_3}</Link>
    <br />
    <Link onClick={onClose}  to="./auth?mode=signup" className={`${styles["banner-btn"]} ${styles.signUp}`} >{txt_4}</Link>
    <br />
  </>
//---------------------------------------------------------
  const onClickNavLink =(title)=>{
    onClickLink(title)
    onClose()
  }
  const userActions = <> 
    {/* {============================================} */}
      <li className={` ${styles.container_} ${styles['menu-category']} `}>       
        <div  className={` ${styles.imgCon} ${styles['menu-title']} `} >
          {/* <img src={UserHolder} alt="UserHolder" /> */}
          {avatar &&<img src={FILES_BASE_API_URL+avatar} alt="Model Cover" crossOrigin="anonymous"  />}
            {!avatar &&  <div className={classes['UserHolder']} >{org_username&&org_username[0]?.toUpperCase()}</div>}
        </div>
      </li>
      <br />
      <li className={` ${styles.container_} ${styles['menu-category']} `}> 
      {first_name && <h4>{first_name?.toUpperCase()?.slice(0, 9)}</h4>}
             { !first_name && <h4>{org_username?.toUpperCase()?.slice(0, 9)}</h4>}
              <h6>{role}</h6>
      </li>
      <hr />
      <li className={` ${styles.container_} ${styles['menu-category']} `}>
      <Link onClick={onClose} to={`/profileSettings`}>Profile Settings</Link>
      </li>

      {role === 'DEVELOPER' && 
          <li className={` ${styles.item_2}  ${styles['dropdown-item']}`}>
            <Link onClick={onClose} to={`/dashboard-dev`} >My Dashboard</Link>
          </li>
      }
      {role === 'CLIENT' && 
          <li className={` ${styles.item_2}  ${styles['dropdown-item']}`}>
            <Link onClick={onClose} to={`/orders-client`} >My Orders</Link>
          </li>
      }
            <li className={` ${styles.container_} ${styles['menu-category']} `}>
      <Link onClick={onClose} to={`/profile/${userID}`}>My Profile</Link>
      </li>
          <br />
          <hr />
          <br />
      <div className={styles['desktop-menu-category-list']}>
          <li className={` ${styles.item_2} ${styles['dropdown-item']}`}>
            <button onClick={logoutAction} className={`${styles["banner-btn"]} ${styles.signUp}`}  >{'Logout'}</button>
          </li>
          <br />
        <ul>
        </ul>

    </div>
    {/* {============================================} */}
  </>
    //------------------------
    return (
        <nav className={`${classes['mobile-navigation-menu']}  has-scrollbar ${menuOpen && classes.active} `} >
      <div className={classes["menu-top"]}>
        <h2 className={classes["menu-title"]}>Menu</h2>
        <button className={classes["menu-close-btn"]} onClick={onClose}>
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
      <ul className={classes["mobile-menu-category-list"]}>

      {/* <div className={styles["header-top-actions"]}> */}
          {!isLoggedIn && pageActions}
          {isLoggedIn && userActions}
      {/* </div> */}

        <SingleLink  title='Home' to='/' onClick={onClose} />
        {/* {======================================} */}
        {NavData.map((item,index)=>{return(
          <AccordionLink key={index}  menuTitle={`${item.title}`} menuItems={item.links} onClick={onClickNavLink} />
        )})}
        {/* {======================================} */}
        {/* <SingleLink  title='About Us' to='/about'/> */}
        <SingleLink  title='Contact Us' to='/contact' onClick={onClose} />
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