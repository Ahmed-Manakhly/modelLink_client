import Modal from '../Modal'
import { Form, Link, useSearchParams, useNavigate } from 'react-router-dom';
import classes from './Auth.module.scss';
import LoginForm from './LoginForm';
import SignupFormStep1 from './SignupFormStep1';
import SignupFormStep2 from './SignupFormStep2';
import AccountRoleForm from './AccountRoleForm';
import ForgotPassword from './ForgotPassword';
// import logo from '../../../assets/robot-mascot.png'
import aiFace from '../../../assets/ai-face.png'
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap'

//-----------------------------------------

function AuthCard({ title }) {
    return (
        <div className={classes.card}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className={`${classes.title} page-main-title`}>
                    <span className="gradient-text">{title}</span>
                </h1>
            </div>
        </div>
    )
}


const Auth = () => {
    const navigate = useNavigate();
    const onClose = () => {
        navigate('/')
    }
    let innerWidth, stepNumber
    // const data = useActionData() ;
    const [SearchParams] = useSearchParams();
    const isLogin = SearchParams.get('mode') === 'login';
    const isSignup = SearchParams.get('mode') === 'signup';
    const isForgotPassword = SearchParams.get('mode') === 'forgotPassword';
    const roleClient = SearchParams.get('role') === 'client';
    const roleDev = SearchParams.get('role') === 'developer';
    const step_1 = SearchParams.get('step') === '1';
    const step_2 = SearchParams.get('step') === '2';
    const [stepData, setStepData] = useState({});
    const onStepData = (data) => {
        setStepData(data)
    }
    innerWidth = isSignup ? ((100 / 3) * 1) + '%' : step_1 ? ((100 / 3) * 2) + '%' : step_2 ? ((100 / 3) * 3) + '%' : null;
    stepNumber = isSignup ? 1 : step_1 ? 2 : step_2 ? 3 : null;
    //-------------------------------------------------------------------
    return (
        <Modal onClose={onClose} >
            <Row md={2} xs={1} lg={3} className={` justify-content-center w-100 ${classes.mainRow}`}>
                <Col className={`${classes['contact-col']} ${classes['contact-col2']} d-flex flex-column `}>
                    <Row className=' d-flex flex-column '>
                        <div className="brand-logo-text" style={{ marginBottom: '20px' }}>
                            Model<span>Link</span>
                        </div>
                        <Row>
                            <h2 className="page-main-title" style={{marginBottom: '0'}}>
                                <span className="gradient-text">Success Starts Here 🌟</span>
                                <span className="sub-title">Access to top-tier AI talent and businesses across the globe. 🌍</span>
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
                    <AuthCard title={isLogin ? "Sign in to your account" : isSignup ? "Create a new account" : ''} />
                    {(!isLogin && !isForgotPassword) &&
                        <Row className={'d-flex flex-column justify-content-center ms-lg-5 me-lg-5 ps-lg-5 pe-lg-5'}>
                            <div className={`${classes['progressLineOut']}`}>
                                <div className={`${classes['progressLineIn']}`} style={{ width: `${innerWidth}` }}>
                                </div>
                            </div>
                            <p >{`step ${stepNumber} of 3`}</p>
                        </Row>
                    }
                    <Form method="post" className={classes.container__3}>
                        {isLogin && <LoginForm />}
                        {isSignup && <AccountRoleForm />}
                        {isForgotPassword && <ForgotPassword />}
                        {((roleClient || roleDev) && step_1) && <SignupFormStep1 onStepData={onStepData} />}
                        {((roleClient || roleDev) && step_2) && <SignupFormStep2 stepData={stepData} />}
                    </Form>
                    <div className={classes.container__2}>
                        {isLogin ? (
                            <div className={classes.actions}>
                                <Row className={classes.actionsBox}>
                                    <Link to={`?mode=forgotPassword`} className={classes.forgotPassword}>Forgot Password</Link>
                                    {/* <Link to={`?mode=resetPassword`}>Reset Password</Link> */}
                                </Row>
                                <Row className={classes.actionsBox}>
                                    <p> {`Don't have an account ?`} </p>
                                    <Link to={`?mode=signup`}>Join here</Link>
                                </Row>
                            </div>
                        ) : !isForgotPassword ? (
                            <div className={classes.actions}>
                                <Row className={classes.actionsBox}>
                                    <p > {`Already have an account ?`}</p>
                                    <Link to={`?mode=login`}>Sign In</Link>
                                </Row>
                            </div>
                        ) : null}
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

export default Auth
