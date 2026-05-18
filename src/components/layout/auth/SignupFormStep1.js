import useInput from '../../../hooks/Use-Input';

import { useSearchParams , Link , useNavigate} from 'react-router-dom';
import classes from './Auth.module.scss' ;
import { Row , Col  } from 'react-bootstrap' 

//-----------------------------------------
const SignupFormStep1 = ( {onStepData}) => {

    const emailRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const passRegs = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,16}$/

    const [SearchParams]=useSearchParams() ;
    const role = SearchParams.get('role') ;
    const navigate = useNavigate();
    const {value: enteredEmail ,hasError : emailInputIsInvalid , valueIsValid : mail,
        valueChangeHandler : emailInputChangeHandler , inputBlurHandler : emailInputBlurHandler  } = useInput(value => value.trim() !=='' && emailRegx.test(value)) ;
    const {value : enteredPass1 ,hasError : passInputIsInvalid , valueIsValid : pass1,
            valueChangeHandler : passInputChangeHandler , inputBlurHandler : passInputBlurHandler } =  useInput(value => passRegs.test(value)) ;
    const {value : enteredPass2 , valueIsValid : pass2, hasError : pass2InputIsInvalid,
            valueChangeHandler : passwInputChangeHandler , inputBlurHandler : passwInputBlurHandler } =  useInput(value => value === enteredPass1) ;
    //------------------------------------------------------form valid
    let formIsValid = false
    if(mail  && pass1 && pass2 ){
        formIsValid = true;
    }

    const emailClasses = emailInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const passInputClasses = passInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const pass2InputClasses = (pass2InputIsInvalid  )? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;

    const handelOnStepData=()=>{
        onStepData({enteredEmail,enteredPass1,enteredPass2})
        navigate(`?role=${role}&step=2`,{replace :true});
    }
    //-----------------------
    return (
        <Col className={`d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
        {/* {====================================================} */}

            <Row xs={0} md lg className={`${emailClasses} d-flex flex-column align-items-center w-100`} >
                <label htmlFor="email" >Email</label>
                <input type="email"  placeholder="Email"
                name="email" onChange={emailInputChangeHandler} onBlur={emailInputBlurHandler} id='email'/>
                {emailInputIsInvalid && <p className={classes['error-text']}>Kindly Use A Valid Email :simple@example.com </p>}
            </Row>
            {/* {===================================} */}


                <Row xs={0} md lg  className={`${passInputClasses} d-flex flex-column align-items-center w-100`} >
                    <label htmlFor="password" >Your Password</label>
                    <input type="password"  placeholder="Your Password" name="password" id='password'
                    onChange={passInputChangeHandler} onBlur={passInputBlurHandler} />
                    {passInputIsInvalid && <p className={classes['error-text']}>Password must be at least 12 characters long, including at least one uppercase letter, one lowercase letter, one digit, and one special character.</p>}
                </Row>
                {/* {===================================} */}
                <Row xs={0} md lg  className={`${pass2InputClasses} d-flex flex-column align-items-center w-100`} >
                <label htmlFor="confirmPassword" >Confirm Your Password</label>
                    <input type="password"  placeholder="Confirm Password" name="passwordConfirm" id='confirmPassword'
                    onChange={passwInputChangeHandler} onBlur={passwInputBlurHandler} />
                    {(pass2InputIsInvalid) && <p className={classes['error-text']}>Your password is not Matching </p>}
                </Row>

            {/* {===================================} */}
            <Row className={`${classes["actions"]}  d-flex  align-items-center w-100 m-0`}>
                <Link to='?mode=signup' className={`${classes['form-btn']} ${classes["actions__"]}  d-flex flex-column align-items-left w-50`}>Previous</Link>
                    <button type="button" className={`${classes['form-btn']} ${classes["actions__"]}  d-flex flex-column align-items-left w-50`}
                        onClick={handelOnStepData}  disabled={!formIsValid} >
                        Continue
                    </button>
            </Row>
    </Col>
    )
}

export default SignupFormStep1
