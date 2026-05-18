import img from '../assets/Speech to text.svg'
import classes from './Contact.module.scss'
import {vals} from '../data' ;
import Val from '../components/Val'

function Contact() {
    return (
        <>
        <div className={classes["container"]}>
        <div className={`  ${classes['contact__container']}`}>
            <aside className={classes["contact__aside"]}>
                <div className={classes.secCon}>
                    <div className={classes["aside__image"]}>
                        <img src={img} alt="contact us" />
                    </div>
                    <h2>Contact Us</h2>
                    <p>learn more about us and awesome services we can provide.</p>
                    <ul className={classes["contact__details"]}>
                        <li>
                            <i className={` ${classes["uil-phone-times"]} ${classes['uil']}`}></i>
                            <h5>+201015000008</h5>
                        </li>
                        <li>
                            <i className={`${classes["uil-envelope"]} ${classes['uil']}`}></i>
                            <h5>Support@Aiexchange.com</h5>
                        </li>
                        <li>
                            <i className={`${classes["uil-map-marker"]} ${classes['uil']}`}></i>
                            <h5>Egypt /USA</h5>
                        </li>
                    </ul>
                </div>
            </aside>

            <form >
                <div className={classes["form__name"]}>
                    <input type="text" name="First Name" placeholder="First Name" required />
                    <input type="text" name="Last Name" placeholder="Last Name" required />
                </div>
                <input type="email" name="Email Address" placeholder="Your Email Address" required />
                <textarea name="Message" id="" cols="30" rows="7" placeholder="Your Message" required></textarea>
                <button type="submit" className={classes["banner-btn"]}>Send Message</button>
            </form>
        </div>
    </div>
    <Val products={vals} title={'A huge collection of medical AI solutions at your fingertips'} />
    </>
    )
}

export default Contact
