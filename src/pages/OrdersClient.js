import BoxWidgets from '../components/BoxWidgets';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { getAuthToken } from '../utility/tokenLoader';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import DashboardDataSection from '../components/layout/DashboardDataSection';
import { getMyOrdersReq } from '../lib/loaders';
import { getOrderColumns } from '../utility/tableColumns';

function OrdersClient() {
    const { id } = useSelector(state => state.auth.userData) || {};
    const navigate = useNavigate();
    const token = getAuthToken();
    const dispatch = useDispatch();
    const { msgCounter = 0, notCounter = 0 } = useOutletContext() || {};

    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        if (!id) {
            let toast = { status: 'error', message: 'you have no access for this!', title: 'Access Denied' };
            dispatch(uiActions.notificationDataChanged(toast));
            dispatch(uiActions.showNotification(true));
            navigate("/", { replace: true });
        }
    }, [id, dispatch, navigate]);

    // Data Loaders for DashboardDataSection
    const loadOrders = useCallback((queryStr) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        return getMyOrdersReq(queryStr, headers);
    }, [token]);

    return (
        <>
            <BoxWidgets
                totalOrders={totalOrders}
                msgCounter={msgCounter}
                notCounter={notCounter}
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
                    subtitle: 'You haven\'t placed any orders. Browse the marketplace to find the perfect AI model for your needs.',
                    action: {
                        label: 'Browse AI Models',
                        onClick: () => navigate('/models'),
                    },
                }}
            />
        </>
    );
}

export default OrdersClient;