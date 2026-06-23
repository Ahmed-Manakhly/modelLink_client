/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import classes from './Header.module.scss' ;


function Header({txt_1,txt_2 , txt_3 , banner ,actionTo , actionTitle , action}) {
    return (
        <div className={classes["banner"]}>
            <div className={classes["container"]}>
                <div className={classes["slider-container has-scrollbar"]}>
                <div className={classes["slider-item"]}>
                    <img src={banner} alt="banner-img" className={classes["banner-img"]} />
                    <div className={classes["banner-content"]}>
                    <p className={classes["banner-subtitle"]}>{txt_1}</p>
                    <h2  className={classes["banner-title"]}>{txt_2}</h2>
                    <p className={classes["banner-text"]}>
                        {txt_3}
                    </p>
                    {action &&
                        <Link to={actionTo} className={classes["banner-btn_"]} >{actionTitle}</Link>
                    }
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Header