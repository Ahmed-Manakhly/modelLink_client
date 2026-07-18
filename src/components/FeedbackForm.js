import React from "react";
import useInput from '../hooks/Use-Input';
import styles from "./FeedbackForm.module.scss";
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap'
// import {FILES_BASE_API_URL} from '../lib/api';
import UserAvatar from './ui/UserAvatar';
import { FaRegFaceAngry } from "react-icons/fa6";
import { FaRegFaceFrown } from "react-icons/fa6";
import { FaRegFaceMeh } from "react-icons/fa6";
import { FaRegFaceSmile } from "react-icons/fa6";
import { FaRegFaceLaughBeam } from "react-icons/fa6";
import { useNavigation } from 'react-router-dom';



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
          // className="font-semibold min-w-[60px] p-2"
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


const FeedbackForm = ({ formTitle, avatar, orgUsername, thisUserRole, firstName, onSubmitFeedback }) => {

  const [rating, setRating] = useState(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';


  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback(reviewText, rating)
  };


  const { hasError: descIsInvalid, valueIsValid: descIsValid, value: reviewText,
    valueChangeHandler: descChangeHandler, inputBlurHandler: descBlurHandler } = useInput(value => (value.trim() !== ''));

  const descClasses = descIsInvalid ? `${styles["form-control"]} ${styles.invalid}` : `${styles["form-control"]}`;
  let formIsValid = false
  if (descIsValid && rating) {
    formIsValid = true;
  }





  return (
    <div className={`mb-5 pb-5 w-100 ${styles.feedbackWrapper}`}>
      <div className="mb-4">
        <h2 className="page-main-title m-0">
          <span className="gradient-text">{formTitle}</span>
        </h2>
      </div>
      <div className={`glass-container py-4 mb-5 ${styles.secpro}`}>
        <form onSubmit={handleSubmit} className={`${styles["contact-col"]} w-100`} >
          <Row className={`${styles["stars-con"]} w-100`} >
            <Col className={`${styles["stars-con-2"]} d-flex flex-row`} >
              {[1, 2, 3, 4, 5].map((star) => (
                <Col
                  className={`${styles.star} ${star <= rating ? styles.starActive : ''}`}
                  key={star}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </Col>
              ))}
            </Col>
            <Col className={`${styles["stars-con-3"]}`} ><RatingLabel ratingValue={rating} /></Col>
          </Row  >

          <Row className={`${styles["feedback-con"]}`}>
            <Col className={`${styles.__box_leftside} `}>
              <div className={styles["widget_11_con"]}>
                <div className={` ${styles.imgCon} `} >
                  <UserAvatar user={{ avatar, org_username: orgUsername, role: thisUserRole }} />
                </div>
                <div className={styles.infoCon}>
                  {firstName && <h3 className={styles.title_} >{firstName?.toUpperCase()?.slice(0, 9)}</h3>}
                  {!firstName && <h3 className={styles.title_} >{orgUsername?.toUpperCase()?.slice(0, 9)}</h3>}
                  <h6 className={styles.info}>{thisUserRole ? thisUserRole : ''}</h6>
                </div>
                <div className="mt-4 w-100 d-flex justify-content-center">
                  <button disabled={!formIsValid || isSubmitting} className="btn-glass-primary px-4 py-2 fw-bold w-100" type="submit">
                    {isSubmitting ? 'submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </Col>
            <Col xs={0} md lg className={`${descClasses} d-flex flex-column`} >
              <textarea id='desc' name="desc" cols="30" rows="7" placeholder="Leave your review here..." required
                onChange={descChangeHandler} onBlur={descBlurHandler} value={reviewText} 
                className="mb-2 w-100" />
              <label htmlFor='desc' className="align-self-start mt-2">Your Feedback</label>
              {descIsInvalid && <p className={styles['error-text']}>Your Feedback Must Not Be Empty</p>}
            </Col>
          </Row>


        </form>
      </div>
    </div>
  );
};




export default FeedbackForm;
