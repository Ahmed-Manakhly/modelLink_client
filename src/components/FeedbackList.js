import React from "react";
import styles from "./FeedbackList.module.scss";
import { Row, Col } from 'react-bootstrap';
import UserProfileStrip from './UserProfileStrip';
import { FaRegFaceAngry, FaRegFaceFrown, FaRegFaceMeh, FaRegFaceSmile, FaRegFaceLaughBeam } from "react-icons/fa6";

const RatingLabel = ({ ratingValue }) => {
  const ratingLabel = [
    { label: "Poor!", color: "#E74C3C", icon: <FaRegFaceAngry /> },
    { label: "Bad!", color: "#E59866", icon: <FaRegFaceFrown /> },
    { label: "Okay!", color: "#F7DC6F", icon: <FaRegFaceMeh /> },
    { label: "Good!", color: "#76D7C4", icon: <FaRegFaceSmile /> },
    { label: "Great!", color: "#229954", icon: <FaRegFaceLaughBeam /> },
  ];
  return (
    <>
      {ratingValue > 0 ? (
        <div
          className={`${styles.RatingLabel}`}
          style={{ color: ratingLabel[ratingValue - 1]?.color }}>
          {ratingLabel[ratingValue - 1]?.label}
          {' '}
          {ratingLabel[ratingValue - 1]?.icon}
        </div>
      ) : (
        <p >No ratings yet...</p>
      )}
    </>
  );
};

const FeedbackCard = ({ userData, desc, star, createdAt, versionLabel, profileId }) => {
  const profileLink = profileId || userData?.id;

  return (
    <div className={`glass-container py-4 w-100 ${styles.secpro}`}>
      <div className={`${styles["contact-col"]} w-100 m-0`}>

        
        <Row className={`${styles["feedback-con"]} w-100 m-0 mt-4`}>
          <Col md={4} lg={3} className={`${styles.__box_leftside} p-0`}>
            <div className="mb-3 w-100 d-flex flex-column align-items-center text-center">
              <h6 className={styles.reviewedOn}>
                {'Reviewed On '}{createdAt ? new Date(createdAt).toLocaleDateString('pt-PT') : ''}
              </h6>
              {versionLabel && (
                <p className={styles.versionLabel}>
                  Review for v{versionLabel}
                </p>
              )}
            </div>
            <UserProfileStrip
              user={userData}
              variant="order-party"
              showViewProfileLink={true}
              profileLinkTo={profileLink ? `/profile/${profileLink}` : null}
              partyContactVisible={true}
              minimal={true}
            />
          </Col>
          <Col md={8} lg={9} className={`${styles["form-control"]} d-flex flex-column justify-content-between h-100`} >
            <div className="d-flex flex-column w-100 h-100">
              <label className="align-self-start mb-2">Feedback</label>
              <div className={styles.userReadOnly}>
                {desc}
              </div>
            </div>
            
            <Row className={`${styles["stars-con"]} w-100 m-0 mt-4`} >
              <Col className={`${styles["stars-con-2"]} d-flex flex-row p-0`} >
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <div
                    className={`${styles.star} ${starIdx <= star ? styles.starActive : ''}`}
                    key={starIdx}
                  >
                    ★
                  </div>
                ))}
              </Col>
              <Col className={`${styles["stars-con-3"]} p-0`} ><RatingLabel ratingValue={star} /></Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const FeedbackList = ({ formTitle, rev, versionMap = {} }) => {
  return (
    <div className={`mb-5 pb-5 w-100 ${styles.feedbackWrapper}`}>
      <div className="mb-5">
        <h2 className="page-main-title m-0">
          <span className="gradient-text">{formTitle}</span>
        </h2>
      </div>
      <div className="d-flex flex-column w-100 gap-4">
        {rev.map((ele, i) => (
          <FeedbackCard
            key={i}
            userData={ele.userData}
            star={ele.star}
            desc={ele.desc}
            createdAt={ele.createdAt}
            versionLabel={ele.versionId ? versionMap[ele.versionId] : null}
            profileId={ele.clientId}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
