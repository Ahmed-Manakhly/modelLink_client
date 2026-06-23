import useInput from '../../../hooks/Use-Input';
import { PhoneInput  } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useNavigation , Link ,useSearchParams} from 'react-router-dom';
import classes from './Auth.module.scss' ;
import { Row , Col  } from 'react-bootstrap'
import { useState , useEffect } from 'react' ;
import { createOtp , validateOtp } from "../../../lib/authRequests";
import { IoMdCheckmarkCircle } from "react-icons/io";


const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

//-----------------------------------------
const SignupFormStep2 = ( {stepData}) => {
    const [SearchParams]=useSearchParams() ;
    const role = SearchParams.get('role') ;
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const phoneIsValid = isPhoneValid(phone);
    const phoneIsInValid = !phoneIsValid && isTouched
    //-----------------------------------------------
    const [verified, setVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rest, setRest] = useState(false);
    const [otpMessage, setOtpMessage] = useState({content : '' , error : false});
    //------------------------------------ init validation
    const {hasError : orgNameInputIsInvalid , valueIsValid : orgName,
        valueChangeHandler : orgnameInputChangeHandler , inputBlurHandler : orgnameInputBlurHandler } = useInput(value => value.trim() !=='') ;
    const {hasError : OTPInputIsInvalid ,value : theOtp ,
        valueChangeHandler : OTPInputChangeHandler , inputBlurHandler : OTPInputBlurHandler } = useInput(value => value.trim() !=='') ;
    //-----------------------------------
    const navigation = useNavigation() ;
    const isSubmitting = navigation.state === 'submitting' ;
    //------------------------------------------------------form valid
    let formIsValid = false
    if(orgName && phoneIsValid && verified){
        formIsValid = true;
    }
    const orgName1Classes = orgNameInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const OTPClasses = OTPInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const phoneClasses = phoneIsInValid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    //-----------------------
    const gettingOtp = async ()=> {
        setIsLoading(true)
        try{
            const {data} =await createOtp({email : stepData?.enteredEmail})
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
            const {data} =await validateOtp({email : stepData?.enteredEmail , otp : theOtp})
            setOtpMessage(prev => ({...prev , content : data?.data?.message , error : false}))
            setVerified(true)
            setRest(true)
            setIsLoading(false)
            // if( data?.data?.message === "Email verified successfully!"){
            // }
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
    return (
        <Col className={`d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
            {/* {====================================================} */}
            <input type="email"    name="email"            hidden value={stepData.enteredEmail}readOnly/>
            <input type="password" name="password"         hidden value={stepData.enteredPass1}readOnly/>
            <input type="password" name="passwordConfirm"  hidden value={stepData.enteredPass2}readOnly/>
            {/* {====================================================} */}
            <Row xs={0} md lg  className={`${orgName1Classes} d-flex flex-column align-items-center w-100`} >
                <label htmlFor="org_name" >Organization Name</label>
                <input type="text"  placeholder="Organization Name" id='org_name'
                onChange={orgnameInputChangeHandler} onBlur={orgnameInputBlurHandler} name="org_name"/>
                {orgNameInputIsInvalid && <p className={classes['error-text']}>Organization Name must not be empty</p>}
            </Row>
            <Row xs={0} md lg className={`${phoneClasses} d-flex flex-column align-items-left w-100`} >
                <label htmlFor='last_name'>Your Phone Number</label>
                    <PhoneInput
                    defaultCountry="us"
                    id='org_phone' name="org_phone"
                    required
                    value={phone}
                    onChange={(phone, { country }) => {setPhone(phone);setCountry(country)}}  onBlur={()=>{setIsTouched(true)}}
                />
                {phoneIsInValid && <p className={classes['error-text']}>Your Phone Number is not valid</p>}
            </Row>
            <Row xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100`} >
                <label htmlFor='org_name'>Your Country</label>
                <input type='text' id='country' name="country" placeholder="Your country Name"  readOnly="readonly"
                onChange={orgnameInputChangeHandler} onBlur={orgnameInputBlurHandler} value={country.name||''}/>
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
            <Row className={`${classes["actions"]}  d-flex  align-items-center w-100 m-0`}>
                <Link to={`?role=${role}&step=1`} className={`${classes['form-btn']} ${classes["actions__"]}  d-flex flex-column align-items-left w-50`}>Previous</Link>
                <button type="submit"  disabled={!formIsValid} className={`${classes['form-btn']} ${classes["actions__"]}  d-flex flex-column align-items-left w-50`} >
                    {isSubmitting? 'Submitting...' : "Sign Up"}
                </button>
            </Row>
        </Col>
    )
}

export default SignupFormStep2
