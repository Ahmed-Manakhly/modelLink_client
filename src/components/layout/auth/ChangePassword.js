import useInput from '../../../hooks/Use-Input';
import { useNavigation, useNavigate } from 'react-router-dom';
import classes from './Auth.module.scss' ;
import { Row , Col  } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/UI-slice' ;
import { changePasswordReq } from '../../../lib/authRequests';
import { getAuthToken } from '../../../utility/tokenLoader';
import { authActions } from '../../../store/authSlice';
import { socket } from '../../../hooks/useSocket';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
    const passRegs = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,16}$/
    
    const navigation = useNavigation() ;
    const isSubmitting = navigation.state === 'submitting' ;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = getAuthToken();
    const userID = useSelector(state => state.auth.userData?.id);

    const {
        value: currentPassword,
        hasError: currentPassIsInvalid,
        valueIsValid: currentPassIsValid,
        valueChangeHandler: currentPassChangeHandler,
        inputBlurHandler: currentPassBlurHandler
    } = useInput(value => value.trim() !== '');

    const {
        value: newPassword,
        hasError: newPassIsInvalid,
        valueIsValid: newPassIsValid,
        valueChangeHandler: newPassChangeHandler,
        inputBlurHandler: newPassBlurHandler
    } = useInput(value => passRegs.test(value));

    const {
        value: newPasswordConfirm,
        hasError: confirmPassIsInvalid,
        valueIsValid: confirmPassIsValid,
        valueChangeHandler: confirmPassChangeHandler,
        inputBlurHandler: confirmPassBlurHandler
    } = useInput(value => value === newPassword);

    let formIsValid = currentPassIsValid && newPassIsValid && confirmPassIsValid;

    const currentPassClasses = currentPassIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;
    const newPassClasses = newPassIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;
    const confirmPassClasses = confirmPassIsInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formIsValid) return;

        dispatch(uiActions.showLoading(true));
        try {
            const response = await changePasswordReq({
                currentPassword,
                newPassword,
                newPasswordConfirm
            }, token);
            dispatch(uiActions.notificationDataChanged({
                status: response.data?.status || 'success',
                message: 'Your password has been changed successfully! Please log in again.',
                title: 'Change Password'
            }));
            dispatch(uiActions.showNotification(true));
            if (userID) {
                socket.emit("leavingRoom", userID);
            }
            dispatch(authActions.onLoginOut());
            navigate('/auth?mode=login', { replace: true });
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                message: err.response?.data?.message || 'Failed to change password',
                title: 'Change Password Failed'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    }

    return (
        <Col className={`d-flex flex-column justify-content-center p-lg-4 align-items-center w-100`}>
            <Row xs={1} className={`${currentPassClasses} d-flex flex-column align-items-center w-100`}>
                <label htmlFor="currentPassword">Current Password</label>
                <input 
                    type="password" 
                    placeholder="Current Password"
                    name="currentPassword" 
                    id='currentPassword'
                    onChange={currentPassChangeHandler} 
                    onBlur={currentPassBlurHandler} 
                />
            </Row>

            <Row xs={1} className={`${newPassClasses} d-flex flex-column align-items-center w-100 mt-3`}>
                <label htmlFor="newPassword">Your New Password</label>
                <input 
                    type="password" 
                    placeholder="New Password" 
                    name="newPassword" 
                    id='newPassword'
                    onChange={newPassChangeHandler} 
                    onBlur={newPassBlurHandler} 
                />
                {newPassIsInvalid && <p className={classes['error-text']}>Password must be at least 12 characters long, including at least one uppercase letter, one lowercase letter, one digit, and one special character.</p>}
            </Row>

            <Row xs={1} className={`${confirmPassClasses} d-flex flex-column align-items-center w-100 mt-3`}>
                <label htmlFor="newPasswordConfirm">Confirm Your New Password</label>
                <input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    name="newPasswordConfirm" 
                    id='newPasswordConfirm'
                    onChange={confirmPassChangeHandler} 
                    onBlur={confirmPassBlurHandler} 
                />
                {confirmPassIsInvalid && <p className={classes['error-text']}>Your password does not match</p>}
            </Row>

            <button
                onClick={handleSubmit}
                type="button"
                disabled={!formIsValid || isSubmitting}
                className={`${classes['form-btn']} d-flex flex-column align-items-center w-100 mt-4`}
            >
                {isSubmitting ? 'Submitting...' : 'Change Password'}
            </button>
        </Col>
    );
}

export default ChangePassword;
