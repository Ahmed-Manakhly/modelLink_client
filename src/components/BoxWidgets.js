import React from "react";
import styles from "./BoxWidgets.module.scss";
import { Link } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import { GrRobot } from "react-icons/gr";
import { FaRegMessage } from "react-icons/fa6";
import { GoCodeReview } from "react-icons/go";
import { FiShoppingCart } from "react-icons/fi";
import { useRef} from 'react' ;
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {Row , Col  } from 'react-bootstrap' 
import { FaLocationDot } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import getStarted from '../assets/getStarted.png'
import {FILES_BASE_API_URL} from '../lib/api'

const BoxWidgets = ( {  profile=false , HandelFileChange , file , totalModels , totalOrders , msgCounter=0 , notCounter=0}) => {


  const org_username = JSON.parse(localStorage.getItem('userData'))?.org_username
  const avatar = JSON.parse(localStorage.getItem('userData'))?.avatar
  const country = JSON.parse(localStorage.getItem('userData'))?.country
  const role = JSON.parse(localStorage.getItem('userData'))?.role
  const createdAt = JSON.parse(localStorage.getItem('userData'))?.createdAt
  const first_name = JSON.parse(localStorage.getItem('userData'))?.first_name
  const imgRef = useRef(null);
  const onFileChange = (e)=>{
    HandelFileChange(e.target.files[0])
  }


const handleImgClick=()=>{
    imgRef.current.click();
}

  return (
    <section className={styles.box_container}>
      <div className={styles.___container}>
        <div className={styles.__box}>
          <div className={styles.__box_main}>
            {/* //------------------------- */}
            <div className={styles.__box_leftside}>
              <div  className={` ${styles.imgCon} ${styles['menu-title']}  `} >
                  <Col xs={0} md lg className={`${styles.img_cover} d-flex flex-column align-items-left w-100`} >
                    <input name='avatar'type="file" onChange={onFileChange} ref={imgRef} style={{display : 'none'}}/>
                    {profile &&<span>
                        <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={handleImgClick} className={styles["img_ico"]} />
                    </span>}
                  </Col>
                    {file&&<img src={URL.createObjectURL(file)} alt="avatar" />}
                    {(!file && avatar) &&<img src={FILES_BASE_API_URL+avatar} alt="Model Cover" crossOrigin="anonymous" />}
                    {(!file && !avatar) &&  <div className={styles['UserHolder']} >{org_username?org_username[0]?.toUpperCase():''}</div>}
              </div>
              {profile &&
                <Row className={styles.infoCon}>
                  {first_name && <h3 className={styles.title_}>{first_name?.toUpperCase()?.slice(0, 9)}</h3>}
                  {! first_name && <h3 className={styles.title_}>{org_username?.toUpperCase()?.slice(0, 9)}</h3>} 
                  <h6 className={styles.info}>{role?role:''}</h6>
                  <h6 className={styles.info__}><FaLocationDot style={{color: '#5DB8DD'}} />{'From '}{country?country:''}</h6>
                  <h6 className={styles.info__}><FaUserAlt style={{color: '#5DB8DD'}} />{'Member since '}{createdAt?new Date(createdAt).toLocaleDateString('pt-PT'):null}</h6>
                </Row>
              }
              {!profile &&
              <Row className={styles.infoCon}>
                {role === 'DEVELOPER' && 
                  <Link to="/models/new" className={styles["banner-btn"]}> {'Create Model'} </Link>
                }
              </Row>
              }
            </div>
            {/* //------------------------- */}
            <div className={styles.__box_rightside}>
              <div className={styles["widgets_container"]}>
                <div className={styles["widget_1_con"]}>
                  <RiRobot2Line className={styles.iconImg} /><h4 className={styles.wel}>Welcome back !</h4>
                </div>
                { !profile && <>
                  <div className={styles["widget_2_con"]}>
                    {role === 'DEVELOPER' && <div className={styles["widget_1"]}>
                      <h1>Total Models</h1>
                      <GrRobot className={styles.iconImg} />
                      <span>{totalModels}</span>
                    </div>}
                    <div className={styles["widget_2"]}>
                    <h1>Total Orders</h1>
                      <FiShoppingCart className={styles.iconImg} />
                      <span>{totalOrders}</span>
                    </div>
                  </div>
                  <div className={styles["widget_3_con"]}>
                    <div className={styles["widget_1"]}>
                    <h1>Unread Messages</h1>
                      <FaRegMessage className={styles.iconImg} />
                      <span>{msgCounter}</span>
                    </div>
                    <div className={styles["widget_2"]}>
                    <h1>Notifications</h1>
                      <GoCodeReview className={styles.iconImg} />
                      <span>{notCounter}</span>
                    </div>
                  </div>
                </>}
                {profile &&
                  <div className={styles["widget_2_con"]}>
                    <div className={styles["widget_1"]}>
                      <h1>{`Make sure to complete Your profile to be able to create ${role === 'DEVELOPER'?'Models':'Orders'}!`}</h1>
                      <img src={getStarted} alt="getStarted"  className={styles["get_start"]}/>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxWidgets;
