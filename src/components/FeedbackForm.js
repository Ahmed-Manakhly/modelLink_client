import React from "react";
import useInput from '../hooks/Use-Input';
import styles from "./FeedbackForm.module.scss";
import { useState } from 'react' ;
import {Container , Row , Col  } from 'react-bootstrap' 
import {FILES_BASE_API_URL} from '../lib/api' 
import { FaRegFaceAngry } from "react-icons/fa6";
import { FaRegFaceFrown } from "react-icons/fa6";
import { FaRegFaceMeh } from "react-icons/fa6";
import { FaRegFaceSmile } from "react-icons/fa6";
import { FaRegFaceLaughBeam } from "react-icons/fa6";
import { useNavigation } from 'react-router-dom';



const RatingLabel = ({ ratingValue }) => {
  const ratingLabel = [
    { label: "Poor!", color: "#E74C3C" ,icon: <FaRegFaceAngry/> },
    { label: "Bad!", color: "#E59866"  , icon : <FaRegFaceFrown/>},
    { label: "Okay!", color: "#F7DC6F" , icon : <FaRegFaceMeh/>},
    { label: "Good!", color: "#76D7C4" , icon : <FaRegFaceSmile/>},
    { label: "Great!", color: "#229954" , icon : <FaRegFaceLaughBeam/>},
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


const FeedbackForm = ({formTitle , avatar,orgUsername ,thisUserRole,firstName, onSubmitFeedback}) => {

  const [rating, setRating] = useState(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting' ;


  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback(reviewText , rating)
  };
  

  const {hasError : descIsInvalid , valueIsValid : descIsValid ,value: reviewText,
    valueChangeHandler : descChangeHandler , inputBlurHandler : descBlurHandler} = useInput(value => (value.trim() !=='') );

  const descClasses = descIsInvalid? `${styles["form-control"]} ${styles.invalid}` : `${styles["form-control"]}` ;
  let formIsValid = false
  if(descIsValid && rating){
      formIsValid = true;
  }





  return (
    <Container>
      <h2 className={styles["title"]}>{formTitle}</h2>
      <Container  className={`${styles.secpro}`}>
        <form onSubmit={handleSubmit} className={`${styles["contact-col"]} `} > 
          <Row xs={0} md lg className={`${styles["stars-con"]}`} >
            <Col className={`${styles["stars-con-2"]}`} >
            {[1, 2, 3, 4, 5].map((star) => (
              <Col
              className={`${styles.star}`}
                key={star}
                onClick={() => handleRatingClick(star)}
                style={{ color: star <= rating ? '#ffc107' : '#e4e5e9', cursor: 'pointer' }}
              >
                ★
              </Col>
            ))}
            </Col>
            <Col  className={`${styles["stars-con-3"]}`} ><RatingLabel ratingValue={rating} /></Col>
          </Row  >

          <Row className={`${styles["feedback-con"]}`}>
            <Col className={`${styles.__box_leftside} `}>
              <div className={styles["widget_11_con"]}>
                <div  className={` ${styles.imgCon} `} >
                      {avatar &&<img src={FILES_BASE_API_URL+avatar} alt="Cover"  crossOrigin="anonymous"  />}
                      {!avatar &&  <div className={styles['UserHolder']} >{orgUsername?orgUsername[0]?.toUpperCase():''}</div>}
                </div>
                <div className={styles.infoCon}>
                  {firstName && <h3 className={styles.title_} >{firstName?.toUpperCase()?.slice(0, 9)}</h3>}
                  { !firstName && <h3 className={styles.title_} >{orgUsername?.toUpperCase()?.slice(0, 9)}</h3>} 
                  <h6 className={styles.info}>{thisUserRole?thisUserRole:''}</h6>
                </div>
              </div>
            </Col>
            <Col xs={0} md lg className={`${descClasses}`} >
              <label htmlFor='desc'>Your Feedback</label>
                <textarea id='desc' name="desc" cols="30" rows="7" placeholder="Leave your review here..." required
                onChange={descChangeHandler} onBlur={descBlurHandler} value={reviewText} />
                {descIsInvalid && <p className={styles['error-text']}>Your Feedback Must Not Be Empty</p>}
            </Col>
          </Row>

          <Row className={`${styles["form-actions"]} `}>
            <Col xs={0} md lg  >
              <button  disabled={!formIsValid||isSubmitting}  className={`${styles["feature-btn"]} `} type="submit">{isSubmitting?'submitting...':'Submit Review'}</button>
            </Col>
          </Row>
        </form>
      </Container>
    </Container>
  );
};




export default FeedbackForm;
