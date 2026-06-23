import Modal from '../Modal'
import { Form , Link , useSearchParams ,useNavigate } from 'react-router-dom';
import classes from './Auth.module.scss' ;
import LoginForm from './LoginForm' ;
import SignupFormStep1 from './SignupFormStep1' ;
import SignupFormStep2 from './SignupFormStep2' ;
import AccountRoleForm from './AccountRoleForm' ;
import ForgotPassword from './ForgotPassword' ;
// import logo from '../../../assets/LOGO_3.png'
import { useState} from 'react' ;
import { Row , Col  } from 'react-bootstrap'

//-----------------------------------------

function AuthCard({title}) {
    return (
        <div className={classes.card}>
            <h1 className={classes.title}>
                {title}
            </h1>
        </div>
    )
}


const Auth = ( ) => {
    const navigate = useNavigate();
    const onClose = ()=>{
        navigate('/' )
    }
    let innerWidth,stepNumber
    // const data = useActionData() ;
    const [SearchParams]=useSearchParams() ;
    const isLogin = SearchParams.get('mode') === 'login' ;
    const isSignup = SearchParams.get('mode') === 'signup' ;
    const isForgotPassword = SearchParams.get('mode') === 'forgotPassword' ;
    const roleClient = SearchParams.get('role') === 'client' ;
    const roleDev = SearchParams.get('role') === 'developer' ;
    const step_1 = SearchParams.get('step') === '1' ;
    const step_2 = SearchParams.get('step') === '2' ;
    const [stepData, setStepData] = useState({});
    const onStepData = (data)=>{
        setStepData(data)
    }
    innerWidth = isSignup?((100/3)*1)+'%': step_1?((100/3)*2)+'%' :step_2?((100/3)*3)+'%':null ;
    stepNumber= isSignup?1: step_1?2 :step_2?3:null ;
    //-------------------------------------------------------------------
    return (
        <Modal onClose={onClose} >
            <Row md={2} xs={1} lg={3} className={` justify-content-center w-100 ${classes.mainRow}`}>
                <Col className={`${classes['contact-col']} ${classes['contact-col2']} d-flex flex-column `}>
                    <Row className=' d-flex flex-column '>
                        <div className="brand-logo-text" style={{ marginBottom: '20px' }}>
                          {/* <img src={logo} alt="logo" /> */}
                          Model<span>Link</span>
                        </div>
                        <Row>
                            <h1 className={classes.title_2}>Success starts here</h1>
                        </Row>
                        <Row>
                            <p className={`${classes["section__text__p2"]}`}>Access to talent and businesses across the globe</p>
                        </Row>
                    </Row>
                    <ul className={classes["header-social-container"]}>
                        <li>
                        <Link to="/" className={classes["social-link"]}>
                            <ion-icon name="logo-facebook"></ion-icon>
                        </Link>
                        </li>
                        <li>
                        <Link to="/" className={classes["social-link"]}>
                            <ion-icon name="logo-twitter"></ion-icon>
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

                <Col  className={`${classes["contact-col"]} flex-fill`}>
                    <AuthCard title={isLogin ? "Sign in to your account" : isSignup ? "Create a new account" : ''}/>
                    {(!isLogin && !isForgotPassword )&&
                    <Row className={'d-flex flex-column justify-content-center ms-lg-5 me-lg-5 ps-lg-5 pe-lg-5'}>
                        <div className={`${classes['progressLineOut']}`}>
                            <div className={`${classes['progressLineIn']}`} style={{width : `${innerWidth}`}}>
                            </div>
                        </div>
                        <p >{`step ${stepNumber} of 3`}</p>
                    </Row>
                    }
                    <Form method="post"  className={classes.container__3}>
                        {isLogin &&  <LoginForm/>}
                        {isSignup && <AccountRoleForm/>}
                        {isForgotPassword && <ForgotPassword/>}
                        {((roleClient || roleDev) &&step_1)&& <SignupFormStep1 onStepData={onStepData}/> }
                        {((roleClient || roleDev) &&step_2)&& <SignupFormStep2 stepData={stepData}/> }
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
