import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getAuthToken } from '../utility/tokenLoader';
import { uiActions } from '../store/UI-slice';
import { authActions } from '../store/authSlice';
import { getWalletMeReq, getWalletTransactionsReq } from '../lib/walletRequests';
import { requestPayoutReq, getMyPayoutsReq, cancelPayoutReq } from '../lib/payoutRequests';
import {
    getStripeConnectStatusReq,
    onboardStripeConnectReq,
    completeStripeConnectDemoReq,
} from '../lib/stripeConnectRequests';
import { getMeReq } from '../lib/loaders';
import { Row, Col, Form } from 'react-bootstrap';
import WarningModal from '../components/layout/WarningModal';
import Modal from '../components/layout/Modal';
import DashboardDataSection from '../components/layout/DashboardDataSection';
import { getWalletTransactionColumns, getMyPayoutColumns } from '../utility/tableColumns';
import { isPayoutReady } from '../utility/stripeHelpers';

const WALLET_TRANSACTION_TYPE_OPTIONS = [
    { value: 'SALE', label: 'Sale' },
    { value: 'PAYOUT', label: 'Payout' },
    { value: 'REFUND', label: 'Refund' },
    { value: 'ADJUSTMENT', label: 'Adjustment' },
];

const PAYOUT_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' },
];


