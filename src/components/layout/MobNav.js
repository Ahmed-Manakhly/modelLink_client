/* eslint-disable react/prop-types */
import classes from './MobNav.module.scss' ;
import {Link} from 'react-router-dom' ;
import {useSelector} from 'react-redux';
import styles from './Topbar.module.scss' ;
import { selectUnreadChats, selectUnreadNotifications } from '../../store/realtimeSlice';

function MobNav({onClick , txt_3 , txt_4}) {
  const userData = useSelector(state => state.auth.userData) ;
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn) ;
  const quantity = useSelector(state => state.cart.quantity) ;
  const msgCounter = useSelector(selectUnreadChats);
  const notCounter = useSelector(selectUnreadNotifications);
  const {role} = userData;
  const pageActions = <>
  <Link to="./auth?mode=signup" className={`${styles["banner-btn"]} ${styles.signUp}`} >{txt_4}</Link>
  <Link to="./auth?mode=login" className={`${styles["banner-btn"]} ${styles.signIn}`}>{txt_3}</Link>
</>
    return (
        <div className={classes["mobile-bottom-navigation"]}>

        <button className={classes["action-btn"]} onClick={onClick}>
          <ion-icon name="menu-outline"></ion-icon>
        </button>
        {isLoggedIn &&
              <div className={classes["header-user-actions"]}>
              {role === 'CLIENT' &&
                <Link className={classes["action-btn"]} to='/cart' >
                  <ion-icon name="heart-outline"></ion-icon>
                  <span className={classes["count"]}>{quantity}</span>
                </Link>
              }
              {role === 'DEVELOPER' &&
                <Link className={classes["action-btn"]} to='/dashboard-dev' >
                  <ion-icon name="grid-outline"></ion-icon>
                </Link>
              }
              {/* {--------------------------------------------} */}
              <Link className={classes["action-btn"]} to='/chat' >
              <ion-icon name="mail-outline"></ion-icon>
                {msgCounter > 0 &&  <span className={classes["count"]}>{msgCounter}</span>}
              </Link>

              <Link className={classes["action-btn"]} to='/chat?to=notification' >
              <ion-icon name="notifications-outline"></ion-icon>
                {notCounter > 0 && <span className={classes["count"]}>{notCounter}</span>}
              </Link>
          </div>
            }
            {!isLoggedIn && pageActions}
      </div>
    )
}

export default MobNav