import {Link} from 'react-router-dom'
import classes from './Section.module.scss' ;


function Section() {
    return (
        <section className={classes["container"]} >
            <div className={classes['teamwork']}>
                <h1>The best part? Everything.</h1>
                <div className={classes["teamwork-container"]}>
                    <div className={classes["container-left"]}>
                        <h3 >stick to your budget</h3>
                        <p>Find the right service for every price point. No hourly rates, just project-based pricing.</p>
                        <h3>get quality work done quickly</h3>
                        <p>Hand your project over to a talented freelancer in minutes, get long-lasting results.</p>
                        <h3>pay when you{'\'re'} happy</h3>
                        <p>Upfront quotes mean no surprises. Payments only get released when you approve.</p>
                        <h3>count on 24/7 support</h3>
                        <p> Our round-the-clock support team is available to help anytime, anywhere.</p>
                        <Link to={"/products"} className={classes["banner-btn"]} > {"Learn More"}</Link>
                    </div>
                    <div className={classes["container-right"]}>
                        <img src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=720&h=750&dpr=2" alt="sec-image" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Section