function WalletPage() {
    const token = getAuthToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const userData = useSelector((state) => state.auth.userData) || {};

    const [wallet, setWallet] = useState(null);
    const [connectStatus, setConnectStatus] = useState(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutNote, setPayoutNote] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [connectLoading, setConnectLoading] = useState(false);
    const [payoutRefreshKey, setPayoutRefreshKey] = useState(0);
    const [warning, setWarning] = useState({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' });

    const payoutReady = isPayoutReady(userData);

    const refreshAuthUser = useCallback(async () => {
        if (!token || token === 'EXPIRED') return;
        try {
            const { data } = await getMeReq({ Authorization: `Bearer ${token}` });
            if (data?.data?.user) {
                dispatch(authActions.updateUser(data.data.user));
            }
        } catch (_) { }
    }, [token, dispatch]);

    const loadConnectStatus = useCallback(async () => {
        if (!token) return;
        try {
            const res = await getStripeConnectStatusReq(token);
            setConnectStatus(res.data?.data || null);
        } catch (_) {
            setConnectStatus(null);
        }
    }, [token]);

    const confirmWarningAction = () => {
        if (warning.onAction) {
            warning.onAction();
        }
        setWarning({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' });
    };

    const loadWallet = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            dispatch(uiActions.showLoading(true));
            const walletRes = await getWalletMeReq(token);
            setWallet(walletRes.data?.data?.wallet || walletRes.data?.wallet || null);
        } catch (error) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error loading wallet',
                message: error.response?.data?.message || error.message || 'Something went wrong',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/auth?mode=login');
            return;
        }
        if (userData?.role !== 'DEVELOPER') {
            navigate('/');
            return;
        }
        loadWallet();
        loadConnectStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        const stripeParam = searchParams.get('stripe');
        if (!stripeParam || !token) return;

        const handleReturn = async () => {
            await refreshAuthUser();
            await loadConnectStatus();
            dispatch(uiActions.notificationDataChanged({
                status: stripeParam === 'return' ? 'success' : 'info',
                title: stripeParam === 'return' ? 'Stripe setup' : 'Stripe onboarding',
                message: stripeParam === 'return'
                    ? 'Returned from Stripe. If onboarding is complete, payouts will unlock shortly.'
                    : 'Continue Stripe setup from this page when ready.',
            }));
            dispatch(uiActions.showNotification(true));
            searchParams.delete('stripe');
            setSearchParams(searchParams, { replace: true });
        };
        handleReturn();
    }, [searchParams, token, refreshAuthUser, loadConnectStatus, dispatch, setSearchParams]);

    useEffect(() => {
        if (window.location.hash === '#stripe-setup') {
            const el = document.getElementById('stripe-setup');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const loadTransactions = useCallback(
        (query) => getWalletTransactionsReq(query, token),
        [token]
    );

    const loadPayouts = useCallback(
        (query) => getMyPayoutsReq(query, token),
        [token]
    );

    const handleConnectStripe = async () => {
        let isRedirecting = false;
        try {
            setConnectLoading(true);
            const res = await onboardStripeConnectReq(token);
            const url = res.data?.data?.url;
            if (url) {
                isRedirecting = true;
                window.location.href = url;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Could not start onboarding';
            if (errorMsg.includes('Stripe Connect is not yet activated')) {
                setWarning({
                    show: true,
                    type: 'missing',
                    cancelText: 'Got it',
                    message: (
                        <div style={{ textAlign: 'left', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            <h4 style={{ color: '#ff6b6b', marginBottom: '15px', fontWeight: 'bold' }}>Platform Verification Required</h4>
                            <p>Real Stripe Connect requires the platform owner to verify their business identity (KYC) on the Stripe Dashboard before the Connect API is unlocked.</p>
                            <p style={{ marginTop: '10px' }}>This is a live deployment prerequisite. For development and portfolio testing, please use the <strong style={{ color: '#14f1d9' }}>Complete Setup (Demo)</strong> button instead.</p>
                            <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#888' }}>The demo path simulates the exact same database state and instantly unlocks your wallet payouts.</p>
                        </div>
                    ),
                });
            } else {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error',
                    title: 'Stripe Connect',
                    message: errorMsg,
                }));
                dispatch(uiActions.showNotification(true));
            }
        } finally {
            if (!isRedirecting) {
                setConnectLoading(false);
            }
        }
    };

    const handleDemoComplete = async () => {
        try {
            setConnectLoading(true);
            const res = await completeStripeConnectDemoReq(token);
            const updatedUser = res.data?.data?.user;
            if (updatedUser) {
                dispatch(authActions.updateUser(updatedUser));
            } else {
                await refreshAuthUser();
            }
            await loadConnectStatus();
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Stripe setup complete',
                message: 'Demo Connect setup finished. You can request payouts when balance allows.',
            }));
            dispatch(uiActions.showNotification(true));
        } catch (error) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Demo setup failed',
                message: error.response?.data?.message || error.message || 'Could not complete demo setup',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setConnectLoading(false);
        }
    };

    const closePayoutModal = () => {
        setShowPayoutModal(false);
        setPayoutAmount('');
        setPayoutNote('');
    };

    const handlePayoutSubmit = async (e) => {
        e.preventDefault();
        const amt = parseFloat(payoutAmount);
        if (isNaN(amt) || amt <= 0) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Invalid Amount',
                message: 'Please enter a valid amount greater than 0',
            }));
            dispatch(uiActions.showNotification(true));
            return;
        }
        if (wallet && amt > wallet.availableBalance) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Insufficient Balance',
                message: 'You cannot request more than your available balance.',
            }));
            dispatch(uiActions.showNotification(true));
            return;
        }

        try {
            dispatch(uiActions.showLoading(true));
            await requestPayoutReq({ amount: amt, note: payoutNote }, token);
            closePayoutModal();
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Payout Request Sent',
                message: 'Your payout request has been successfully submitted.',
            }));
            dispatch(uiActions.showNotification(true));
            loadWallet();
            setPayoutRefreshKey((prev) => prev + 1);
        } catch (error) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: error.response?.data?.message || error.message || 'Failed to submit payout request',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    };

    const handleCancelPayout = (id) => {
        setWarning({
            show: true,
            type: 'action',
            action: 'Cancel Request',
            message: 'Are you sure you want to cancel this payout request?',
            onAction: async () => {
                try {
                    dispatch(uiActions.showLoading(true));
                    await cancelPayoutReq(id, token);
                    loadWallet();
                    setPayoutRefreshKey((prev) => prev + 1);
                    dispatch(uiActions.notificationDataChanged({
                        status: 'success',
                        title: 'Cancelled',
                        message: 'Payout request was successfully cancelled.',
                    }));
                    dispatch(uiActions.showNotification(true));
                } catch (error) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: error.response?.data?.message || error.message || 'Failed to cancel payout request',
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            },
        });
    };

    const status = connectStatus || {
        stripeAccountId: userData.stripeAccountId,
        stripeChargesEnabled: userData.stripeChargesEnabled,
        stripeDetailsSubmitted: userData.stripeDetailsSubmitted,
        payoutReady,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {warning.show && <WarningModal
                warning={warning}
                onAction={confirmWarningAction}
                onClose={() => setWarning({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' })}
            />}

            <div className="mb-2">
                <h2 className="page-main-title" style={{ textAlign: 'left', margin: '0 0 0.5rem 0' }}>
                    <span className="gradient-text" style={{ fontSize: '2.5rem' }}>Developer Earnings Wallet</span>
                </h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--on-surface-variant)' }}>
                    All balances and sale amounts shown here are <strong style={{ color: 'var(--on-surface)' }}>after platform fees</strong> — your net earnings from each order.
                </p>
            </div>

            <div className="glass-container p-4 mb-2" id="stripe-setup" style={{ scrollMarginTop: '100px' }}>
                <div className="d-flex flex-column gap-3">
                    <h5 className="mb-3">Stripe Setup</h5>
                    <p className="mb-3" style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                        Connect Stripe to receive payouts. All three steps must be complete before requesting a withdrawal.
                    </p>
                    <ul className="mb-3" style={{ color: 'var(--on-surface)' }}>
                        <li className={status.stripeAccountId ? 'text-success' : ''}>
                            {status.stripeAccountId ? '✓' : '○'} Account linked
                            {status.stripeAccountId && <span className="ms-2" style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>({status.stripeAccountId})</span>}
                        </li>
                        <li className={status.stripeDetailsSubmitted ? 'text-success' : ''}>
                            {status.stripeDetailsSubmitted ? '✓' : '○'} Details submitted
                        </li>
                        <li className={status.payoutReady ? 'text-success' : ''}>
                            {status.payoutReady ? '✓' : '○'} Payouts enabled
                        </li>
                    </ul>
                    <div className="d-flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="btn-glass-primary"
                            onClick={handleConnectStripe}
                            disabled={connectLoading}
                        >
                            {connectLoading ? 'Loading…' : 'Connect with Stripe'}
                        </button>
                        <button
                            type="button"
                            className="btn-glass-outline"
                            onClick={handleDemoComplete}
                            disabled={connectLoading}
                        >
                            Complete setup (demo)
                        </button>
                    </div>
                    <p className="mt-3 mb-0" style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                        You can choose to securely connect your live Stripe account to receive actual payouts, or use the <strong>Demo setup</strong> to simulate the flow instantly.
                    </p>
                </div>
            </div>

            <div className="glass-container p-3 mb-2" style={{
                borderLeft: `4px solid ${payoutReady ? 'var(--color-success)' : 'var(--color-warning)'}`,
                background: payoutReady ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 193, 7, 0.05)'
            }}>
                <span style={{ color: payoutReady ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
                    {payoutReady ? 'Payouts enabled — you can request a withdrawal.' : (
                        <>Complete Stripe setup above to request payouts. <Link to="/wallet#stripe-setup" style={{ color: 'var(--primary)' }}>Go to setup</Link></>
                    )}
                </span>
            </div>

            <Row className="g-3 mb-2">
                <Col md={4}>
                    <div className="glass-container p-4 h-100 d-flex flex-column justify-content-between" style={{ background: 'var(--bg-glassy-primary)', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                        <div>
                            <h6 className="text-uppercase mb-2" style={{ color: 'var(--primary)', letterSpacing: '1px', fontSize: '0.8rem' }}>Available Balance</h6>
                            <h2 className="mb-0" style={{ color: 'var(--on-surface)', fontSize: '2.5rem', fontWeight: 700 }}>
                                ${wallet ? Number(wallet.availableBalance).toFixed(2) : '0.00'}
                            </h2>
                        </div>
                        <button
                            type="button"
                            className="btn-glass-primary w-100 mt-4"
                            onClick={() => setShowPayoutModal(true)}
                            disabled={!wallet || wallet.availableBalance <= 0 || !payoutReady}
                            style={{ border: 'none' }}
                        >
                            Request Payout
                        </button>
                    </div>
                </Col>

                <Col md={4}>
                    <div className="glass-container p-4 h-100 d-flex flex-column">
                        <h6 className="text-uppercase mb-2" style={{ color: 'var(--on-surface-variant)', letterSpacing: '1px', fontSize: '0.8rem' }}>Pending Balance</h6>
                        <h2 className="mb-0" style={{ color: 'var(--color-warning)', fontSize: '2.5rem', fontWeight: 700 }}>
                            ${wallet ? Number(wallet.pendingBalance).toFixed(2) : '0.00'}
                        </h2>
                        <p className="mt-3 mb-0" style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                            Net earnings awaiting delivery confirmation (after platform fees).
                        </p>
                    </div>
                </Col>

                <Col md={4}>
                    <div className="glass-container p-4 h-100 d-flex flex-column">
                        <h6 className="text-uppercase mb-2" style={{ color: 'var(--on-surface-variant)', letterSpacing: '1px', fontSize: '0.8rem' }}>Total Lifetime Earnings</h6>
                        <h2 className="mb-0" style={{ color: 'var(--color-success)', fontSize: '2.5rem', fontWeight: 700 }}>
                            ${wallet ? Number(wallet.totalEarnings).toFixed(2) : '0.00'}
                        </h2>
                        <p className="mt-3 mb-0" style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                            All-time net earnings from delivered sales (after platform fees).
                        </p>
                    </div>
                </Col>
            </Row>

            {!isLoading && (
                <>
                    <DashboardDataSection
                        getData={loadTransactions}
                        contentType="transactions"
                        dataKey="transactions"
                        columns={getWalletTransactionColumns}
                        tableTitle="Transaction History Ledger"
                        fluid={true}
                        defaultStatusArray={[]}
                        statusOptions={[]}
                        extraFilters={[
                            {
                                param: 'type',
                                label: 'Type',
                                placeholder: 'All Types',
                                options: WALLET_TRANSACTION_TYPE_OPTIONS,
                            },
                        ]}
                        emptyState={{
                            title: 'No transactions yet',
                            subtitle: 'Net sale credits (after platform fees) from paid orders will appear here.',
                        }}
                    />

                    <DashboardDataSection
                        key={payoutRefreshKey}
                        getData={loadPayouts}
                        contentType="payouts"
                        dataKey="payouts"
                        columns={() => getMyPayoutColumns(handleCancelPayout)}
                        tableTitle="Payout Request History"
                        fluid={true}
                        statusFilterParam="status"
                        defaultStatusArray={[]}
                        statusOptions={PAYOUT_STATUS_OPTIONS}
                        emptyState={{
                            title: 'No payouts requested',
                            subtitle: 'Once you have earnings, you can request a payout here.',
                        }}
                    />
                </>
            )}

            {showPayoutModal && (
                <Modal onClose={closePayoutModal}>
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                            <h5 className="mb-0">Request Earnings Payout</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={closePayoutModal}
                            />
                        </div>
                        <Form onSubmit={handlePayoutSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--on-surface)' }}>Payout Amount ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter amount to withdraw"
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                    max={wallet ? wallet.availableBalance : 0}
                                    required
                                    style={{ background: 'var(--bg-main)', color: 'var(--on-surface)', border: 'var(--border-standard)' }}
                                />
                                <Form.Text style={{ color: 'var(--on-surface-variant)' }}>
                                    Maximum withdrawable balance: ${wallet ? Number(wallet.availableBalance).toFixed(2) : '0.00'}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--on-surface)' }}>Additional Notes (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Stripe/Bank details or notes"
                                    value={payoutNote}
                                    onChange={(e) => setPayoutNote(e.target.value)}
                                    style={{ background: 'var(--bg-main)', color: 'var(--on-surface)', border: 'var(--border-standard)' }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2 pt-3 border-top" style={{ borderColor: 'var(--border-glass) !important' }}>
                                <button className="btn-glass-outline" type="button" onClick={closePayoutModal}>
                                    Close
                                </button>
                                <button className="btn-glass-primary" type="submit">
                                    Submit Request
                                </button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default WalletPage;
