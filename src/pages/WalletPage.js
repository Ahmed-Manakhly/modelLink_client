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
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
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

const isDemoStripeEnv =
    process.env.REACT_APP_MARKETPLACE_DEMO === 'true'
    || process.env.NODE_ENV !== 'production';

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
        try {
            setConnectLoading(true);
            const res = await onboardStripeConnectReq(token);
            const url = res.data?.data?.url;
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Stripe Connect',
                message: error.response?.data?.message || error.message || 'Could not start onboarding',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setConnectLoading(false);
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
        <Container className="py-5">
            {warning.show && <WarningModal
                warning={warning}
                onAction={confirmWarningAction}
                onClose={() => setWarning({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' })}
            />}
            <h2>Developer Earnings Wallet</h2>
            <p className="text-muted mb-4">
                All balances and sale amounts shown here are <strong>after platform fees</strong> — your net earnings from each order.
            </p>

            <Card className="mb-4" id="stripe-setup">
                <Card.Body className="p-4">
                    <h5 className="mb-3">Stripe Setup</h5>
                    <p className="text-muted small mb-3">
                        Connect Stripe to receive payouts. All three steps must be complete before requesting a withdrawal.
                    </p>
                    <ul className="mb-3">
                        <li className={status.stripeAccountId ? 'text-success' : ''}>
                            {status.stripeAccountId ? '✓' : '○'} Account linked
                            {status.stripeAccountId && <span className="text-muted small ms-2">({status.stripeAccountId})</span>}
                        </li>
                        <li className={status.stripeDetailsSubmitted ? 'text-success' : ''}>
                            {status.stripeDetailsSubmitted ? '✓' : '○'} Details submitted
                        </li>
                        <li className={status.payoutReady ? 'text-success' : ''}>
                            {status.payoutReady ? '✓' : '○'} Payouts enabled
                        </li>
                    </ul>
                    <div className="d-flex flex-wrap gap-2">
                        <Button
                            variant="primary"
                            onClick={handleConnectStripe}
                            disabled={connectLoading || status.payoutReady}
                        >
                            {connectLoading ? 'Loading…' : 'Connect with Stripe'}
                        </Button>
                        {isDemoStripeEnv && !status.payoutReady && (
                            <Button
                                variant="outline-secondary"
                                onClick={handleDemoComplete}
                                disabled={connectLoading}
                            >
                                Complete setup (demo)
                            </Button>
                        )}
                    </div>
                    {!status.payoutReady && (
                        <p className="text-muted small mt-3 mb-0">
                            Local QA: click <strong>Complete setup (demo)</strong> to enable payouts without real Stripe keys.
                        </p>
                    )}
                </Card.Body>
            </Card>

            <div className={`alert ${payoutReady ? 'alert-success' : 'alert-warning'} mb-4`}>
                {payoutReady ? 'Payouts enabled — you can request a withdrawal.' : (
                    <>Complete Stripe setup above to request payouts. <Link to="/wallet#stripe-setup">Go to setup</Link></>
                )}
            </div>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="text-white bg-primary">
                        <Card.Body className="p-4">
                            <h6 className="text-uppercase mb-2 text-white-50">Available Balance</h6>
                            <h2 className="mb-0">
                                ${wallet ? Number(wallet.availableBalance).toFixed(2) : '0.00'}
                            </h2>
                            <Button
                                variant="light"
                                className="mt-3 w-100 fw-bold"
                                onClick={() => setShowPayoutModal(true)}
                                disabled={!wallet || wallet.availableBalance <= 0 || !payoutReady}
                            >
                                Request Payout
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body className="p-4">
                            <h6 className="text-muted">Pending Balance</h6>
                            <h2 className="mb-0 text-warning">
                                ${wallet ? Number(wallet.pendingBalance).toFixed(2) : '0.00'}
                            </h2>
                            <p className="text-muted mt-3 mb-0 small">
                                Net earnings awaiting delivery confirmation (after platform fees).
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body className="p-4">
                            <h6 className="text-muted">Total Lifetime Earnings</h6>
                            <h2 className="mb-0 text-success">
                                ${wallet ? Number(wallet.totalEarnings).toFixed(2) : '0.00'}
                            </h2>
                            <p className="text-muted mt-3 mb-0 small">
                                All-time net earnings from delivered sales (after platform fees).
                            </p>
                        </Card.Body>
                    </Card>
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
                                <Form.Label>Payout Amount ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter amount to withdraw"
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                    max={wallet ? wallet.availableBalance : 0}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Maximum withdrawable balance: ${wallet ? Number(wallet.availableBalance).toFixed(2) : '0.00'}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Additional Notes (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Stripe/Bank details or notes"
                                    value={payoutNote}
                                    onChange={(e) => setPayoutNote(e.target.value)}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                                <Button variant="secondary" type="button" onClick={closePayoutModal}>
                                    Close
                                </Button>
                                <Button type="submit" variant="primary">Submit Request</Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </Container>
    );
}

export default WalletPage;
