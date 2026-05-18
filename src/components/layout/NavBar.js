import {categoriesList} from '../../data' ;
import {menuList} from '../../data' ;
import {Link} from 'react-router-dom' ;
import classes from './NavBar.module.scss' ;
import { FaCode } from "react-icons/fa";
import { GrOrganization } from "react-icons/gr";
import {useSelector} from 'react-redux'; 
import Notifications from '../Notifications/Notifications'
import Conversation from '../CoversationNew/Conversation'

//-------------------------------------
const SingleLink = ({title , to })=>{
  return(
  <li className={classes["menu-category"]}>
    <Link to={to} className={classes["menu-title"]}>{title}</Link>
  </li>
  )
}
//----------------------------
const MultipleLink = ({categoryTitle,to,subCategory , categoryImg , onClickLink })=>{
  return (
    <ul className={classes["dropdown-panel-list"]}>
      <li className={classes["menu-title"]}> <Link to={to} >{categoryTitle}</Link></li>
      {subCategory.map((item,index)=>{return(
        <li className={classes["panel-list-item"]} key={index} > <Link to={item.to} onClick={onClickLink?.bind(null,item.title)} >{item.title} </Link> </li>
      )})}
      <li className={`${classes["panel-list-item"]}   ${classes["img-con"]}`}>
        <Link to='/'>
          <img src={categoryImg} alt={categoryTitle} style={{width:'25%'}} />
        </Link>
      </li>
  </ul>
  )
}
//------------------------------------
const MultipleLinkList =({listName , listItems , onClickLink})=> {
  return(
    <li className={classes["menu-category"]} >
      <Link to="/" className={classes["menu-title"]}>{listName}</Link>
      <div className={classes["dropdown-panel"]}>
        {listItems.map((item,index)=>{return(
          <MultipleLink   key={index} categoryTitle={item.title} to={item.to} subCategory={item.items} categoryImg={item.img} onClickLink={onClickLink}/>
        )})}
      </div>
    </li>
  )
}
//----------------------------------
const MenuList = ({title,list})=>{
  return(
    <li className={classes["menu-category"]}>
    <Link to='/' className={classes["menu-title"]}>{title}</Link>
    <ul className={classes["dropdown-list"]}>
    {list.map((item,index)=>{return(
          <li className={classes["dropdown-item"]}  key={index} >
          <Link to={item.to} >{item.title === 'developer'?<FaCode />:item.title === 'organization'?<GrOrganization />:null}{item.title} </Link>
        </li>
        )})}
    </ul>
  </li>
  )
}
//----------------------------------------------------------
function NavBar({msgCounter , notCounter , notifys , handleDeleteNotification , handleUpdateNotification , chats , checkOnlineStatus , handleDeleteChat ,onClickLink}) {
  const userData = useSelector(state => state.auth.userData) ;
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn) ;
  const quantity = useSelector(state => state.cart.quantity) ;
  const {role} = userData;

  const getMember = (chat) =>{
    let chatMember
    if(role === 'CLIENT'){
      chatMember = chat?.developerId;
    }else {
      chatMember = chat?.clientId;
    }
    return chatMember
  }
  return (
    <nav className={classes["desktop-navigation-menu"]}>
      <div className={classes["container"]}>
        <ul className={classes["desktop-menu-category-list"]}>
          <SingleLink  title='Home' to='/'/>
          <MultipleLinkList  listName='models' listItems={categoriesList} onClickLink={onClickLink}/>
          {!isLoggedIn && <>
          
            {menuList.map((item,index)=>{return(
                <MenuList key={index} list={item.items}  title={item.title} />
            )})}
          </>} 
          {/* <SingleLink  title='ABOUT US' to='/about'/> */}
          <SingleLink  title='contact us' to='/contact'/>
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
                  <Link  to='/dashboard-dev' >
                    <ion-icon name="grid-outline"></ion-icon>
                  </Link>
                  </div>               
                }
                {/* {--------------------------------------------} */}
                <div className={classes["action-btn"]} >
                  <Link  to='/chat'>
                    <ion-icon name="mail-outline"></ion-icon>
                  </Link>
                  {msgCounter >0 && <span className={classes["count"]}>{msgCounter}</span>}
                    {/* {(chats?.length >0 ) &&  */}
                    { (chats?.length > 0 ) && <div className={classes["dropdown-list"]}>
                      {chats.slice(0, 5).map((chat , i) => (
                          <div
                          key={i}
                          className={classes["con"]}
                          >
                            <Conversation
                              to={`/chat?contact=${getMember(chat)}`}
                              onRemove={handleDeleteChat}
                              currentUserRole={role}
                              data={chat}
                              online={checkOnlineStatus(chat)}
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
                  {notCounter > 0 &&  <span className={classes["count"]}>{notCounter}</span>}
                  { (notifys?.length > 0 ) && <div className={classes["dropdown-list"]}>
                      {notifys.slice(0, 5).map((notify , i) => (
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
                  <Link className={classes["show-btn"]} to='/chat?to=notification'>Show All</Link>
                  </div>}
                </div>
            </div>
            }
        </ul>
      </div>
    </nav>
  )
}

export default NavBar