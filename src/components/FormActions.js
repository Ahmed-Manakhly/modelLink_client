import classes from './FormActions.module.scss';
import CustomSelect from './ui/CustomSelect';
import { useNavigate, Form as RouterForm, useNavigation, Link } from 'react-router-dom';
import useInput from '../hooks/Use-Input';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import ToggleSwitch from './ToggleSwitch';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import imgHolder from '../assets/modelPlaceholder.png';
import { FILES_BASE_API_URL } from '../lib/api';
import { getCategoriesReq, getModalitiesReq, getBodyPartsReq, getTagsReq, getFeaturesReq, getMetricsReq } from '../lib/loaders';
import { isMedicalSubcategory } from '../lib/categoryHelpers';
import { getPrimaryVersion } from '../lib/modelHelpers';
import { createVersionReq } from '../lib/versionRequests';
import { getAuthToken } from '../utility/tokenLoader';
import VersionAssetsPanel from './ui/VersionAssetsPanel';
import Modal from './layout/Modal';
import { uiActions } from '../store/UI-slice';

const getAssetFromVersion = (version, type) =>
    version?.assets?.find((a) => a.type === type)?.decryptedValue || '';

const FormActions = ({ thisModel = null, formTitle, onCreatingModelAction, onModelReload, preferredVersionId = null }) => {
    const dispatch = useDispatch();
    const authority = useSelector(state => state.auth.userData)?.id;

    const [dbCategories, setDbCategories] = useState([]);
    const [dbModalities, setDbModalities] = useState([]);
    const [dbBodyParts, setDbBodyParts] = useState([]);

    useEffect(() => {
        getCategoriesReq('?subcategoriesOnly=true&limit=500')
            .then(res => setDbCategories(res.data?.data?.categories || []))
            .catch(err => {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error',
                    title: 'Error',
                    message: err?.response?.data?.message || 'Failed to fetch categories'
                }));
                dispatch(uiActions.showNotification(true));
            });

        getModalitiesReq('?limit=500')
            .then(res => setDbModalities(res.data?.data?.modalities || []))
            .catch(err => {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error',
                    title: 'Error',
                    message: err?.response?.data?.message || 'Failed to fetch modalities'
                }));
                dispatch(uiActions.showNotification(true));
            });

        getBodyPartsReq('?limit=500')
            .then(res => setDbBodyParts(res.data?.data?.bodyParts || []))
            .catch(err => {
                dispatch(uiActions.notificationDataChanged({
                    status: 'error',
                    title: 'Error',
                    message: err?.response?.data?.message || 'Failed to fetch body parts'
                }));
                dispatch(uiActions.showNotification(true));
            });
    }, [dispatch]);

    const initialCover = thisModel?.galleryImages?.[0] || null;
    const initialGallery = thisModel?.galleryImages?.length > 1 ? thisModel.galleryImages.slice(1) : [];

    const [file, setFile] = useState(null);
    const [existingCover, setExistingCover] = useState(initialCover);
    const [fda, setFda] = useState(thisModel ? (thisModel.versions?.[0]?.fda || false) : false);
    const [isActive, setIsActive] = useState(thisModel ? (thisModel.versions?.[0]?.isActive ?? true) : true);
    const [isPrimary, setIsPrimary] = useState(thisModel ? (thisModel.versions?.[0]?.isPrimary || false) : false);
    const [status, setStatus] = useState(thisModel ? (thisModel.status || 'DRAFT') : 'DRAFT');

    const [features, setFeatures] = useState(thisModel ? (thisModel.versions?.[0]?.features?.map(f => typeof f === 'string' ? f : f.feature) || []) : []);
    const [metrics, setMetrics] = useState(thisModel ? (thisModel.versions?.[0]?.metrics?.map(m => ({ metric: m.metric, value: m.value, metricsUrl: m.metricsUrl || '' })) || []) : []);
    const [tags, setTags] = useState(thisModel ? (thisModel.tags || []) : []);
    const [galleryImages, setGalleryImages] = useState(initialGallery);

    const [uploadedGalleryFiles, setUploadedGalleryFiles] = useState([]);

    // Stable blob URL for a newly selected cover file (revoke on replace/unmount)
    const [coverBlobUrl, setCoverBlobUrl] = useState(null);
    // Selection by slot key — avoids broken URL equality (createObjectURL returns new refs each call)
    const [selectedImageKey, setSelectedImageKey] = useState('cover');

    const coverBlobUrlRef = useRef(null);
    useEffect(() => {
        coverBlobUrlRef.current = coverBlobUrl;
    }, [coverBlobUrl]);

    useEffect(() => {
        return () => {
            if (coverBlobUrlRef.current) URL.revokeObjectURL(coverBlobUrlRef.current);
        };
    }, []);

    const [tagInput, setTagInput] = useState('');
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [featureSuggestions, setFeatureSuggestions] = useState([]);
    const [metricSuggestions, setMetricSuggestions] = useState([]);



    const [isEditing, setEditing] = useState({
        title: false, categoryId: false, useCases: false, modalityId: false, fdaUrl: false, endpointUrl: false,
        price: false, deliveryTime: false, bodyPart: false, desc: false, version: false, dockerImage: false,
        downloadLink: false, licenseKey: false, huggingFaceUrl: false
    });

    const [isTouched, setIsTouched] = useState({ features: false, metrics: false, tags: false });
    const [isChanged, setIsChanged] = useState(false);
    const [imgWarning, setImgWarning] = useState(false);

    const modelVersions = thisModel?.versions || [];
    const [selectedVersionId, setSelectedVersionId] = useState(null);
    const versionDraftsRef = useRef({});
    const token = getAuthToken();

    const [showAddVersionModal, setShowAddVersionModal] = useState(false);
    const [newVersionCode, setNewVersionCode] = useState('');
    const [newVersionPrice, setNewVersionPrice] = useState('');
    const [addVersionLoading, setAddVersionLoading] = useState(false);
    const [addVersionError, setAddVersionError] = useState('');
    const [assetWarning, setAssetWarning] = useState(false);

    const getSelectedVersion = () => {
        if (!modelVersions.length) return null;
        if (selectedVersionId != null) {
            return modelVersions.find((v) => v.id === selectedVersionId) || getPrimaryVersion(thisModel);
        }
        return getPrimaryVersion(thisModel);
    };

    const featuresIsValid = features.length > 0;
    const featuresIsInValid = !featuresIsValid && isTouched.features;

    const imgRef = useRef(null);
    const galleryInputRef = useRef(null);

    const urlEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

    const { hasError: modelNameIsInvalid, valueIsValid: modelNameIsValid, value: title, valueChangeHandler: modelNameChangeHandler, inputBlurHandler: modelNameBlurHandler } = useInput(value => value.trim() !== '');
    const { hasError: categoryIsInvalid, valueIsValid: categoryIsValid, value: categoryId, valueChangeHandler: categoryChangeHandler, inputBlurHandler: categoryBlurHandler } = useInput(value => value !== '' && value !== '--Please Choose An Option--');
    const { hasError: useCasesIsInvalid, valueIsValid: useCasesIsValid, value: useCases, valueChangeHandler: useCasesChangeHandler, inputBlurHandler: useCasesBlurHandler } = useInput(() => true);
    const { hasError: modalityIsInvalid, valueIsValid: modalityIsValid, value: modalityId, valueChangeHandler: modalityChangeHandler, inputBlurHandler: modalityBlurHandler } = useInput(value => true);
    const { hasError: fdaUrlIsInvalid, valueIsValid: fdaUrlIsValid, value: fdaUrl, valueChangeHandler: fdaUrlChangeHandler, inputBlurHandler: fdaUrlBlurHandler } = useInput(value => value.trim() === '' || urlEx.test(value));
    const { hasError: endpointUrlIsInvalid, valueIsValid: endpointUrlIsValid, value: endpointUrl, valueChangeHandler: endpointUrlChangeHandler, inputBlurHandler: endpointUrlBlurHandler } = useInput(value => value.trim() === '' || urlEx.test(value));
    const { hasError: deliveryTimeIsInvalid, valueIsValid: deliveryTimeIsValid, value: deliveryTime, valueChangeHandler: deliveryTimeChangeHandler, inputBlurHandler: deliveryTimeBlurHandler } = useInput(value => value.trim() !== '' && +value.trim() > 0);
    const { hasError: priceIsInvalid, valueIsValid: priceIsValid, value: price, valueChangeHandler: priceChangeHandler, inputBlurHandler: priceBlurHandler } = useInput(value => value.trim() !== '' && +value.trim() >= 10);
    const { hasError: bodyPartIsInvalid, valueIsValid: bodyPartIsValid, value: bodyPartId, valueChangeHandler: bodyPartChangeHandler, inputBlurHandler: bodyPartBlurHandler } = useInput(value => true);

    // Derived AFTER all useInput hooks — categoryId must be initialized first
    const showMedicalFields = isMedicalSubcategory(categoryId, dbCategories);

    useEffect(() => {
        if (!showMedicalFields) {
            modalityChangeHandler({ target: { value: '' } });
            bodyPartChangeHandler({ target: { value: '' } });
            fdaUrlChangeHandler({ target: { value: '' } });
            setFda(false);
        }
    }, [showMedicalFields, categoryId]);

    const { hasError: descIsInvalid, valueIsValid: descIsValid, value: desc, valueChangeHandler: descChangeHandler, inputBlurHandler: descBlurHandler } = useInput(value => value.trim() !== '');
    const versionEx = /^\d+\.\d+\.\d+$/;
    const { hasError: versionIsInvalid, valueIsValid: versionIsValid, value: version, valueChangeHandler: versionChangeHandler, inputBlurHandler: versionBlurHandler } = useInput(value => value.trim() !== '' && versionEx.test(value));
    const { hasError: dockerImageIsInvalid, valueIsValid: dockerImageIsValid, value: dockerImage, valueChangeHandler: dockerImageChangeHandler, inputBlurHandler: dockerImageBlurHandler } = useInput(value => value.trim() === '' || true);
    const { hasError: downloadLinkIsInvalid, valueIsValid: downloadLinkIsValid, value: downloadLink, valueChangeHandler: downloadLinkChangeHandler, inputBlurHandler: downloadLinkBlurHandler } = useInput(value => value.trim() === '' || urlEx.test(value));
    const { hasError: licenseKeyIsInvalid, valueIsValid: licenseKeyIsValid, value: licenseKey, valueChangeHandler: licenseKeyChangeHandler, inputBlurHandler: licenseKeyBlurHandler } = useInput(value => value.trim() === '' || true);
    const { hasError: huggingFaceUrlIsInvalid, valueIsValid: huggingFaceUrlIsValid, value: huggingFaceUrl, valueChangeHandler: huggingFaceUrlChangeHandler, inputBlurHandler: huggingFaceUrlBlurHandler } = useInput(value => value.trim() === '' || urlEx.test(value));

    const hasAtLeastOneDeliveryAsset = [
        endpointUrl,
        dockerImage,
        downloadLink,
        licenseKey,
        huggingFaceUrl,
    ].some((value) => (value || '').trim() !== '');

    const { hasError: featureIsInvalid, valueIsValid: featureIsValid, value: feature, reset: resetFeature, valueChangeHandler: featureChangeHandler, inputBlurHandler: featureBlurHandler } = useInput(value => value.trim() !== '');
    const { hasError: metricIsInvalid, valueIsValid: metricIsValid, value: metric, reset: resetMetric, valueChangeHandler: metricChangeHandler, inputBlurHandler: metricBlurHandler } = useInput(value => value.trim() !== '');
    const { value: metricValue, reset: resetMetricValue, valueChangeHandler: metricValueChangeHandler } = useInput(value => value.trim() !== '');
    const { value: metricUrl, reset: resetMetricUrl, valueChangeHandler: metricUrlChangeHandler } = useInput(value => value.trim() === '' || urlEx.test(value));

    useEffect(() => {
        if (!thisModel) {
            versionChangeHandler({ target: { value: '1.0.0' } });
        }
    }, [thisModel]);

    useEffect(() => {
        if (!thisModel?.id) return;
        const v = preferredVersionId
            ? modelVersions.find((row) => row.id === preferredVersionId) || getPrimaryVersion(thisModel)
            : getPrimaryVersion(thisModel);
        setSelectedVersionId(v?.id ?? modelVersions[0]?.id ?? null);
        versionDraftsRef.current = {};
        modelNameChangeHandler({ target: { value: thisModel.title || '' } });
        categoryChangeHandler({ target: { value: String(thisModel.categoryId || thisModel.categoryRel?.id || '') } });
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCasesChangeHandler({ target: { value: v?.indications || v?.useCases || '' } });
        modalityChangeHandler({ target: { value: v?.modalityId ? String(v.modalityId) : '' } });
        bodyPartChangeHandler({ target: { value: v?.bodyPartId ? String(v.bodyPartId) : '' } });
        fdaUrlChangeHandler({ target: { value: v?.fdaUrl || '' } });
        priceChangeHandler({ target: { value: v?.price != null ? String(v.price) : '' } });
        deliveryTimeChangeHandler({ target: { value: v?.deliveryTime != null ? String(v.deliveryTime) : '' } });
        descChangeHandler({ target: { value: thisModel.desc || '' } });
        versionChangeHandler({ target: { value: v?.version || '' } });
        endpointUrlChangeHandler({ target: { value: getAssetFromVersion(v, 'API_ENDPOINT') } });
        dockerImageChangeHandler({ target: { value: getAssetFromVersion(v, 'DOCKER_IMAGE') } });
        downloadLinkChangeHandler({ target: { value: getAssetFromVersion(v, 'DOWNLOAD_LINK') } });
        licenseKeyChangeHandler({ target: { value: getAssetFromVersion(v, 'LICENSE_KEY') } });
        huggingFaceUrlChangeHandler({ target: { value: getAssetFromVersion(v, 'HUGGINGFACE_URL') } });
        setFda(v.fda || false);
        setIsActive(v.isActive ?? true);
        setIsPrimary(v.isPrimary || false);
        setFeatures(v?.features?.map((f) => (typeof f === 'string' ? f : f.feature)) || []);
        setMetrics(v?.metrics?.map((m) => ({ metric: m.metric, value: m.value, metricsUrl: m.metricsUrl || '' })) || []);
    }, [thisModel?.id, preferredVersionId]);

    const closeAddVersionModal = () => {
        setShowAddVersionModal(false);
        setNewVersionCode('');
        setNewVersionPrice('');
        setAddVersionError('');
    };

    const handleAddVersionSubmit = async (e) => {
        e.preventDefault();
        if (!versionEx.test(newVersionCode.trim())) {
            setAddVersionError('Version must use semver format (e.g. 1.0.0).');
            return;
        }
        const parsedPrice = parseInt(newVersionPrice, 10);
        if (Number.isNaN(parsedPrice) || parsedPrice < 10) {
            setAddVersionError('Price must be at least $10.');
            return;
        }
        setAddVersionLoading(true);
        setAddVersionError('');
        try {
            const res = await createVersionReq(
                thisModel.id,
                { version: newVersionCode.trim(), price: parsedPrice },
                token
            );
            const newId = res.data?.data?.version?.id;
            closeAddVersionModal();
            setIsChanged(true);
            if (onModelReload) onModelReload(newId);
        } catch (err) {
            setAddVersionError(err?.response?.data?.message || err.message || 'Failed to create version');
        } finally {
            setAddVersionLoading(false);
        }
    };

    const persistCurrentVersionDraft = () => {
        if (!selectedVersionId) return;
        versionDraftsRef.current[selectedVersionId] = {
            price, deliveryTime, version, useCases, modalityId, bodyPartId, fdaUrl,
            endpointUrl, dockerImage, downloadLink, licenseKey, huggingFaceUrl,
            fda, isActive, isPrimary, features, metrics,
        };
    };

    const loadVersionIntoForm = (v) => {
        if (!v) return;
        priceChangeHandler({ target: { value: v.price != null ? String(v.price) : '' } });
        deliveryTimeChangeHandler({ target: { value: v.deliveryTime != null ? String(v.deliveryTime) : '' } });
        versionChangeHandler({ target: { value: v.version || '' } });
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCasesChangeHandler({ target: { value: v.useCases || v.indications || '' } });
        modalityChangeHandler({ target: { value: v.modalityId ? String(v.modalityId) : '' } });
        bodyPartChangeHandler({ target: { value: v.bodyPartId ? String(v.bodyPartId) : '' } });
        fdaUrlChangeHandler({ target: { value: v.fdaUrl || '' } });
        endpointUrlChangeHandler({ target: { value: getAssetFromVersion(v, 'API_ENDPOINT') } });
        dockerImageChangeHandler({ target: { value: getAssetFromVersion(v, 'DOCKER_IMAGE') } });
        downloadLinkChangeHandler({ target: { value: getAssetFromVersion(v, 'DOWNLOAD_LINK') } });
        licenseKeyChangeHandler({ target: { value: getAssetFromVersion(v, 'LICENSE_KEY') } });
        huggingFaceUrlChangeHandler({ target: { value: getAssetFromVersion(v, 'HUGGINGFACE_URL') } });
        setFda(v.fda || false);
        setIsActive(v.isActive ?? true);
        setIsPrimary(v.isPrimary || false);
        setFeatures(v.features?.map((f) => (typeof f === 'string' ? f : f.feature)) || []);
        setMetrics(v.metrics?.map((m) => ({ metric: m.metric, value: m.value, metricsUrl: m.metricsUrl || '' })) || []);
        setEditing({
            title: false, categoryId: false, useCases: false, modalityId: false, fdaUrl: false, endpointUrl: false,
            price: false, deliveryTime: false, bodyPart: false, desc: false, version: false, dockerImage: false,
            downloadLink: false, licenseKey: false, huggingFaceUrl: false,
        });
        setIsChanged(false);
    };

    const handleVersionSelect = (nextId) => {
        const parsedId = parseInt(nextId, 10);
        if (!parsedId || parsedId === selectedVersionId) return;
        persistCurrentVersionDraft();
        setSelectedVersionId(parsedId);
        const draft = versionDraftsRef.current[parsedId];
        const versionRow = modelVersions.find((v) => v.id === parsedId);
        if (draft) {
            loadVersionIntoForm({ ...versionRow, ...draft, features: draft.features, metrics: draft.metrics });
        } else {
            loadVersionIntoForm(versionRow);
        }
    };

    const getClasses = (isInvalid) => isInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;

    const defaultData = { sales: 0, starFrequency: 0, totalStars: 0, reviewCount: 0, userId: authority };

    const getCoverPreviewSrc = () => {
        if (coverBlobUrl) return coverBlobUrl;
        if (existingCover) {
            return existingCover.startsWith('http') ? existingCover : FILES_BASE_API_URL + existingCover;
        }
        return imgHolder;
    };

    const getPreviewForKey = (key) => {
        if (key === 'cover') return getCoverPreviewSrc();
        if (key.startsWith('gallery-url-')) {
            const idx = Number(key.replace('gallery-url-', ''));
            const img = galleryImages[idx];
            if (!img) return imgHolder;
            return img.startsWith('http') ? img : FILES_BASE_API_URL + img;
        }
        if (key.startsWith('gallery-file-')) {
            const idx = Number(key.replace('gallery-file-', ''));
            return uploadedGalleryFiles[idx]?.preview || imgHolder;
        }
        return imgHolder;
    };

    const selectedGalleryImage = getPreviewForKey(selectedImageKey);

    const setCoverFile = (newFile) => {
        if (coverBlobUrl) URL.revokeObjectURL(coverBlobUrl);
        const nextUrl = newFile ? URL.createObjectURL(newFile) : null;
        setCoverBlobUrl(nextUrl);
        setFile(newFile);
        setSelectedImageKey('cover');
    };

    const navigate = useNavigate();
    function cancelHandler() { navigate('..'); }
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    const addFeature = () => {
        if (feature.trim() === '') return;
        setFeatures([...features, feature]);
        setIsChanged(true);
        resetFeature();
    };
    const removeFeature = (index) => {
        const cloned = [...features];
        cloned.splice(index, 1);
        setFeatures(cloned);
        setIsChanged(true);
    };

    const addMetric = () => {
        if (metric.trim() === '') return;
        setMetrics([...metrics, { metric, value: metricValue, metricsUrl: metricUrl }]);
        setIsChanged(true);
        resetMetric();
        resetMetricValue();
        resetMetricUrl();
    };
    const removeMetric = (index) => {
        const cloned = [...metrics];
        cloned.splice(index, 1);
        setMetrics(cloned);
        setIsChanged(true);
    };

    const handleTagInputChange = async (e) => {
        const val = e.target.value;
        setTagInput(val);
        if (val.trim().length > 1) {
            getTagsReq(val.trim(), 10).then(res => setTagSuggestions(res.data?.data?.tags || [])).catch(() => { });
        } else {
            setTagSuggestions([]);
        }
    };

    const handleFeatureInputChange = async (e) => {
        const val = e.target.value;
        featureChangeHandler(e);
        if (val.trim().length > 1) {
            getFeaturesReq(val.trim(), 10).then(res => setFeatureSuggestions(res.data?.data?.features || [])).catch(() => { });
        } else {
            setFeatureSuggestions([]);
        }
    };

    const handleMetricInputChange = async (e) => {
        const val = e.target.value;
        metricChangeHandler(e);
        if (val.trim().length > 1) {
            getMetricsReq(val.trim(), 10).then(res => setMetricSuggestions(res.data?.data?.metrics || [])).catch(() => { });
        } else {
            setMetricSuggestions([]);
        }
    };
    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setIsChanged(true);
        }
        setTagInput('');
        setTagSuggestions([]);
    };
    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
        setIsChanged(true);
    };


    const removeGalleryImage = (index) => {
        const cloned = [...galleryImages];
        cloned.splice(index, 1);
        setGalleryImages(cloned);
        if (selectedImageKey === `gallery-url-${index}`) {
            setSelectedImageKey('cover');
        } else if (selectedImageKey.startsWith('gallery-url-')) {
            const selectedIdx = Number(selectedImageKey.replace('gallery-url-', ''));
            if (selectedIdx > index) {
                setSelectedImageKey(`gallery-url-${selectedIdx - 1}`);
            }
        }
        setIsChanged(true);
    };
    const handleGalleryFiles = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }));
        setUploadedGalleryFiles(prev => {
            const startIdx = prev.length;
            if (previews.length > 0) {
                setSelectedImageKey(`gallery-file-${startIdx}`);
            }
            return [...prev, ...previews];
        });
        setIsChanged(true);
        e.target.value = '';
    };
    const removeUploadedGalleryFile = (index) => {
        const cloned = [...uploadedGalleryFiles];
        URL.revokeObjectURL(cloned[index].preview);
        cloned.splice(index, 1);
        setUploadedGalleryFiles(cloned);
        if (selectedImageKey === `gallery-file-${index}`) {
            setSelectedImageKey('cover');
        } else if (selectedImageKey.startsWith('gallery-file-')) {
            const selectedIdx = Number(selectedImageKey.replace('gallery-file-', ''));
            if (selectedIdx > index) {
                setSelectedImageKey(`gallery-file-${selectedIdx - 1}`);
            }
        }
        setIsChanged(true);
    };

    const handleEditMainViewerImage = (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;

        if (selectedImageKey === 'cover') {
            setCoverFile(newFile);
        } else if (selectedImageKey.startsWith('gallery-file-')) {
            const fileIdx = Number(selectedImageKey.replace('gallery-file-', ''));
            const newPreviews = [...uploadedGalleryFiles];
            if (newPreviews[fileIdx]) {
                URL.revokeObjectURL(newPreviews[fileIdx].preview);
                newPreviews[fileIdx] = {
                    file: newFile,
                    preview: URL.createObjectURL(newFile),
                    name: newFile.name,
                };
                setUploadedGalleryFiles(newPreviews);
                setSelectedImageKey(`gallery-file-${fileIdx}`);
            }
        } else if (selectedImageKey.startsWith('gallery-url-')) {
            const urlIdx = Number(selectedImageKey.replace('gallery-url-', ''));
            const newGalleryImages = [...galleryImages];
            newGalleryImages.splice(urlIdx, 1);
            setGalleryImages(newGalleryImages);

            const newPreview = {
                file: newFile,
                preview: URL.createObjectURL(newFile),
                name: newFile.name,
            };
            setUploadedGalleryFiles(prev => {
                const nextIdx = prev.length;
                setSelectedImageKey(`gallery-file-${nextIdx}`);
                return [...prev, newPreview];
            });
        }
        setIsChanged(true);
        e.target.value = '';
    };

    const handelFdaChange = () => { setFda(prev => !prev); setIsChanged(true); };
    const handelIsActiveChange = () => { setIsActive(prev => !prev); setIsChanged(true); };
    const handelIsPrimaryChange = () => { setIsPrimary(prev => !prev); setIsChanged(true); };
    const handelStatusChange = (e) => { setStatus(e.target.value); setIsChanged(true); };

    const formCompleted = (thisModel &&
        !isEditing.title && !isEditing.categoryId && !isEditing.useCases && !isEditing.modalityId
        && !isEditing.fdaUrl && !isEditing.price && !isEditing.deliveryTime && !isEditing.bodyPartId && !isEditing.desc
        && !isEditing.version && !isEditing.dockerImage && !isEditing.downloadLink && !isEditing.licenseKey && !isEditing.huggingFaceUrl);

    const markEdited = () => {
        if (thisModel) setIsChanged(true);
    };

    const wrapChange = (handler) => (event) => {
        handler(event);
        markEdited();
    };

    const wrapSelectChange = (handler) => (value) => {
        handler({ target: { value } });
        markEdited();
    };

    const featuresRequired = !thisModel;
    const featuresPass = featuresRequired ? featuresIsValid : true;

    const editHasChanges = isChanged || !!file || uploadedGalleryFiles.length > 0;
    const submitGate = thisModel ? editHasChanges : (!formCompleted || isChanged);

    const isFieldValid = (fieldIsEditing, fieldIsValid) => {
        return (thisModel && !fieldIsEditing) || (!thisModel && fieldIsValid) || (thisModel && fieldIsEditing && fieldIsValid);
    };

    let formIsValid = false;
    if (
        isFieldValid(isEditing.title, modelNameIsValid) &&
        isFieldValid(isEditing.categoryId, categoryIsValid) &&
        isFieldValid(isEditing.useCases, useCasesIsValid) &&
        (!showMedicalFields || isFieldValid(isEditing.modalityId, modalityIsValid && modalityId !== '')) &&
        isFieldValid(isEditing.fdaUrl, fdaUrlIsValid) &&
        (!thisModel ? isFieldValid(isEditing.endpointUrl, endpointUrlIsValid) : true) &&
        isFieldValid(isEditing.price, priceIsValid) &&
        isFieldValid(isEditing.deliveryTime, deliveryTimeIsValid) &&
        (!showMedicalFields || isFieldValid(isEditing.bodyPartId, bodyPartIsValid && bodyPartId !== '')) &&
        isFieldValid(isEditing.desc, descIsValid) &&
        isFieldValid(isEditing.version, versionIsValid) &&
        (!thisModel ? (
            isFieldValid(isEditing.dockerImage, dockerImageIsValid) &&
            isFieldValid(isEditing.downloadLink, downloadLinkIsValid) &&
            isFieldValid(isEditing.licenseKey, licenseKeyIsValid) &&
            isFieldValid(isEditing.huggingFaceUrl, huggingFaceUrlIsValid) &&
            hasAtLeastOneDeliveryAsset
        ) : true) &&
        featuresPass &&
        submitGate
    ) {
        formIsValid = true;
    }

    const handelSubmit = (e) => {
        e.preventDefault();
        setImgWarning(false);
        setAssetWarning(false);
        if (!file && !thisModel) {
            setImgWarning(true);
            return;
        }
        if (!thisModel && !hasAtLeastOneDeliveryAsset) {
            setAssetWarning(true);
            return;
        }

        let modelData = {};
        if (!thisModel) modelData = { ...defaultData };

        if (title) modelData.title = title;
        if (categoryId) modelData.categoryId = parseInt(categoryId, 10);
        if (useCases) modelData.indications = useCases;
        if (modalityId) modelData.modalityId = parseInt(modalityId, 10);
        if (fdaUrl) modelData.fdaUrl = fdaUrl;
        if (price) modelData.price = parseInt(price, 10);
        if (deliveryTime) modelData.deliveryTime = parseInt(deliveryTime, 10);
        if (desc) modelData.desc = desc;
        if (bodyPartId) modelData.bodyPartId = parseInt(bodyPartId, 10);
        if (version) modelData.version = version;
        if (!thisModel) {
            modelData.version = '1.0.0';
            if (endpointUrl) modelData.endpointUrl = endpointUrl;
            if (dockerImage) modelData.dockerImage = dockerImage;
            if (downloadLink) modelData.downloadLink = downloadLink;
            if (licenseKey) modelData.licenseKey = licenseKey;
            if (huggingFaceUrl) modelData.huggingFaceUrl = huggingFaceUrl;
        }

        modelData.fda = fda;
        modelData.isActive = isActive;
        modelData.isPrimary = isPrimary;
        modelData.status = status;

        if (thisModel && selectedVersionId) {
            modelData.versionId = selectedVersionId;
        }

        if (features.length > 0) modelData.features = features;
        if (metrics.length > 0) modelData.metrics = metrics;
        if (tags.length > 0) modelData.tags = tags;

        let finalGallery = [];
        if (existingCover && !file) finalGallery.push(existingCover);
        if (galleryImages.length > 0) finalGallery = [...finalGallery, ...galleryImages];
        if (finalGallery.length > 0) modelData.galleryImages = finalGallery;

        const formdata = new FormData();
        if (file) formdata.append('cover', file);
        if (Object.keys(modelData).length > 0) {
            formdata.append('data', JSON.stringify(modelData));
        }
        if (uploadedGalleryFiles.length > 0) {
            uploadedGalleryFiles.forEach((item) => {
                formdata.append('gallery', item.file, item.name);
            });
        }
        onCreatingModelAction(file ? file : null, Object.keys(modelData).length !== 0 ? modelData : null, uploadedGalleryFiles);
    };

    const selectedVersion = getSelectedVersion();
    const getAsset = (type) => getAssetFromVersion(selectedVersion, type);

    const renderInputRow = (label, name, value, hookValue, hookChange, hookBlur, hookInvalid, isEditingField, setEditingField, type = 'text', placeholder = '', isSelect = false, options = []) => {
        const classesName = getClasses(hookInvalid);
        const onChange = wrapChange(hookChange);
        const onSelectChange = wrapSelectChange(hookChange);

        const hasValue = name === 'categoryId' ? (thisModel?.categoryId || thisModel?.categoryRel || thisModel?.category) : thisModel?.[name];
        const displayValue = name === 'categoryId' ? (thisModel?.categoryRel?.name || thisModel?.category || thisModel?.categoryId) : thisModel?.[name];

        return (
            <div className={`${classesName} d-flex flex-column align-items-left w-100 mb-3`} >
                <label htmlFor={name}>{label}</label>
                {(!hasValue || (hasValue && isEditing[setEditingField])) && <>
                    {isSelect ? (
                        <CustomSelect
                            options={options.map(item => ({ label: item.name, value: String(item.id ?? item.name) }))}
                            value={hookValue !== '' ? hookValue : (name === 'categoryId' ? (thisModel?.categoryId || thisModel?.categoryRel?.id || thisModel?.category || '') : (thisModel?.[name] || ''))}
                            onChange={onSelectChange}
                            placeholder={`--Please Choose ${label}--`}

                        />
                    ) : (
                        type === 'textarea' ?
                            <textarea id={name} name={name} cols="30" rows="3" placeholder={placeholder} required onChange={onChange} onBlur={hookBlur} defaultValue={thisModel?.[name] || ''} /> :
                            <input type={type} id={name} name={name} placeholder={placeholder} required onChange={onChange} onBlur={hookBlur} defaultValue={thisModel?.[name] || ''} step={type === 'number' ? "0.01" : undefined} min={type === 'number' ? "0" : undefined} />
                    )}
                    {hookInvalid && <p className={classes['error-text']}>Invalid input for {label}</p>}
                </>}
                {(hasValue && !isEditing[setEditingField]) &&
                    <p>{displayValue} <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="edit" onClick={() => setEditing(prev => ({ ...prev, [setEditingField]: true }))} /></p>
                }
            </div>
        );
    };

    const renderVersionInputRow = (label, name, thisValue, hookValue, hookChange, hookBlur, hookInvalid, isEditingField, setEditingField, type = 'text', placeholder = '', isSelect = false, options = []) => {
        const classesName = getClasses(hookInvalid);
        const onChange = wrapChange(hookChange);
        const onSelectChange = wrapSelectChange(hookChange);
        return (
            <div className={`${classesName} d-flex flex-column align-items-left w-100 mb-3`} >
                <label htmlFor={name}>{label}</label>
                {(!thisValue || (thisValue && isEditing[setEditingField])) && <>
                    {isSelect ? (
                        <CustomSelect
                            options={options.map(item => ({ label: item.name, value: String(item.id ?? item.name) }))}
                            value={hookValue !== '' ? hookValue : (thisValue || '')}
                            onChange={onSelectChange}
                            placeholder={`--Please Choose ${label}--`}

                        />
                    ) : type === 'textarea' ? (
                        <textarea id={name} name={name} cols="30" rows="3" placeholder={placeholder} required onChange={onChange} onBlur={hookBlur} value={hookValue} />
                    ) : (
                        <input type={type} id={name} name={name} placeholder={placeholder} required={type !== 'url' && !placeholder.includes('URL')} onChange={onChange} onBlur={hookBlur} value={hookValue} step={type === 'number' ? "0.01" : undefined} min={type === 'number' ? "0" : undefined} />
                    )}
                    {hookInvalid && <p className={classes['error-text']}>Invalid input for {label}</p>}
                </>}
                {(thisValue && !isEditing[setEditingField]) &&
                    <p>{thisValue} <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="edit" onClick={() => setEditing(prev => ({ ...prev, [setEditingField]: true }))} /></p>
                }
            </div>
        );
    };

    return (
        <div className="w-100 m-0 p-0">
            <section className={`${classes.secpro} w-100`}>
                <h2 className={classes["title"]}>{formTitle}</h2>
                <div className={`g-5 p-0 gap-5 justify-content-center w-100 m-0`}>
                    <Col className={`${classes["contact-col"]} flex-fill`}>
                        <RouterForm method='post'>
                            <div className="d-flex flex-column justify-content-center align-items-center w-100">
                                {/* SECTION 1: CORE IDENTITY (SIDE-BY-SIDE) */}
                                <Row className="w-100 mb-4 glass-container p-4" style={{ gap: '20px' }}>
                                    {/* LEFT: GALLERY UX */}
                                    <Col xs={12} lg={5} className="d-flex flex-column gap-3">
                                        <h4 className="gradient-text" style={{ textAlign: 'left', marginBottom: '15px' }}>Model Gallery</h4>
                                        <div className={`${classes.img_cover} d-flex flex-column align-items-center w-100`} style={{ minHeight: '300px', background: 'var(--gradient-marketing)', border: '1px solid var(--border-glass)', borderRadius: '15px', position: 'relative', overflow: 'hidden', padding: '0' }} >
                                            <input name='cover' type="file" onChange={handleEditMainViewerImage} ref={imgRef} style={{ display: 'none' }} accept="image/*" />
                                            <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', padding: '5px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                                <EditOutlinedIcon style={{ color: 'var(--primary)', cursor: 'pointer' }} titleAccess="Upload Main Cover" onClick={() => imgRef.current.click()} />
                                            </span>
                                            <img src={selectedGalleryImage} alt="Model Main Viewer" style={{ width: '100%', height: '400px', objectFit: 'contain' }} />
                                        </div>

                                        <div className="w-100" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
                                            <div onClick={() => setSelectedImageKey('cover')}
                                                style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', border: selectedImageKey === 'cover' ? '2px solid var(--primary)' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                                <img src={getCoverPreviewSrc()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="cover thumb" />
                                            </div>
                                            {galleryImages.map((img, idx) => (
                                                <div key={`gal-url-${idx}`} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', border: selectedImageKey === `gallery-url-${idx}` ? '2px solid var(--primary)' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={img.startsWith('http') ? img : FILES_BASE_API_URL + img} onClick={() => setSelectedImageKey(`gallery-url-${idx}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                                                    <div onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '0 0 0 5px' }}>&times;</div>
                                                </div>
                                            ))}
                                            {uploadedGalleryFiles.map((item, idx) => (
                                                <div key={`gal-file-${idx}`} style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', border: selectedImageKey === `gallery-file-${idx}` ? '2px solid var(--primary)' : '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={item.preview} onClick={() => setSelectedImageKey(`gallery-file-${idx}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                                                    <div onClick={(e) => { e.stopPropagation(); removeUploadedGalleryFile(idx); }} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '0 0 0 5px' }}>&times;</div>
                                                </div>
                                            ))}
                                            <div onClick={() => galleryInputRef.current?.click()} style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                                                <AddPhotoAlternateIcon />
                                            </div>
                                        </div>

                                        <div className="w-100 d-flex gap-2">
                                            <input ref={galleryInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleGalleryFiles} />


                                        </div>
                                    </Col>

                                    {/* RIGHT: CORE DETAILS */}
                                    <Col xs={12} lg={6} className="d-flex flex-column gap-3">
                                        <h4 className="gradient-text" style={{ textAlign: 'left', marginBottom: '15px' }}>Core Identity</h4>
                                        <Row>
                                            <Col xs={12}>
                                                {renderInputRow('Model Name', 'title', title, title, modelNameChangeHandler, modelNameBlurHandler, modelNameIsInvalid, 'title', 'title')}
                                            </Col>
                                            <Col xs={12}>
                                                {renderInputRow('Model Category (subcategory)', 'categoryId', categoryId, categoryId, categoryChangeHandler, categoryBlurHandler, categoryIsInvalid, 'categoryId', 'categoryId', 'text', '', true, dbCategories)}
                                            </Col>
                                            <Col xs={12}>
                                                {renderVersionInputRow('Model Price (USD)', 'price', selectedVersion?.price, price, priceChangeHandler, priceBlurHandler, priceIsInvalid, 'price', 'price', 'number', '10.00')}
                                            </Col>
                                            <Col xs={12}>
                                                <div className={`${getClasses(false)} d-flex flex-column align-items-left w-100 mb-3`} >
                                                    <label htmlFor='status'>Status</label>
                                                    <div style={{ width: '100%', marginTop: '5px' }}>
                                                        <CustomSelect
                                                            options={[{ label: 'DRAFT', value: 'DRAFT' }, { label: 'PUBLISHED', value: 'PUBLISHED' }, { label: 'SUSPENDED', value: 'SUSPENDED' }]}
                                                            value={status}
                                                            onChange={(val) => handelStatusChange({ target: { value: val } })}
                                                            placeholder="Select Status"

                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/* SECTION 2: PUBLIC SPECIFICATIONS / VERSIONS */}
                                <Row className="w-100 mb-4 glass-container p-4 d-flex flex-column gap-3">
                                    <h4 className="gradient-text" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                        {thisModel ? 'Version specifications' : 'Initial version (v1.0.0)'}
                                        <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)', fontWeight: 'normal', display: 'block', marginTop: '6px' }}>
                                            {thisModel
                                                ? 'Select a version to edit its public specs. Use Add new version for v2+.'
                                                : 'Public specs and delivery assets for your first version. After save you can add more versions on Edit.'}
                                        </span>
                                    </h4>
                                    {thisModel && modelVersions.length >= 1 && (
                                        <Row className="align-items-end">
                                            <Col xs={12} md={6}>
                                                <Row className={`${getClasses(false)} d-flex flex-column align-items-left w-100`}>
                                                    <label htmlFor="versionSelect">Editing Version</label>
                                                    <CustomSelect
                                                        options={modelVersions.map((v) => ({
                                                            label: `${v.version}${v.isPrimary ? ' (primary)' : ''}${v.isActive === false ? ' [inactive]' : ''}`,
                                                            value: String(v.id),
                                                        }))}
                                                        value={selectedVersionId != null ? String(selectedVersionId) : ''}
                                                        onChange={handleVersionSelect}
                                                        placeholder="Select version to edit"

                                                    />
                                                </Row>
                                            </Col>
                                            <Col xs={12} md={6} className="mb-3">
                                                <button type="button" className="btn-glass-outline" onClick={() => {
                                                    setNewVersionCode('');
                                                    setNewVersionPrice(price || String(selectedVersion?.price || ''));
                                                    setAddVersionError('');
                                                    setShowAddVersionModal(true);
                                                }}>
                                                    Add new version
                                                </button>
                                            </Col>
                                        </Row>
                                    )}
                                    <Row>
                                        <Col xs={12} md={6}>
                                            {!thisModel ? (
                                                <Row className={`${getClasses(false)} d-flex flex-column align-items-left w-100`}>
                                                    <label htmlFor="version">Version</label>
                                                    <p style={{ margin: 0, fontWeight: 600 }}>1.0.0</p>
                                                    <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>First version is always 1.0.0. Add v1.1.0, v2.0.0, etc. from Edit after save.</span>
                                                </Row>
                                            ) : (
                                                renderVersionInputRow('Version', 'version', selectedVersion?.version, version, versionChangeHandler, versionBlurHandler, versionIsInvalid, 'version', 'version', 'text', '1.0.0')
                                            )}
                                        </Col>
                                        <Col xs={12} md={6}>
                                            {renderVersionInputRow('Delivery Time (Days)', 'deliveryTime', selectedVersion?.deliveryTime, deliveryTime, deliveryTimeChangeHandler, deliveryTimeBlurHandler, deliveryTimeIsInvalid, 'deliveryTime', 'deliveryTime', 'number', '3')}
                                        </Col>
                                    </Row>
                                    {showMedicalFields && (
                                        <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
                                            Technical specs — optional fields for medical AI listings (modality, anatomy, regulatory).
                                        </p>
                                    )}
                                    <Row>
                                        {showMedicalFields && (
                                            <>
                                                <Col xs={12} md={6}>
                                                    {renderVersionInputRow('Modality', 'modalityId', selectedVersion?.modalityRel?.name, modalityId, modalityChangeHandler, modalityBlurHandler, modalityIsInvalid, 'modalityId', 'modalityId', 'text', '', true, dbModalities)}
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    {renderVersionInputRow('Body Part', 'bodyPartId', selectedVersion?.bodyPartRel?.name, bodyPartId, bodyPartChangeHandler, bodyPartBlurHandler, bodyPartIsInvalid, 'bodyPartId', 'bodyPartId', 'text', '', true, dbBodyParts)}
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            {renderVersionInputRow('Use Cases / Intended Application', 'useCases', selectedVersion?.useCases || selectedVersion?.indications, useCases, useCasesChangeHandler, useCasesBlurHandler, useCasesIsInvalid, 'useCases', 'useCases', 'textarea', 'Describe intended use cases...')}
                                        </Col>
                                        <Col xs={12} md={6}>
                                            {renderInputRow('Model Description', 'desc', desc, desc, descChangeHandler, descBlurHandler, descIsInvalid, 'desc', 'desc', 'textarea', 'Description...')}
                                        </Col>
                                    </Row>
                                    <Row>
                                        {showMedicalFields && (
                                            <Col xs={12} md={6}>
                                                {renderVersionInputRow('FDA URL', 'fdaUrl', selectedVersion?.fdaUrl, fdaUrl, fdaUrlChangeHandler, fdaUrlBlurHandler, fdaUrlIsInvalid, 'fdaUrl', 'fdaUrl', 'url', 'https://fda.gov/...')}
                                            </Col>
                                        )}
                                        <Col xs={12} md={6} className="d-flex align-items-center gap-4">
                                            {showMedicalFields && <ToggleSwitch type='checkbox' name='fda' value={fda} onChange={handelFdaChange} title='FDA Compliant' checked={fda} id='fda' />}
                                            <ToggleSwitch type='checkbox' name='isActive' value={isActive} onChange={handelIsActiveChange} title='Is Active Version' checked={isActive} id='isActive' />
                                            <ToggleSwitch type='checkbox' name='isPrimary' value={isPrimary} onChange={handelIsPrimaryChange} title='Is Primary Version' checked={isPrimary} id='isPrimary' />
                                        </Col>
                                    </Row>
                                </Row>

                                {/* SECTION 3: DELIVERY ASSETS */}
                                {thisModel && selectedVersion && (
                                    <VersionAssetsPanel
                                        version={selectedVersion}
                                        assetsLocked={selectedVersion?.hasPaidOrders === true}
                                        onAssetsChanged={() => onModelReload?.(selectedVersionId)}
                                    />
                                )}
                                {!thisModel && (
                                    <Row className="w-100 mb-4 glass-container p-4 d-flex flex-column gap-3">
                                        <h4 className="gradient-text" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                            Delivery assets (v1.0.0)
                                            <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)', fontWeight: 'normal', display: 'block', marginTop: '6px' }}>
                                                At least one field is required (API endpoint, Docker image, download link, license key, or Hugging Face URL).
                                            </span>
                                        </h4>
                                        {assetWarning && (
                                            <p className={classes['error-text']}>Add at least one delivery asset before submitting.</p>
                                        )}
                                        <Row>
                                            <Col xs={12} md={6}>
                                                {renderVersionInputRow('Endpoint URL', 'endpointUrl', getAsset('API_ENDPOINT'), endpointUrl, endpointUrlChangeHandler, endpointUrlBlurHandler, endpointUrlIsInvalid, 'endpointUrl', 'endpointUrl', 'url', 'https://api.example.com')}
                                            </Col>
                                            <Col xs={12} md={6}>
                                                {renderVersionInputRow('Docker Image', 'dockerImage', getAsset('DOCKER_IMAGE'), dockerImage, dockerImageChangeHandler, dockerImageBlurHandler, dockerImageIsInvalid, 'dockerImage', 'dockerImage', 'text', 'docker.io/your/image:tag')}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                {renderVersionInputRow('Download Link', 'downloadLink', getAsset('DOWNLOAD_LINK'), downloadLink, downloadLinkChangeHandler, downloadLinkBlurHandler, downloadLinkIsInvalid, 'downloadLink', 'downloadLink', 'url', 'https://...')}
                                            </Col>
                                            <Col xs={12} md={6}>
                                                {renderVersionInputRow('License Key', 'licenseKey', getAsset('LICENSE_KEY'), licenseKey, licenseKeyChangeHandler, licenseKeyBlurHandler, licenseKeyIsInvalid, 'licenseKey', 'licenseKey')}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                {renderVersionInputRow('HuggingFace URL', 'huggingFaceUrl', getAsset('HUGGINGFACE_URL'), huggingFaceUrl, huggingFaceUrlChangeHandler, huggingFaceUrlBlurHandler, huggingFaceUrlIsInvalid, 'huggingFaceUrl', 'huggingFaceUrl', 'url', 'https://huggingface.co/...')}
                                            </Col>
                                        </Row>
                                    </Row>
                                )}

                                {/* SECTION 4: DYNAMIC METADATA */}
                                <Col className="w-100 glass-container p-4 mb-4">
                                    <h4 className="gradient-text" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Search & Performance Metadata</h4>
                                    {/* TAGS */}
                                    <Row>
                                        <Col xs={0} md lg className={`${getClasses(false)} d-flex flex-column align-items-left w-100`} >
                                            <label>Model Tags</label>
                                            <Row className={`flex gap-3 items-center mb-5 ${classes.f_con_2}`} style={{ position: 'relative' }}>
                                                <Col>
                                                    <input type='text' placeholder="Add a Tag" value={tagInput} onChange={handleTagInputChange}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                                                    {tagSuggestions.length > 0 && (
                                                        <ul style={{ position: 'absolute', top: '100%', left: '15px', zIndex: 10, background: '#fff', width: 'calc(100% - 30px)', listStyle: 'none', padding: 0, margin: 0, border: '1px solid #ddd', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                                            {tagSuggestions.map((s, idx) => (
                                                                <li key={idx} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                                                    onMouseDown={() => { setTagInput(s); setTagSuggestions([]); }}
                                                                    onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                                    onMouseLeave={(e) => e.target.style.background = '#fff'}
                                                                >
                                                                    {s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </Col>
                                                <Col>
                                                    <button type="button" onClick={addTag} className="btn-glass-outline mt-2 w-100">Add Tag</button>
                                                </Col>
                                            </Row>
                                            <Row className={classes.f_list}>
                                                {tags.map((tag, index) => (
                                                    <Col key={`tag-${index}`} className={classes.f_item}>
                                                        <span className={classes.f_item_title}>{tag}</span>
                                                        <span className={classes.f_item_icon} onClick={() => removeTag(tag)}> X </span>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>

                                    {/* FEATURES */}
                                    <Row>
                                        <Col xs={0} md lg className={`${getClasses(featuresIsInValid)} d-flex flex-column align-items-left w-100`} >
                                            <label htmlFor='feature'>Model Features</label>
                                            <Row className={`flex gap-3 items-center mb-5 ${classes.f_con_2}`}>
                                                <Col>
                                                    <input type='text' id='feature' name="feature" placeholder="Enter Feature Name"
                                                        onChange={handleFeatureInputChange} onBlur={() => setIsTouched({ ...isTouched, features: true })} value={feature} />
                                                    {featureSuggestions.length > 0 && (
                                                        <ul style={{ position: 'absolute', zIndex: 10, background: '#fff', width: '100%', listStyle: 'none', padding: 0, margin: 0, border: '1px solid #ddd', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                                            {featureSuggestions.map((s, idx) => (
                                                                <li key={idx} style={{ padding: '8px 12px', cursor: 'pointer' }} onMouseDown={() => { featureChangeHandler({ target: { value: s } }); setFeatureSuggestions([]); }}>{s}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </Col>
                                                <Col>
                                                    <button type="button" onClick={addFeature} className="btn-glass-outline mt-2 w-100">Add Feature</button>
                                                </Col>
                                            </Row>
                                            {featuresIsInValid && featuresRequired && <p className={classes['error-text']}>Set at least one Feature</p>}
                                            <Row className={classes.f_list}>
                                                {features.map((feat, index) => (
                                                    <Col key={`feat-${index}`} className={classes.f_item}>
                                                        <span className={classes.f_item_title}>{feat}</span>
                                                        <span className={classes.f_item_icon} onClick={() => removeFeature(index)}> X </span>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>

                                    {/* METRICS */}
                                    <Row>
                                        <Col xs={0} md lg className={`${getClasses(false)} d-flex flex-column align-items-left w-100`} >
                                            <label>Model Metrics</label>
                                            <Row className={`flex gap-3 items-center mb-5 ${classes.f_con_2}`}>
                                                <Col xs={12} md={4}>
                                                    <input type='text' placeholder="Metric Name (e.g. Accuracy)" onChange={handleMetricInputChange} value={metric} />
                                                    {metricSuggestions.length > 0 && (
                                                        <ul style={{ position: 'absolute', zIndex: 10, background: '#fff', width: '100%', listStyle: 'none', padding: 0, margin: 0, border: '1px solid #ddd', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                                            {metricSuggestions.map((s, idx) => (
                                                                <li key={idx} style={{ padding: '8px 12px', cursor: 'pointer' }} onMouseDown={() => { metricChangeHandler({ target: { value: s } }); setMetricSuggestions([]); }}>{s}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <input type='text' placeholder="Value (e.g. 98%)" onChange={metricValueChangeHandler} value={metricValue} />
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <input type='text' placeholder="URL (Optional)" onChange={metricUrlChangeHandler} value={metricUrl} />
                                                </Col>
                                                <Col xs={12} md={2}>
                                                    <button type="button" onClick={addMetric} className="btn-glass-outline mt-2 w-100" style={{ padding: '10px' }}>Add Metric</button>
                                                </Col>
                                            </Row>
                                            <Row className={classes.f_list} style={{ flexDirection: 'column', gap: '10px' }}>
                                                {metrics.map((m, index) => (
                                                    <div key={`metric-${index}`} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--primary-glow)', padding: '10px 15px', borderRadius: '8px', color: 'var(--primary)' }}>
                                                        <div style={{ display: 'flex', gap: '20px' }}>
                                                            <strong>{m.metric}:</strong> <span>{m.value}</span>
                                                            {m.metricsUrl && <a href={m.metricsUrl} target="_blank" rel="noreferrer">Link</a>}
                                                        </div>
                                                        <span onClick={() => removeMetric(index)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>&times;</span>
                                                    </div>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>

                                {imgWarning && <p className={classes['error-text']} style={{ textAlign: 'center' }}>Please Select a cover Image</p>}
                                <div className="w-100 mt-4 d-flex flex-column flex-md-row justify-content-between gap-3 m-0 p-0">
                                    <div className="flex-grow-1">
                                        <button onClick={handelSubmit} disabled={!formIsValid || isSubmitting} className="btn-glass-primary w-100" style={{ padding: '12px', fontSize: '1rem' }} type="submit">{isSubmitting ? 'Submitting...' : (thisModel ? "Update" : "Submit")}</button>
                                    </div>
                                    <div className="flex-grow-1">
                                        <button type="button" onClick={cancelHandler} className="btn-glass-danger w-100" style={{ padding: '12px', fontSize: '1rem' }}>Cancel</button>
                                    </div>
                                </div>
                                <div className="w-100 mt-3 d-flex flex-wrap align-items-center" style={{ gap: '4px', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                                    <span>Publishing this model means you agree to the</span>
                                    <Link to="/policy?tab=terms" target="_blank" className="legal-link" style={{ color: 'var(--primary)', display: 'inline-block' }}>Developer Terms</Link>
                                    <span>,</span>
                                    <Link to="/policy?tab=content" target="_blank" className="legal-link" style={{ color: 'var(--primary)', display: 'inline-block' }}>Content Policy</Link>
                                    <span>, and</span>
                                    <Link to="/policy?tab=licensing" target="_blank" className="legal-link" style={{ color: 'var(--primary)', display: 'inline-block' }}>Licensing Rules</Link>
                                    <span>.</span>
                                </div>
                            </div>
                        </RouterForm>
                    </Col>
                </div>
            </section>
            {showAddVersionModal && (
                <Modal onClose={closeAddVersionModal}>
                    <div className="p-4" style={{ background: 'var(--bg-surface)', borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <h5 className="mb-0 gradient-text">Add New Version</h5>
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={closeAddVersionModal} />
                        </div>
                        <Form onSubmit={handleAddVersionSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--on-surface-variant)' }}>Version (semver)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="1.1.0"
                                    value={newVersionCode}
                                    onChange={(e) => setNewVersionCode(e.target.value)}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--on-surface)', padding: '10px' }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--on-surface-variant)' }}>Price (USD)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={10}
                                    placeholder="10"
                                    value={newVersionPrice}
                                    onChange={(e) => setNewVersionPrice(e.target.value)}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--on-surface)', padding: '10px' }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn-glass-danger" onClick={closeAddVersionModal} style={{ padding: '8px 16px' }}>
                                    Close
                                </button>
                                <button type="submit" className="btn-glass-primary" disabled={addVersionLoading} style={{ padding: '8px 16px' }}>
                                    {addVersionLoading ? 'Creating...' : 'Create Version'}
                                </button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default FormActions;
