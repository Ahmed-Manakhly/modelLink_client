// eslint-disable-next-line
import React from "react";
import styles from "./OrderBoxWidgets.module.scss";
import { Link } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import {Container , Row , Col  } from 'react-bootstrap' 
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import imgHolder from '../assets/imgHolder.jpg'
import {origin} from '../lib/api' 



const OrderBoxWidgets = ( { order  , confirmOrdeerHandler}) => {


  const isBuyer = order?.clientData?.id ===  JSON.parse(localStorage.getItem('userData'))?.id ;
  const isSeller =order?.developerData?.id ===   JSON.parse(localStorage.getItem('userData'))?.id ;

  return (
    <Container>
      <h2 className={styles["title"]}>The Agreement Details..</h2>
      <div className={styles.___container}>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div className={styles["widget_1_con"]}>
                    <RiRobot2Line className={styles.iconImg} /><h4 className={styles.title_}>The Model Details</h4>
              </div>
              <div className={styles["widget_11_con"]}>
                <Col xs={0} md lg className={`${styles.img_cover} d-flex flex-column align-items-left w-100`} >
                    {order?.img &&<img src={origin+order.img} alt="Model Cover" crossOrigin="anonymous" />}
                    {!order?.img && <img src={imgHolder} alt="Model Cover" />}
                </Col>
              </div>
              <Row className={styles.infoCon_}>
              <Link to={`/models/view/${order?.aiModelId}`} className={styles["banner-btn"]}> {'VIEW MODEL'} </Link>
              </Row>
            </div>
            {/* //------------------------- */}
            <div className={styles.__box_rightside}>
                  <Col xs={0} md lg className={`  ${styles["controlCon-1"]} d-flex flex-column align-items-left w-100 gap-5 p-3`} >
                      <Row className={`d-flex justify-content-center  align-items-start gap-3 w-100  ${styles["controlCon-2"]}`}>
                        <Col className={`${styles.f_list}  gap-2 w-100`}>                
                                <Row className={`${styles.f_item}`} >
                                    {order?.aiModelData?.payPerClick&&<Col className={`${styles.f_item_title}`}>payPerClick</Col>}
                                    {!order?.aiModelData?.payPerClick&& <del className={`${styles.f_item_title_false}`}>payPerClick</del>}
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    {order?.aiModelData?.subscription&&<Col className={`${styles.f_item_title}`}>subscription</Col>}
                                    {!order?.aiModelData?.subscription&& <del className={`${styles.f_item_title_false}`}>subscription</del>}
                                </Row>
                        </Col>
                        <Col className={`${styles.f_list}  gap-2`}>               
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Model Title : ${order?.aiModelData?.title}`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Delivery Category : ${order?.aiModelData?.category}`}</Col>
                                </Row>
                        </Col>
                      </Row>
                      <Row className={`d-flex justify-content-center  align-items-start gap-3 w-100 ${styles["controlCon-2"]}`}>
                        <Col className={`${styles.f_list}  gap-2`}>                
                                  <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Price : ${order?.aiModelData?.price}`}</Col>
                                  </Row>
                                  <Row className={`${styles.f_item}`} >
                                      <Col className={`${styles.f_item_title}`}>{` Delivery Time : ${order?.aiModelData?.deliveryTime}`}</Col>
                                  </Row>
                        </Col>
                        <Col className={`${styles.f_list}  gap-2`}>                
                                  <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Indications : ${order?.aiModelData?.indications}`}</Col>
                                  </Row>
                                  <Row className={`${styles.f_item}`} >
                                      <Col className={`${styles.f_item_title}`}>{` Modality : ${order?.aiModelData?.modality}`}</Col>
                                  </Row>
                          </Col>
                      </Row>
                      <Row className="d-flex justify-content-center  align-items-start gap-3 w-100">
                        <Col className={`${styles.f_list}  gap-2`}>                
                                  <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`FDA URL : ${order?.aiModelData?.fdaUrl}`}</Col>
                                  </Row>
                                  <Row className={`${styles.f_item}`} >
                                      <Col className={`${styles.f_item_title}`}>{` Endpoint URL : ${order?.aiModelData?.endpointUrl}`}</Col>
                                  </Row>
                          </Col>
                          <Col className={`${styles.f_list}  gap-2`}>                
                                  <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Body Part : ${order?.aiModelData?.bodyPart}`}</Col>
                                  </Row>
                                  <Row className={`${styles.f_item}`} >
                                      <Col className={`${styles.f_item_title}`}>{` Description : ${order?.aiModelData?.desc}`}</Col>
                                  </Row>
                          </Col>
                      </Row>
                  </Col>
            </div>
          </div>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div className={styles["widget_1_con"]}>
                    <RiRobot2Line className={styles.iconImg} /><h4 className={styles.title_}>Seller Data</h4>
              </div>
              <div className={styles["widget_11_con"]}>
                <div  className={` ${styles.imgCon} `} >
                      {order?.developerData?.avatar &&<img src={origin+order?.developerData?.avatar} alt="Cover" crossOrigin="anonymous"  />}
                      {!order?.developerData?.avatar &&  <div className={styles['UserHolder']} >{order?.developerData?.org_username?order?.developerData?.org_username[0]?.toUpperCase():''}</div>}
                </div>
                <div className={styles.infoCon}>

                  {order?.developerData?.first_name && <h3 className={styles.title_} >{order?.developerData?.first_name?.toUpperCase()?.slice(0, 6)}</h3>}
                  { !order?.developerData?.first_name && <h3 className={styles.title_} >{order?.developerData?.org_username?.toUpperCase()?.slice(0, 6)}</h3>} 
                  <h6 className={styles.info}>{order?.developerData?.role?order?.developerData?.role:''}</h6>
                  <h6 className={styles.info__}><FaLocationDot style={{color: '#5DB8DD'}} />{'From '}{order?.developerData?.country?order?.developerData?.country:''}</h6>
                  <h6 className={styles.info__}><MdEmail style={{color: '#5DB8DD', fontSize : '17.5px'}} />{'Email Address '}{order?.developerData?.email?order?.developerData?.email:''}</h6>
                  <h6 className={styles.info__}><FaPhone style={{color: '#5DB8DD'}} />{'Contact Number '}{order?.developerData?.org_phone?order?.developerData?.org_phone:''}</h6>
                  <h6 className={styles.info__}><FaUserAlt style={{color: '#5DB8DD'}} />{'Member since '}{order?.developerData?.createdAt?new Date(order?.developerData?.createdAt).toLocaleDateString('pt-PT'):null}</h6>
                </div>
              </div>
              <Row className={styles.infoCon_}>
              <Link to={`/profile/${order?.developerData?.id}`} className={styles["banner-btn"]}> {'VIEW PROFILE'} </Link>
              </Row>
            </div>
            {/* //------------------------- */}
            <div className={styles.__box_rightside}>
                  <Col xs={0} md lg className={` ${styles["controlCon-1"]}  d-flex flex-column align-items-left w-100`} >
                      <p className={styles.title_} >Order Status</p>
                      <Row className={`d-flex justify-content-center  align-items-start gap-3 w-100  ${styles["controlCon-2"]}`}>
                        <Col className={`${styles.f_list}  gap-2`}>               
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Created At : ${order?.createdAt?new Date(order?.createdAt).toLocaleDateString('pt-PT') :''}`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Updated At : ${order?.updatedAt?new Date(order?.updatedAt).toLocaleDateString('pt-PT') :''}`}</Col>
                                </Row>
                        </Col>
                        <Col className={`${styles.f_list}  gap-2`}>                
                                <Row className={`${styles.f_item}`} style={{
                                  borderColor : `${order?.isCompleted? 'var(--ocean-green)' :'#fe89a2ce'}`
                                }}>
                                <Col className={`${styles.f_item_title}`} style={{
                                  color : `${order?.isCompleted? 'var(--ocean-green)' :'#fe89a2ce'}`
                                }} >{`Status : ${order?.isCompleted? 'pending on payment' :'Waiting for seller confirmation'}`}</Col>
                                </Row>
                        </Col>
                      </Row>
                  </Col>
              <Row>
              <label htmlFor='feature'>Seller Actions</label>
                  <Col >
                        <button  disabled={isBuyer || order?.isCompleted} onClick={confirmOrdeerHandler} className={`${styles["feature-btn"]}`}>Confirm Order</button>
                  </Col>
              </Row>
            </div>
          </div>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div className={styles["widget_1_con"]}>
                    <RiRobot2Line className={styles.iconImg} /><h4 className={styles.title_}>Buyer Data</h4>
              </div>
              <div className={styles["widget_11_con"]}>
                <div  className={` ${styles.imgCon} `} >
                      {order?.clientData?.avatar &&<img src={origin+order?.clientData?.avatar} alt="Cover"  crossOrigin="anonymous"  />}
                      {!order?.clientData?.avatar &&  <div className={styles['UserHolder']} >{order?.clientData?.org_username?order?.clientData?.org_username[0]?.toUpperCase():''}</div>}
                </div>
                <div className={styles.infoCon}>

                  {order?.clientData?.first_name && <h3 className={styles.title_} >{order?.clientData?.first_name?.toUpperCase()?.slice(0, 9)}</h3>}
                  { !order?.clientData?.first_name && <h3 className={styles.title_} >{order?.clientData?.org_username?.toUpperCase()?.slice(0, 9)}</h3>} 
                  <h6 className={styles.info}>{order?.clientData?.role?order?.clientData?.role:''}</h6>
                  <h6 className={styles.info__}><FaLocationDot style={{color: '#5DB8DD'}} />{'From '}{order?.clientData?.country?order?.clientData?.country:''}</h6>
                  <h6 className={styles.info__}><MdEmail style={{color: '#5DB8DD', fontSize : '17.5px'}} />{'Email Address '}{order?.clientData?.email?order?.clientData?.email:''}</h6>
                  <h6 className={styles.info__}><FaPhone style={{color: '#5DB8DD'}} />{'Contact Number '}{order?.clientData?.org_phone?order?.clientData?.org_phone:''}</h6>
                  <h6 className={styles.info__}><FaUserAlt style={{color: '#5DB8DD'}} />{'Member since '}{order?.clientData?.createdAt?new Date(order?.clientData?.createdAt).toLocaleDateString('pt-PT'):null}</h6>
                </div>
              </div>
              <Row className={styles.infoCon_}>
              <Link to={`/profile/${order?.clientData?.id}`} className={styles["banner-btn"]}> {'VIEW PROFILE'} </Link>
              </Row>
            </div>
            {/* //------------------------- */}
            <div className={styles.__box_rightside}>
                  <Col xs={0} md lg className={` ${styles["controlCon-1"]}  d-flex flex-column align-items-left w-100`} >
                      <p className={styles.title_} >Order Status</p>
                      <Row className={`d-flex justify-content-center  align-items-start gap-3 w-100  ${styles["controlCon-2"]}`}>
                        <Col className={`${styles.f_list}  gap-2`}>               
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Created At : ${order?.createdAt?new Date(order?.createdAt).toLocaleDateString('pt-PT') :''}`}</Col>
                                </Row>
                                <Row className={`${styles.f_item}`} >
                                    <Col className={`${styles.f_item_title}`}>{`Updated At : ${order?.updatedAt?new Date(order?.updatedAt).toLocaleDateString('pt-PT') :''}`}</Col>
                                </Row>
                        </Col>
                        <Col className={`${styles.f_list}  gap-2`}>                
                                <Row className={`${styles.f_item}`} style={{
                                  borderColor : `${order?.isCompleted? 'var(--ocean-green)' :'#fe89a2ce'}`
                                }}>
                                <Col className={`${styles.f_item_title}`} style={{
                                  color : `${order?.isCompleted? 'var(--ocean-green)' :'#fe89a2ce'}`
                                }} >{`Status : ${order?.isCompleted? 'pending on payment' :'Waiting for seller confirmation'}`}</Col>
                                </Row>
                        </Col>
                      </Row>
                  </Col>
              <Row className={`${styles.buyerActions}`}>
              <label htmlFor='feature'>Buyer Actions</label>
                  <Col >
                        <button  disabled={isSeller || (order?.isCompleted===false)||((order?.aiModelData?.payPerClick===false)&&(order?.isCompleted===true))}  className={`${styles["feature-btn_"]}`}>
                        <Link  to={'/stripe?plan=payPerClick'}>Pay Per Click</Link>
                        </button>
                  </Col>
                  <Col >
                        <button   disabled={isSeller || (order?.isCompleted===false)||((order?.aiModelData?.subscription===false)&&(order?.isCompleted===true))} className={`${styles["feature-btn_"]}`}>
                        <Link to={'/stripe?plan=subscription'}>Subscription</Link>
                        </button>
                  </Col>
              </Row>
            </div>
          </div>
      </div>
    </Container>
  );
};

export default OrderBoxWidgets;

// order?.aiModelData?.subscription

