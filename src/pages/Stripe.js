import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAuthToken } from '../utility/tokenLoader';
import { uiActions } from '../store/UI-slice';
// import { getOrderByIdReq } from '../lib/loaders';
import axios from 'axios';
import { BASE_URL } from '../lib/api';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import classes from './Stripe.module.scss';

function Stripe() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const token = getAuthToken();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [order, setOrder] = useState(null);
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
    const [expiry, setExpiry] = useState('12/29');
    const [cvc, setCvc] = useState('***');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
        if (!orderId) {
            navigate('/');
            return;
        }

        const fetchOrder = async () => {
            dispatch(uiActions.showLoading(true));
            try {
                const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const fetchedOrder = response.data?.data?.order || response.data?.order;
                setOrder(fetchedOrder);
            } catch (err) {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error',
                    title: 'Error',
                    message: err.response?.data?.message || err.message || 'Failed to load order details'
                }));
                dispatch(uiActions.showNotification(true));
                navigate('/');
            } finally {
                dispatch(uiActions.showLoading(false));
            }
        };

        fetchOrder();
    }, [orderId, token, dispatch, navigate]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!order) return;

        dispatch(uiActions.showLoading(true));
        try {
            // Trigger Stripe Webhook mock event
            const webhookPayload = {
                id: `evt_mock_${Date.now()}`,
                type: 'payment_intent.succeeded',
                data: {
                    object: {
                        id: order.stripePaymentIntentId
                    }
                }
            };

            await axios.post(`${BASE_URL}/api/orders/stripe-webhook`, webhookPayload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPaymentSuccess(true);
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Payment Confirmed',
                message: 'Your payment was successfully processed by Stripe!'
            }));
            dispatch(uiActions.showNotification(true));

            setTimeout(() => {
                navigate(`/order/view/${order.id}`);
            }, 2000);
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Payment Failed',
                message: err.response?.data?.message || err.message || 'Failed to confirm stripe checkout payment'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    };

    if (paymentSuccess) {
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <div className="glass-container text-center p-5 shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}>
                    <div className="p-3">
                        <svg width="0" height="0">
                            <linearGradient id="successIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop stopColor="var(--primary)" offset="0%" />
                                <stop stopColor="var(--on-surface)" offset="100%" />
                            </linearGradient>
                        </svg>
                        <FaCheckCircle className={`mb-4 animate-bounce ${classes.successIcon}`} size={80} style={{ fill: 'url(#successIconGradient)' }} />
                        <h2 className={`mb-3 gradient-text ${classes.successTitle}`}>Payment Successful!</h2>
                        <p className={classes.successText}>Stripe has confirmed the transaction. Unlocking asset downloads now...</p>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            {order && (
                <div className="glass-container shadow-lg overflow-hidden" style={{ maxWidth: '650px', width: '100%', borderRadius: '15px' }}>
                    <div className={classes.checkoutHeader}>
                        <h3 className={`mb-1 fw-bold ${classes.checkoutTitle}`}>Stripe Checkout</h3>
                        <p className={`mb-0 small ${classes.checkoutSubtitle}`}>Secure professional B2B order settlement</p>
                    </div>

                    <div className="p-4">
                        <div className={classes.demoWarning}>
                            Demo Mode — Payments are simulated. No real card is charged.
                        </div>

                        <div className={`mb-4 p-3 rounded ${classes.orderSummary}`}>
                            <h6 className={`mb-1 text-uppercase small ${classes.summaryTitle}`}>Order Summary</h6>
                            <h5 className={`mb-1 ${classes.summaryTitle}`}>{order.title || 'AI Model Order'}</h5>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className={classes.summaryItem}>Total Purchase Price</span>
                                <span className={`fw-bold ${classes.summaryPrice}`}>
                                    ${Number(order.purchasePrice).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Form onSubmit={handlePaymentSubmit}>
                            <h6 className={`mb-3 text-uppercase small ${classes.sectionTitle}`}>Credit Card Details</h6>

                            <Form.Group className="mb-3">
                                <Form.Label className={`small fw-semibold ${classes.formLabel}`}>Cardholder Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    required
                                    className={classes.formInput}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className={`small fw-semibold ${classes.formLabel}`}>Card Number</Form.Label>
                                <div className="input-group">
                                    <span className={`input-group-text ${classes.formInput}`}><FaCreditCard /></span>
                                    <Form.Control
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        required
                                        className={classes.formInput}
                                    />
                                </div>
                            </Form.Group>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className={`small fw-semibold ${classes.formLabel}`}>Expiration Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            required
                                            className={classes.formInput}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className={`small fw-semibold ${classes.formLabel}`}>CVC / CVV</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            maxLength={4}
                                            required
                                            className={classes.formInput}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className={`d-flex justify-content-center align-items-center mb-4 small ${classes.securityNote}`}>
                                <FaLock className={`me-2 ${classes.successIcon}`} />
                                Guaranteed 256-bit SSL encrypted connection through Stripe gateway.
                            </div>

                            <Button
                                type="submit"
                                className={`w-100 py-3 fw-bold text-uppercase btn-glass-primary ${classes.payButton}`}
                            >
                                Confirm & Pay ${Number(order.purchasePrice).toFixed(2)}
                            </Button>
                        </Form>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default Stripe;