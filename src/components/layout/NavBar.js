import { menuList } from '../../constants/marketingData';
import { Link } from 'react-router-dom';
import classes from './NavBar.module.scss';
import { FaCode } from "react-icons/fa";
import { GrOrganization } from "react-icons/gr";
import { FiHome, FiInfo, FiMail, FiGlobe } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Notifications from '../Notifications/Notifications'
import Conversation from '../ConversationNew/Conversation'
import GlobalWrapper from './GlobalWrapper';
import { RiRobot2Line } from "react-icons/ri";
import { getCategoriesReq } from '../../lib/loaders';
import { buildCategoriesList } from '../../lib/categoryHelpers';
import {
  selectUnreadChats,
  selectUnreadNotifications,
  selectChats,
  selectNotifications,
  selectOnlineUsers,
  checkOnlineStatus as checkChatOnlineStatus,
} from '../../store/realtimeSlice';

//-------------------------------------
const SingleLink = ({ title, to, icon }) => {
  return (
    <li className={classes["menu-category"]}>
      <Link to={to} className={classes["menu-title"]} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
        {icon && <span style={{fontSize: '1.2rem', display: 'flex', color: 'var(--on-surface-variant)'}}>{icon}</span>}
        {title}
      </Link>
    </li>
  )
}
//----------------------------
const MultipleLink = ({ categoryTitle, to, subCategory, categoryImg }) => {
  return (
    <ul className={classes["dropdown-panel-list"]}>
      <li className={classes["menu-title"]}> <Link to={to} >{categoryTitle}</Link></li>
      {subCategory.map((item, index) => {
        return (
          <li className={classes["panel-list-item"]} key={index} > <Link to={item.to} >{item.title} </Link> </li>
        )
      })}
      <li className={`${classes["panel-list-item"]}   ${classes["img-con"]}`}>
        <Link to='/'>
          {categoryTitle === 'AI Models' ? (
            <RiRobot2Line className={classes["img-ai"]} style={{ fontSize: '60px', color: 'var(--primary)', filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))' }} />
          ) : (
            <img src={categoryImg} alt={categoryTitle} />
          )}
        </Link>
      </li>
    </ul>
  )
}
//----------------------------------
const MultipleLinkList = ({ listName, listItems }) => {
  return (
    <li className={classes["menu-category"]} >
      <Link to="/" className={classes["menu-title"]}>{listName}</Link>
      <div className={classes["dropdown-panel"]}>
        {listItems.map((item, index) => {
          return (
            <MultipleLink key={index} categoryTitle={item.title} to={item.to} subCategory={item.items} categoryImg={item.img} />
          )
        })}
      </div>
    </li>
  )
}

//----------------------------------
const MenuList = ({ title, list }) => {
  return (
    <li className={classes["menu-category"]}>
      <Link to='/' className={classes["menu-title"]}>{title}</Link>
      <ul className={classes["dropdown-list"]}>
        {list.map((item, index) => {
          return (
            <li className={classes["dropdown-item"]} key={index} >
              <Link to={item.to} >{item.title === 'developer' ? <FaCode /> : item.title === 'organization' ? <GrOrganization /> : null}{item.title} </Link>
            </li>
          )
        })}
      </ul>
    </li>
  )
}
//----------------------------------------------------------
function NavBar({ handleDeleteNotification, handleUpdateNotification, handleReadAllNotifications, handleDeleteChat }) {
  const userData = useSelector(state => state.auth.userData);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const quantity = useSelector(state => state.cart.quantity);
  const msgCounter = useSelector(selectUnreadChats);
  const notCounter = useSelector(selectUnreadNotifications);
  const chats = useSelector(selectChats);
  const notifys = useSelector(selectNotifications);
  const onlineUsers = useSelector(selectOnlineUsers);
  const { role } = userData;
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    getCategoriesReq('?parentId=null&limit=12')
      .then((res) => {
        const dbCategories = res.data?.data?.categories || [];
        setCategoriesList(buildCategoriesList(dbCategories));
      })
      .catch(() => {});
  }, []);

  const getMember = (chat) => {
    return chat?.participants?.find(p => p.userId !== userData?.id)?.userId;
  }
  return (
    <nav className={classes["desktop-navigation-menu"]}>
      <GlobalWrapper>
        <ul className={classes["desktop-menu-category-list"]}>
          <SingleLink title='Home' to='/' icon={<FiHome />} />
          <MultipleLinkList listName='models' listItems={categoriesList} />
          {!isLoggedIn && <>

            {menuList.map((item, index) => {
              return (
                <MenuList key={index} list={item.items} title={item.title} />
              )
            })}
          </>}
          <SingleLink title='ABOUT US' to='/about' icon={<FiInfo />} />
          <SingleLink title='contact us' to='/contact' icon={<FiMail />} />
          <SingleLink title='Site Directory' to='/directory' icon={<FiGlobe />} />
          {isLoggedIn &&
            <div className={classes["header-user-actions"]}>
              {role === 'CLIENT' &&
                <Link className={classes["action-btn"]} to='/cart' >
                  <ion-icon name="heart-outline"></ion-icon>
                  <span className={classes["count"]}>{quantity}</span>
                </Link>
              }
              {role === 'DEVELOPER' &&
                <div className={classes["action-btn"]}>
                  <Link to='/dashboard-dev' >
                    <ion-icon name="grid-outline"></ion-icon>
                  </Link>
                </div>
              }
              {/* {--------------------------------------------} */}
              <div className={classes["action-btn"]} >
                <Link to='/chat'>
                  <ion-icon name="mail-outline"></ion-icon>
                </Link>
                {msgCounter > 0 && <span className={classes["count"]}>{msgCounter}</span>}
                {/* {(chats?.length >0 ) &&  */}
                {(chats?.length > 0) && <div className={classes["dropdown-list"]}>
                  {chats.slice(0, 5).map((chat, i) => (
                    <div
                      key={i}
                      className={classes["con"]}
                    >
                      <Conversation
                        to={`/chat?contact=${getMember(chat)}`}
                        onRemove={handleDeleteChat}
                        currentUserId={userData?.id}
                        data={chat}
                        online={checkChatOnlineStatus(chat, userData?.id, onlineUsers)}
                      />
                    </div>
                  ))}
                  <Link className={classes["show-btn"]} to='/chat'>Show All</Link>
                </div>}
              </div>

              <div className={classes["action-btn"]} >
                <Link to='/chat?to=notification' >
                  <ion-icon name="notifications-outline"></ion-icon>
                </Link>
                {notCounter > 0 && <span className={classes["count"]}>{notCounter}</span>}
                {(notifys?.length > 0) && <div className={classes["dropdown-list"]}>
                  {notifys.slice(0, 5).map((notify, i) => (
                    <div
                      key={i}
                      className={classes["con"]}
                    >
                      <Notifications
                        onRemove={handleDeleteNotification}
                        onUpdate={handleUpdateNotification}
                        data={notify}
                      />
                    </div>
                  ))}
                  {notCounter > 0 && handleReadAllNotifications && (
                    <button
                      type="button"
                      className={classes["show-btn"]}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleReadAllNotifications();
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                  <Link className={classes["show-btn"]} to='/chat?to=notification'>Show All</Link>
                </div>}
              </div>
            </div>
          }
        </ul>
      </GlobalWrapper>
    </nav>
  )
}

export default NavBar