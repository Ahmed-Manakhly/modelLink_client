/* eslint-disable */
import Header from '../components/layout/Header';
import Val from '../components/Val'
import { vals } from '../constants/marketingData';
import banner from '../assets/banner_4.png'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { getAuthToken } from '../utility/tokenLoader'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormActions from '../components/FormActions'
import ProfileCompletionGuard from '../components/ProfileCompletionGuard';
import { getData, getModelByIdReq } from '../lib/loaders';
import { updateModelReq } from '../lib/modelRequests';
import { socket } from '../hooks/useSocket';
import { getVerificationMeReq } from '../lib/verificationRequests';




function EditModel() {
    const navigate = useNavigate();
    const token = getAuthToken();
    const userData = useSelector(state => state.auth.userData) || {};
    const authority = userData.role === 'DEVELOPER';
    const [liveVerificationStatus, setLiveVerificationStatus] = useState(null);
    const IS_VERIFIED = userData ? (userData.isVerified || userData.verification?.status === 'APPROVED' || liveVerificationStatus === 'APPROVED') : false;
    //------------------------------------------------
    const dispatch = useDispatch();
    const [model, setModel] = useState({});
    const [preferredVersionId, setPreferredVersionId] = useState(null);
    const { id } = useParams();
    //------------------------------------------------
    useEffect(() => {
        if (token && authority) {
            getVerificationMeReq(token).then(res => {
                const data = res.data?.data || res.data || {};
                setLiveVerificationStatus(data.verification?.status || null);
            }).catch(() => { });
        }
    }, [token, authority]);

    useEffect(() => {
        if (!token && !authority) {
            let toast = { status: 'error', message: 'you have no access for this!', title: 'Access Denied' };
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
            navigate("/", { replace: true });
            return;
        }
        const timer = setTimeout(() => {
            if (authority && !IS_VERIFIED && liveVerificationStatus !== 'APPROVED') {
                let toast = { status: 'error', message: 'You must be a verified developer to edit AI models.', title: 'Verification Required' };
                dispatch(uiActions.notificationDataChanged(toast))
                dispatch(uiActions.showNotification(true))
                navigate(`/profileSettings`, { replace: true });
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [authority, token, IS_VERIFIED, liveVerificationStatus, dispatch, navigate])
    //------------------------------------------------
    useEffect(() => {

        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast))
        }
        const loadingState = (state) => {
            dispatch(uiActions.showLoading(state))
        }
        const notificationState = (state) => {
            dispatch(uiActions.showNotification(state))
        }
        const gettingData = (data) => {
            setModel(data ? data : null)
        }
        getData(() => getModelByIdReq(id, token ? { Authorization: `Bearer ${token}` } : {}), toastHandler, loadingState, notificationState, gettingData, 'model!')
        dispatch(uiActions.showNotification(false))
    }, [])
    //------------------------------------------
    const reloadModel = (selectVersionId) => {
        const toastHandler = (toast) => dispatch(uiActions.notificationDataChanged(toast));
        const loadingState = (state) => dispatch(uiActions.showLoading(state));
        const notificationState = (state) => dispatch(uiActions.showNotification(state));
        const gettingData = (data) => {
            setModel(data ? data : null);
            if (selectVersionId) setPreferredVersionId(selectVersionId);
        };
        getData(
            () => getModelByIdReq(id, token ? { Authorization: `Bearer ${token}` } : {}),
            toastHandler,
            loadingState,
            notificationState,
            gettingData,
            'model!'
        );
    };
    //------------------------------------------
    const onUpdatingModelAction = (file = null, modelData = null, galleryFiles = null) => {
        async function updatingModelAction(toastHandler, loadingState) {
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
                const response = await updateModelReq(id, formdata, token);
                const resData = response.data;
                loadingState(false);
                toast = { status: resData.status, message: 'Model has been updated', title: 'Updating Model' };
                socket.emit("new_model");
                toastHandler(toast);
                reloadModel(modelData?.versionId ?? preferredVersionId);
            } catch (err) {
                loadingState(false);
                toast = { status: 'error', message: err.response?.data?.message || err.message, title: 'Updating Model failed' };
                toastHandler(toast);
            }
        }
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast));
            dispatch(uiActions.showNotification(true));
        };
        const loadingState = (state) => {
            dispatch(uiActions.showLoading(state));
        };

        updatingModelAction(toastHandler, loadingState);
        dispatch(uiActions.showNotification(false));
    };
    return (
        <>
            <Header
                // txt_1='The ModelLink'
                txt_2=' Getting New Ideas is always amazing'
                txt_3=" Share your insights. Together, we're advancing the frontier of production AI."
                banner={banner}
            />
            {/* <Categories/> */}
            <ProfileCompletionGuard>
                {Object.keys(model).length > 0 && (
                    <FormActions
                        formTitle={'Modify Your Model'}
                        thisModel={model}
                        onCreatingModelAction={onUpdatingModelAction}
                        onModelReload={reloadModel}
                        preferredVersionId={preferredVersionId}
                    />
                )}
            </ProfileCompletionGuard>
            <Val products={vals} title={'A growing collection of production-ready AI models at your fingertips'} />
        </>
    )
}

export default EditModel