import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import img from '../assets/ai-face.png';
import classes from './Contact.module.scss';
import { vals } from '../constants/marketingData';
import Val from '../components/Val';
import { getAuthToken } from '../utility/tokenLoader';
import { submitContactReq } from '../lib/supportRequests';
import { uiActions } from '../store/UI-slice';
import GlobalWrapper from '../components/layout/GlobalWrapper';

function Contact() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData) || {};
    const token = getAuthToken();

    const [form, setForm] = useState({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            firstName: prev.firstName || userData.first_name || '',
            lastName: prev.lastName || userData.last_name || '',
            email: prev.email || userData.email || '',
        }));
    }, [userData.first_name, userData.last_name, userData.email]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            await submitContactReq(form, token);
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Message sent',
                message: 'Thanks for reaching out. We received your message and will reply soon.',
            }));
            dispatch(uiActions.showNotification(true));
            setForm({
                firstName: userData.first_name || '',
                lastName: userData.last_name || '',
                email: userData.email || '',
                message: '',
            });
        } catch (error) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Could not send message',
                message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <GlobalWrapper className="global-banner-spacing">
                <div className={classes['contact__container']}>
                    <aside className={classes['contact__aside']}>
                        <div className={classes.secCon}>
                            <div className={classes['aside__image']}>
                                <img src={img} alt="contact us" />
                            </div>
                            <h2>Contact Us</h2>
                            <p>learn more about us and awesome services we can provide.</p>
                            <ul className={classes['contact__details']}>
                                <li>
                                    <i className={` ${classes['uil-phone-times']} ${classes['uil']}`}></i>
                                    <h5>+201015000008</h5>
                                </li>
                                <li>
                                    <i className={`${classes['uil-envelope']} ${classes['uil']}`}></i>
                                    <h5>Support@modellink.com</h5>
                                </li>
                                <li>
                                    <i className={`${classes['uil-map-marker']} ${classes['uil']}`}></i>
                                    <h5>Egypt /USA</h5>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    <form onSubmit={handleSubmit}>
                        <div className={classes['form__name']}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={form.firstName}
                                onChange={handleChange('firstName')}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={form.lastName}
                                onChange={handleChange('lastName')}
                                required
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email Address"
                            value={form.email}
                            onChange={handleChange('email')}
                            required
                        />
                        <textarea
                            name="message"
                            cols="30"
                            rows="7"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange('message')}
                            required
                            minLength={10}
                        />
                        <button
                            type="submit"
                            className={classes['banner-btn']}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending…' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </GlobalWrapper>
            <Val products={vals} title={'A growing collection of production-ready AI models at your fingertips'} />
        </>
    );
}

export default Contact;
