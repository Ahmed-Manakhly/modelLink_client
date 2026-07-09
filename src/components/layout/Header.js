/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import classes from './Header.module.scss' ;


function Header({txt_1,txt_2 , txt_3 , banner ,actionTo , actionTitle , action}) {
    return (
        <div className={classes["banner"]}>
            <div className={classes["container"]}>
                <div className={classes["hero-container"]}>
                    <div className={classes["banner-content"]}>
                    {txt_1 && <p className={classes["banner-subtitle"]}>{txt_1}</p>}
                    <h1 className={classes["banner-title"]}>
                        THE DIGITAL MARKETPLACE FOR <br/>
                        <span className={classes["gradientText"]}>PRODUCTION AI MODELS</span>
                    </h1>
                    <p className={classes["banner-text"]}>
                        {txt_3}
                    </p>
                    </div>
                    {banner && <div className={classes["banner-image-container"]}>
                        <img src={banner} alt="AI Mascot" className={classes["banner-img"]} />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Header