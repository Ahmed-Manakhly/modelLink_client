import Header from '../components/layout/Header';
import Val from '../components/Val'
import { vals } from '../constants/marketingData';
import banner from '../assets/banner_3.png'
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { getAuthToken } from '../utility/tokenLoader'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormActions from '../components/FormActions'
import ProfileCompletionGuard from '../components/ProfileCompletionGuard';
import { createModelReq } from '../lib/modelRequests';
import { getVerificationMeReq } from '../lib/verificationRequests';
import { socket } from '../hooks/useSocket';

function CreateModel() {
    const navigate = useNavigate();
    const token = getAuthToken();
    const userData = useSelector(state => state.auth.userData) || {};
    const authority = userData.role === 'DEVELOPER';
    const [liveVerificationStatus, setLiveVerificationStatus] = useState(null);
    const IS_VERIFIED = userData ? (userData.isVerified || userData.verification?.status === 'APPROVED' || liveVerificationStatus === 'APPROVED') : false;
    const dispatch = useDispatch();
    //=============================================================================
    useEffect(() => {
        if (!token && !authority) {
            let toast = { status: 'error', message: 'you have no access for this!', title: 'Access Denied' };
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            navigate("/", { replace: true });
            return;
        }
    }, [authority, token, dispatch, navigate])
    //==========================================================================================
    useEffect(() => {
        if (token && authority) {
            getVerificationMeReq(token).then(res => {
                const data = res.data?.data || res.data || {};
                setLiveVerificationStatus(data.verification?.status || null);
            }).catch(() => { });
        }
    }, [token, authority]);

    useEffect(() => {
        // Delay the redirect slightly to allow the live fetch to complete
        const timer = setTimeout(() => {
            if (authority && !IS_VERIFIED && liveVerificationStatus !== 'APPROVED') {
                let toast = { status: 'error', message: 'You must be a verified developer to list AI models.', title: 'Verification Required' };
                dispatch(uiActions.notificationDataChanged(toast))
                dispatch(uiActions.showNotification(true))
                navigate(`/profileSettings`, { replace: true });
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [authority, IS_VERIFIED, liveVerificationStatus, dispatch, navigate])
    //==========================================================================================

    const onCreatingModelAction = async (file, modelData, galleryFiles) => {
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast));
            dispatch(uiActions.showNotification(true));
        };
        const loadingState = (state) => {
            dispatch(uiActions.showLoading(state));
        };

        let toast = { status: '', title: '', message: '' };
        loadingState(true);
        const formdata = new FormData();
        if (file) formdata.append('cover', file);
        if (modelData) {
            formdata.append('data', JSON.stringify(modelData));
        }
        if (galleryFiles && galleryFiles.length > 0) {
            galleryFiles.forEach(item => {
                formdata.append('gallery', item.file, item.name);
            });
        }
        try {
            const response = await createModelReq(formdata, token);
            const resData = response.data;
            loadingState(false);
            toast = { status: resData.status, message: 'Model has been created', title: 'Creating Model' };
            socket.emit("new_model");
            toastHandler(toast);
            const newId = resData?.data?.newAIModel?.id;
            if (newId) {
                navigate(`/models/edit/${newId}`, { replace: true });
            } else {
                navigate('/dashboard-dev', { replace: false });
            }
        } catch (err) {
            loadingState(false);
            toast = { status: 'error', message: err.response?.data?.message || err.message, title: 'Creating Model failed' };
            toastHandler(toast);
        }
        dispatch(uiActions.showNotification(false));
    };
    //==========================================================================================
    return (
        <>
            <Header
                // txt_1='The ModelLink'
                txt_2=' Be part of something bigger'
                txt_3=" Share your insights. Together, we're advancing the frontier of production AI."
                banner={banner}
            />
            {/* <Categories/> */}
            <ProfileCompletionGuard>
                <FormActions formTitle={'Create a New Model'} onCreatingModelAction={onCreatingModelAction} />
            </ProfileCompletionGuard>
            <Val products={vals} title={'A growing collection of production-ready AI models at your fingertips'} />
        </>
    )
}

export default CreateModel