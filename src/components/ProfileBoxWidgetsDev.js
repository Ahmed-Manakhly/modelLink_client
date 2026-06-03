import React from "react";
import styles from "./ProfileBoxWidgetsDev.module.scss";
import { RiRobot2Line } from "react-icons/ri";
import {  Row , Col  } from 'react-bootstrap' 
//================================
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import {FILES_BASE_API_URL} from '../lib/api' 

const ProfileBoxWidgetsDev = ({user}) => {
const {org_username , avatar , country , role , createdAt , first_name , org_name , last_name , org_phone , org_desc , rule_id , target_id ,module_id , org_ipAddress  , email}=user


  return (
      <div className={styles.___container}>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div className={styles["widget_1_con"]}>
                    <RiRobot2Line className={styles.iconImg} /><h4 className={styles.wel}>User Profile</h4>
              </div>
              <div className={styles["widget_11_con"]}>
                <div  className={` ${styles.imgCon} `} >
                      {avatar &&<img src={FILES_BASE_API_URL+avatar} alt="Model Cover"  crossOrigin="anonymous"  />}
                      {!avatar &&  <div className={styles['UserHolder']} >{org_username?org_username[0]?.toUpperCase():''}</div>}
                </div>
                <div className={styles.infoCon}>
                {first_name && <h3 className={styles.title_} >{first_name?.toUpperCase()?.slice(0, 9)}</h3>}
                  { !first_name && <h3 className={styles.title_} >{org_username?.toUpperCase()?.slice(0, 9)}</h3>} 
                  <h6 className={styles.info}>{role}</h6>
                  <h6 className={styles.info__}><FaLocationDot style={{color: '#5DB8DD'}} />{'From '}{country?country:''}</h6>
                  <h6 className={styles.info__}><MdEmail style={{color: '#5DB8DD', fontSize : '17.5px'}} />{'Email Address '}{email?email:''}</h6>
                  <h6 className={styles.info__}><FaPhone style={{color: '#5DB8DD'}} />{'Contact Number '}{org_phone?org_phone:''}</h6>
                  <h6 className={styles.info__}><FaUserAlt style={{color: '#5DB8DD'}} />{'Member since '}{createdAt?new Date(createdAt).toLocaleDateString('pt-PT'):null}</h6>
                </div>
              </div>
            </div>
            {/* //------------------------- */}
            <div className={styles.__box_rightside}>
                    <Row className={`justify-content-md-center d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
                            <Row >
                                <Col xs={0} md lg className={`d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='first_name'>First Name</label>
                                        <p className={styles.user} >{first_name} </p>
                                </Col>
                                <Col xs={0} md lg className={` d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='last_name'>Last Name</label>
                                        <p className={styles.user} >{last_name}</p>
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={0} md lg  className={`d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='org_name'>Organization Name</label>
                                        <p className={styles.user} >{org_name}</p>
                                </Col>
                                <Col xs={0} md lg className={`d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='org_ipAddress'>Organization IP Address</label>
                                        <p className={styles.user} >{org_ipAddress}</p>
                                </Col>
                            </Row>
                            {role === 'DEVELOPER' &&                            
                                <Row>
                                    <Col xs={0} md lg className={`d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='last_name'>rule_id</label>
                                            <p className={styles.user} >{rule_id?rule_id:''} </p>
                                    </Col>
                                    <Col xs={0} md lg className={`${styles["form-control"]} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='org_name'>target_id</label>
                                            <p className={styles.user} >{target_id?target_id:''} </p>
                                    </Col>
                                    <Col xs={0} md lg className={`${styles["form-control"]} d-flex flex-column align-items-left w-100`} >
                                        <label htmlFor='org_name'>module_id</label>
                                            <p className={styles.user} >{module_id?module_id:''} </p>
                                    </Col>
                                </Row>
                            }
                            <Row>
                                <Col xs={0} md lg  className={`d-flex flex-column align-items-left w-100`}>
                                    <label htmlFor='org_desc'>{`About ${first_name?.toUpperCase() || org_username?.toUpperCase()}`}</label>
                                        <p className={styles.user} >{org_desc} </p>
                                </Col>
                            </Row>
                        </Row>
            </div>
          </div>
      </div>
  );
};

export default ProfileBoxWidgetsDev;


