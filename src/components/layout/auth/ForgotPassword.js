import useInput from '../../../hooks/Use-Input';
import { useNavigation , useNavigate} from 'react-router-dom';
import classes from './Auth.module.scss' ;
import { Row , Col  } from 'react-bootstrap'
import { useState , useEffect } from 'react' ;
import { createOtp , validateOtp , resetPasswordReq } from "../../../lib/authRequests";
import { IoMdCheckmarkCircle } from "react-icons/io";
import {useDispatch} from 'react-redux';
import {uiActions} from '../../../store/UI-slice' ;


//-----------------------------------------
const ForgotPassword = ( ) => {

    const emailRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const passRegs = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,16}$/
    //----------------------------------
    const navigation = useNavigation() ;
    const isSubmitting = navigation.state === 'submitting' ;
    //-----------------------------------------------
    const [verified, setVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rest, setRest] = useState(false);
    const [otpMessage, setOtpMessage] = useState({content : '' , error : false});
    //--------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();  
    //--------------------------
    const {value: enteredEmail ,hasError : emailInputIsInvalid , valueIsValid : mail,
        valueChangeHandler : emailInputChangeHandler , inputBlurHandler : emailInputBlurHandler  } = useInput(value => value.trim() !=='' && emailRegx.test(value)) ;
    const {value : enteredPass1 ,hasError : passInputIsInvalid , valueIsValid : pass1,
            valueChangeHandler : passInputChangeHandler , inputBlurHandler : passInputBlurHandler } =  useInput(value => passRegs.test(value)) ;
    const {value : enteredPass2 , valueIsValid : pass2, hasError : pass2InputIsInvalid,
            valueChangeHandler : passwInputChangeHandler , inputBlurHandler : passwInputBlurHandler } =  useInput(value => value === enteredPass1) ;
    const {hasError : OTPInputIsInvalid ,value : theOtp ,
        valueChangeHandler : OTPInputChangeHandler , inputBlurHandler : OTPInputBlurHandler } = useInput(value => value.trim() !=='') ;
    //------------------------------------------------------form valid
    let formIsValid = false
    if(mail  && pass1 && pass2 && verified){
        formIsValid = true;
    }
    const emailClasses = emailInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const passInputClasses = passInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const pass2InputClasses = (pass2InputIsInvalid  )? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const OTPClasses = OTPInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    //-----------------------
    const gettingOtp = async ()=> {
        setIsLoading(true)
        try{
            const {data} =await createOtp({email : enteredEmail})
            setOtpMessage(prev => ({...prev , content : data?.data?.message , error : false}))
            setRest(true)
            setIsLoading(false)
        }catch(error)
        {   
            setOtpMessage(prev => ({...prev , content : error?.response?.data?.message , error : true}))
            setRest(true)
            setIsLoading(false)
        }
    }
    //-----------------
    const verifingOtp = async ()=> {
        setIsLoading(true)
        try{
            const {data} =await validateOtp({email : enteredEmail , otp : theOtp})
            setOtpMessage(prev => ({...prev , content : data?.data?.message , error : false}))
            setVerified(true)
            setRest(true)
            setIsLoading(false)
        }catch(error)
        {
            setOtpMessage(prev => ({...prev , content : error?.response?.data?.message , error : true}))
            setRest(true)
            setIsLoading(false)
        }
    }
    //rest
    useEffect(() => {
        if(rest){
            setRest(false)
            if(otpMessage.content !== "Email verified successfully!" ){
                setVerified(false)
            }else{
                setTimeout(()=>{
                    setVerified(false)
                },120000)
            }
        }
    },[rest , otpMessage.content])
    //-----------------------
    const handelSubmit =(e)=>{
        e.preventDefault();
        let toast = {status :'', title :'', message:''}
        async function changePass (actions ,toastHandler , loadingState ) {
            loadingState(true)
            //---------------------------------------------                
            try{
                const response = await resetPasswordReq({email: enteredEmail , password:enteredPass1 , passwordConfirm : enteredPass2, otp: theOtp});
                const resData =  response.data ;
                loadingState(false)
                console.log(resData)
                actions(resData)
                toast= {status :resData.status,message:resData.message || "Your Password has been Changed!",title:'Change Password'}
                toastHandler(toast);
            }catch(err){
                console.log(err)
                loadingState(false)
                toast = {status :'error',message:err.response.data.message,title:'Updating Information failed'};
                toastHandler(toast);
            }
        } 
        const toastHandler =(toast)=>{
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
        } 
        const actions =(data)=>{
            console.log(data)
        }
        const loadingState = (state)=>{
            dispatch(uiActions.showLoading(state))
        }
        changePass(actions ,toastHandler , loadingState )
        dispatch(uiActions.showNotification(false))
        navigate(`/auth?mode=login`,{replace :false});
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
                    <label htmlFor="password" >Your New Password</label>
                    <input type="password"  placeholder="Your Password" name="password" id='password'
                    onChange={passInputChangeHandler} onBlur={passInputBlurHandler} />
                    {passInputIsInvalid && <p className={classes['error-text']}>Password must be at least 12 characters long, including at least one uppercase letter, one lowercase letter, one digit, and one special character.</p>}
                </Row>
                {/* {===================================} */}
                <Row xs={0} md lg  className={`${pass2InputClasses} d-flex flex-column align-items-center w-100`} >
                <label htmlFor="confirmPassword" >Confirm Your New Password</label>
                    <input type="password"  placeholder="Confirm Password" name="passwordConfirm" id='confirmPassword'
                    onChange={passwInputChangeHandler} onBlur={passwInputBlurHandler} />
                    {(pass2InputIsInvalid) && <p className={classes['error-text']}>Your password is not Matching </p>}
                </Row>

            {/* {===================================} */}                      
            <div className={`${OTPClasses} ${classes['__otp__con__1']}`} >
                <div className={`${OTPClasses} ${classes['__otp__con']}`} >
                    <span  onClick={gettingOtp}>Get OTP</span>
                    <input type="text"  placeholder="OTP is required" id='otp' required
                    onChange={OTPInputChangeHandler} onBlur={OTPInputBlurHandler} name="org_name"/>
                    <span onClick={verifingOtp} >Verify Your Email</span>
                </div>
                {isLoading && <p>Please Wait...</p>}
                {otpMessage.content !== '' && <p className={`
                    ${classes['otp-text']} ${otpMessage.error && classes['otp-text-error']}    
                `} >{!otpMessage.error && <IoMdCheckmarkCircle/>}{otpMessage.content}</p>}
            </div>
            {/* {===================================} */}
            <button
                onClick={handelSubmit}
                type="button" 
                disabled={!formIsValid}
                className={`${classes['form-btn']} d-flex flex-column align-items-left w-100`}
            >
                { isSubmitting? 'Submitting...' : "Change Password"} 
            </button>
    </Col>
    )
}

export default ForgotPassword