import classes from './About.module.scss' ;
import img from "../assets/Content team.svg" ;
import img_1 from "../assets/team_placeholder.svg" ;
import img_2 from "../assets/team_placeholder.svg" ;
import img_3 from "../assets/team_placeholder.svg" ;
import img_4 from "../assets/team_placeholder.svg" ;
import img_5 from "../assets/team_placeholder.svg" ;
import img_6 from "../assets/team_placeholder.svg" ;
import img_7 from "../assets/team_placeholder.svg" ;
import img_8 from "../assets/team_placeholder.svg" ;
import {Link} from 'react-router-dom' ;
import GlobalWrapper from '../components/layout/GlobalWrapper';
import { FiTarget, FiLayers, FiGlobe } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Val from '../components/Val';
import { vals } from '../constants/marketingData';
import marketingJoinUsImg from '../assets/robot-mascot.png';

//----------------------------------------
function About() {
    return (
        <>
            <GlobalWrapper className="global-banner-spacing global-page-margin-top">
            <section className={classes["about__achievment"]}>
            <div className={classes["achievment__container"]}>
                    <div className={classes["achievment__left"]}>
                        <img src={img} alt=""/>
                    </div>
                    <div className={classes["achievment__right"]}>
                <h1 className="page-main-title" style={{marginBottom: '20px', textAlign: 'left'}}>
                    <span className="gradient-text">Achievements 🏆</span>
                    <span className="sub-title">Let's not waste any time and take a close look at our awesome engineering team, so we can give you a detailed overview of their capabilities. ✨</span>
                </h1>
                <div className={classes["achievment__cards"]}>
                <article className={classes["achievment__card"]}>
                    <span className={classes["achievment__icon"]}><FiTarget /></span>
                    <h3>45+</h3>
                    <p>AI model, used in a huge projects</p>
                </article>

                <article className={classes["achievment__card"]}>
                    <span className={classes["achievment__icon"]}><FiLayers /></span>
                    <h3>190+</h3>
                    <p>CRM/WEB application</p>
                </article>

                <article className={classes["achievment__card"]}>
                    <span className={classes["achievment__icon"]}><FiGlobe /></span>
                    <h3>98</h3>
                    <p>Happy customer around the world</p>
                </article>
                </div>
            </div>
            </div>
            </section>
            </GlobalWrapper>
            <GlobalWrapper className="global-section-spacing">
            <section className={classes["team"]}>
                <h2 className="page-main-title" style={{textAlign: 'center', marginBottom: '40px'}}>
                    <span className="gradient-text">Meet Our Team 🤝</span>
                </h2>
                <div className={classes["team__container"]}>

                    <article className={classes["team__mem"]}>
                        <div className={classes["team__mem__img"]}>
                            <img src={img_1} alt="team_work"/>
                        </div>
                        <div className={classes["team__mem__info"]}>
                            <h4>John Doe</h4>
                            <p>CEO</p>
                        </div>
                        <div className={classes["team__mem__social"]}>
                            <Link to="/" className={classes["team__social__link"]}>
                                <ion-icon name="logo-facebook"></ion-icon>
                            </Link>
                            <Link to="/" className={classes["team__social__link"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                                </svg>
                            </Link>
                            <Link to="/" className={classes["team__social__link"]}>
                                <ion-icon name="logo-instagram"></ion-icon>
                            </Link>
                            <Link to="/" className={classes["team__social__link"]}>
                                <ion-icon name="logo-linkedin"></ion-icon>
                            </Link>
                        </div>
                    </article>
            <article className={classes["team__mem"]}>
                <div className={classes["team__mem__img"]}>
                    <img src={img_2} alt="team_work"/>
                </div>
                <div className={classes["team__mem__info"]}>
                    <h4>Jane Smith</h4>
                    <p>AI Developer</p>
                </div>
                <div className={classes["team__mem__social"]}>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                </div>
            </article>
            <article className={classes["team__mem"]}>
                <div className={classes["team__mem__img"]}>
                    <img src={img_3} alt="team_work"/>
                </div>
                <div className={classes["team__mem__info"]}>
                    <h4>Michael Brown</h4>
                    <p>Backend Developer</p>
                </div>
                <div className={classes["team__mem__social"]}>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                </div>
            </article>

            <article className={classes["team__mem"]}>
                <div className={classes["team__mem__img"]}>
                    <img src={img_4} alt="team_work"/>
                </div>
                <div className={classes["team__mem__info"]}>
                    <h4>Emily Davis</h4>
                    <p>Software Engineer</p>
                </div>
                <div className={classes["team__mem__social"]}>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                </div>
            </article>

            <article className={classes["team__mem"]}>
                <div className={classes["team__mem__img"]}>
                    <img src={img_5} alt="team_work"/>
                </div>
                <div className={classes["team__mem__info"]}>
                    <h4>Chris Wilson</h4>
                    <p>Operation Manager</p>
                </div>
                <div className={classes["team__mem__social"]}>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                </div>
            </article>

            <article className={classes["team__mem"]}>
                <div className={classes["team__mem__img"]}>
                    <img src={img_6} alt="team_work"/>
                </div>
                <div className={classes["team__mem__info"]}>
                    <h4>Sarah Taylor</h4>
                    <p>Frontend Developer</p>
                </div>
                <div className={classes["team__mem__social"]}>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                </div>
            </article>

            <article className={classes["team__mem"]}>
                <div className={classes["team__mem__img"]}>
                    <img src={img_7} alt="team_work"/>
                </div>
                <div className={classes["team__mem__info"]}>
                    <h4>David Miller</h4>
                    <p>team leader</p>
                </div>
                <div className={classes["team__mem__social"]}>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                </div>
            </article>

            <article className={classes["team__mem"]}>
                <div className={classes["team__mem__img"]}>
                    <img src={img_8} alt="team_work"/>
                </div>
                <div className={classes["team__mem__info" ]}>
                    <h4>Jessica Anderson</h4>
                    <p>Account Manager</p>
                </div>
                <div className={classes["team__mem__social"]}>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-instagram"></ion-icon>
                    </Link>
                    <Link to="/" className={classes["team__social__link"]}>
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </Link>
                </div>
            </article>
        </div>
    </section>
    </GlobalWrapper>

    <Header
        title_1={'Join the'}
        title_2={'Ecosystem'}
        txt_1={''}
        txt_3={"Access a growing repository of specialized AI models tested for performance and security. Distribute your AI creations to a global audience with seamless integration and licensing."}
        banner={marketingJoinUsImg}
        action={true}
        actionTo={'/auth?mode=signup'}
        actionTitle={'Get Started Now'}
        reverse={true}
    />
    
    <Val products={vals} title={'Why Choose ModelLink?'} />
</>
    )
}

export default About






