import { createBrowserRouter, RouterProvider, Link, redirect, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/authSlice';
import { tokenLoader, getAuthToken } from './utility/tokenLoader';
import { LoginAction, deletingModelAction } from './lib/actions';
import { uiActions } from './store/UI-slice';
//-------------------------------
import './index.scss';
import './styles/tokens.css';
//========================
import Home from './pages/Home';
import About from './pages/About';
import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/ErrorPage';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import ProfileSettings from './pages/ProfileSettings';
import ProfileDev from './pages/ProfileDev';
import CreateModel from './pages/CreateModel';
import EditModel from './pages/EditModel';
import ModelView from './pages/ModelView';
import Stripe from './pages/Stripe';
import OrderView from './pages/OrderView';
import DashboardDev from './pages/DashboardDev';
import OrdersClient from './pages/OrdersClient';
import CartPage from './pages/CartPage';
import Models from './pages/Models';
import ChatNew from './pages/ChatNew';
import WalletPage from './pages/WalletPage';
import AdminDashboard from './pages/AdminDashboard';
import ReviewsClient from './pages/ReviewsClient';
import ReviewsDev from './pages/ReviewsDev';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';
import PolicyPage from './pages/PolicyPage';
import SitemapPage from './pages/SitemapPage';
import { useState } from 'react';
import useRealtimeSession from './hooks/useRealtimeSession';
import ChangePasswordPage from './pages/ChangePasswordPage';
import PortalLayout from './pages/PortalLayout';

function App() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userData)?.id;
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const userData = useSelector(state => state.auth.userData) || {};
  const userRole = userData.role;
  const isPlatformStaff = userRole === 'ADMIN' || userRole === 'EMPLOYEE';
  const token = getAuthToken();
  const hasSession = isLoggedIn || (token && token !== 'EXPIRED');

  const {
    onlineUsers,
    notify,
    refresh,
    modelRefresh,
    onFeatchChats,
    onFeatchNotifications,
    handleDeleteNotification,
    handleUpdateNotification,
    handleReadAllNotifications,
    handleDeleteChat,
  } = useRealtimeSession(userId, token);

  const [modelsUpdated, setModelsUpdated] = useState(true);
  const [searchByVal, setSearchByVal] = useState(null);
  const [searchVal, setSearchVal] = useState(null);

  const onModelsUpdated = () => {
    setModelsUpdated(false);
    setSearchByVal(null);
    setSearchVal(null);
  };

  const onLoginAction = ({ request }) => {
    const toastHandler = (toast) => {
      dispatch(uiActions.notificationDataChanged(toast));
      dispatch(uiActions.showNotification(true));
    };
    const actions = (data) => {
      dispatch(authActions.onLogin(data));
    };
    const loadingState = (state) => {
      dispatch(uiActions.showLoading(state));
    };
    LoginAction(request, actions, toastHandler, loadingState);
    dispatch(uiActions.showNotification(false));
    return redirect('/');
  };

  const onDeletingModelAction = ({ request, params }) => {
    const toastHandler = (toast) => {
      dispatch(uiActions.notificationDataChanged(toast));
      dispatch(uiActions.showNotification(true));
    };
    const loadingState = (state) => {
      dispatch(uiActions.showLoading(state));
    };
    deletingModelAction(request, toastHandler, loadingState, params);
    dispatch(uiActions.showNotification(false));
    return redirect(`/dashboard-dev`);
  };

  const getSearch = (searchByVal, searchVal) => {
    setSearchByVal(searchByVal);
    setSearchVal(searchVal);
    setModelsUpdated(true);
  };

  const router = createBrowserRouter([
    {
      path: '/', element: <RootLayout
        handleDeleteNotification={handleDeleteNotification}
        handleUpdateNotification={handleUpdateNotification}
        handleReadAllNotifications={handleReadAllNotifications}
        handleDeleteChat={handleDeleteChat}
        getSearch={getSearch}
      />
      , errorElement: <RouteErrorBoundary><ErrorPage /></RouteErrorBoundary>, id: 'root', loader: tokenLoader, children: [
        { index: true, element: <RouteErrorBoundary><Home modelsUpdated={modelsUpdated} onModelsUpdated={onModelsUpdated} /></RouteErrorBoundary> },
        { path: 'contact', element: <RouteErrorBoundary><Contact /></RouteErrorBoundary> },
        { path: 'about', element: <RouteErrorBoundary><About /></RouteErrorBoundary> },
        { path: 'policy', element: <RouteErrorBoundary><PolicyPage /></RouteErrorBoundary> },
        { path: 'directory', element: <RouteErrorBoundary><SitemapPage /></RouteErrorBoundary> },
        {
          path: 'auth', element: <RouteErrorBoundary><AuthPage /></RouteErrorBoundary>, action: onLoginAction, errorElement:
            <RouteErrorBoundary>
              <div style={{ height: '60vh' }}>
                invalid user name or password!
                <Link className='' to='/auth?mode=login' >Kindly Click Here</Link>
              </div>
            </RouteErrorBoundary>
        },
        { path: 'profile/:id', element: <RouteErrorBoundary><ProfileDev onlineUsers={onlineUsers} /></RouteErrorBoundary> },
        { path: 'cart', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER' ? <Navigate to="/" /> : <CartPage />}</RouteErrorBoundary> },
        {
          path: 'models', element: <RouteErrorBoundary><Models searchByVal={searchByVal} searchVal={searchVal}
            modelsUpdated={modelsUpdated} onModelsUpdated={onModelsUpdated} /></RouteErrorBoundary>
        },
        { path: 'models/new', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'CLIENT' ? <Navigate to="/" /> : <CreateModel />}</RouteErrorBoundary> },
        { path: 'models/edit/:id', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'CLIENT' ? <Navigate to="/" /> : <EditModel />}</RouteErrorBoundary>, },
        { path: 'models/view/:id', element: <RouteErrorBoundary><ModelView refresh={refresh} modelRefresh={modelRefresh} onlineUsers={onlineUsers} /></RouteErrorBoundary> },
        { path: 'order/view/:id', element: <RouteErrorBoundary>{hasSession ? <OrderView refresh={refresh} /> : <Navigate to="/auth?mode=login" />}</RouteErrorBoundary> },
        { path: 'stripe', element: <RouteErrorBoundary>{isLoggedIn ? <Stripe /> : <Navigate to="/auth?mode=login" />}</RouteErrorBoundary> },
        {
          path: 'chat', element: <RouteErrorBoundary>{isLoggedIn ? <ChatNew onlineUsers={onlineUsers} onFeatchChats={onFeatchChats} notify={notify} onFeatchNotifications={onFeatchNotifications} />
            : <Navigate to="/auth?mode=login" />}</RouteErrorBoundary>
        },
        {
          element: <RouteErrorBoundary><PortalLayout /></RouteErrorBoundary>,
          children: [
            { path: 'change-password', element: <RouteErrorBoundary>{isLoggedIn ? <ChangePasswordPage /> : <Navigate to="/auth?mode=login" />}</RouteErrorBoundary> },
            { path: 'dashboard-dev', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole !== 'DEVELOPER' ? <Navigate to={userRole === 'ADMIN' || userRole === 'EMPLOYEE' ? '/admin' : '/'} /> : <DashboardDev />}</RouteErrorBoundary> },
            { path: 'orders-client', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER' ? <Navigate to="/" /> : <OrdersClient />}</RouteErrorBoundary> },
            { path: 'reviews-client', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER' ? <Navigate to="/reviews-dev" /> : <ReviewsClient />}</RouteErrorBoundary> },
            { path: 'reviews-dev', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole !== 'DEVELOPER' ? <Navigate to="/" /> : <ReviewsDev />}</RouteErrorBoundary> },
            { path: 'profileSettings', element: <RouteErrorBoundary>{isLoggedIn ? <ProfileSettings /> : <Navigate to="/auth?mode=login" />}</RouteErrorBoundary> },
            { path: 'wallet', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : userRole === 'DEVELOPER' ? <WalletPage /> : <Navigate to="/" />}</RouteErrorBoundary> },
            { path: 'admin', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : !isPlatformStaff ? <Navigate to="/" replace /> : <AdminDashboard />}</RouteErrorBoundary> },
            { path: 'admin/disputes', element: <RouteErrorBoundary>{!isLoggedIn ? <Navigate to="/auth?mode=login" /> : !isPlatformStaff ? <Navigate to="/" replace /> : <AdminDashboard />}</RouteErrorBoundary> },
          ]
        },
        { path: 'models/delete/:id', action: onDeletingModelAction },
        { path: '*', element: <RouteErrorBoundary><NotFoundPage /></RouteErrorBoundary> }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
