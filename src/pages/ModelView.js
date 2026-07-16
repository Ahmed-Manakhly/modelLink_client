
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/UI-slice';
import { getAuthToken } from '../utility/tokenLoader'
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalWrapper from '../components/layout/GlobalWrapper';
import ModelData from '../components/ModelData'
import ModelDataTop from '../components/ModelDataTop'
import ModelGallery from '../components/ModelGallery'
import ModelBoxWidgets from '../components/ModelBoxWidgets'
import FeedbackList from '../components/FeedbackList'
// eslint-disable-next-line
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getData, getModelByIdReq, getOrdersByModelReq, getModelsByUserReq, getReviewsByModelReq } from '../lib/loaders';
import { createOrderReq } from '../lib/orderRequests';
import DashboardDataSection from '../components/layout/DashboardDataSection'
import { getOrderColumns } from '../utility/tableColumns'
import { Box } from "@mui/material";
import PopularServices from '../components/PopularServices'
import ChatCard from '../components/ChatCard'
import AssetDeliveryCallout from '../components/ui/AssetDeliveryCallout'
import VersionHistoryPanel from '../components/ui/VersionHistoryPanel'
import MetricsComparisonTable from '../components/ui/MetricsComparisonTable'
import { getModelRating } from '../lib/modelHelpers'


//==========================


