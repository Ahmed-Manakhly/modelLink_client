import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./OrderBoxWidgets.module.scss";
import { Link } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import { Container, Row, Col, Card } from 'react-bootstrap';
import imgHolder from '../assets/imgHolder.jpg';
import { FILES_BASE_API_URL, createAPI } from '../lib/api';
import { getAuthToken } from '../utility/tokenLoader';
import { uiActions } from '../store/UI-slice';
import UserProfileStrip from './UserProfileStrip';

const API = createAPI();

const partyDisplayName = (party, fallback) =>
  party?.first_name || party?.org_username || fallback;

const OrderBoxWidgets = ({
  order,
  versionLabel,
  confirmOrdeerHandler,
  cancelOrderHandler,
  openDisputeHandler,
  refundOrderHandler,
  resolveDisputeHandler
}) => {
  const dispatch = useDispatch();
  const [revealedAssets, setRevealedAssets] = useState({});
  const userData = useSelector(state => state.auth.userData) || {};
  const isBuyer = order?.clientId === userData.id;
  const isSeller = order?.developerId === userData.id;
  const isAdmin = userData.role === 'ADMIN' || userData.role === 'EMPLOYEE';

  const status = order?.status || 'PENDING';

  const getDeliverablesEmptyMessage = () => {
    switch (status) {
      case 'PAID':
        return 'Payment confirmed. Awaiting developer delivery confirmation.';
      case 'DELIVERED':
        return 'Assets should be available above. Contact support if missing.';
      case 'DISPUTED':
        return 'Assets are on hold pending dispute resolution.';
      default:
        return 'Deliverables will be unlocked once payment is confirmed.';
    }
  };

  const getStatusClass = (statusVal) => {
    switch (statusVal) {
      case 'DELIVERED':
      case 'PAID':
        return styles.statusPaid;
      case 'DISPUTED':
        return styles.statusDisputed;
      case 'CANCELLED':
      case 'REFUNDED':
        return styles.statusCancelled;
      case 'PENDING':
      default:
        return styles.statusPending;
    }
  };

  const handleCopyValue = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      dispatch(uiActions.notificationDataChanged({
        status: 'success',
        title: 'Copied',
        message: 'Value copied to clipboard',
      }));
      dispatch(uiActions.showNotification(true));
    } catch {
      dispatch(uiActions.notificationDataChanged({
        status: 'error',
        title: 'Copy Failed',
        message: 'Could not copy to clipboard',
      }));
      dispatch(uiActions.showNotification(true));
    }
  };

  const renderAssetContent = (asset) => {
    const { type, value, downloadUrl } = asset;
    const isRevealed = revealedAssets[asset.id];

    if (type === 'DOWNLOAD_LINK' || type === 'DOCKER_IMAGE') {
      return (
        <button
          type="button"
          onClick={() => handleAssetDownload(asset)}
          className="btn btn-success btn-sm w-100 fw-bold"
        >
          Download {type === 'DOCKER_IMAGE' ? 'Docker Image' : 'Model Asset File'}
        </button>
      );
    }

    if (type === 'HUGGINGFACE_URL' && value) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm w-100">
          Open Hugging Face URL
        </a>
      );
    }

    if (type === 'API_ENDPOINT') {
      if (downloadUrl) {
        return (
          <button
            type="button"
            onClick={() => handleAssetDownload(asset)}
            className="btn btn-success btn-sm w-100 fw-bold"
          >
            Download API Endpoint Package
          </button>
        );
      }
      if (value) {
        return (
          <div>
            <div className={styles.monoBlock}>
              {isRevealed ? value : '••••••••••••••••'}
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setRevealedAssets((prev) => ({ ...prev, [asset.id]: !prev[asset.id] }))}>
                {isRevealed ? 'Hide' : 'Reveal'}
              </button>
              {isRevealed && (
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleCopyValue(value)}>
                  Copy
                </button>
              )}
            </div>
          </div>
        );
      }
    }

    if (type === 'LICENSE_KEY' && value) {
      return (
        <div>
          <div className="bg-light p-2 rounded mb-2" style={{ fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {isRevealed ? value : '••••••••••••••••'}
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setRevealedAssets((prev) => ({ ...prev, [asset.id]: !prev[asset.id] }))}>
              {isRevealed ? 'Hide' : 'Reveal'}
            </button>
            {isRevealed && (
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleCopyValue(value)}>
                Copy
              </button>
            )}
          </div>
        </div>
      );
    }

    if (value) {
      return (
        <div className={styles.monoBlock}>
          {value}
        </div>
      );
    }

    return <p className="text-muted small mb-0">No deliverable available for this asset type.</p>;
  };

  const handleAssetDownload = async (asset) => {
    const token = getAuthToken();
    if (!token || token === 'EXPIRED' || !asset.downloadUrl) return;

    try {
      const downloadPath = asset.downloadUrl.replace(/^\/api\//, '');
      const response = await API.get(downloadPath, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = `asset-${asset.id}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      dispatch(uiActions.notificationDataChanged({
        status: 'error',
        title: 'Download Failed',
        message: err.response?.data?.message || err.message || 'Failed to download asset',
      }));
      dispatch(uiActions.showNotification(true));
    }
  };

  return (
    <Container className="py-4">
      <h2 className={styles.pageTitle}>Agreement Details</h2>

      <div className={styles.___container}>
        <div className={styles.__box_main}>
          {/* Left: Model Info */}
          <div className={styles.__box_leftside}>
            <div className={styles["widget_1_con"]}>
              <RiRobot2Line className={styles.iconImg} />
              <h4 className={styles.title_}>The Model Details</h4>
            </div>
            <div className={styles["widget_11_con"]}>
              <Col xs={0} md lg className={`${styles.img_cover} d-flex flex-column align-items-left w-100`} >
                {order?.img && <img src={FILES_BASE_API_URL + order.img} alt="Model Cover" crossOrigin="anonymous" />}
                {!order?.img && <img src={imgHolder} alt="Model Cover" />}
              </Col>
            </div>
            <Row className={styles.infoCon_}>
              <Link to={`/models/view/${order?.aiModelId}`} className={styles["banner-btn"]}> VIEW MODEL </Link>
            </Row>
          </div>

          {/* Right: Technical Metadata details */}
          <div className={styles.__box_rightside}>
            <Col xs={0} md lg className={`${styles["controlCon-1"]} d-flex flex-column align-items-left w-100 gap-3 p-3`}>
              <h5 className={styles.sectionHeading}>Model Metadata</h5>
              <Row className="w-100">
                <Col md={6}>
                  <p><strong>Title:</strong> {order?.title || order?.aiModelData?.title || 'N/A'}</p>
                  <p><strong>Version:</strong> {versionLabel || order?.versionName || (order?.versionId ? `#${order.versionId}` : 'Primary Version')}</p>
                  <p><strong>Price:</strong> ${Number(order?.purchasePrice || order?.aiModelData?.price || 0).toFixed(2)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Model ID:</strong> {order?.aiModelId || 'N/A'}</p>
                  <p><strong>Order ID:</strong> {order?.id || 'N/A'}</p>
                </Col>
              </Row>
              <hr />
              <p><strong>Description:</strong> {order?.aiModelData?.desc || 'N/A'}</p>
            </Col>
          </div>
        </div>

        {/* Seller Info Block */}
        <div className={styles.__box_main}>
          <div className={styles.__box_leftside}>
            <div className={styles["widget_1_con"]}>
              <RiRobot2Line className={styles.iconImg} />
              <h4 className={styles.title_}>Seller Data</h4>
            </div>
            <div className={styles["widget_11_con"]}>
              <UserProfileStrip
                user={order?.developerData}
                variant="order-party"
                
                partyContactFallbackName="Seller"
                showViewProfileLink={Boolean(order?.developerData?.id)}
                profileLinkTo={order?.developerData?.id ? `/profile/${order.developerData.id}` : null}
                partyContactVisible={isBuyer || isAdmin}
              />
            </div>
          </div>

          {/* Combined Status & Action Board */}
          <div className={styles.__box_rightside}>
            <Col xs={0} md lg className={`${styles["controlCon-1"]} d-flex flex-column align-items-left w-100 p-3`}>
              <p className={styles.title_}>Order Status & Actions</p>
              <div className={styles.statusPanel}>
                <h3 className={getStatusClass(status)}>
                  {status}
                </h3>
                <p className="text-muted small mt-1 mb-0">Created on {new Date(order?.createdAt).toLocaleDateString()}</p>
              </div>

              {order?.dispute && (
                <div className="border rounded p-3 mt-3 bg-light">
                  <h6 className="mb-2">Dispute Details</h6>
                  <p className="mb-1"><strong>Status:</strong> {order.dispute.status}</p>
                  <p className="mb-1"><strong>Reason:</strong> {order.dispute.reason || '—'}</p>
                  <p className="mb-1"><strong>Opened:</strong> {order.dispute.createdAt ? new Date(order.dispute.createdAt).toLocaleDateString() : '—'}</p>
                  <p className="mb-1"><strong>Opened By:</strong> {partyDisplayName(order.dispute.openedBy, 'Unknown')}</p>
                  {order.dispute.resolution && (
                    <p className="mb-0"><strong>Resolution:</strong> {order.dispute.resolution}</p>
                  )}
                </div>
              )}

              {isAdmin && order?.transaction && (
                <div className="border rounded p-3 mt-3">
                  <h6 className="mb-2">Transaction Breakdown</h6>
                  <p className="mb-1"><strong>Gross:</strong> ${Number(order.transaction.grossAmount || 0).toFixed(2)} {order.transaction.currency || 'USD'}</p>
                  <p className="mb-1"><strong>Platform Fee:</strong> ${Number(order.transaction.platformFee || 0).toFixed(2)}</p>
                  <p className="mb-0"><strong>Developer Payout:</strong> ${Number(order.transaction.developerPayout || 0).toFixed(2)}</p>
                </div>
              )}

              {/* Actions Matrix */}
              <div className="d-flex flex-column gap-2 mt-2">
                {/* Buyer (Client) Actions */}
                {isBuyer && status === 'PENDING' && (
                  <>
                    <Link to={`/stripe?orderId=${order.id}`} className={`btn btn-success py-2 fw-bold text-white text-center w-100 ${styles.actionBtn}`}>
                      Proceed to Pay (${Number(order.purchasePrice).toFixed(2)})
                    </Link>
                    <button onClick={cancelOrderHandler} className={`btn btn-outline-danger py-2 w-100 ${styles.actionBtn}`}>
                      Cancel Order
                    </button>
                  </>
                )}

                {isBuyer && (status === 'PAID' || status === 'DELIVERED') && !order?.dispute && (
                  <button onClick={openDisputeHandler} className={`btn btn-warning py-2 fw-bold w-100 ${styles.actionBtn}`}>
                    Open Dispute / Request Refund
                  </button>
                )}

                {/* Developer (Seller) Actions */}
                {isSeller && status === 'PAID' && (
                  <button onClick={confirmOrdeerHandler} className={`btn btn-primary py-2 fw-bold text-white w-100 ${styles.actionBtn} ${styles.primaryActionBtn}`}>
                    Confirm Delivery
                  </button>
                )}

                {/* Shared / Admin Operations */}
                {isAdmin && (status === 'PAID' || status === 'DELIVERED') && (
                  <button onClick={refundOrderHandler} className={`btn btn-outline-danger py-2 w-100 ${styles.actionBtn}`}>
                    Refund Order
                  </button>
                )}

                {isAdmin && status === 'DISPUTED' && (
                  <button onClick={resolveDisputeHandler} className={`btn btn-danger py-2 fw-bold w-100 ${styles.actionBtn}`}>
                    Resolve Dispute
                  </button>
                )}
              </div>
            </Col>
          </div>
        </div>

        {/* Buyer Info Block */}
        <div className={styles.__box_main}>
          <div className={styles.__box_leftside}>
            <div className={styles["widget_1_con"]}>
              <RiRobot2Line className={styles.iconImg} />
              <h4 className={styles.title_}>Buyer Data</h4>
            </div>
            <div className={styles["widget_11_con"]}>
              <UserProfileStrip
                user={order?.clientData}
                variant="order-party"
                
                partyContactFallbackName="Buyer"
                showViewProfileLink={Boolean(order?.clientData?.id)}
                profileLinkTo={order?.clientData?.id ? `/profile/${order.clientData.id}` : null}
                partyContactVisible={isSeller || isAdmin}
              />
            </div>
          </div>

          {/* Secure Deliverables Panel */}
          <div className={styles.__box_rightside}>
            <Col xs={0} md lg className={`${styles["controlCon-1"]} d-flex flex-column align-items-left w-100 p-3`}>
              <p className={styles.title_}>Model Deliverables & Assets</p>

              {order?.decryptedAssets && order.decryptedAssets.length > 0 ? (
                <div className="d-flex flex-column gap-3 mt-2">
                  {order.decryptedAssets.map((asset, index) => (
                      <Card key={asset.id || index} className={styles.assetCard}>
                        <Card.Body className="p-3">
                          <h6 className={styles.assetLabel}>
                            Asset Type: {asset.type}
                          </h6>
                          {renderAssetContent(asset)}
                        </Card.Body>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className={styles.emptyDeliverables}>
                  {getDeliverablesEmptyMessage()}
                </div>
              )}
            </Col>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderBoxWidgets;
