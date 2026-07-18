import React, { useRef } from "react";
import { useSelector } from 'react-redux';
import styles from "./BoxWidgets.module.scss";
import { Link } from "react-router-dom";
import { Row, Col } from 'react-bootstrap';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { 
  FiCpu, 
  FiShoppingCart, 
  FiDollarSign, 
  FiEye, 
  FiMessageSquare, 
  FiBell, 
  FiCreditCard 
} from "react-icons/fi";
import getStarted from '../assets/getStarted.png';
// import ProfileHeroCard from './ui/ProfileHeroCard';
import UserProfileStrip from './UserProfileStrip';
import UserAvatar from './ui/UserAvatar';

const BoxWidgets = ({ profile = false, HandelFileChange, file, totalModels, totalOrders, totalSales = 0, totalViews = 0, msgCounter = 0, notCounter = 0, walletBalance, payoutReady = null }) => {
  const userData = useSelector(state => state.auth.userData) || {};
  const { role } = userData;
  const imgRef = useRef(null);

  const onFileChange = (e) => {
    HandelFileChange(e.target.files[0]);
  };

  const handleImgClick = () => {
    imgRef.current.click();
  };

  const avatarNode = (
    <div className={styles.imgCon}>
      <Col xs={0} md lg className={`${styles.img_cover} d-flex flex-column align-items-left w-100`}>
        <input name="avatar" type="file" onChange={onFileChange} ref={imgRef} style={{ display: 'none' }} />
        {profile && (
          <span>
            <EditOutlinedIcon
              className={styles.img_ico}
              style={{ color: 'var(--primary)', cursor: 'pointer' }}
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

  // eslint-disable-next-line
  const profileRightContent = (
    <div className={styles.profileRightCon}>
      <div className={styles.welcomeSection}>
        <h2 className="page-main-title" style={{ margin: 0 }}>
          <span className="gradient-text">Welcome back!</span>
        </h2>
      </div>
      <div className="glass-container p-4 mt-3 text-center">
        <h5 style={{ color: 'var(--on-surface-variant)', fontWeight: 500, marginBottom: '1.5rem' }}>{getWelcomeMessage()}</h5>
        <img src={getStarted} alt="getStarted" style={{ maxWidth: '100%', height: 'auto', borderRadius: 'var(--radius-card)', filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.1))' }} />
      </div>
    </div>
  );

  if (profile) {
    return (
      <div className="glass-container p-4 w-100 h-100">
        {profileLeftInfo}
      </div>
    );
  }

  return (
    <section className={styles.box_container}>
      <div className={styles.___container}>
        <div className={styles.__box}>
          <div className={styles.__box_main}>
            <div className={styles.__box_leftside}>
              {avatarNode}
              <div className={styles.leftBtnWrapper}>
                {role === 'DEVELOPER' && (
                  <Link to="/models/new" className="btn-glass-primary w-100" style={{ textAlign: 'center', justifyContent: 'center' }}>
                    Create Model
                  </Link>
                )}
              </div>
            </div>
            
            <div className={styles.__box_rightside}>
              <div className={styles.welcomeSection} style={{ marginBottom: '1.5rem' }}>
                <h2 className="page-main-title" style={{ margin: 0 }}>
                  <span className="gradient-text">Welcome back!</span>
                </h2>
              </div>

              <div className={styles.widgets_grid}>
                {role === 'DEVELOPER' && (
                  <>
                    <div className={styles.widgetCard} style={{ '--accent-color': 'var(--primary)' }}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetTitle}>Total Models</span>
                        <div className={styles.widgetIconWrapper}>
                          <FiCpu />
                        </div>
                      </div>
                      <div className={styles.widgetValue}>{totalModels}</div>
                    </div>

                    <div className={styles.widgetCard} style={{ '--accent-color': '#10B981' }}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetTitle}>Total Sales</span>
                        <div className={styles.widgetIconWrapper}>
                          <FiDollarSign />
                        </div>
                      </div>
                      <div className={styles.widgetValue}>{totalSales}</div>
                    </div>

                    <div className={styles.widgetCard} style={{ '--accent-color': '#F59E0B' }}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetTitle}>Total Views</span>
                        <div className={styles.widgetIconWrapper}>
                          <FiEye />
                        </div>
                      </div>
                      <div className={styles.widgetValue}>{totalViews}</div>
                    </div>

                    <div className={styles.widgetCard} style={{ '--accent-color': '#8B5CF6' }}>
                      <div className={styles.widgetHeader}>
                        <span className={styles.widgetTitle}>Total Orders</span>
                        <div className={styles.widgetIconWrapper}>
                          <FiShoppingCart />
                        </div>
                      </div>
                      <div className={styles.widgetValue}>{totalOrders}</div>
                    </div>
                  </>
                )}

                {role !== 'DEVELOPER' && (
                  <div className={styles.widgetCard} style={{ '--accent-color': '#8B5CF6' }}>
                    <div className={styles.widgetHeader}>
                      <span className={styles.widgetTitle}>Total Orders</span>
                      <div className={styles.widgetIconWrapper}>
                        <FiShoppingCart />
                      </div>
                    </div>
                    <div className={styles.widgetValue}>{totalOrders}</div>
                  </div>
                )}

                <div className={styles.widgetCard} style={{ '--accent-color': '#EC4899' }}>
                  <div className={styles.widgetHeader}>
                    <span className={styles.widgetTitle}>Unread Messages</span>
                    <div className={styles.widgetIconWrapper}>
                      <FiMessageSquare />
                    </div>
                  </div>
                  <div className={styles.widgetValue}>{msgCounter}</div>
                </div>

                {role === 'DEVELOPER' ? (
                  <Link to="/wallet" className={styles.widgetCard} style={{ '--accent-color': '#10B981', textDecoration: 'none' }}>
                    <div className={styles.widgetHeader}>
                      <span className={styles.widgetTitle}>Wallet Balance</span>
                      <div className={styles.widgetIconWrapper}>
                        <FiCreditCard />
                      </div>
                    </div>
                    <div className={`${styles.widgetValue} ${styles.walletValue}`}>
                      {walletBalance !== undefined ? `$${Number(walletBalance).toFixed(2)}` : '$0.00'}
                    </div>
                    {payoutReady === false && (
                      <span className={styles.stripeWarning}>Stripe setup needed</span>
                    )}
                  </Link>
                ) : (
                  <div className={styles.widgetCard} style={{ '--accent-color': '#EF4444' }}>
                    <div className={styles.widgetHeader}>
                      <span className={styles.widgetTitle}>Notifications</span>
                      <div className={styles.widgetIconWrapper}>
                        <FiBell />
                      </div>
                    </div>
                    <div className={styles.widgetValue}>{notCounter}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxWidgets;