function ModelView({ onlineUsers, refresh, modelRefresh }) {
    const navigate = useNavigate();
    const token = getAuthToken();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const userData = useSelector(state => state.auth.userData) || {};
    const thisUserRole = userData.role ?? null;
    const thisUserId = userData.id ?? null;


    useEffect(() => {
        if (!token && (thisUserRole === 'DEVELOPER' || thisUserRole === 'ADMIN')) {
            navigate("/auth?mode=login", { replace: true });
        }
    }, [token, thisUserRole, navigate])

    const dispatch = useDispatch();
    const [model, setModel] = useState({});
    const [orders, setOrders] = useState([]);
    const [models, setModels] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [modelUpdated, setModelUpdated] = useState(false);
    const [singleModelUpdated, setSingleModelUpdated] = useState(false);
    const [selectedVersionId, setSelectedVersionId] = useState(null);
    let { id } = useParams();
    const [searchParams] = useSearchParams();
    const versionIdFromQuery = searchParams.get('versionId');


    //------------------------------------------------
    let clientOrders, isBuyer, isSeller, otherDev, otherClient, profileNotCompleted;
    if (orders && model) {
        clientOrders = orders.filter(order => order.clientId === thisUserId)
        isBuyer = clientOrders.length > 0;
        isSeller = model.developerId === thisUserId;
        otherDev = !isSeller && thisUserRole === 'DEVELOPER'
        otherClient = !isBuyer && thisUserRole === 'CLIENT'
    }
    if (otherClient && (!userData.org_name || !userData.org_phone)) {
        profileNotCompleted = true
    }

    const goUpHandler = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
    useEffect(() => {
        goUpHandler()
    }, [model])

    const redirectIfModelForbidden = (err) => {
        const status = err?.response?.status;
        if (status === 403 || status === 404) {
            navigate('/not-found', { replace: true });
            return true;
        }
        return false;
    };

    useEffect(() => {
        const versions = model?.versions || [];
        if (versions.length === 0) {
            setSelectedVersionId(null);
            return;
        }
        if (versionIdFromQuery) {
            const fromQuery = versions.find((v) => String(v.id) === String(versionIdFromQuery));
            if (fromQuery) {
                setSelectedVersionId(fromQuery.id);
                return;
            }
        }
        const primary = versions.find(v => v.isPrimary) || versions[versions.length - 1];
        setSelectedVersionId(primary?.id ?? null);
    }, [model?.versions, model?.id, versionIdFromQuery]);

    useEffect(() => {
        if (refresh) {
            setUpdated(true)
        }
    }, [refresh])
    useEffect(() => {
        if (modelRefresh) {
            setSingleModelUpdated(true)
        }
    }, [modelRefresh])

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
            setModelUpdated(true)
        }
        getData(
            () => getModelByIdReq(id),
            toastHandler,
            loadingState,
            notificationState,
            gettingData,
            'model!',
            { onError: redirectIfModelForbidden }
        )
        dispatch(uiActions.showNotification(false))
    // eslint-disable-next-line
    }, [id, dispatch, navigate])
    //------------------------------------------
    useEffect(() => {
        if (singleModelUpdated) {
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
                setModelUpdated(true)
            }
            getData(
                () => getModelByIdReq(id),
                toastHandler,
                loadingState,
                notificationState,
                gettingData,
                'model details!',
                { onError: redirectIfModelForbidden }
            )
            dispatch(uiActions.showNotification(false))
            setSingleModelUpdated(false)
        }
    // eslint-disable-next-line
    }, [singleModelUpdated, id, dispatch, navigate])
    //------------------------------------------
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
            setOrders(data ? data : [])
        }
        if (!token) return;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        getData(() => getOrdersByModelReq(id, '', headers), toastHandler, loadingState, notificationState, gettingData, 'Orders!')
        dispatch(uiActions.showNotification(false))
    }, [dispatch, id, token])
    //----------------------------------------------------
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
            setReviews(data ? data?.allReviews : [])
        }
        const headers = token ? {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        } : {};
        getData(() => getReviewsByModelReq(id, headers), toastHandler, loadingState, notificationState, gettingData, 'Reviews!', { silent: true })
    }, [token, id, dispatch])
    //----------------------------------------------------
    useEffect(() => {
        if (updated) {
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
                setReviews(data ? data?.allReviews : [])
            }
            const headers = token ? {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            } : {};
            getData(() => getReviewsByModelReq(id, headers), toastHandler, loadingState, notificationState, gettingData, 'Reviews!', { silent: true })
            setUpdated(false)
        }

    }, [dispatch, id, token, updated])
    //----------------------------------------------------
    useEffect(() => {

        if (updated) {
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
                setOrders(data ? data : [])
            }
            if (!token) {
                setUpdated(false);
                return;
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            getData(() => getOrdersByModelReq(id, '', headers), toastHandler, loadingState, notificationState, gettingData, 'Orders!')
            setUpdated(false)
        }
    }, [updated, id, dispatch, token])
    //----------------------------------------------------
    useEffect(() => {
        if (modelUpdated) {
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
                setModels(data ? data : [])
            }
            getData(() => getModelsByUserReq(model?.developerId), toastHandler, loadingState, notificationState, gettingData, 'other models!')
            setModelUpdated(false)
        }
    }, [modelUpdated, dispatch, model?.developerId,])
    const orderRequestHandler = () => {
        if (!token) {
            navigate('/auth?mode=login');
            return;
        }
        async function onOrderRequestHandler(toastHandler, loadingState) {
            let toast = { status: '', title: '', message: '' }
            loadingState(true)
            const requestData = {
                id: parseInt(id, 10),
                aiModelId: parseInt(id, 10),
                ...(selectedVersionId ? { versionId: parseInt(selectedVersionId, 10) } : {})
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            try {
                const response = await createOrderReq(requestData, headers);
                const resData = response.data;
                const orderId = resData?.data?.order?.id;
                loadingState(false)
                toast = {
                    status: 'success',
                    message: 'Order created! Complete payment below to confirm your purchase.',
                    title: 'Order Created',
                };
                toastHandler(toast);
                if (orderId) {
                    navigate(`/order/view/${orderId}`, { state: { fromOrderCreation: true } });
                } else {
                    setUpdated(true);
                }
            } catch (err) {
                loadingState(false)
                toast = { status: 'error', message: err?.response?.data?.message || err.message, title: 'Creating Order failed' };
                toastHandler(toast);
            }
        }
        const toastHandler = (toast) => {
            dispatch(uiActions.notificationDataChanged(toast))
            dispatch(uiActions.showNotification(true))
        }
        const loadingState = (state) => {
            dispatch(uiActions.showLoading(state))
        }
        onOrderRequestHandler(toastHandler, loadingState)
    }
    //------------------------- columns

    const reviewVersionMap = useMemo(() => {
        const map = {};
        (model?.versions || []).forEach((v) => {
            if (v?.id != null) map[v.id] = v.version;
        });
        return map;
    }, [model?.versions]);

    const modelForDisplay = useMemo(() => {
        if (!model?.id || getModelRating(model) > 0 || !reviews.length) return model;
        const totalStars = reviews.reduce((sum, review) => sum + (Number(review.star) || 0), 0);
        const reviewCount = reviews.length;
        return {
            ...model,
            totalStars,
            reviewCount,
            starFrequency: reviewCount,
        };
    }, [model, reviews]);

    const visibleVersions = useMemo(() => {
        const all = model?.versions || [];
        if (isSeller && model?.status === 'DRAFT') return all;
        return all.filter((v) => v.isActive !== false);
    }, [model?.versions, isSeller, model?.status]);

    const otherModels = useMemo(() => {
        if (!models || !model?.id) return [];
        return models.filter(m => parseInt(m.id, 10) !== parseInt(model.id, 10));
    }, [models, model?.id]);

    //--------------------------------------------------
    return (
        <GlobalWrapper className="global-page-margin-top py-5">
            {(model && isLoggedIn && !isSeller) && (
                <ChatCard userData={model?.developer} userId={model?.developerId} onlineUsers={onlineUsers} />
            )}
            <ModelGallery images={model?.galleryImages} alt={model?.title} />
            <ModelDataTop formTitle={'Model Details..'} model={modelForDisplay} selectedVersionId={selectedVersionId} />
            <ModelBoxWidgets
                model={model}
                orderRequestHandler={orderRequestHandler}
                isBuyer={isBuyer}
                otherDev={otherDev}
                isSeller={isSeller}
                profileNotCompleted={profileNotCompleted}
                selectedVersionId={selectedVersionId}
                onVersionChange={setSelectedVersionId}
                modelCount={models.length}
            />
            <VersionHistoryPanel
                fluid={true}
                versions={model?.versions || []}
                selectedVersionId={selectedVersionId}
                onSelect={setSelectedVersionId}
                showInactive={Boolean(isSeller && model?.status === 'DRAFT')}
            />
            <div className="mt-5 pt-3 w-100">
                <MetricsComparisonTable fluid={true} versions={visibleVersions} />
            </div>
            <AssetDeliveryCallout fluid={true} hidden={isSeller && model?.status === 'DRAFT'} />
            <ModelData formTitle={''} model={model} selectedVersionId={selectedVersionId} />
            {isSeller && (
                <DashboardDataSection
                    fluid={true}
                    getData={(query) => getOrdersByModelReq(id, typeof query === 'string' ? query : '', { 'Authorization': `Bearer ${token}` })}
                    contentType="orders"
                    columns={getOrderColumns()}
                    tableTitle="Orders Made On This Model"
                />
            )}
            {isBuyer && (
                <DashboardDataSection
                    fluid={true}
                    getData={(query) => getOrdersByModelReq(id, `?clientId=${thisUserId}` + ((query && typeof query === 'string') ? '&' + query.replace('?', '') : ''), { 'Authorization': `Bearer ${token}` })}
                    contentType="orders"
                    columns={getOrderColumns()}
                    tableTitle="Orders You Made On This Model"
                />
            )}
            {!isLoggedIn && (
                <Box className="glass-container" sx={{ textAlign: 'center', padding: '40px 20px', margin: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h4 className="gradient-text mb-2" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Want to connect or purchase?</h4>
                    <p style={{ color: 'var(--on-surface-variant)', marginBottom: '25px', fontSize: '15px' }}>
                        Please log in to message the developer and place orders on this model.
                    </p>
                    <Link to="/auth?mode=login" className="btn-glass-primary" style={{ padding: '10px 25px' }}>
                        Log In Now
                    </Link>
                </Box>
            )}
            {reviews.length > 0 && (
                <FeedbackList rev={reviews} formTitle='Reviews for this model' versionMap={reviewVersionMap} />
            )}
            {otherModels.length > 0 && (
                <div className="mt-5 pt-3 w-100">
                    <PopularServices fluid={true} models={otherModels.slice(0, 10)} title={<span className="gradient-text">More Models Made By This Developer</span>} titleClassName="page-main-title m-0" />
                </div>
            )}
        </GlobalWrapper>
    )
}

export default ModelView