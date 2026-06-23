import React from "react";
import styles from "./box.module.scss";
import { Link } from "react-router-dom";
// import { AiFillSafetyCertificate } from "react-icons/ai";
import { RiRobot2Line } from "react-icons/ri";

const Box = ({title,img,text_1,text_2,actionTo ,title_2,content_1,title_3,content_2,closure, actionTitle , action}) => {
  return (
    <section className={styles.box_container}>
      <div className={styles.___container}>
        <div className={styles.__box}>
          <div className={styles.container}>
            <div className={styles.__box_rightside}>
              <Link to={'/'} className={styles._headding}>
              <RiRobot2Line className={styles.iconImg} />
              {title}
              </Link>
              <strong className={styles.__strong}>
              {text_1}
              </strong>
              <br />
              <strong className={styles.__strong}>
              {text_2}
              </strong>
              <h1 className={styles._headding2}>
              {title_2}
              </h1>
              <p className={styles.__content}>
                {content_1}
              </p>
              <h1 className={styles._headding2}>
              {title_3}
              </h1>
              <p className={styles.__content}>
                {content_2}
              </p>
              <strong className={styles.__strong}>
              {closure}
              </strong>
              {action &&
                <Link to={actionTo} className={styles["banner-btn_"]} >{actionTitle}</Link>
              }
            </div>
            <div className={styles.__box_leftside}>
              <div className={styles.__box_image}>
                <img src={img} alt={title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Box;
