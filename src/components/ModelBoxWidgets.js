// eslint-disable-next-line
import React from "react";
import styles from "./ModelBoxWidgets.module.scss";
import { useNavigate ,Link } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import {Container , Row , Col  } from 'react-bootstrap'
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
    <Container className="my-5">

      <div className={styles.___container}>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div className={styles["widget_1_con"]}>
                    <RiRobot2Line className={styles.iconImg} /><h3 className="title_2 mb-0">This Model Created By</h3>
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
                      <h3 className="title_2" >Model Details & Metadata</h3>

                      <Row className={`d-flex justify-content-center  align-items-start gap-3 w-100  ${styles["controlCon-2"]} `}>
                        <Col className={`${styles.f_list}  gap-2`}>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Model Price : $${Number(marketing.price || 0).toFixed(2)}`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Delivery Time : ${marketing.deliveryTime ?? 'N/A'} days`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Category : ${marketing.category || 'N/A'}`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Last Updated : ${model?.updatedAt ? new Date(model.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}`}</Col>
                                </Row>
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
              <Row>
              <label htmlFor='feature'>For More Information Contact the Developer</label>
                  <Col>
                        <button type="button" onClick={cancelHandler} className={`${styles["cancel-btn"]} `}>Back</button>
                  </Col>
                  {canOrder && (
                  <Col >
                        <button disabled={orderDisabled} onClick={orderRequestHandler} className={`${styles["feature-btn"]}`}>{`${isBuyer?'I WANT TO ORDER AGAIN..':'ORDER NOW'}`}</button>
                  </Col>
                  )}
                  {profileNotCompleted &&
                    <Link  className={styles["banner-btn"]} to={`/profileSettings`} >Complete Your profile to be able to create Orders!</Link>
                  }
              </Row>
            </div>
          </div>
      </div>
    </Container>
  );
};

export default ModelBoxWidgets;
