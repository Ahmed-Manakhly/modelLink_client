import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../utility/tokenLoader';
import { uiActions } from '../store/UI-slice';
import { getAllUsersReq, updateUserReq, deleteUserReq, getAuditLogsReq, getSettingsReq, updateSettingsReq, getAllTransactionsReq, getWebhookEventsReq, getAdminPendingCountsReq, getAllOrdersReq } from '../lib/adminRequests';
import { getAllPayoutsReq, approvePayoutReq, rejectPayoutReq } from '../lib/payoutRequests';
import { getDisputesReq, resolveDisputeReq } from '../lib/disputeRequests';
import { getAllVerificationsReq, approveVerificationReq, rejectVerificationReq } from '../lib/verificationRequests';
import { Tabs, Tab, Form } from 'react-bootstrap';
import Modal from '../components/layout/Modal';
import DashboardDataSection from '../components/layout/DashboardDataSection';
import { getAllModelsReq, deleteModelReq, updateModelStatusReq, restoreModelReq, bulkUpdateModelsReq } from '../lib/loaders';
import {
    getModelColumns,
    getAdminUserColumns,
    getAdminPayoutColumns,
    getAdminDisputeColumns,
    getAdminVerificationColumns,
    getAdminTransactionColumns,
    getAdminAuditLogColumns,
    getAdminWebhookColumns,
    getOrderColumns,
} from '../utility/tableColumns';
import WarningModal from '../components/layout/WarningModal';
import AdminTaxonomySection from '../components/admin/AdminTaxonomySection';
import CustomSelect from '../components/ui/CustomSelect';
import classes from './AdminDashboard.module.scss';

const AdminTabLabel = ({ label, count = 0 }) => (
    <span className="d-inline-flex align-items-center gap-2">
        {label}
        {count > 0 && (
            <span
                className="badge rounded-pill"
                style={{ fontSize: '0.65rem', minWidth: '1.25rem', backgroundColor: 'var(--color-danger)', color: 'var(--bg-main)', fontWeight: 700 }}
                aria-label={`${count} pending`}
            >
                {count > 99 ? '99+' : count}
            </span>
        )}
    </span>
);

