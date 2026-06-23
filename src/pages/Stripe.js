import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAuthToken } from '../utility/tokenLoader';
import { uiActions } from '../store/UI-slice';
import { getOrderByIdReq } from '../lib/loaders';
import axios from 'axios';
import { BASE_URL } from '../lib/api';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';

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
    }, [orderId, token]);

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
                <Card className="text-center p-5 shadow-lg" style={{ maxWidth: '500px', borderRadius: '20px', border: 'none' }}>
                    <Card.Body>
                        <FaCheckCircle className="text-success mb-4 animate-bounce" size={80} />
                        <h2 className="mb-3" style={{ fontWeight: 800, color: 'var(--main-2-blue)' }}>Payment Successful!</h2>
                        <p className="text-muted">Stripe has confirmed the transaction. Unlocking asset downloads now...</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            {order && (
                <Card className="shadow-lg overflow-hidden" style={{ maxWidth: '650px', width: '100%', borderRadius: '20px', border: 'none' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: '#fff', padding: '2rem' }}>
                        <h3 className="mb-1 fw-bold">Stripe Checkout</h3>
                        <p className="mb-0 text-white-50 small">Secure professional B2B order settlement</p>
                    </div>

                    <Card.Body className="p-4">
                        <div
                            style={{
                                backgroundColor: '#fff3cd',
                                color: '#856404',
                                border: '1px solid #ffc107',
                                borderRadius: '6px',
                                padding: '8px 14px',
                                fontSize: '0.875rem',
                                marginBottom: '16px',
                                textAlign: 'center'
                            }}
                        >
                            Demo Mode — Payments are simulated. No real card is charged.
                        </div>

                        <div className="mb-4 p-3 rounded bg-light" style={{ borderLeft: '5px solid #2a5298' }}>
                            <h6 className="mb-1 text-muted text-uppercase small" style={{ fontWeight: 700 }}>Order Summary</h6>
                            <h5 className="mb-1" style={{ fontWeight: 700 }}>{order.title || 'AI Model Order'}</h5>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className="text-muted">Total Purchase Price</span>
                                <span className="fw-bold text-primary" style={{ fontSize: '1.25rem' }}>
                                    ${Number(order.purchasePrice).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Form onSubmit={handlePaymentSubmit}>
                            <h6 className="mb-3 text-muted text-uppercase small" style={{ fontWeight: 700 }}>Credit Card Details</h6>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Cardholder Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold">Card Number</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaCreditCard /></span>
                                    <Form.Control
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-semibold">Expiration Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-semibold">CVC / CVV</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            maxLength={4}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-center align-items-center text-muted mb-4 small">
                                <FaLock className="me-2 text-success" />
                                Guaranteed 256-bit SSL encrypted connection through Stripe gateway.
                            </div>

                            <Button
                                type="submit"
                                className="w-100 py-3 fw-bold text-uppercase"
                                style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', border: 'none', borderRadius: '10px' }}
                            >
                                Confirm & Pay ${Number(order.purchasePrice).toFixed(2)}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default Stripe;