import classes from './About.module.scss' ;
import img from "../assets/Content team.svg" ;
import img_1 from "../assets/userHolder.jpg" ;
import img_2 from "../assets/userHolder.jpg" ;
import img_3 from "../assets/userHolder.jpg" ;
import img_4 from "../assets/userHolder.jpg" ;
import img_5 from "../assets/userHolder.jpg" ;
import img_6 from "../assets/userHolder.jpg" ;
import img_7 from "../assets/userHolder.jpg" ;
import img_8 from "../assets/userHolder.jpg" ;
import {Link} from 'react-router-dom' ;
import GlobalWrapper from '../components/layout/GlobalWrapper';
import { FiTarget, FiLayers, FiGlobe } from 'react-icons/fi';
// import img_9 from "../assets/tm9.jpg" ;
// import img_10 from "../assets/tm10.jpg" ;

//----------------------------------------
function About() {
    return (
        <>
            <GlobalWrapper className="global-banner-spacing">
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
            <section className={classes["team"]}>
                <h2 className="page-main-title" style={{textAlign: 'center', marginBottom: '40px'}}>
                    <span className="gradient-text">Meet Our Team 🤝</span>
                </h2>
                <div className={` ${classes["team__container"]} ${classes['container']}`}>

                    <article className={classes["team__mem"]}>
                        <div className={classes["team__mem__img"]}>
                            <img src={img_1} alt="team_work"/>
                        </div>
                        <div className={classes["team__mem__info"]}>
                            <h4>John Doe</h4>
                            <p>CEO</p>
                        </div>
                        <div className={classes["team__mem__social"]}>
                            <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                            <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                            <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
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
                    <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                    <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                    <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
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
                    <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                    <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                    <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
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
                    <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                    <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                    <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
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
                    <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                    <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                    <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
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
                    <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                    <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                    <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
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
                    <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                    <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                    <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
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
                    <Link to="/https://instagram.com" ><ion-icon name="logo-instagram"></ion-icon></Link>
                    <Link to="/https://facebook.com" ><ion-icon name="logo-facebook"></ion-icon></Link>
                    <Link to="/https://twitter.com" ><ion-icon name="logo-twitter"></ion-icon></Link>
                </div>
            </article>
        </div>
    </section>
</>
    )
}

export default About






