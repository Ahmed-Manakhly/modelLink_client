import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getAuthToken } from '../utility/tokenLoader';
import { uiActions } from '../store/UI-slice';
import axios from 'axios';
import { BASE_URL } from '../lib/api';
import { Container } from 'react-bootstrap';
import { FaCheckCircle, FaFlask } from 'react-icons/fa';
import { SiStripe } from 'react-icons/si';
import classes from './Stripe.module.scss';

// Initialize Stripe with the publishable key — safe to expose on client
const stripePromise = process.env.REACT_APP_STRIPE_PUBLIC_KEY
    ? loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
    : null;

// ─── Real Stripe Elements form ───────────────────────────────────────────────
function RealStripeForm({ order, clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [cardName, setCardName] = useState('');
    const [error, setError] = useState(null);

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                color: '#E2E8F0',
                fontFamily: '"Inter", sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': { color: '#6B7280' },
                backgroundColor: 'transparent',
            },
            invalid: { color: '#F44336', iconColor: '#F44336' },
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setError(null);
        setLoading(true);
        dispatch(uiActions.showLoading(true));

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: { name: cardName },
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                dispatch(uiActions.notificationDataChanged({
                    status: 'success',
                    title: 'Payment Confirmed',
                    message: 'Stripe confirmed your payment. Unlocking your order now…',
                }));
                dispatch(uiActions.showNotification(true));
                
                // Force backend to sync state instantly (triggers our self-healing logic)
                try {
                    await axios.get(`${BASE_URL}/api/orders/${order.id}/payment-client-secret`, {
                        headers: { Authorization: `Bearer ${getAuthToken()}` },
                    });
                } catch (e) {
                    // It will sync the DB on the backend regardless
                }
                
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
            dispatch(uiActions.showLoading(false));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className={`form-label small fw-semibold ${classes.formLabel}`}>
                    Cardholder Name
                </label>
                <input
                    type="text"
                    className={`form-control ${classes.formInput}`}
                    placeholder="Jane Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className={`form-label small fw-semibold ${classes.formLabel}`}>
                    Card Details
                </label>
                <div style={{
                    padding: '12px 14px',
                    background: 'var(--surface-glass)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    transition: 'border-color 0.2s',
                }}>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                <small style={{ color: 'var(--on-surface-variant)', marginTop: '6px', display: 'block' }}>
                    Use Stripe test card: <code style={{ color: 'var(--primary)' }}>4242 4242 4242 4242</code> · Any future date · Any CVC
                </small>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid var(--color-danger)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: 'var(--color-danger)',
                    fontSize: '0.875rem',
                    marginBottom: '16px',
                }}>
                    {error}
                </div>
            )}

            <button
                type="submit"
                className={`w-100 py-3 fw-bold text-uppercase btn-glass-primary ${classes.payButton}`}
                disabled={!stripe || loading}
            >
                {loading ? 'Processing…' : `Confirm & Pay $${Number(order.purchasePrice).toFixed(2)}`}
            </button>
        </form>
    );
}