function AdminDashboard() {
    const token = getAuthToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(() => {
        if (location.pathname.includes('/admin/disputes')) return 'disputes';
        return 'models';
    });

    const userData = useSelector(state => state.auth.userData) || {};
    const isAdminRole = userData.role === 'ADMIN';

    // Refresh keys — bump after admin actions to reload paginated tabs
    const [refreshKeys, setRefreshKeys] = useState({
        models: 0,
        users: 0,
        payouts: 0,
        disputes: 0,
        verifications: 0,
        transactions: 0,
        orders: 0,
        auditLogs: 0,
        webhooks: 0,
    });
    const bumpRefresh = (tab) => setRefreshKeys((prev) => ({ ...prev, [tab]: prev[tab] + 1 }));

    const [pendingCounts, setPendingCounts] = useState({
        payouts: 0,
        verifications: 0,
        disputes: 0,
        webhooks: 0,
    });

    const loadPendingCounts = React.useCallback(async () => {
        if (!token) return;
        try {
            const res = await getAdminPendingCountsReq(token);
            const counts = res.data?.data?.counts || res.data?.counts;
            if (counts) {
                setPendingCounts({
                    payouts: counts.payouts || 0,
                    verifications: counts.verifications || 0,
                    disputes: counts.disputes || 0,
                    webhooks: counts.webhooks || 0,
                });
            }
        } catch (_) {
            // Non-blocking — tab badges are optional UI enhancement.
        }
    }, [token]);

    const refreshAdminActionTab = (tab) => {
        bumpRefresh(tab);
        loadPendingCounts();
    };

    const [platformFeeValue, setPlatformFeeValue] = useState('');
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Modal state for rejection reasons
    const [showPayoutRejectModal, setShowPayoutRejectModal] = useState(false);
    const [selectedPayoutId, setSelectedPayoutId] = useState(null);
    const [payoutRejectReason, setPayoutRejectReason] = useState('');

    const [showVerifRejectModal, setShowVerifRejectModal] = useState(false);
    const [selectedVerifId, setSelectedVerifId] = useState(null);
    const [verifRejectReason, setVerifRejectReason] = useState('');

    const [showDisputeResolveModal, setShowDisputeResolveModal] = useState(false);
    const [selectedDisputeId, setSelectedDisputeId] = useState(null);
    const [disputeResolution, setDisputeResolution] = useState('REFUND_CLIENT');
    const [disputeResolveNotes, setDisputeResolveNotes] = useState('');

    const [warning, setWarning] = useState({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' });

    const confirmWarningAction = () => {
        if (warning.onAction) {
            warning.onAction();
        }
        setWarning({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' });
    };

    const loadAllUsers = React.useCallback((query) => getAllUsersReq(query, token), [token]);
    const loadAllPayouts = React.useCallback((query) => getAllPayoutsReq(query, token), [token]);
    const loadAllDisputes = React.useCallback((query) => getDisputesReq(query, token), [token]);
    const loadAllVerifications = React.useCallback((query) => getAllVerificationsReq(query, token), [token]);
    const loadAllTransactions = React.useCallback((query) => getAllTransactionsReq(query, token), [token]);
    const loadAllOrders = React.useCallback((query) => getAllOrdersReq(query, token), [token]);
    const loadAllAuditLogs = React.useCallback((query) => getAuditLogsReq(query, token), [token]);
    const loadAllWebhooks = React.useCallback((query) => getWebhookEventsReq(query, token), [token]);

    const loadSettings = React.useCallback(async () => {
        if (!token) return;
        try {
            dispatch(uiActions.showLoading(true));
            const res = await getSettingsReq(token);
            const settings = res.data?.data?.settings || res.data?.settings;
            setPlatformFeeValue(String(settings?.platformFeeValue ?? 20));
            setSettingsLoaded(true);
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err.response?.data?.message || err.message || 'Failed to load platform settings'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    }, [token, dispatch]);

    const handleTabSelect = (key) => {
        setActiveTab(key);
        if (key === 'settings' && !settingsLoaded) {
            loadSettings();
        }
        if (['payouts', 'disputes', 'verifications', 'webhooks'].includes(key)) {
            loadPendingCounts();
        }
    };

    const handleSavePlatformFee = () => {
        const fee = parseInt(platformFeeValue, 10);
        if (isNaN(fee) || fee < 1 || fee > 50) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Invalid Fee',
                message: 'Platform fee must be an integer between 1 and 50.'
            }));
            dispatch(uiActions.showNotification(true));
            return;
        }

        setWarning({
            show: true,
            type: 'action',
            action: 'Save',
            message: `Update platform fee to ${fee}%? This affects all future order payouts.`,
            onAction: async () => {
                try {
                    dispatch(uiActions.showLoading(true));
                    await updateSettingsReq({ platformFeeValue: fee }, token);
                    dispatch(uiActions.notificationDataChanged({
                        status: 'success',
                        title: 'Settings Saved',
                        message: 'Platform fee updated successfully.'
                    }));
                    dispatch(uiActions.showNotification(true));
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to update platform settings'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
        });
    };

    useEffect(() => {
        if (!token || (userData.role !== 'ADMIN' && userData.role !== 'EMPLOYEE')) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Access Denied',
                message: 'Administrator privileges required.'
            }));
            dispatch(uiActions.showNotification(true));
            navigate('/');
            return;
        }
        loadPendingCounts();
    }, [token, userData.role, navigate, dispatch, loadPendingCounts]);

    // --- User management actions ---
    const handleSuspendUser = (id) => {
        setWarning({
            show: true,
            type: 'action',
            action: 'Suspend User',
            message: 'Are you sure you want to suspend/soft-delete this user?',
            onAction: async () => {
                try {
                    dispatch(uiActions.showLoading(true));
                    await deleteUserReq(id, token);
                    bumpRefresh('users');
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to suspend user'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
        });
    };

    const handleReactivateUser = (id) => {
        setWarning({
            show: true,
            type: 'action',
            action: 'Reactivate',
            message: 'Reactivate this user account?',
            onAction: async () => {
                try {
                    dispatch(uiActions.showLoading(true));
                    await updateUserReq(id, { isActive: true }, token);
                    bumpRefresh('users');
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to reactivate user'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
        });
    };

    // --- Payout actions ---
    const handleApprovePayout = (id) => {
        setWarning({
            show: true,
            type: 'action',
            action: 'Approve',
            message: 'Approve this payout request?',
            onAction: async () => {
                try {
                    dispatch(uiActions.showLoading(true));
                    await approvePayoutReq(id, {}, token);
                    refreshAdminActionTab('payouts');
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to approve payout'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
        });
    };

    const handleOpenPayoutReject = (id) => {
        setSelectedPayoutId(id);
        setPayoutRejectReason('');
        setShowPayoutRejectModal(true);
    };

    const handleRejectPayoutSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(uiActions.showLoading(true));
            await rejectPayoutReq(selectedPayoutId, { rejectReason: payoutRejectReason }, token);
            setShowPayoutRejectModal(false);
            refreshAdminActionTab('payouts');
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err.response?.data?.message || err.message || 'Failed to reject payout'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    };

    // --- Dispute actions ---
    const handleOpenDisputeResolve = (id, resolution) => {
        setSelectedDisputeId(id);
        setDisputeResolution(resolution);
        setDisputeResolveNotes('');
        setShowDisputeResolveModal(true);
    };

    const handleDisputeResolveSubmit = async (e) => {
        e.preventDefault();
        if (!disputeResolveNotes.trim()) return;
        try {
            dispatch(uiActions.showLoading(true));
            await resolveDisputeReq(
                selectedDisputeId,
                { resolution: disputeResolution, notes: disputeResolveNotes.trim() },
                token
            );
            setShowDisputeResolveModal(false);
            refreshAdminActionTab('disputes');
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Dispute Resolved',
                message: 'The dispute has been resolved successfully.',
            }));
            dispatch(uiActions.showNotification(true));
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err.response?.data?.message || err.message || 'Failed to resolve dispute'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    };

    // --- Verification actions ---
    const handleApproveVerification = (id) => {
        setWarning({
            show: true,
            type: 'action',
            action: 'Approve',
            message: 'Approve this developer verification request?',
            onAction: async () => {
                try {
                    dispatch(uiActions.showLoading(true));
                    await approveVerificationReq(id, token);
                    refreshAdminActionTab('verifications');
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to approve verification'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
        });
    };

    const handleOpenVerifReject = (id) => {
        setSelectedVerifId(id);
        setVerifRejectReason('');
        setShowVerifRejectModal(true);
    };

    const handleRejectVerifSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(uiActions.showLoading(true));
            await rejectVerificationReq(selectedVerifId, { rejectReason: verifRejectReason }, token);
            setShowVerifRejectModal(false);
            refreshAdminActionTab('verifications');
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err.response?.data?.message || err.message || 'Failed to reject verification'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    };

    // --- Admin Models Loading ---
    const loadAllModels = React.useCallback((queryStr) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const queryWithDeleted = queryStr ? `${queryStr}&isDeleted=all` : '?isDeleted=all';
        return getAllModelsReq(queryWithDeleted, headers);
    }, [token]);

    const handleDeleteModel = async (modelId) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        return deleteModelReq(modelId, headers);
    };

    const handleUpdateModelStatus = async (modelId, data) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        if (data?.restore) {
            return restoreModelReq(modelId, headers);
        }
        return updateModelStatusReq(modelId, data, headers);
    };

    const adminModelHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    const handleFeaturedChange = async (modelId, featured) => {
        try {
            dispatch(uiActions.showLoading(true));
            await updateModelStatusReq(modelId, { featured }, adminModelHeaders);
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Success',
                message: 'Featured status updated successfully.'
            }));
            dispatch(uiActions.showNotification(true));
            bumpRefresh('models');
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to update featured status'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    };

    const modelBulkActions = [
        {
            label: 'Publish Selected',
            handler: (ids) => bulkUpdateModelsReq({ ids, status: 'PUBLISHED' }, adminModelHeaders),
            successMessage: 'Selected models published.',
        },
        {
            label: 'Draft Selected',
            handler: (ids) => bulkUpdateModelsReq({ ids, status: 'DRAFT' }, adminModelHeaders),
            successMessage: 'Selected models moved to draft.',
        },
        {
            label: 'Archive Selected',
            handler: (ids) => bulkUpdateModelsReq({ ids, status: 'ARCHIVED' }, adminModelHeaders),
            successMessage: 'Selected models archived.',
        },
        {
            label: 'Feature Selected',
            handler: (ids) => bulkUpdateModelsReq({ ids, featured: true }, adminModelHeaders),
            successMessage: 'Selected models marked featured.',
        },
        {
            label: 'Unfeature Selected',
            handler: (ids) => bulkUpdateModelsReq({ ids, featured: false }, adminModelHeaders),
            successMessage: 'Selected models unfeatured.',
        },
    ];

    return (
        <div className="w-100">
            {warning.show && <WarningModal
                warning={warning}
                onAction={confirmWarningAction}
                onClose={() => setWarning({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' })}
            />}
            <h2 className="gradient-text mb-4" style={{ fontWeight: 700 }}>🛡️ Administration Dashboard</h2>

            <div className={classes.adminTabsContainer}>
                <Tabs activeKey={activeTab} id="admin-dashboard-tabs" className="mb-4" onSelect={handleTabSelect} unmountOnExit={true}>
                    {/* All Models Management */}
                    <Tab eventKey="models" title="All Models">
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.models}
                                getData={loadAllModels}
                                deleteData={handleDeleteModel}
                                updateData={handleUpdateModelStatus}
                                contentType="models"
                                columns={(handleDelete, handleStatusChange) => getModelColumns(handleDelete, handleStatusChange, true, handleFeaturedChange)}
                                tableTitle="Manage All Models"
                                isAdmin={true}
                                enableBulkSelection={true}
                                bulkActions={modelBulkActions}
                            />
                        </div>
                    </Tab>

                    {/* Users Management */}
                    <Tab eventKey="users" title="👥 Users & Accounts">
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.users}
                                getData={loadAllUsers}
                                contentType="users"
                                dataKey="users"
                                columns={() => getAdminUserColumns(handleSuspendUser, handleReactivateUser)}
                                tableTitle="Users & Accounts"
                                statusFilterParam="isActive"
                                defaultStatusArray={[]}
                                statusOptions={[
                                    { value: 'true', label: 'Active' },
                                    { value: 'false', label: 'Suspended' },
                                ]}
                                extraFilters={[
                                    {
                                        param: 'role',
                                        label: 'Role',
                                        placeholder: 'All Roles',
                                        options: [
                                            { value: 'CLIENT', label: 'Client' },
                                            { value: 'DEVELOPER', label: 'Developer' },
                                            { value: 'ADMIN', label: 'Admin' },
                                        ],
                                    },
                                    {
                                        param: 'isVerified',
                                        label: 'Verified',
                                        placeholder: 'All',
                                        options: [
                                            { value: 'true', label: 'Yes' },
                                            { value: 'false', label: 'No' },
                                        ],
                                    },
                                ]}
                                emptyState={{
                                    title: 'No users found',
                                    subtitle: 'Try adjusting your role, status, or verified filters.',
                                }}
                            />
                        </div>
                    </Tab>

                    {/* Payouts Management */}
                    <Tab eventKey="payouts" title={<AdminTabLabel label="💰 Payout Approvals" count={pendingCounts.payouts} />}>
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.payouts}
                                getData={loadAllPayouts}
                                contentType="payouts"
                                dataKey="payouts"
                                columns={() => getAdminPayoutColumns(handleApprovePayout, handleOpenPayoutReject)}
                                tableTitle="Payout Approvals"
                                defaultStatusArray={['PENDING', 'PAID', 'REJECTED']}
                                statusOptions={[
                                    { value: 'PENDING', label: 'Pending' },
                                    { value: 'PAID', label: 'Paid' },
                                    { value: 'REJECTED', label: 'Rejected' },
                                ]}
                            />
                        </div>
                    </Tab>

                    {/* Disputes Management */}
                    <Tab eventKey="disputes" title={<AdminTabLabel label="⚖️ Disputes Center" count={pendingCounts.disputes} />}>
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.disputes}
                                getData={loadAllDisputes}
                                contentType="disputes"
                                dataKey="disputes"
                                columns={() => getAdminDisputeColumns(handleOpenDisputeResolve)}
                                tableTitle="Disputes"
                                defaultStatusArray={['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED']}
                                statusOptions={[
                                    { value: 'OPEN', label: 'Open' },
                                    { value: 'UNDER_REVIEW', label: 'Under Review' },
                                    { value: 'RESOLVED', label: 'Resolved' },
                                    { value: 'REJECTED', label: 'Rejected' },
                                ]}
                            />
                        </div>
                    </Tab>

                    {/* Verifications Management */}
                    <Tab eventKey="verifications" title={<AdminTabLabel label="✅ Developer Verifications" count={pendingCounts.verifications} />}>
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.verifications}
                                getData={loadAllVerifications}
                                contentType="verifications"
                                dataKey="verifications"
                                columns={() => getAdminVerificationColumns(handleApproveVerification, handleOpenVerifReject)}
                                tableTitle="Developer Verifications"
                                defaultStatusArray={['PENDING', 'APPROVED', 'REJECTED']}
                                statusOptions={[
                                    { value: 'PENDING', label: 'Pending' },
                                    { value: 'APPROVED', label: 'Approved' },
                                    { value: 'REJECTED', label: 'Rejected' },
                                ]}
                            />
                        </div>
                    </Tab>

                    {/* Transactions Read-Only */}
                    <Tab eventKey="transactions" title="💳 Transactions">
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.transactions}
                                getData={loadAllTransactions}
                                contentType="transactions"
                                dataKey="transactions"
                                columns={getAdminTransactionColumns}
                                tableTitle="Transactions"
                                defaultStatusArray={[]}
                            />
                        </div>
                    </Tab>

                    {/* Orders Read-Only */}
                    <Tab eventKey="orders" title="📦 Orders">
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.orders}
                                getData={loadAllOrders}
                                contentType="orders"
                                dataKey="orders"
                                columns={getOrderColumns}
                                tableTitle="All Orders"
                                defaultStatusArray={[]}
                            />
                        </div>
                    </Tab>

                    {/* Audit Logs Read-Only */}
                    <Tab eventKey="auditLogs" title="📜 Audit Logs">
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.auditLogs}
                                getData={loadAllAuditLogs}
                                contentType="auditLogs"
                                dataKey="logs"
                                columns={getAdminAuditLogColumns}
                                tableTitle="Audit Logs"
                                defaultStatusArray={[]}
                                extraFilters={[
                                    {
                                        param: 'actionType',
                                        label: 'Action Type',
                                        placeholder: 'All actions',
                                        options: [
                                            { value: 'CREATE_USER', label: 'Create User' },
                                            { value: 'UPDATE_USER', label: 'Update User' },
                                            { value: 'DELETE_USER', label: 'Delete/Suspend User' },
                                            { value: 'APPROVE_DEVELOPER,REJECT_DEVELOPER', label: 'Verify Developer' },
                                            { value: 'APPROVE_PAYOUT,REJECT_PAYOUT', label: 'Payout Approvals' },
                                            { value: 'RESOLVE_DISPUTE_REFUND,RESOLVE_DISPUTE_RELEASE', label: 'Resolve Dispute' },
                                            { value: 'STRIPE_WEBHOOK_RECEIVED,STRIPE_WEBHOOK_PROCESSED', label: 'Stripe Webhooks' },
                                            { value: 'UPDATE_SETTINGS', label: 'Update Settings' },
                                        ],
                                    },
                                ]}
                            />
                        </div>
                    </Tab>

                    {/* Webhook Events Read-Only */}
                    <Tab eventKey="webhooks" title={<AdminTabLabel label="🔗 Webhook Events" count={pendingCounts.webhooks} />}>
                        <div>
                            <DashboardDataSection
                                key={refreshKeys.webhooks}
                                getData={loadAllWebhooks}
                                contentType="webhooks"
                                dataKey="webhooks"
                                columns={getAdminWebhookColumns}
                                tableTitle="Webhook Events"
                                defaultStatusArray={[]}
                            />
                        </div>
                    </Tab>

                    {/* Taxonomy Management */}
                    <Tab eventKey="taxonomy" title="🏷️ Taxonomy">
                        <AdminTaxonomySection token={token} />
                    </Tab>

                    {/* Platform Settings */}
                    <Tab eventKey="settings" title="⚙️ Platform Settings">
                        <div>
                            <Form.Group className="mb-3">
                                <Form.Label>Platform Fee (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={platformFeeValue}
                                    onChange={(e) => setPlatformFeeValue(e.target.value)}
                                    disabled={!settingsLoaded}
                                    style={{ backgroundColor: 'var(--bg-main, #0a0a0a)', color: 'var(--on-surface, #e2e8f0)', border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}
                                />
                                <Form.Text style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>
                                    Percentage retained from each order (1–50). Current default: 20%.
                                </Form.Text>
                            </Form.Group>
                            {isAdminRole && (
                                <button type="button"
                                    className="btn-glass-primary"
                                    onClick={handleSavePlatformFee}
                                    disabled={!settingsLoaded}
                                >
                                    Save Platform Fee
                                </button>
                            )}
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {/* Payout Rejection Modal */}
            {showPayoutRejectModal && (
                <Modal onClose={() => setShowPayoutRejectModal(false)}>
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}>
                            <h5 className="mb-0 gradient-text">Reject Payout Request</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowPayoutRejectModal(false)}
                            />
                        </div>
                        <Form onSubmit={handleRejectPayoutSubmit}>
                            <Form.Group>
                                <Form.Label>Reason for Rejection</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={payoutRejectReason}
                                    onChange={(e) => setPayoutRejectReason(e.target.value)}
                                    required
                                    style={{ backgroundColor: 'var(--bg-main, #0a0a0a)', color: 'var(--on-surface, #e2e8f0)', border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2 pt-3 mt-3" style={{ borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}>
                                <button type="button" className="btn-glass-logout" onClick={() => setShowPayoutRejectModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-glass-danger">Reject Request</button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}

            {/* Verification Rejection Modal */}
            {showVerifRejectModal && (
                <Modal onClose={() => setShowVerifRejectModal(false)}>
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}>
                            <h5 className="mb-0 gradient-text">Reject Developer Verification</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowVerifRejectModal(false)}
                            />
                        </div>
                        <Form onSubmit={handleRejectVerifSubmit}>
                            <Form.Group>
                                <Form.Label>Reason for Rejection</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={verifRejectReason}
                                    onChange={(e) => setVerifRejectReason(e.target.value)}
                                    required
                                    style={{ backgroundColor: 'var(--bg-main, #0a0a0a)', color: 'var(--on-surface, #e2e8f0)', border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2 pt-3 mt-3" style={{ borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}>
                                <button type="button" className="btn-glass-logout" onClick={() => setShowVerifRejectModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-glass-danger">Reject Request</button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}

            {/* Dispute Resolution Modal */}
            {showDisputeResolveModal && (
                <Modal onClose={() => setShowDisputeResolveModal(false)}>
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}>
                            <h5 className="mb-0 gradient-text">Resolve Dispute</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowDisputeResolveModal(false)}
                            />
                        </div>
                        <Form onSubmit={handleDisputeResolveSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Resolution</Form.Label>
                                <CustomSelect
                                    value={disputeResolution}
                                    onChange={(val) => setDisputeResolution(val)}
                                    options={[
                                        { value: 'REFUND_CLIENT', label: 'Refund Buyer (REFUND_CLIENT)' },
                                        { value: 'RELEASE_TO_DEVELOPER', label: 'Release to Developer (RELEASE_TO_DEVELOPER)' }
                                    ]}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Resolution Notes (required)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={disputeResolveNotes}
                                    onChange={(e) => setDisputeResolveNotes(e.target.value)}
                                    placeholder="Explain the resolution decision for audit purposes."
                                    required
                                    style={{ backgroundColor: 'var(--bg-main, #0a0a0a)', color: 'var(--on-surface, #e2e8f0)', border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2 pt-3 mt-3" style={{ borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))' }}>
                                <button type="button" className="btn-glass-logout" onClick={() => setShowDisputeResolveModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-glass-primary">Confirm Resolution</button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AdminDashboard;
