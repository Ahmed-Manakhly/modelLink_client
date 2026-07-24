import classes from './FormProfile.module.scss';
import { useNavigate, Form, useNavigation } from 'react-router-dom';
import useInput from '../hooks/Use-Input';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Row, Col } from 'react-bootstrap'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

const FormProfile = ({ onUpdateProfileAction, isChanged, onRateChange }) => {

    const userData = useSelector(state => state.auth.userData) || {};
    const { first_name, org_name, last_name, org_phone, country: userCountry, org_desc } = userData;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const first_name_r = ((first_name && !isEditing.first_name) || (!first_name && fName) || (first_name && isEditing.first_name && fName)) ? 1 : 0
        const last_name_r = ((last_name && !isEditing.last_name) || (!last_name && lName) || (last_name && isEditing.last_name && lName)) ? 1 : 0
        const org_name_r = ((org_name && !isEditing.org_name) || (!org_name && orgName) || (org_name && isEditing.org_name && orgName)) ? 1 : 0
        const org_phone_r = ((org_phone && !isEditing.org_phone) || (!org_phone && phoneIsValid) || (org_phone && isEditing.org_phone && phoneIsValid)) ? 1 : 0
        const org_desc_r = ((org_desc && !isEditing.org_desc) || (!org_desc && desc) || (org_desc && isEditing.org_desc && desc)) ? 1 : 0

        const newRate = (((first_name_r + last_name_r + org_name_r + org_phone_r + org_desc_r) / 5) * 100).toFixed(0);
        if (onRateChange) onRateChange(newRate);
    });

    const [phone, setPhone] = useState(org_phone || '');
    const [country, setCountry] = useState({ name: userCountry || '' });
    const [isTouched, setIsTouched] = useState(false);
    const [isEditing, setEditing] = useState({ first_name: false, org_name: false, last_name: false, org_phone: false, org_desc: false });
    const phoneIsValid = isPhoneValid(phone);
    const phoneIsInValid = !phoneIsValid && isTouched

    const { hasError: desInputIsInvalid, valueIsValid: desc, value: value_org_desc,
        valueChangeHandler: desInputChangeHandler, inputBlurHandler: desInputBlurHandler } = useInput(value => value.trim() !== '');
    const { hasError: orgNameInputIsInvalid, valueIsValid: orgName, value: value_org_name,
        valueChangeHandler: orgnameInputChangeHandler, inputBlurHandler: orgnameInputBlurHandler } = useInput(value => value.trim() !== '');
    const { hasError: fNameInputIsInvalid, valueIsValid: fName, value: value_first_name,
        valueChangeHandler: fNameInputChangeHandler, inputBlurHandler: fNameInputBlurHandler } = useInput(value => value.trim() !== '');
    const { hasError: lNameInputIsInvalid, valueIsValid: lName, value: value_last_name,
        valueChangeHandler: lNameInputChangeHandler, inputBlurHandler: lNameInputBlurHandler } = useInput(value => value.trim() !== '');

    const formCompleted = (first_name && org_name && last_name && org_phone && org_desc &&
        !isEditing.first_name && !isEditing.org_name && !isEditing.last_name && !isEditing.org_phone && !isEditing.org_desc)

    let formIsValid = false
    if (
        ((first_name && !isEditing.first_name) || (!first_name && fName) || (first_name && isEditing.first_name && fName)) &&
        ((last_name && !isEditing.last_name) || (!last_name && lName) || (last_name && isEditing.last_name && lName)) &&
        ((org_name && !isEditing.org_name) || (!org_name && orgName) || (org_name && isEditing.org_name && orgName)) &&
        ((org_phone && !isEditing.org_phone) || (!org_phone && phoneIsValid) || (org_phone && isEditing.org_phone && phoneIsValid)) &&
        ((org_desc && !isEditing.org_desc) || (!org_desc && desc) || (org_desc && isEditing.org_desc && desc)) &&
        (!formCompleted || (formCompleted && isChanged))
    ) {
        formIsValid = true;
    }

    const navigate = useNavigate();
    function cancelHandler() {
        navigate('..');
    }

    const handelSubmit = (e) => {
        e.preventDefault();
        let authData = {}
        if (value_org_desc) authData.org_desc = value_org_desc;
        if (value_org_name) authData.org_name = value_org_name;
        if (value_first_name) authData.first_name = value_first_name;
        if (value_last_name) authData.last_name = value_last_name;
        if (phone) authData.org_phone = phone;
        if (country.name) authData.country = country.name;

        onUpdateProfileAction(Object.keys(authData).length !== 0 ? authData : null)
    }

    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const descClasses = desInputIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;
    const orgNameClasses = orgNameInputIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;
    const fNameClasses = fNameInputIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;
    const lNameClasses = lNameInputIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;
    const phoneClasses = phoneIsInValid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;

    return (
        <div className="w-100">
            <section className="w-100">
                <div className={`${classes["contact-col"]} w-100`}>
                    <Form method='post'>
                        <Row className={`justify-content-md-center d-flex flex-column justify-content-center  p-lg-4 align-items-center`}>
                            <Row >
                                <Col xs={0} md lg className={`${fNameClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='first_name'>First Name</label>
                                    {(!first_name || (first_name && isEditing.first_name)) && <>
                                        <input type='text' id='first_name' name="first_name" placeholder="Your First Name" required
                                            onChange={fNameInputChangeHandler} onBlur={fNameInputBlurHandler} defaultValue={first_name ? first_name : ''} />
                                        {(fNameInputIsInvalid) && <p className={classes['error-text']}>Your First Name must not be empty</p>}
                                    </>}
                                    {(first_name && !isEditing.first_name) &&
                                        <p>{first_name} <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="edit" onClick={() => { setEditing((prev) => { return { ...prev, first_name: true } }) }} /></p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${lNameClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='last_name'>Last Name</label>
                                    {(!last_name || (last_name && isEditing.last_name)) && <>
                                        <input type='text' id='last_name' name="last_name" placeholder="Your Last Name"
                                            onChange={lNameInputChangeHandler} onBlur={lNameInputBlurHandler} defaultValue={last_name ? last_name : ''} />
                                        {(lNameInputIsInvalid) && <p className={classes['error-text']}>Your Last Name must not be empty</p>}
                                    </>}
                                    {(last_name && !isEditing.last_name) &&
                                        <p>{last_name} <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="edit" onClick={() => { setEditing((prev) => { return { ...prev, last_name: true } }) }} /></p>
                                    }
                                </Col>
                            </Row>

                            <Row >
                                <Col xs={0} md lg className={`${orgNameClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='org_name'>Organization Name</label>
                                    {(!org_name || (org_name && isEditing.org_name)) && <>
                                        <input type='text' id='org_name' name="org_name" placeholder="Your Organization Name" required
                                            onChange={orgnameInputChangeHandler} onBlur={orgnameInputBlurHandler} defaultValue={org_name ? org_name : ''} />
                                        {(orgNameInputIsInvalid) && <p className={classes['error-text']}>Your Organization Name must not be empty</p>}
                                    </>}
                                    {(org_name && !isEditing.org_name) &&
                                        <p>{org_name} <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="edit" onClick={() => { setEditing((prev) => { return { ...prev, org_name: true } }) }} /></p>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={0} md lg className={`${phoneClasses} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='last_name'>Your Phone Number</label>
                                    {(!org_phone || (org_phone && isEditing.org_phone)) && <>
                                        <PhoneInput
                                            defaultCountry="us"
                                            id='org_phone' name="org_phone"
                                            required
                                            value={phone}
                                            onChange={(phone, { country }) => { setPhone(phone); setCountry(country) }} onBlur={() => { setIsTouched(true) }}
                                        />
                                        {phoneIsInValid && <p className={classes['error-text']}>Your Phone Number is not valid</p>}
                                    </>}
                                    {(org_phone && !isEditing.org_phone) &&
                                        <p>{org_phone} </p>
                                    }
                                </Col>
                                <Col xs={0} md lg className={`${classes["form-control"]} d-flex flex-column align-items-left w-100`} >
                                    <label htmlFor='org_name'>Your Country</label>
                                    {(!org_phone || (org_phone && isEditing.org_phone)) && <>
                                        <input type='text' id='country' name="country" placeholder="Your country Name" readOnly="readonly" style={{ border: 'none' }}
                                            onChange={orgnameInputChangeHandler} onBlur={orgnameInputBlurHandler} value={country.name ? country.name : ''} />
                                    </>}
                                    {(org_phone && !isEditing.org_phone) &&
                                        <p>{userCountry} <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="edit" onClick={() => { setEditing((prev) => { return { ...prev, org_phone: true } }) }} /></p>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={0} md lg className={`${descClasses} d-flex flex-column align-items-left w-100`}>
                                    <label htmlFor='org_desc'>About You</label>
                                    {((org_desc === '') || (org_desc !== '' && isEditing.org_desc)) && <>
                                        <textarea id='org_desc' name="org_desc" cols="30" rows="7" placeholder="About You" required
                                            onChange={desInputChangeHandler} onBlur={desInputBlurHandler} defaultValue={org_desc} />
                                        {desInputIsInvalid && <p className={classes['error-text']}>Your Description Must Not Be Empty</p>}
                                    </>}
                                    {((org_desc !== '') && !isEditing.org_desc) &&
                                        <p>{org_desc} <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="edit" onClick={() => { setEditing((prev) => { return { ...prev, org_desc: true } }) }} /></p>
                                    }
                                </Col>
                            </Row>
                            <Row >
                                <Col xs={0} md lg className={`${classes["form-actions"]} `}>
                                    <button disabled={!formIsValid || isSubmitting} className="btn-glass-primary w-100" style={{ padding: '12px', fontSize: '1rem' }}
                                        onClick={handelSubmit} type="submit">{isSubmitting ? 'Updating...' : "Update"}</button>
                                </Col>
                                <Col xs={0} md lg className={`${classes["form-actions"]} `}>
                                    <button type="button" onClick={cancelHandler} className="btn-glass-danger w-100" style={{ padding: '12px', fontSize: '1rem' }}>Cancel</button>
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                </div>
            </section>
        </div>
    )
}
export default FormProfile