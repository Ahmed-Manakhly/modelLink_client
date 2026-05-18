/* eslint-disable */
import classes from './FormProfile.module.scss' ;
import { useNavigate , Form ,useNavigation  } from 'react-router-dom';
import useInput from '../hooks/Use-Input';
import { PhoneInput  } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import {Container , Row , Col  } from 'react-bootstrap' 
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {useEffect , useState } from 'react' ;

//-------------------------------- whatsapp


const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};



const   FormProfile = ({onUpdateProfileAction  , isChanged}) => {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const {  role  ,first_name , org_name , last_name , org_phone,country:userCountry,org_desc,rule_id , target_id , module_id,org_ipAddress} = userData;
    let isDev = role === 'DEVELOPER'
    useEffect(() => {
        const first_name_r = ((first_name && !isEditing.first_name) || (!first_name && fName )|| (first_name && isEditing.first_name && fName))? 1:0
        const last_name_r = ((last_name && !isEditing.last_name) || (!last_name && lName )|| (last_name && isEditing.last_name && lName))? 1:0
        const org_name_r = ((org_name && !isEditing.org_name) || (!org_name && orgName )|| (org_name && isEditing.org_name && orgName))? 1:0
        const org_phone_r = ((org_phone && !isEditing.org_phone) || (!org_phone && phoneIsValid )|| (org_phone && isEditing.org_phone && phoneIsValid))? 1:0
        const org_desc_r = ((org_desc && !isEditing.org_desc) || (!org_desc && desc )|| (org_desc && isEditing.org_desc && desc))? 1:0
        const org_ipAddress_r = ((org_ipAddress && !isEditing.org_ipAddress) || (!org_ipAddress && org__ipAddress )|| (org_ipAddress && isEditing.org_ipAddress && org__ipAddress))? 1:0
        const rule_id_r = ((rule_id && !isEditing.rule_id) || (!rule_id && rule__id )|| (rule_id && isEditing.rule_id && rule__id))? 1:0
        const target_id_r = ((target_id && !isEditing.target_id) || (!target_id && target__id )|| (target_id && isEditing.target_id && target__id))? 1:0
        const module_id_r = ((module_id && !isEditing.module_id) || (!module_id && module__id )|| (module_id && isEditing.module_id && module__id))? 1:0
        if(isDev){
            setRate((((first_name_r+last_name_r+org_name_r+org_phone_r+org_desc_r+org_ipAddress_r+rule_id_r+target_id_r+module_id_r) / 9)*100).toFixed(0))
        }else {
            setRate((((first_name_r+last_name_r+org_name_r+org_phone_r+org_desc_r+org_ipAddress_r) / 6)*100).toFixed(0))
        }
    })


    const numEx = /^\d+$/;
    const urlEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const [rate, setRate] = useState(0);
    const [isEditing, setEditing] = useState({first_name :false, org_name:false , last_name:false , org_phone:false,org_desc:false,rule_id :false, target_id :false, module_id:false,org_ipAddress:false});
    const phoneIsValid = isPhoneValid(phone);
    const phoneIsInValid = !phoneIsValid && isTouched
    //------------------------------------ init validation

    const {hasError : desInputIsInvalid ,valueIsValid : desc,value:value_org_desc,
        valueChangeHandler : desInputChangeHandler , inputBlurHandler : desInputBlurHandler  } = useInput(value => value.trim() !=='') ;
    const {hasError : orgNameInputIsInvalid , valueIsValid : orgName,value:value_org_name,
        valueChangeHandler : orgnameInputChangeHandler , inputBlurHandler : orgnameInputBlurHandler } = useInput(value => value.trim() !=='') ;
    const {hasError : fNameInputIsInvalid , valueIsValid : fName,value:value_first_name,
        valueChangeHandler : fNameInputChangeHandler , inputBlurHandler : fNameInputBlurHandler } = useInput(value => value.trim() !=='') ;
        // ===============================================
    const {hasError : lNameInputIsInvalid , valueIsValid : lName,value:value_last_name,
        valueChangeHandler : lNameInputChangeHandler , inputBlurHandler : lNameInputBlurHandler } = useInput(value => value.trim() !=='') ;
//==============================================================
    const {hasError : org_ipAddressInputIsInvalid ,valueIsValid : org__ipAddress,value:value_org_ipAddress,
        valueChangeHandler : org_ipAddressInputChangeHandler , inputBlurHandler : org_ipAddressInputBlurHandler  } = useInput(value => (value.trim() !=='' && urlEx.test(value)) );
    const {hasError : rule_idInputIsInvalid ,valueIsValid : rule__id,value:value_rule_id,
        valueChangeHandler : rule_idInputChangeHandler , inputBlurHandler : rule_idInputBlurHandler  } = useInput(value => value.trim() !==''  && +value.trim() !== 0  && numEx.test(value)) ;
    const {hasError : target_idInputIsInvalid ,valueIsValid : target__id,value:value_target_id,
        valueChangeHandler : target_idInputChangeHandler , inputBlurHandler : target_idInputBlurHandler  }= useInput(value => value.trim() !==''  && +value.trim() !== 0  && numEx.test(value)) ;
    const {hasError : module_idInputIsInvalid ,valueIsValid : module__id,value:value_module_id,
        valueChangeHandler : module_idInputChangeHandler , inputBlurHandler : module_idInputBlurHandler  } = useInput(value => value.trim() !==''  && +value.trim() !== 0 && numEx.test(value)) ;
    //------------------------------------------------------form valid

    const formCompleted = (first_name && org_name && last_name && org_phone&&org_desc&&(rule_id || !isDev) && (target_id||!isDev) && (module_id || !isDev)&&org_ipAddress&&
        !isEditing.first_name && !isEditing.org_name && !isEditing.last_name && !isEditing.org_phone&&!isEditing.org_desc&&(!isEditing.rule_id || !isDev )&&
        (!isEditing.target_id || !isDev )&& (!isEditing.module_id || !isDev)&&!isEditing.org_ipAddress)

    let formIsValid = false
    if(   
        ((first_name && !isEditing.first_name) || (!first_name && fName )|| (first_name && isEditing.first_name && fName))&&
        ((last_name && !isEditing.last_name) || (!last_name && lName )|| (last_name && isEditing.last_name && lName))&&
        ((org_name && !isEditing.org_name) || (!org_name && orgName )|| (org_name && isEditing.org_name && orgName))&&
        ((org_phone && !isEditing.org_phone) || (!org_phone && phoneIsValid )|| (org_phone && isEditing.org_phone && phoneIsValid))&&
        ((org_desc && !isEditing.org_desc) || (!org_desc && desc )|| (org_desc && isEditing.org_desc && desc))&&
        ((org_ipAddress && !isEditing.org_ipAddress) || (!org_ipAddress && org__ipAddress )|| (org_ipAddress && isEditing.org_ipAddress && org__ipAddress))&&

        ((rule_id && !isEditing.rule_id) || (!rule_id && rule__id )|| (rule_id && isEditing.rule_id && rule__id) || !isDev)&&
        ((target_id && !isEditing.target_id) || (!target_id && target__id )|| (target_id && isEditing.target_id && target__id)|| !isDev)&&
        ((module_id && !isEditing.module_id) || (!module_id && module__id )|| (module_id && isEditing.module_id && module__id)|| !isDev)&&
        
        (!formCompleted ||(formCompleted&&isChanged))
    ){
        formIsValid = true;
    }

    //-----------------------------------------
    const navigate = useNavigate();
    function cancelHandler() {
    navigate('..');
    }

    const handelSubmit =(e)=>{
        e.preventDefault();
        let authData = {}
        value_org_desc ? authData.org_desc = value_org_desc : null
        value_org_name ? authData.org_name = value_org_name : null
        value_first_name ? authData.first_name = value_first_name : null
        value_last_name ? authData.last_name = value_last_name : null
        value_org_ipAddress ? authData.org_ipAddress = value_org_ipAddress : null
        value_rule_id ? authData.rule_id = value_rule_id : null
        value_target_id ? authData.target_id = value_target_id : null
        value_module_id ? authData.module_id = value_module_id : null
        phone ? authData.org_phone = phone : null
        country ? authData.country = country.name : null

        onUpdateProfileAction(Object.keys(authData).length !==0?authData:null)
    }
    //---------------------------------------
    
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting' ;
    //--------------------------------------------------
    const descClasses = desInputIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const orgNameClasses = orgNameInputIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const fNameClasses = fNameInputIsInvalid  ?`${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const lNameClasses = lNameInputIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    //-----------
    const phoneClasses = phoneIsInValid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const org_ipAddressClasses = org_ipAddressInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const rule_idClasses = rule_idInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const target_idClasses = target_idInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    const module_idClasses = module_idInputIsInvalid? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}` ;
    //----------------------------------------------------------
    //=========================================================
    return(
        <Container>
            <section className={`${classes.secpro} w-100`}>
            <Container  className={`g-5 p-md-3 gap-5  justify-content-center ${classes['theMain']}`}>
                <Row className={`d-flex flex-column justify-content-center ms-lg-5 me-lg-5 ps-lg-5 pe-lg-5 ${classes['container_con']}`}>
                    <div className={classes["container"]}>
                        <h2 className={classes["title"]}>{`Completion Rate: ${rate}%`}</h2>
                    </div>
                    <div className={`${classes['progressLineOut']}`}>
                        <div className={`${classes['progressLineIn']}`} style={{width : `${rate}%`}}>
                        </div>
                    </div>
                </Row>
                <Col  className={`${classes["contact-col"]} flex-fill`}>
                    <Form method='post'>
                        <Row className={`justify-content-md-center d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
                            <Row >
                                <Col xs={0} md lg className={`${fNameClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='first_name'>First Name</label>
                                    {(!first_name || (first_name &&isEditing.first_name))&& <>
                                        <input type='text' id='first_name' name="first_name" placeholder="Your First Name" required
                                        onChange={fNameInputChangeHandler} onBlur={fNameInputBlurHandler} defaultValue={first_name? first_name : ''}/>
                                        {(fNameInputIsInvalid )&& <p className={classes['error-text']}>Your First Name must not be empty</p>}
                                    </>}
                                    {(first_name&&!isEditing.first_name)&&
                                        <p>{first_name} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,first_name:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${lNameClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='last_name'>Last Name</label>
                                    {(!last_name || (last_name &&isEditing.last_name))&& <>
                                        <input type='text' id='last_name' name="last_name" placeholder="Your Last Name" 
                                        onChange={lNameInputChangeHandler} onBlur={lNameInputBlurHandler} defaultValue={last_name? last_name : ''}/>
                                        {(lNameInputIsInvalid )&& <p className={classes['error-text']}>Your Last Name must not be empty</p>}
                                    </>}
                                    {(last_name&&!isEditing.last_name)&&
                                        <p>{last_name} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,last_name:true}})}}/></p>
                                    }
                                </Col>
                            </Row>

                            <Row >
                                <Col xs={0} md lg className={`${orgNameClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='org_name'>Organization Name</label>
                                    {(!org_name || (org_name &&isEditing.org_name))&& <>
                                        <input type='text' id='org_name' name="org_name" placeholder="Your Organization Name" required
                                        onChange={orgnameInputChangeHandler} onBlur={orgnameInputBlurHandler} defaultValue={org_name? org_name : ''}/>
                                        {(orgNameInputIsInvalid )&& <p className={classes['error-text']}>Your Organization Name must not be empty</p>}
                                    </>}
                                    {(org_name&&!isEditing.org_name)&&
                                        <p>{org_name} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,org_name:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${org_ipAddressClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='org_ipAddress'>Organization IP Address</label>
                                    {(!org_ipAddress || (org_ipAddress &&isEditing.org_ipAddress))&& <>
                                        <input type='text' id='org_ipAddress' name="org_ipAddress" placeholder="Your Organization IP Address" required
                                        onChange={org_ipAddressInputChangeHandler} onBlur={org_ipAddressInputBlurHandler} defaultValue={org_ipAddress? org_ipAddress : ''}/>
                                        {(org_ipAddressInputIsInvalid )&& <p className={classes['error-text']}>Your Organization IP Address must not be empty</p>}
                                    </>}
                                    {(org_ipAddress&&!isEditing.org_ipAddress)&&
                                        <p>{org_ipAddress} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,org_ipAddress:true}})}}/></p>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={0} md lg className={`${phoneClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='last_name'>Your Phone Number</label>
                                    {(!org_phone || (org_phone &&isEditing.org_phone))&& <>
                                        <PhoneInput
                                        defaultCountry="us"
                                        id='org_phone' name="org_phone"
                                        required
                                        value={phone}
                                        defaultValue={org_phone? org_phone : ''}
                                        onChange={(phone, { country }) => {setPhone(phone);setCountry(country)}}  onBlur={()=>{setIsTouched(true)}}
                                        />
                                        {phoneIsInValid && <p className={classes['error-text']}>Your Phone Number is not valid</p>}
                                    </>}
                                    {(org_phone&&!isEditing.org_phone)&&
                                        <p>{org_phone} </p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='org_name'>Your Country</label>
                                    {(!org_phone || (org_phone &&isEditing.org_phone))&& <>
                                        <input type='text' id='country' name="country" placeholder="Your country Name"  readOnly="readonly" style={{border : 'none'}}
                                    onChange={orgnameInputChangeHandler} onBlur={orgnameInputBlurHandler} value={country.name?country.name:''}/>
                                    </>}
                                    {(org_phone&&!isEditing.org_phone)&&
                                        <p>{userCountry} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,org_phone:true}})}}/></p>
                                    }
                                </Col>
                            </Row>
                            {isDev && <Row>
                                <Col xs={0} md lg className={`${rule_idClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='rule_id'>Rule ID</label>
                                    {((+rule_id ===0) || (+rule_id !==0) &&isEditing.rule_id)&& <>
                                        <input type='number'  step="1" min="1" id='rule_id' name="rule_id" placeholder="Rule ID" required
                                        onChange={rule_idInputChangeHandler} onBlur={rule_idInputBlurHandler} defaultValue={(+rule_id !==0) ? rule_id : ''}/>
                                        {(rule_idInputIsInvalid )&& <p className={classes['error-text']}>Rule ID must not be empty</p>}
                                    </>}
                                    {((+rule_id !==0) &&!isEditing.rule_id)&&
                                        <p>{+rule_id} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,rule_id:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${target_idClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='target_id'>Target ID</label>
                                    {((+target_id ===0) || (+target_id !==0) &&isEditing.target_id)&& <>
                                        <input type='number'  step="1" min="1" id='target_id' name="target_id" placeholder="Target ID" required
                                        onChange={target_idInputChangeHandler} onBlur={target_idInputBlurHandler} defaultValue={(+target_id !==0) ? target_id : ''}/>
                                        {(target_idInputIsInvalid )&& <p className={classes['error-text']}>Target ID must not be empty</p>}
                                    </>}
                                    {((+target_id !==0) &&!isEditing.target_id)&&
                                        <p>{+target_id} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,target_id:true}})}}/></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${module_idClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='module_id'>Module ID</label>
                                    {((+module_id ===0) || (+module_id !==0) &&isEditing.module_id)&& <>
                                        <input type='number'  step="1" min="1" id='module_id' name="module_id" placeholder="Module ID" required
                                        onChange={module_idInputChangeHandler} onBlur={module_idInputBlurHandler} defaultValue={(+module_id !==0) ? module_id : ''}/>
                                        {(module_idInputIsInvalid )&& <p className={classes['error-text']}>Module ID must not be empty</p>}
                                    </>}
                                    {((+module_id !==0) &&!isEditing.module_id)&&
                                        <p>{+module_id} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,module_id:true}})}}/></p>
                                    }
                                </Col>
                            </Row> }
                            <Row>
                                <Col xs={0} md lg  className={`${descClasses} d-flex flex-column align-items-left w-100`}>
                                    <label htmlFor='org_desc'>About You</label>
                                    {((org_desc ==='') || (org_desc !=='') &&isEditing.org_desc)&& <>
                                        <textarea id='org_desc' name="org_desc" cols="30" rows="7" placeholder="About You" required
                                        onChange={desInputChangeHandler} onBlur={desInputBlurHandler} defaultValue={org_desc}/>
                                        {desInputIsInvalid && <p className={classes['error-text']}>Your Description Must Not Be Empty</p>}
                                    </>}
                                    {((org_desc !== '') &&!isEditing.org_desc)&&
                                        <p>{org_desc} <BorderColorIcon style={{color: '#5DB8DD', cursor: 'pointer'}} title="edit" onClick={()=>{setEditing((prev)=>{return{...prev,org_desc:true}})}}/></p>
                                    }
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={0} md lg  className={`${classes["form-actions"]} `}>
                                    <button disabled={!formIsValid||isSubmitting} className={`${classes["feature-btn"]} `} 
                                        onClick={handelSubmit} type="submit">{isSubmitting?'Updating...':"Update"}</button>
                                </Col>
                                <Col xs={0} md lg  className={`${classes["form-actions"]} `}>
                                    <button type="button" onClick={cancelHandler} className={`${classes["cancel-btn"]} `}>Cancel</button>
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                </Col>
            </Container>
            </section>
        </Container>
    )
}
export default FormProfile