import React from "react";
import styles from "./FeedbackList.module.scss";
import { Container, Row, Col } from 'react-bootstrap'
import { FILES_BASE_API_URL } from '../lib/api'
import { FaRegFaceAngry } from "react-icons/fa6";
import { FaRegFaceFrown } from "react-icons/fa6";
import { FaRegFaceMeh } from "react-icons/fa6";
import { FaRegFaceSmile } from "react-icons/fa6";
import { FaRegFaceLaughBeam } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";



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


const FeedbackCard = ({ userData, desc, star, createdAt }) => {
  return (
    <Row className={`${styles["contact-col"]} `} >
      <Col className={styles.__box_leftside}>
        <h6 style={{ color: '#5DB8DD' }} >{'Reviewed On '}{createdAt ? new Date(createdAt).toLocaleDateString('pt-PT') : null}</h6>
        <div className={styles["widget_11_con"]}>
          <div className={` ${styles.imgCon} `} >
            {userData?.avatar && <img src={FILES_BASE_API_URL + userData?.avatar} alt="Cover" crossOrigin="anonymous" />}
            {!userData?.avatar && <div className={styles['UserHolder']} >{userData?.org_username ? userData?.org_username[0]?.toUpperCase() : ''}</div>}
          </div>
          <div className={styles.infoCon}>

            {userData?.first_name && <h3 className={styles.title_} >{userData?.first_name?.toUpperCase()?.slice(0, 6)}</h3>}
            {!userData?.first_name && <h3 className={styles.title_} >{userData?.org_username?.toUpperCase()?.slice(0, 6)}</h3>}
            <h6 className={styles.info}>{userData?.role ? userData?.role : ''}</h6>
            <h6 className={styles.info__}><FaLocationDot style={{ color: '#5DB8DD' }} />{'From '}{userData?.country ? userData?.country : ''}</h6>
            <h6 className={styles.info__}><FaUserAlt style={{ color: '#5DB8DD' }} />{'Member since '}{userData?.createdAt ? new Date(userData?.createdAt).toLocaleDateString('pt-PT') : null}</h6>
          </div>
        </div>
        <Row className={styles.infoCon_}>
          <Link to={`/profile/${userData?.id}`} className={styles["banner-btn"]}> {'VIEW PROFILE'} </Link>
        </Row>
      </Col>
      <Col xs={0} md lg className={`${styles["form-control"]}`} >
        <Row xs={0} md lg className={`${styles["stars-con"]}`} >
          <Col className={`${styles["stars-con-2"]}`} >
            <Col className={`${styles.star}`} > <ion-icon name={`${star < 1 ? 'star-outline' : 'star'}`}></ion-icon> </Col>
            <Col className={`${styles.star}`} ><ion-icon name={`${star < 2 ? 'star-outline' : 'star'}`}></ion-icon></Col>
            <Col className={`${styles.star}`} ><ion-icon name={`${star < 3 ? 'star-outline' : 'star'}`}></ion-icon></Col>
            <Col className={`${styles.star}`} ><ion-icon name={`${star < 4 ? 'star-outline' : 'star'}`}></ion-icon></Col>
            <Col className={`${styles.star}`} ><ion-icon name={`${star < 5 ? 'star-outline' : 'star'}`}></ion-icon></Col>
          </Col>
          <Col className={`${styles["stars-con-3"]}`} ><RatingLabel ratingValue={star} /></Col>
        </Row  >
        <label htmlFor='desc'>Feedback</label>
        <p>{desc}</p>
      </Col>
    </Row>
  )
}


const FeedbackList = ({ formTitle, rev }) => {
  return (
    <Container>
      <h2 className={styles["title"]}>{formTitle}</h2>
      <Container className={`${styles.secpro}`}>
        {rev.map((ele, i) => {
          return (
            <FeedbackCard
              key={i}
              userData={ele.userData}
              star={ele.star}
              desc={ele.desc}
              createdAt={ele.createdAt}
            />
          )
        })}
      </Container>
    </Container>
  );
};




export default FeedbackList;
