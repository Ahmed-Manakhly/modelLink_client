import { Form, Link } from 'react-router-dom';
import classes from '../components/layout/auth/Auth.module.scss';
import { Row, Col } from 'react-bootstrap';
import ChangePassword from '../components/layout/auth/ChangePassword';
import aiFace from '../assets/ai-face.png';

function AuthCard({ title }) {
    return (
        <div className={classes.card}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className={`${classes.title} page-main-title`}>
                    <span className="gradient-text">{title}</span>
                </h1>
            </div>
        </div>
    );
}

function ChangePasswordPage() {
    return (
        <main style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <Row md={2} xs={1} lg={3} className={` justify-content-center w-100 ${classes.mainRow}`} style={{ maxWidth: '1200px' }}>
                <Col className={`${classes['contact-col']} ${classes['contact-col2']} d-flex flex-column `}>
                    <Row className=' d-flex flex-column '>
                        <div className="brand-logo-text" style={{ marginBottom: '20px' }}>
                            Model<span>Link</span>
                        </div>
                        <Row>
                            <h2 className="page-main-title" style={{marginBottom: '0'}}>
                                <span className="gradient-text">Secure your account 🔒</span>
                                <span className="sub-title">Keep your password safe and updated with the latest security standards. 🛡️</span>
                            </h2>
                        </Row>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <img src={aiFace} alt="AI Face" style={{ width: '400px', height: '220px', filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.2))', transform: 'translateX(-70px)' }} />
                    </div>
                    <ul className={classes["header-social-container"]}>
                        <li>
                            <Link to="/" className={classes["social-link"]}>
                                <ion-icon name="logo-facebook"></ion-icon>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className={classes["social-link"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className={classes["social-link"]}>
                                <ion-icon name="logo-instagram"></ion-icon>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className={classes["social-link"]}>
                                <ion-icon name="logo-linkedin"></ion-icon>
                            </Link>
                        </li>
                    </ul>
                </Col>

                <Col className={`${classes["contact-col"]} flex-fill`}>
                    <AuthCard title="Change Password" />
                    <Form method="post" className={classes.container__3}>
                        <ChangePassword />
                    </Form>
                    <div className={classes.container__2}>
                        <div className={classes.actions}>
                            <Row className={classes.actionsBox}>
                                <Link to={`/`}>Back to Home</Link>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </main>
    );
}

export default ChangePasswordPage;
