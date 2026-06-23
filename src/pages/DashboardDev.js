import BoxWidgets from '../components/BoxWidgets';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { getAuthToken } from '../utility/tokenLoader';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useOutletContext, useSubmit, Link } from 'react-router-dom';
import DashboardDataSection from '../components/layout/DashboardDataSection';
import { getModelsByUserReq, getMyOrdersReq, getData, updateModelStatusReq } from '../lib/loaders';
import { getWalletMeReq } from '../lib/walletRequests';
import { getVerificationMeReq } from '../lib/verificationRequests';
import { getModelColumns, getOrderColumns } from '../utility/tableColumns';
import { selectUnreadChats, selectUnreadNotifications } from '../store/realtimeSlice';
import { isPayoutReady } from '../utility/stripeHelpers';

function DashboardDev() {
    const userData = useSelector(state => state.auth.userData) || {};
    const { id } = userData;
    const [liveVerificationStatus, setLiveVerificationStatus] = useState(null);
    const [verificationLoaded, setVerificationLoaded] = useState(false);
    const isVerified = Boolean(
        userData.isVerified
        || userData.verification?.status === 'APPROVED'
        || liveVerificationStatus === 'APPROVED'
    );
    const navigate = useNavigate();
    const token = getAuthToken();
    const dispatch = useDispatch();
    const { msgCounter, notCounter } = useOutletContext() || {};
    const unreadChats = useSelector(selectUnreadChats);
    const unreadNotifications = useSelector(selectUnreadNotifications);
    const submit = useSubmit();

    const [totalModels, setTotalModels] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const payoutReady = isPayoutReady(userData);

    useEffect(() => {
        if (!id) {
            let toast = { status: 'error', message: 'you have no access for this!', title: 'Access Denied' };
            dispatch(uiActions.notificationDataChanged(toast));
            dispatch(uiActions.showNotification(true));
            navigate("/", { replace: true });
        }
    }, [id, dispatch, navigate]);

    useEffect(() => {
        if (!token) return;
        getVerificationMeReq(token)
            .then((res) => {
                const data = res.data?.data || res.data || {};
                setLiveVerificationStatus(data.verification?.status || null);
            })
            .catch(() => setLiveVerificationStatus(null))
            .finally(() => setVerificationLoaded(true));
    }, [token]);

    useEffect(() => {
        if (!token) return;
        getData(
            () => getWalletMeReq(token),
            (toast) => dispatch(uiActions.notificationDataChanged(toast)),
            (state) => dispatch(uiActions.showLoading(state)),
            (state) => dispatch(uiActions.showNotification(state)),
            (data) => setWalletBalance(data?.availableBalance || data?.wallet?.availableBalance || 0),
            'Wallet Balance!'
        );
        dispatch(uiActions.showNotification(false));
    }, [dispatch, token]);

    useEffect(() => {
        if (!token || !id) return;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        getModelsByUserReq(id, '?limit=500', headers)
            .then((res) => {
                const models = res.data?.data?.models || res.data?.data || [];
                setTotalSales(models.reduce((sum, model) => sum + (Number(model.sales) || 0), 0));
                setTotalViews(models.reduce((sum, model) => sum + (Number(model.views) || 0), 0));
            })
            .catch(() => {
                setTotalSales(0);
                setTotalViews(0);
            });
    }, [token, id]);

    // Data Loaders for DashboardDataSection
    const loadModels = useCallback((queryStr) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        return getModelsByUserReq(id, queryStr, headers);
    }, [id, token]);

    const loadOrders = useCallback((queryStr) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        return getMyOrdersReq(queryStr, headers);
    }, [token]);

    const handleDeleteModel = async (modelId) => {
        submit(null, { action: `/models/delete/${modelId}`, method: 'DELETE' });
    };

    const handleUpdateModelStatus = async (modelId, data) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        return updateModelStatusReq(modelId, data, headers);
    };

    return (
        <>
            {verificationLoaded && !isVerified && (
                <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <span>
                        ⚠️ Your identity is not yet verified. Verify to unlock model publishing.
                    </span>
                    <Link to="/profileSettings" className="btn btn-sm btn-outline-dark">
                        Complete Verification →
                    </Link>
                </div>
            )}
            {userData.role === 'DEVELOPER' && !payoutReady && (
                <div className="alert alert-info mb-3">
                    Complete Stripe setup to request payouts.{' '}
                    <Link to="/wallet#stripe-setup">Set up Stripe on your wallet page →</Link>
                </div>
            )}

            <BoxWidgets
                totalOrders={totalOrders}
                totalModels={totalModels}
                totalSales={totalSales}
                totalViews={totalViews}
                msgCounter={msgCounter ?? unreadChats}
                notCounter={notCounter ?? unreadNotifications}
                walletBalance={walletBalance}
                payoutReady={payoutReady}
            />

            <DashboardDataSection
                getData={loadModels}
                deleteData={handleDeleteModel}
                updateData={handleUpdateModelStatus}
                contentType="models"
                dataKey="models"
                columns={getModelColumns}
                tableTitle="Manage Your Models"
                onDataLoaded={(count) => setTotalModels(count)}
                skeletonCols={6}
                skeletonRows={5}
                emptyState={{
                    title: "You haven't published any models yet",
                    subtitle: 'Upload your first AI model to start earning.',
                    action: {
                        label: 'Upload Model',
                        onClick: () => navigate('/models/new'),
                    },
                }}
            />

            <DashboardDataSection
                getData={loadOrders}
                contentType="orders"
                dataKey="orders"
                columns={getOrderColumns()}
                tableTitle="Manage Your Orders"
                onDataLoaded={(count) => setTotalOrders(count)}
                skeletonCols={5}
                skeletonRows={5}
                defaultStatusArray={[]}
                statusOptions={[
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'PAID', label: 'Paid' },
                    { value: 'DELIVERED', label: 'Delivered' },
                    { value: 'DISPUTED', label: 'Disputed' },
                    { value: 'REFUNDED', label: 'Refunded' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                ]}
                emptyState={{
                    title: 'No orders yet',
                    subtitle: 'Orders from clients will appear here once your models are live.',
                }}
            />
        </>
    );
}

export default DashboardDev;