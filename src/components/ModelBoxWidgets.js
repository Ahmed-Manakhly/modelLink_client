// eslint-disable-next-line
import React from "react";
import styles from "./ModelBoxWidgets.module.scss";
import { useNavigate ,Link } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import { Row , Col  } from 'react-bootstrap'
import { getModelMarketingFields } from '../lib/modelHelpers';
import UserProfileStrip from './UserProfileStrip';

const ModelBoxWidgets = ( { model , orderRequestHandler , isBuyer ,otherDev ,isSeller,profileNotCompleted, selectedVersionId, onVersionChange, modelCount = null}) => {
  const marketing = getModelMarketingFields(model, selectedVersionId);
  const versions = model?.versions || [];
  const hasMultipleVersions = versions.length > 1;
  const canOrder = !((!otherDev && isSeller) || (!isSeller && otherDev) || profileNotCompleted);
  const orderDisabled = canOrder && hasMultipleVersions && !selectedVersionId;
  const User = model?.developer;
  const id = model?.developerId;
  const navigate = useNavigate();
  function cancelHandler() {
  navigate('..');
  }

  return (
    <div className="my-5 w-100">

      <div className={styles.___container}>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div className={styles["widget_1_con"]}>
                    <RiRobot2Line className={styles.iconImg} style={{ color: 'var(--primary)' }} /><h3 className="gradient-text mb-0" style={{fontSize: '1.2rem', fontWeight: 600}}>This Model Created By</h3>
              </div>
              <div className={styles["widget_11_con"]}>
                <UserProfileStrip
                  user={User}
                  variant="model-developer"
                  
                  modelCount={modelCount}
                  verifiedAt={User?.verification?.verifiedAt}
                  showViewProfileLink
                  profileLinkTo={`/profile/${id}`}
                  viewProfileLabel="VIEW PROFILE"
                />
              </div>
            </div>
            {/* //------------------------- */}
            <div className={styles.__box_rightside}>
                  <Col xs={0} md lg className={` ${styles["controlCon-1"]} d-flex flex-column align-items-left w-100`} >
                      <h3 className="gradient-text" style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem'}}>Model Details & Metadata</h3>

                      <Row className={`d-flex justify-content-center  align-items-start gap-3 w-100  ${styles["controlCon-2"]} `}>
                        <Col className={`${styles.f_list}  gap-2`}>
                                <div className="global-read-only-field" style={{ minHeight: '50px', padding: '10px 15px' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '14px' }}>{`Model Price : $${Number(marketing.price || 0).toFixed(2)}`}</span>
                                </div>
                                <div className="global-read-only-field" style={{ minHeight: '50px', padding: '10px 15px' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '14px' }}>{`Delivery Time : ${marketing.deliveryTime ?? 'N/A'} days`}</span>
                                </div>
                                <div className="global-read-only-field" style={{ minHeight: '50px', padding: '10px 15px' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '14px' }}>{`Category : ${marketing.category || 'N/A'}`}</span>
                                </div>
                                <div className="global-read-only-field" style={{ minHeight: '50px', padding: '10px 15px' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--sonic-silver)', fontSize: '14px' }}>{`Last Updated : ${model?.updatedAt ? new Date(model.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}`}</span>
                                </div>
                        </Col>
                      </Row>
                      {hasMultipleVersions && canOrder && (
                        <Row className={`d-flex justify-content-center align-items-start gap-3 w-100 ${styles["controlCon-2"]} mt-2`}>
                          <Col className={`${styles.f_list} gap-2`}>
                            <label htmlFor="model-version-select" className={styles.f_item_title}>Select Version</label>
                            <select
                              id="model-version-select"
                              className="form-select form-select-sm"
                              value={selectedVersionId ?? ''}
                              onChange={(e) => onVersionChange?.(parseInt(e.target.value, 10))}
                            >
                              {versions.map((version) => (
                                <option key={version.id} value={version.id}>
                                  v{version.version} — ${Number(version.price || 0).toFixed(2)}
                                </option>
                              ))}
                            </select>
                          </Col>
                        </Row>
                      )}
                  </Col>
              <Row className="g-2">
              <Col xs={12}>
                  <label htmlFor='feature' style={{ color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>For More Information Contact the Developer</label>
              </Col>
                  <Col xs={12} sm={6}>
                        <button type="button" onClick={cancelHandler} className="btn-glass-outline w-100">Back</button>
                  </Col>
                  {canOrder && (
                  <Col xs={12} sm={6}>
                        <button disabled={orderDisabled} onClick={orderRequestHandler} className="btn-glass-primary w-100">{`${isBuyer?'I WANT TO ORDER AGAIN..':'ORDER NOW'}`}</button>
                  </Col>
                  )}
                  {profileNotCompleted &&
                    <Col xs={12}>
                        <Link  className="btn-glass-primary w-100 text-center mt-2" to={`/profileSettings`} >Complete Your profile to be able to create Orders!</Link>
                    </Col>
                  }
              </Row>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ModelBoxWidgets;
