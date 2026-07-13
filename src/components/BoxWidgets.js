import React, { useRef } from "react";
import { useSelector } from 'react-redux';
import styles from "./BoxWidgets.module.scss";
import { Link } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import { GrRobot } from "react-icons/gr";
import { FaRegMessage } from "react-icons/fa6";
import { GoCodeReview } from "react-icons/go";
import { FiShoppingCart } from "react-icons/fi";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Row, Col } from 'react-bootstrap';
import getStarted from '../assets/getStarted.png';
// import { FILES_BASE_API_URL } from '../lib/api';
import ProfileHeroCard from './ui/ProfileHeroCard';
import UserProfileStrip from './UserProfileStrip';
import UserAvatar from './ui/UserAvatar';

const BoxWidgets = ({ profile = false, HandelFileChange, file, totalModels, totalOrders, totalSales = 0, totalViews = 0, msgCounter = 0, notCounter = 0, walletBalance, payoutReady = null }) => {
  const userData = useSelector(state => state.auth.userData) || {};
  // eslint-disable-next-line
  const { org_username, avatar, role } = userData;
  const imgRef = useRef(null);

  const onFileChange = (e) => {
    HandelFileChange(e.target.files[0]);
  };

  const handleImgClick = () => {
    imgRef.current.click();
  };

  const avatarNode = (
    <div className={`${styles.imgCon} ${styles['menu-title']}`}>
      <Col xs={0} md lg className={`${styles.img_cover} d-flex flex-column align-items-left w-100`}>
        <input name="avatar" type="file" onChange={onFileChange} ref={imgRef} style={{ display: 'none' }} />
        {profile && (
          <span>
            <BorderColorIcon
              className={styles.img_ico}
              style={{ color: '#5DB8DD', cursor: 'pointer' }}
              title="edit"
              onClick={handleImgClick}
            />
          </span>
        )}
      </Col>
      {file && <img src={URL.createObjectURL(file)} alt="avatar" className="global-avatar" />}
      {!file && <UserAvatar user={userData} />}
    </div>
  );

  const profileLeftInfo = (
    <Row className={styles.infoCon}>
      <UserProfileStrip
        user={userData}
        variant="owner-settings"
        avatarNode={avatarNode}
        truncateName
      />
    </Row>
  );

  const getWelcomeMessage = () => {
    if (role === 'ADMIN' || role === 'EMPLOYEE') {
      return "Keep your profile updated to manage the platform effectively!";
    } else if (role === 'DEVELOPER') {
      return "Make sure to complete Your profile to be able to create Models!";
    } else {
      return "Make sure to complete Your profile to be able to create Orders!";
    }
  };

  const profileRightContent = (
    <div className={styles["widgets_container"]}>
      <div className={styles["widget_1_con"]}>
        <RiRobot2Line className={styles.iconImg} /><h4 className={styles.wel}>Welcome back !</h4>
      </div>
      <div className={styles["widget_2_con"]}>
        <div className={styles["widget_1"]}>
          <h1>{getWelcomeMessage()}</h1>
          <img src={getStarted} alt="getStarted" className={styles["get_start"]} />
        </div>
      </div>
    </div>
  );

  if (profile) {
    return (
      <ProfileHeroCard avatar={null} leftInfo={profileLeftInfo}>
        {profileRightContent}
      </ProfileHeroCard>
    );
  }

  return (
    <section className={styles.box_container}>
      <div className={styles.___container}>
        <div className={styles.__box}>
          <div className={styles.__box_main}>
            <div className={styles.__box_leftside}>
              {avatarNode}
              <Row className={styles.infoCon}>
                {role === 'DEVELOPER' && (
                  <Link to="/models/new" className={styles["banner-btn"]}> {'Create Model'} </Link>
                )}
              </Row>
            </div>
            <div className={styles.__box_rightside}>
              <div className={styles["widgets_container"]}>
                <div className={styles["widget_1_con"]}>
                  <RiRobot2Line className={styles.iconImg} /><h4 className={styles.wel}>Welcome back !</h4>
                </div>
                <div className={styles["widget_2_con"]}>
                  {role === 'DEVELOPER' && (
                    <>
                      <div className={styles["widget_1"]}>
                        <h1>Total Models</h1>
                        <GrRobot className={styles.iconImg} />
                        <span>{totalModels}</span>
                      </div>
                      <div className={styles["widget_2"]}>
                        <h1>Total Sales</h1>
                        <FiShoppingCart className={styles.iconImg} />
                        <span>{totalSales}</span>
                      </div>
                    </>
                  )}
                  {role !== 'DEVELOPER' && (
                    <div className={styles["widget_2"]}>
                      <h1>Total Orders</h1>
                      <FiShoppingCart className={styles.iconImg} />
                      <span>{totalOrders}</span>
                    </div>
                  )}
                </div>
                {role === 'DEVELOPER' && (
                  <div className={styles["widget_2_con"]}>
                    <div className={styles["widget_1"]}>
                      <h1>Total Views</h1>
                      <GoCodeReview className={styles.iconImg} />
                      <span>{totalViews}</span>
                    </div>
                    <div className={styles["widget_2"]}>
                      <h1>Total Orders</h1>
                      <FiShoppingCart className={styles.iconImg} />
                      <span>{totalOrders}</span>
                    </div>
                  </div>
                )}
                <div className={styles["widget_3_con"]}>
                  <div className={styles["widget_1"]}>
                    <h1>Unread Messages</h1>
                    <FaRegMessage className={styles.iconImg} />
                    <span>{msgCounter}</span>
                  </div>
                  {role === 'DEVELOPER' ? (
                    <Link to="/wallet" className={styles["widget_2"]}>
                      <h1>Wallet Balance</h1>
                      <span className={styles.walletBalance}>{walletBalance !== undefined ? `$${Number(walletBalance).toFixed(2)}` : '$0.00'}</span>
                      {payoutReady === false && (
                        <small style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>Stripe setup needed</small>
                      )}
                    </Link>
                  ) : (
                    <div className={styles["widget_2"]}>
                      <h1>Notifications</h1>
                      <GoCodeReview className={styles.iconImg} />
                      <span>{notCounter}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxWidgets;
