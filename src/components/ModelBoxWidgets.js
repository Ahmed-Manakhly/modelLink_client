// eslint-disable-next-line
import React from "react";
import styles from "./ModelBoxWidgets.module.scss";
import { useNavigate ,Link } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import {Container , Row , Col  } from 'react-bootstrap' 
import { FaLocationDot } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import {origin} from '../lib/api' 

const ModelBoxWidgets = ( { model , orderRequestHandler , isBuyer ,otherDev ,isSeller,profileNotCompleted}) => {

  const org_username = model?.userData?.org_username
  const avatar = model?.userData?.avatar
  const country = model?.userData?.country
  const role = model?.userData?.role
  const createdAt = model?.userData?.createdAt
  const id = model?.userId;
  const first_name = model?.userData?.first_name;
  const navigate = useNavigate();
  function cancelHandler() {
  navigate('..');
  }

  return (
    <Container>

      <div className={styles.___container}>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div className={styles["widget_1_con"]}>
                    <RiRobot2Line className={styles.iconImg} /><h4 className={styles.title_}>This Model Created By</h4>
              </div>
              <div className={styles["widget_11_con"]}>
                <div  className={` ${styles.imgCon} `} >
                      {avatar &&<img src={origin+avatar} alt="Cover"  crossOrigin="anonymous"  />}
                      {!avatar &&  <div className={styles['UserHolder']} >{org_username?org_username[0]?.toUpperCase():''}</div>}
                </div>
                <div className={styles.infoCon}>

                  {first_name && <h3 className={styles.title_} >{first_name?.toUpperCase()?.slice(0, 9)}</h3>}
                  { !first_name && <h3 className={styles.title_} >{org_username?.toUpperCase()?.slice(0, 9)}</h3>} 
                  <h6 className={styles.info}>{role?role:''}</h6>
                  <h6 className={styles.info__}><FaLocationDot style={{color: '#5DB8DD'}} />{'From '}{country?country:''}</h6>
                  <h6 className={styles.info__}><FaUserAlt style={{color: '#5DB8DD'}} />{'Member since '}{createdAt?new Date(createdAt).toLocaleDateString('pt-PT'):null}</h6>
                </div>
              </div>
              <Row className={styles.infoCon_}>
                <Link to={`/profile/${id}`} className={styles["banner-btn"]}> {'VIEW PROFILE'} </Link>
              </Row>
            </div>
            {/* //------------------------- */}
            <div className={styles.__box_rightside}>
                  <Col xs={0} md lg className={` ${styles["controlCon-1"]} d-flex flex-column align-items-left w-100`} >
                      <p className={styles.title_} >available plans for this model</p>

                      <Row className={`d-flex justify-content-center  align-items-start gap-3 w-100  ${styles["controlCon-2"]} `}>
                        <Col className={`${styles.f_list}  gap-2 w-100`}>                
                                <Row className={`${styles.f_item}`} >
                                    {model?.payPerClick&&<Col className={`${styles.f_item_title}`}>payPerClick</Col>}
                                    {!model?.payPerClick&& <del className={`${styles.f_item_title_false}`}>payPerClick</del>}
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    {model?.subscription&&<Col className={`${styles.f_item_title}`}>subscription</Col>}
                                    {!model?.subscription&& <del className={`${styles.f_item_title_false}`}>subscription</del>}
                                </Row>
                        </Col>
                        <Col className={`${styles.f_list}  gap-2`}>               
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Model Price : ${model?.price}`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Delivery Time : ${model?.deliveryTime}`}</Col>
                                </Row>
                        </Col>
                        <Col className={`${styles.f_list}  gap-2`}>                
                                <Row className={`${styles.f_item}`} >
                                  <Col className={`${styles.f_item_title}`}>{`Indications : ${model?.indications}`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{` Modality : ${model?.modality}`}</Col>
                                </Row>
                        </Col>
                      </Row>
                  </Col>
              <Row>
              <label htmlFor='feature'>For More Information Contact the Developer</label>
                  <Col>
                        <button type="button" onClick={cancelHandler} className={`${styles["cancel-btn"]} `}>Back</button>
                  </Col>
                  {!((!otherDev&&isSeller) || (!isSeller&&otherDev) || profileNotCompleted) &&  (
                  <Col >
                        <button  disabled={false} onClick={orderRequestHandler} className={`${styles["feature-btn"]}`}>{`${isBuyer?'I WANT TO ORDER AGAIN..':'ORDER NOW'}`}</button>
                  </Col>
                  )                 
                  }
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


