import useInput from '../../../hooks/Use-Input';
import { useNavigation} from 'react-router-dom';
import classes from './Auth.module.scss' ;
import { Row , Col  } from 'react-bootstrap' 
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

//-----------------------------------------
const LoginForm = ( ) => {
    const emailRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const passRegs = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,16}$/
    //------------------------------------ init validation
    const {hasError : userInputIsInvalid , valueIsValid : userName,
        valueChangeHandler : userInputChangeHandler , inputBlurHandler : userInputBlurHandler } = useInput(value => value.trim() !=='' && emailRegx.test(value)) ;
    //------------------------
    const {hasError : passInputIsInvalid , valueIsValid : pass1,
            valueChangeHandler : passInputChangeHandler , inputBlurHandler : passInputBlurHandler } = useInput(value => passRegs.test(value)) ;
    //----------------------------------------------
    const navigation = useNavigation() ;
    const isSubmitting = navigation.state === 'submitting' ;
    //-----------------------------------------
    const userNameClasses = userInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const pass1Classes = passInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    //------------------------------------------------------form valid
    let formIsValid = false
    if(userName &&  pass1){
        formIsValid = true;
    }
    //-----------------
    return (
        <Col className={`d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
            {/* {====================================================} */}
                <Row className={`${userNameClasses} d-flex flex-column align-items-center w-100`} >
                    <label htmlFor="userName" ><MdEmail  />User Email</label>
                    <input type="text"  placeholder="User Name" name="org_username" id='userName'
                    onChange={userInputChangeHandler} onBlur={userInputBlurHandler} />
                    {userInputIsInvalid && <p className={classes['error-text']}>Kindly Use A Valid Email : simple@example.com </p>}
                </Row>
                {/* {===================================} */}
                <Row   className={`${pass1Classes} d-flex flex-column align-items-left w-100`} >
                    <label htmlFor="password" ><RiLockPasswordFill />User Password</label>
                    <input type="password"  placeholder="Password" name="password" id='password'
                    onChange={passInputChangeHandler} onBlur={passInputBlurHandler} />
                    {passInputIsInvalid && <p className={classes['error-text']}>Password must be at least 12 characters long, including at least one uppercase letter, one lowercase letter, one digit, and one special character.</p>}
                </Row>
            {/* {====================================================} */}
                    <button type="submit"  disabled={!formIsValid} className={`${classes['form-btn']} d-flex flex-column align-items-left w-100`} > { isSubmitting? 'Submitting...' : "Login"} </button>
        </Col>
    )
}
export default LoginForm
