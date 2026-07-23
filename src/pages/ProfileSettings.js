/* eslint-disable */
import { Row, Col } from 'react-bootstrap';
import BoxWidgets from '../components/BoxWidgets';
import FormProfile from '../components/FormProfile';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authActions } from '../store/authSlice';
import { getAuthToken } from '../utility/tokenLoader'
import { updateMyProfileReq } from '../lib/userRequests';
import { getVerificationMeReq, submitVerificationReq } from '../lib/verificationRequests';

function ProfileSettings() {
    const token = getAuthToken();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [file, setFile] = useState();
    const [isChanged, setIsChanged] = useState(false);
    const [completionRate, setCompletionRate] = useState(0);
    const userData = useSelector(state => state.auth.userData) || {};
    const { id, role } = userData;
    let avatar = null
    if (userData?.avatar) {
        avatar = userData.avatar;
    }

    const [verification, setVerification] = useState(null);
    const [verifDoc, setVerifDoc] = useState(null);

    useEffect(() => {
        if (token && role === 'DEVELOPER') {
            getVerificationMeReq(token)
                .then(res => {
                    const data = res.data?.data || res.data || {};
                    setVerification(data.verification || null);
                })
                .catch(() => { });
        }
    }, [token, role]);

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        if (!verifDoc) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Verification',
                message: 'Please select a document to upload'
            }));
            dispatch(uiActions.showNotification(true));
            return;
        }
        const formData = new FormData();
        formData.append('document', verifDoc);
        try {
            dispatch(uiActions.showLoading(true));
            const res = await submitVerificationReq(formData, token);
            const data = res.data?.data || res.data || {};
            setVerification(data.verification || null);

            const serverMessage = res.data?.message || 'Verification request submitted successfully.';

            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Verification Submitted',
                message: serverMessage
            }));
            dispatch(uiActions.showNotification(true));
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Verification Failed',
                message: err.response?.data?.message || err.message || 'Failed to submit verification request'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            dispatch(uiActions.showLoading(false));
        }
    };

    const HandelFileChange = (file) => {
        setFile(file)
        setIsChanged(true)
    }
    //==============================================
    const onUpdateProfileAction = (file = null, authData = null) => {

        let toast = { status: '', title: '', message: '' }
        if (!file && !avatar) {
            toast = { status: 'error', message: 'Please Select a cover Image', title: 'Updating Information failed' };
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            return;
        }
        async function updateProfileAction(actions, toastHandler, loadingState) {
            loadingState(true)
            //---------------------------------------------
            const formdata = new FormData();
            if (file) formdata.append('avatar', file);
            if (authData) formdata.append('data', JSON.stringify(authData));
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
                    'Authorization': `Bearer ${token}`,
                }
            };
            try {
                const response = await updateMyProfileReq(formdata, config);
                const resData = response.data;
                loadingState(false)
                const token = localStorage.getItem('token');
                const userData = { ...resData.data.updatedUser, token }
                actions(userData)
                localStorage.setItem('userData', JSON.stringify(userData));
                toast = { status: resData.status, message: resData.message || "Your Informations has been Updated", title: 'Update Informations' }
                toastHandler(toast);
            } catch (err) {
                loadingState(false)
                toast = { status: 'error', message: err.response.data.message, title: 'Updating Information failed' };
                toastHandler(toast);
            }
        }
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
        }
        const actions = (data) => {
            dispatch(authActions.onLogin(data))
        }
        const loadingState = (state) => {
            dispatch(uiActions.showLoading(state))
        }
        updateProfileAction(actions, toastHandler, loadingState)
        dispatch(uiActions.showNotification(false))
        navigate(`/`, { replace: false });
    }
    //==============================================
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="mb-2">
                <h2 className="page-main-title" style={{ textAlign: 'left', margin: '0 0 0.5rem 0' }}>
                    <span className="gradient-text" style={{ fontSize: '2.5rem' }}>Welcome back!</span>
                </h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--on-surface-variant)' }}>Make sure to complete your profile below 👇</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h3 className="mb-3">
                    <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Completion Rate: {completionRate}%
                    </span>
                </h3>
                <div style={{ background: 'var(--surface-glass)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--gradient-text, linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%))', width: `${completionRate}%`, height: '100%', transition: 'width 0.3s ease' }}></div>
                </div>
            </div>

            <Row className="g-4 align-items-stretch">
                <Col xs={12} lg={6}>
                    <BoxWidgets profile={true} HandelFileChange={HandelFileChange} file={file} />
                </Col>
                {role === 'DEVELOPER' && (
                    <Col xs={12} lg={6}>
                        {(() => {
                            const hasDoc = Boolean(verification?.documentUrl);
                            const isApproved = verification?.status === 'APPROVED';
                            const isRejected = verification?.status === 'REJECTED';
                            const isAwaiting = verification?.status === 'PENDING' && hasDoc;
                            // Show upload form when: never submitted, empty PENDING (legacy), or rejected
                            const canSubmit = !verification || (!hasDoc && !isApproved) || isRejected;

                            return (
                                <div className="p-4 glass-container w-100 h-100" style={{ color: 'var(--on-surface)' }}>
                        <h4 style={{ color: 'var(--primary)', fontWeight: 700 }}>Developer Identity Verification</h4>

                        {/* APPROVED */}
                        {isApproved && (
                            <div className="mt-3">
                                <span className="badge bg-success fs-6">APPROVED</span>
                                <p className="text-muted small mt-2">
                                    Verified on {verification.verifiedAt ? new Date(verification.verifiedAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        )}

                        {/* PENDING — document submitted, awaiting admin review */}
                        {isAwaiting && (
                            <div className="mt-3">
                                <span className="badge bg-warning text-dark fs-6">PENDING</span>
                                <p className="text-muted small mt-2">
                                    Document submitted on {verification.createdAt ? new Date(verification.createdAt).toLocaleDateString() : 'N/A'}.
                                    An admin will review your submission shortly.
                                </p>
                            </div>
                        )}

                        {/* REJECTED — show reason + re-submit form */}
                        {isRejected && (
                            <div className="mt-3 mb-2">
                                <span className="badge bg-danger fs-6">REJECTED</span>
                                <p className="text-danger mt-2"><strong>Reason:</strong> {verification.rejectionReason}</p>
                            </div>
                        )}

                        {/* Upload / re-submit form */}
                        {canSubmit && (
                            <form onSubmit={handleVerificationSubmit} className="mt-3">
                                <p style={{ color: 'var(--on-surface-variant)' }}>
                                    {isRejected
                                        ? 'Re-submit a corrected document to try again.'
                                        : 'Submit an official PDF document or image proving your developer or organization credentials to unlock full marketplace publishing privileges.'}
                                </p>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: 'var(--on-surface-variant)' }}>Upload Document (PDF, PNG, JPG)</label>
                                    <input
                                        type="file"
                                        id="verification-file-input"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) => setVerifDoc(e.target.files[0])}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="d-flex align-items-center gap-3 mt-2">
                                        <button 
                                            type="button" 
                                            className="btn-glass-primary"
                                            onClick={() => document.getElementById('verification-file-input').click()}
                                        >
                                            Choose File
                                        </button>
                                        <span style={{ color: 'var(--on-surface-variant)' }}>
                                            {verifDoc ? verifDoc.name : 'No file chosen'}
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn-glass-primary">
                                    {isRejected ? 'Re-Submit Verification' : 'Submit Verification'}
                                </button>
                            </form>
                        )}
                                </div>
                            );
                        })()}
                    </Col>
                )}
            </Row>

            <div className="mt-4">
                <FormProfile onUpdateProfileAction={onUpdateProfileAction?.bind(null, file ? file : null)} isChanged={isChanged} onRateChange={setCompletionRate} />
            </div>

            <div className="mt-4 mb-5">
                <div className="glass-container p-4 w-100" style={{ color: 'var(--on-surface)' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '20px' }}>Legal & Account</h4>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <Link to="/policy?tab=privacy" className="legal-link" style={{ color: 'var(--on-surface-variant)' }}>Privacy Policy</Link>
                        <Link to="/policy?tab=terms" className="legal-link" style={{ color: 'var(--on-surface-variant)' }}>Terms of Service</Link>
                        <Link to="/policy?tab=cookies" className="legal-link" style={{ color: 'var(--on-surface-variant)' }}>Cookies Policy</Link>
                        <Link to="/contact" className="legal-link" style={{ color: 'var(--color-danger)', fontWeight: 600 }}>Request Account Deletion</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileSettings