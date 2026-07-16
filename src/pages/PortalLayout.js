import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store/authSlice';
import { uiActions } from '../store/UI-slice';
import { socket } from '../hooks/useSocket';
import {
  FiSettings,
  FiGrid,
  FiStar,
  FiCreditCard,
  FiPackage,
  FiShield,
  FiUser,
  FiLock,
  FiLogOut
} from 'react-icons/fi';
import classes from './PortalLayout.module.scss';
import GlobalWrapper from '../components/layout/GlobalWrapper';
import UserAvatar from '../components/ui/UserAvatar';

function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const userData = useSelector(state => state.auth.userData) || {};
  const { role, id: userID, first_name, org_username } = userData;

  const logoutAction = () => {
    socket.emit("leavingRoom", userID);
    const toast = { status: 'success', message: 'come back soon', title: 'logged out' };
    dispatch(authActions.onLoginOut());
    dispatch(uiActions.notificationDataChanged(toast));
    dispatch(uiActions.showNotification(true));
    navigate('/');
  };

  if (!isLoggedIn) {
    return <Outlet />;
  }

  // Define sidebar links based on role
  const getSidebarLinks = () => {
    const commonLinks = [
      {
        path: '/profileSettings',
        label: 'Profile Settings',
        icon: <FiSettings />
      }
    ];

    let roleLinks = [];
    if (role === 'DEVELOPER') {
      roleLinks = [
        {
          path: '/dashboard-dev',
          label: 'My Dashboard',
          icon: <FiGrid />
        },
        {
          path: '/reviews-dev',
          label: 'My Reviews',
          icon: <FiStar />
        },
        {
          path: '/wallet',
          label: 'My Wallet',
          icon: <FiCreditCard />
        }
      ];
    } else if (role === 'CLIENT') {
      roleLinks = [
        {
          path: '/orders-client',
          label: 'My Orders',
          icon: <FiPackage />
        },
        {
          path: '/reviews-client',
          label: 'My Reviews',
          icon: <FiStar />
        }
      ];
    } else if (role === 'ADMIN' || role === 'EMPLOYEE') {
      roleLinks = [
        {
          path: '/admin',
          label: 'Admin Dashboard',
          icon: <FiShield />
        }
      ];
    }

    const footerLinks = [
      {
        path: `/profile/${userID}`,
        label: 'My Profile',
        icon: <FiUser />,
        isExternal: true
      },
      {
        path: '/change-password',
        label: 'Change Password',
        icon: <FiLock />
      }
    ];

    return [...commonLinks, ...roleLinks, ...footerLinks];
  };

  const links = getSidebarLinks();
  const userName = first_name || org_username || 'User';

  return (
    <GlobalWrapper className={`global-page-top-clearance ${classes.portalContainer}`}>
      {/* Sidebar - Hidden on mobile */}
      <aside className={`${classes.sidebar} glass-container`}>
        <div className={classes.userCard}>
          <div className={classes.avatarWrapper}>
            <UserAvatar user={userData} />
          </div>
          <div className={classes.userInfo}>
            <h4 className={classes.userName}>{userName}</h4>
            <span className={classes.userRole}>{role}</span>
          </div>
        </div>

        <nav className={classes.navMenu}>
          <ul className={classes.navList}>
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path} className={classes.navItem}>
                  <Link
                    to={link.path}
                    className={`${classes.navLink} ${isActive ? classes.activeLink : ''}`}
                  >
                    <span className={classes.icon}>{link.icon}</span>
                    <span className={classes.linkLabel}>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={classes.sidebarFooter}>
          <button onClick={logoutAction} className="btn-glass-logout" style={{ width: '100%' }}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={classes.contentArea}>
        <Outlet />
      </main>
    </GlobalWrapper>
  );
}

export default PortalLayout;
