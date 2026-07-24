import { Link } from "react-router-dom";
import classes from './Header.module.scss';

import GlobalWrapper from './GlobalWrapper';

function Header({ txt_1, txt_2, txt_3, banner, actionTo, actionTitle, action, title_1, title_2, reverse, className = '' }) {
    return (
        <GlobalWrapper className={`global-banner-spacing ${className}`}>
            <div className={`${classes["hero-container"]} ${reverse ? classes.reverse : ''}`}>
                <div className={classes["banner-content"]}>
                    {txt_1 && <p className={classes["banner-subtitle"]}>{txt_1}</p>}
                    <h1 className={classes["banner-title"]}>
                        {title_1 ? title_1 : "THE DIGITAL MARKETPLACE FOR"} <br />
                        <span className={classes["gradientText"]}>{title_2 ? title_2 : "PRODUCTION AI MODELS"}</span>
                    </h1>
                    <p className={classes["banner-text"]}>
                        {txt_3}
                    </p>
                    {action && (
                        <Link to={actionTo} className="btn-glass-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                            {actionTitle}
                        </Link>
                    )}
                </div>
                {banner && <div className={classes["banner-image-container"]}>
                    <img src={banner} alt="AI Mascot" className={`${classes["banner-img"]} global-rounded`} />
                </div>}
            </div>
        </GlobalWrapper>
    )
}

export default Header