import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { getAuthToken } from '../utility/tokenLoader';
import OrderBoxWidgets from '../components/OrderBoxWidgets';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import { getData, getOrderByIdReq, getReviewByOrderReq } from '../lib/loaders';
import { confirmOrderReq, cancelOrderReq, refundOrderReq } from '../lib/orderRequests';
import { createDisputeReq } from '../lib/disputeRequests';
import { submitReviewReq } from '../lib/reviewRequests';
import { Form } from 'react-bootstrap';
import Modal from '../components/layout/Modal';
import WarningModal from '../components/layout/WarningModal';
import GlobalWrapper from '../components/layout/GlobalWrapper';
import classes from './OrderView.module.scss';

function OrderView({ refresh }) {
    const navigate = useNavigate();
    const location = useLocation();
    const token = getAuthToken();
    const userData = useSelector(state => state.auth.userData) || {};
    const thisUserRole = userData.role ?? null;
    const avatar = userData.avatar ?? null;
    const org_username = userData.org_username ?? null;
    const firstName = userData.first_name ?? null;

    const dispatch = useDispatch();
    const [order, setOrder] = useState({});
    const [review, setReview] = useState(null);
    const [updated, setUpdated] = useState(false);
    const { id } = useParams();

    // Modals state
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [isDisputeSubmitting, setIsDisputeSubmitting] = useState(false);
    const [warning, setWarning] = useState({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' });

    const confirmWarningAction = () => {
        if (warning.onAction) {
            warning.onAction();
        }
        setWarning({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' });
    };

    useEffect(() => {
        if (refresh) {
            setUpdated(true);
        }
    }, [refresh]);

    const loadOrderAndReview = () => {
        if (!token) return;
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast));
        };
        const loadingState = (state) => {
            dispatch(uiActions.showLoading(state));
        };
        const notificationState = (state) => {
            dispatch(uiActions.showNotification(state));
        };
        const gettingOrder = (data) => {
            setOrder(data || null);
        };
        const gettingReview = (data) => {
            setReview(data?.review || null);
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        getData(() => getOrderByIdReq(id, headers), toastHandler, loadingState, notificationState, gettingOrder, 'Order!');
        getData(() => getReviewByOrderReq(id, headers), toastHandler, loadingState, notificationState, gettingReview, 'Review!');
    };

    useEffect(() => {
        loadOrderAndReview();
    // eslint-disable-next-line
    }, [dispatch, id, token]);

    const versionLabel = order?.versionData?.version || null;
    const isOrderClient = order?.clientId === userData?.id;
    const showPayBanner = Boolean(
        location.state?.fromOrderCreation && isOrderClient && order?.status === 'PENDING'
    );

    useEffect(() => {
        if (updated) {
            loadOrderAndReview();
            setUpdated(false);
        }
    // eslint-disable-next-line
    }, [updated]);

    const confirmOrdeerHandler = () => {
        async function runConfirm() {
            dispatch(uiActions.showLoading(true));
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            try {
                // eslint-disable-next-line
                const response = await confirmOrderReq(id, {}, headers);
                dispatch(uiActions.notificationDataChanged({
                    status: 'success',
                    title: 'Delivery Confirmed',
                    message: 'Order delivery confirmed successfully.'
                }));
                dispatch(uiActions.showNotification(true));

                setUpdated(true);
            } catch (err) {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error',
                    title: 'Error',
                    message: err.response?.data?.message || err.message || 'Failed to confirm order delivery'
                }));
                dispatch(uiActions.showNotification(true));
            } finally {
                dispatch(uiActions.showLoading(false));
            }
        }
        runConfirm();
    };

    const cancelOrderHandler = () => {
        setWarning({
            show: true,
            type: 'action',
            action: 'Confirm',
            message: 'Are you sure you want to cancel this order?',
            onAction: async () => {
                const headers = { 'Authorization': `Bearer ${token}` };
                try {
                    dispatch(uiActions.showLoading(true));
                    await cancelOrderReq(id, headers);
                    dispatch(uiActions.notificationDataChanged({
                        status: 'success',
                        title: 'Order Cancelled',
                        message: 'Your order was successfully cancelled.'
                    }));
                    dispatch(uiActions.showNotification(true));
                    setUpdated(true);
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to cancel order'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
        });
    };

    const refundOrderHandler = () => {
        setWarning({
            show: true,
            type: 'action',
            action: 'Refund',
            message: 'Are you sure you want to refund this order? This action is permanent.',
            onAction: async () => {
                const headers = { 'Authorization': `Bearer ${token}` };
                try {
                    dispatch(uiActions.showLoading(true));
                    await refundOrderReq(id, headers);
                    dispatch(uiActions.notificationDataChanged({
                        status: 'success',
                        title: 'Order Refunded',
                        message: 'Your order was successfully refunded.'
                    }));
                    dispatch(uiActions.showNotification(true));
                    setUpdated(true);
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to refund order'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
        });
    };

    const closeDisputeModal = () => {
        setShowDisputeModal(false);
        setDisputeReason('');
    };

    const handleDisputeSubmit = async (e) => {
        e.preventDefault();
        if (isDisputeSubmitting) return;

        if (order?.dispute) {
            closeDisputeModal();
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Dispute Already Exists',
                message: 'This order already has a dispute on record.',
            }));
            dispatch(uiActions.showNotification(true));
            return;
        }

        if (disputeReason.trim().length < 20) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Invalid Input',
                message: 'Please provide a detailed dispute reason (minimum 20 characters).'
            }));
            dispatch(uiActions.showNotification(true));
            return;
        }

        setIsDisputeSubmitting(true);
        try {
            await createDisputeReq(
                { orderId: Number(id), reason: disputeReason.trim() },
                token
            );
            closeDisputeModal();
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Dispute Opened',
                message: 'A formal dispute has been opened for this order. Admin arbitration will review.'
            }));
            dispatch(uiActions.showNotification(true));
            setUpdated(true);
        } catch (err) {
            const rawMessage = err.response?.data?.message || err.message || 'Failed to open dispute';
            const alreadyExists = /unique|already exists|already open/i.test(rawMessage);
            if (alreadyExists) {
                closeDisputeModal();
                setUpdated(true);
            }
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: alreadyExists ? 'Dispute Already Exists' : 'Error',
                message: alreadyExists
                    ? 'This order already has a dispute on record.'
                    : rawMessage,
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setIsDisputeSubmitting(false);
        }
    };

    const resolveDisputeHandler = () => {
        // Redirect Admin directly to Admin dispute center
        navigate('/admin/disputes');
    };

    const onSubmitFeedback = (feedback, rate) => {
        if (order) {
            async function onSubmitFeedbackHandler() {
                dispatch(uiActions.showLoading(true));
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                const data = {
                    aiModelId: order?.aiModelId,
                    orderId: id,
                    versionId: order?.versionId,
                    desc: feedback,
                    star: rate
                };
                try {
                    const response = await submitReviewReq(data, headers);
                    // eslint-disable-next-line
                    const resData = response?.data;
                    dispatch(uiActions.notificationDataChanged({
                        status: 'success',
                        title: 'Review Submitted',
                        message: 'Thank you for your feedback!'
                    }));
                    dispatch(uiActions.showNotification(true));

                    setUpdated(true);
                } catch (err) {
                    dispatch(uiActions.notificationDataChanged({
                        status: 'error',
                        title: 'Error',
                        message: err.response?.data?.message || err.message || 'Failed to submit review'
                    }));
                    dispatch(uiActions.showNotification(true));
                } finally {
                    dispatch(uiActions.showLoading(false));
                }
            }
            onSubmitFeedbackHandler();
        }
    };

    return (
        <GlobalWrapper className={`py-5 my-3 mb-5 ${classes.pageWrapper}`}>
            {warning.show && <WarningModal
                warning={warning}
                onAction={confirmWarningAction}
                onClose={() => setWarning({ show: false, onAction: null, message: '', type: 'action', action: 'Confirm' })}
            />}
            {showPayBanner && (
                <div className={`mb-4 p-4 rounded ${classes.paymentBanner}`}>
                    <h5 className={`mb-2 ${classes.bannerTitle}`}>Order created — payment required</h5>
                    <p className={`mb-3 ${classes.bannerText}`}>
                        Your order is pending until payment is completed. Use the{' '}
                        <strong className={classes.bannerHighlight}>Proceed to Pay</strong> button below to checkout securely.
                    </p>
                    <Link
                        to={`/stripe?orderId=${order.id}`}
                        className="btn-glass-primary fw-bold"
                    >
                        Proceed to Pay (${Number(order.purchasePrice || 0).toFixed(2)})
                    </Link>
                </div>
            )}
            <OrderBoxWidgets
                order={order}
                versionLabel={versionLabel}
                confirmOrdeerHandler={confirmOrdeerHandler}
                cancelOrderHandler={cancelOrderHandler}
                openDisputeHandler={() => {
                    if (!order?.dispute) setShowDisputeModal(true);
                }}
                refundOrderHandler={refundOrderHandler}
                resolveDisputeHandler={resolveDisputeHandler}
            />

            {review && (
                <FeedbackList
                    rev={[review]}
                    formTitle='Review Made on This Order'
                    versionMap={review.versionId && versionLabel ? { [review.versionId]: versionLabel } : {}}
                />
            )}

            {!review && (thisUserRole === 'CLIENT') && (order?.status === 'DELIVERED') && (
                <FeedbackForm
                    avatar={avatar}
                    orgUsername={org_username}
                    firstName={firstName}
                    thisUserRole={thisUserRole}
                    onSubmitFeedback={onSubmitFeedback}
                    formTitle='Submit your Review regarding this Order'
                />
            )}

            {showDisputeModal && (
                <Modal onClose={closeDisputeModal}>
                    <div className={`p-4 ${classes.modalContent}`}>
                        <div className={`d-flex justify-content-between align-items-center mb-3 pb-2 ${classes.modalHeader}`}>
                            <h5 className="mb-0">Open Agreement Dispute</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                aria-label="Close"
                                onClick={closeDisputeModal}
                            />
                        </div>
                        <Form onSubmit={handleDisputeSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className={classes.formLabel}>Reason for Dispute (min 20 characters)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Explain why you are opening a dispute. Administrative staff will review your case and resolve appropriately."
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    minLength={20}
                                    required
                                    className={classes.formTextarea}
                                />
                            </Form.Group>
                            <div className={`d-flex justify-content-end gap-2 pt-3 ${classes.modalFooter}`}>
                                <button type="button" className="btn-glass-outline" onClick={closeDisputeModal}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-glass-danger"
                                    disabled={isDisputeSubmitting}
                                >
                                    {isDisputeSubmitting ? 'Submitting…' : 'File Dispute'}
                                </button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </GlobalWrapper>
    );
}

export default OrderView;