// ─── Main Stripe checkout page ────────────────────────────────────────────────
function Stripe() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const token = getAuthToken();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [order, setOrder] = useState(null);
    const [mode, setMode] = useState(null);           // null | 'real' | 'demo'
    const [clientSecret, setClientSecret] = useState(null);
    const [stripeEnabled, setStripeEnabled] = useState(false);
    const [loadingSecret, setLoadingSecret] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);

    // Fetch the order
    useEffect(() => {
        if (!token) { navigate('/auth'); return; }
        if (!orderId) { navigate('/'); return; }

        const fetchOrder = async () => {
            dispatch(uiActions.showLoading(true));
            try {
                const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedOrder = res.data?.data?.order || res.data?.order;
                if (fetchedOrder?.status !== 'PENDING') {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'info',
                        title: 'Already Paid',
                        message: 'This order has already been paid.',
                    }));
                    dispatch(uiActions.showNotification(true));
                    navigate(`/order/view/${fetchedOrder.id}`);
                    return;
                }
                setOrder(fetchedOrder);
                // Check if server has Stripe configured
                setStripeEnabled(!!process.env.REACT_APP_STRIPE_PUBLIC_KEY);
            } catch (err) {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to load order',
                }));
                dispatch(uiActions.showNotification(true));
                navigate('/');
            } finally {
                dispatch(uiActions.showLoading(false));
            }
        };
        fetchOrder();
    }, [orderId, token, dispatch, navigate]);

    // When user picks "Pay with Stripe" — fetch clientSecret from backend
    const handleSelectReal = useCallback(async () => {
        setLoadingSecret(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/orders/${orderId}/payment-client-secret`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (res.data?.alreadyPaid) {
                dispatch(uiActions.notificationDataChanged({
                    status: 'success',
                    title: 'Payment Confirmed',
                    message: 'Your payment was confirmed and the order has been successfully fulfilled!',
                }));
                dispatch(uiActions.showNotification(true));
                setPaymentSuccess(true);
                setTimeout(() => navigate(`/order/view/${orderId}`), 2000);
                return;
            }

            const secret = res.data?.clientSecret;
            if (!secret) throw new Error('Could not load payment details.');
            setClientSecret(secret);
            setMode('real');
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Stripe Error',
                message: err.response?.data?.message || err.message || 'Could not start Stripe checkout.',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setLoadingSecret(false);
        }
    }, [orderId, token, dispatch, navigate]);

    // Demo payment — calls backend mock-pay endpoint
    const handleDemoPayment = async () => {
        setDemoLoading(true);
        dispatch(uiActions.showLoading(true));
        try {
            await axios.post(`${BASE_URL}/api/orders/${orderId}/demo-checkout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Demo Payment Complete',
                message: 'Order fulfilled instantly via demo payment.',
            }));
            dispatch(uiActions.showNotification(true));
            setPaymentSuccess(true);
            setTimeout(() => navigate(`/order/view/${orderId}`), 2000);
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Demo Payment Failed',
                message: err.response?.data?.message || err.message || 'Could not complete demo payment.',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setDemoLoading(false);
            dispatch(uiActions.showLoading(false));
        }
    };

    const handleSuccess = () => {
        setPaymentSuccess(true);
        setTimeout(() => navigate(`/order/view/${orderId}`), 2000);
    };

    // ── Success screen ──────────────────────────────────────────────────────
    if (paymentSuccess) {
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <div className="glass-container text-center p-5 shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}>
                    <svg width="0" height="0">
                        <linearGradient id="successIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop stopColor="var(--primary)" offset="0%" />
                            <stop stopColor="var(--on-surface)" offset="100%" />
                        </linearGradient>
                    </svg>
                    <FaCheckCircle className={`mb-4 ${classes.successIcon}`} size={80} style={{ fill: 'url(#successIconGradient)' }} />
                    <h2 className={`mb-3 gradient-text ${classes.successTitle}`}>Payment Confirmed!</h2>
                    <p className={classes.successText}>Redirecting to your order…</p>
                </div>
            </Container>
        );
    }

    if (!order) return null;

    // ── Mode selector — the user hasn't chosen yet ──────────────────────────
    if (!mode) {
        return (
            <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="glass-container shadow-lg overflow-hidden" style={{ maxWidth: '700px', width: '100%', borderRadius: '15px' }}>
                    {/* Header */}
                    <div className={classes.checkoutHeader}>
                        <h3 className={`mb-1 fw-bold ${classes.checkoutTitle}`}>Checkout</h3>
                        <p className={`mb-0 small ${classes.checkoutSubtitle}`}>
                            Order #{order.id} · {order.title}
                        </p>
                    </div>

                    <div className="p-4">
                        {/* Order summary */}
                        <div className={`mb-4 p-3 rounded ${classes.orderSummary}`}>
                            <h6 className={`mb-1 text-uppercase small ${classes.summaryTitle}`}>Order Summary</h6>
                            <h5 className={`mb-1 ${classes.summaryTitle}`}>{order.title}</h5>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className={classes.summaryItem}>Total</span>
                                <span className={`fw-bold ${classes.summaryPrice}`}>
                                    ${Number(order.purchasePrice).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <h6 className={`mb-3 text-uppercase small ${classes.sectionTitle}`}>Choose How to Pay</h6>

                        <div className="d-flex flex-column flex-md-row gap-3">
                            {/* Real Stripe */}
                            {stripeEnabled && (
                                <button
                                    className="flex-fill btn-glass-primary py-4 d-flex flex-column align-items-center gap-2"
                                    style={{ borderRadius: '12px', border: '2px solid var(--primary)' }}
                                    onClick={handleSelectReal}
                                    disabled={loadingSecret}
                                >
                                    <SiStripe size={32} />
                                    <span className="fw-bold">Pay with Stripe</span>
                                    <small style={{ color: 'var(--on-surface-variant)', fontWeight: 400 }}>
                                        Real card · Secure checkout
                                    </small>
                                    {loadingSecret && <span className="spinner-border spinner-border-sm mt-1" />}
                                </button>
                            )}

                            {/* Demo payment */}
                            <button
                                className="flex-fill btn-glass-outline py-4 d-flex flex-column align-items-center gap-2"
                                style={{ borderRadius: '12px', border: '2px solid var(--color-warning)', color: 'var(--color-warning)' }}
                                onClick={handleDemoPayment}
                                disabled={demoLoading}
                            >
                                <FaFlask size={28} />
                                <span className="fw-bold">Demo Payment</span>
                                <small style={{ color: 'var(--on-surface-variant)', fontWeight: 400 }}>
                                    No card needed · Simulates instant payment
                                </small>
                                {demoLoading && <span className="spinner-border spinner-border-sm mt-1" />}
                            </button>
                        </div>

                        <p className="mt-3 mb-0 text-center" style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem' }}>
                            Demo mode uses the same backend fulfillment logic as real payments — wallet credits, notifications, and asset unlock all fire identically.
                        </p>
                    </div>
                </div>
            </Container>
        );
    }

    // ── Real Stripe Elements checkout ───────────────────────────────────────
    if (mode === 'real' && clientSecret) {
        return (
            <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="glass-container shadow-lg overflow-hidden" style={{ maxWidth: '650px', width: '100%', borderRadius: '15px' }}>
                    <div className={classes.checkoutHeader}>
                        <h3 className={`mb-1 fw-bold ${classes.checkoutTitle}`}>Stripe Checkout</h3>
                        <p className={`mb-0 small ${classes.checkoutSubtitle}`}>Secure professional payment</p>
                    </div>

                    <div className="p-4">
                        <div className={`mb-4 p-3 rounded ${classes.orderSummary}`}>
                            <h6 className={`mb-1 text-uppercase small ${classes.summaryTitle}`}>Order Summary</h6>
                            <h5 className={`mb-1 ${classes.summaryTitle}`}>{order.title}</h5>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className={classes.summaryItem}>Total</span>
                                <span className={`fw-bold ${classes.summaryPrice}`}>${Number(order.purchasePrice).toFixed(2)}</span>
                            </div>
                        </div>

                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <RealStripeForm order={order} clientSecret={clientSecret} onSuccess={handleSuccess} />
                        </Elements>

                        <button
                            className="btn-glass-outline w-100 mt-3"
                            onClick={() => { setMode(null); setClientSecret(null); }}
                        >
                            ← Back to payment options
                        </button>
                    </div>
                </div>
            </Container>
        );
    }

    return null;
}

export default Stripe;