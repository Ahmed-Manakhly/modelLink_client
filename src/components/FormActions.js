import classes from './FormActions.module.scss';
import CustomSelect from './ui/CustomSelect';
import { useNavigate, Form as RouterForm, useNavigation, Link } from 'react-router-dom';
import { useModelForm } from '../hooks/useModelForm';
import { useGallery } from '../hooks/useGallery';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { getCategoriesReq, getModalitiesReq, getBodyPartsReq, getTagsReq, getFeaturesReq, getMetricsReq } from '../lib/loaders';

import { createVersionReq } from '../lib/versionRequests';
import { getAuthToken } from '../utility/tokenLoader';
import Modal from './layout/Modal';
import { uiActions } from '../store/UI-slice';
import FormIdentitySection from './FormIdentitySection';
import FormVersionSpecsSection from './FormVersionSpecsSection';
import FormDeliveryAssetsSection from './FormDeliveryAssetsSection';

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
    const galleryReturn = useGallery(initialCover, initialGallery);
    const {
        file, uploadedGalleryFiles, existingCover, galleryImages
    } = galleryReturn;

    const useModelFormReturn = useModelForm(thisModel, dbCategories, preferredVersionId);
    const {
        title, modelNameIsValid, categoryId, categoryIsValid, useCases, useCasesIsValid, modalityId, modalityIsValid,
        fdaUrl, fdaUrlIsValid, endpointUrl, endpointUrlIsValid, deliveryTime, deliveryTimeIsValid, price, priceIsValid, bodyPartId, bodyPartIsValid,
        desc, descIsValid, version, versionIsValid, dockerImage, dockerImageIsValid, downloadLink, downloadLinkIsValid, licenseKey, licenseKeyIsValid, huggingFaceUrl, huggingFaceUrlIsValid,
        feature, resetFeature, featureChangeHandler, metric, resetMetric, metricChangeHandler, metricValue, resetMetricValue,
        metricValueChangeHandler, metricUrl, resetMetricUrl, metricUrlChangeHandler, fda, setFda, isActive, setIsActive, isPrimary, setIsPrimary,
        status, setStatus, features, setFeatures, metrics, setMetrics, tags, setTags, tagInput, setTagInput, tagSuggestions,
        setTagSuggestions, featureSuggestions, setFeatureSuggestions, metricSuggestions, setMetricSuggestions, isEditing,
        setEditing, isTouched, setIsTouched, isChanged, setIsChanged, showMedicalFields, hasAtLeastOneDeliveryAsset,
        selectedVersionId, handleVersionSelect
    } = useModelFormReturn;

    const [imgWarning, setImgWarning] = useState(false);
    const token = getAuthToken();

    const [showAddVersionModal, setShowAddVersionModal] = useState(false);
    const [newVersionCode, setNewVersionCode] = useState('');
    const [newVersionPrice, setNewVersionPrice] = useState('');
    const [addVersionLoading, setAddVersionLoading] = useState(false);
    const [addVersionError, setAddVersionError] = useState('');
    const [assetWarning, setAssetWarning] = useState(false);

    const featuresIsValid = features.length > 0;
    const featuresIsInValid = !featuresIsValid && isTouched.features;
    const tagsIsValid = tags.length > 0;
    const tagsIsInValid = !tagsIsValid && isTouched.tags;
    const metricsIsValid = metrics.length > 0;
    const metricsIsInValid = !metricsIsValid && isTouched.metrics;

    const versionEx = /^\d+\.\d+\.\d+$/;

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

    const getClasses = (isInvalid) => isInvalid ? `${classes["form-control"]} ${classes.invalid}` : `${classes["form-control"]}`;

    const defaultData = { sales: 0, starFrequency: 0, totalStars: 0, reviewCount: 0, userId: authority };

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




    const handelFdaChange = () => { setFda(prev => !prev); setIsChanged(true); setEditing(prev => ({ ...prev, fdaUrl: true })); };
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
    const tagsRequired = !thisModel;
    const tagsPass = tagsRequired ? tagsIsValid : true;
    const metricsRequired = !thisModel;
    const metricsPass = metricsRequired ? metricsIsValid : true;

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
        isFieldValid(isEditing.endpointUrl, endpointUrlIsValid) &&
        isFieldValid(isEditing.price, priceIsValid) &&
        isFieldValid(isEditing.deliveryTime, deliveryTimeIsValid) &&
        (!showMedicalFields || isFieldValid(isEditing.bodyPartId, bodyPartIsValid && bodyPartId !== '')) &&
        isFieldValid(isEditing.desc, descIsValid) &&
        isFieldValid(isEditing.version, versionIsValid) &&
        isFieldValid(isEditing.dockerImage, dockerImageIsValid) &&
        isFieldValid(isEditing.downloadLink, downloadLinkIsValid) &&
        isFieldValid(isEditing.licenseKey, licenseKeyIsValid) &&
        isFieldValid(isEditing.huggingFaceUrl, huggingFaceUrlIsValid) &&
        hasAtLeastOneDeliveryAsset &&
        featuresPass &&
        tagsPass &&
        metricsPass &&
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
        if (!hasAtLeastOneDeliveryAsset) {
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

    const getAsset = (type) => getAssetFromVersion(useModelFormReturn.selectedVersion, type);

    const renderInputRow = (label, name, value, hookValue, hookChange, hookBlur, hookInvalid, isEditingField, setEditingField, type = 'text', placeholder = '', isSelect = false, options = []) => {
        const classesName = getClasses(hookInvalid);
        const onChange = wrapChange(hookChange);
        const onSelectChange = wrapSelectChange(hookChange);

        const hasValue = name === 'categoryId' ? (thisModel?.categoryId || thisModel?.categoryRel || thisModel?.category) : thisModel?.[name];
        const displayValue = name === 'categoryId' ? (thisModel?.categoryRel?.name || thisModel?.category || thisModel?.categoryId) : thisModel?.[name];

        return (
        <div className={`${classesName} ${classes.statusWrapper}`}>
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
                            <textarea className="w-100" id={name} name={name} cols="30" rows="3" placeholder={placeholder} required onChange={onChange} onBlur={hookBlur} value={hookValue} /> :
                            <input className="w-100" type={type} id={name} name={name} placeholder={placeholder} required onChange={onChange} onBlur={hookBlur} value={hookValue} step={type === 'number' ? "0.01" : undefined} min={type === 'number' ? "0" : undefined} />
                    )}
                    {hookInvalid && <p className={classes['error-text']}>Invalid input for {label}</p>}
                </>}
                {(hasValue && !isEditing[setEditingField]) &&
                    <p>{displayValue} <EditOutlinedIcon className={classes.editIcon} titleAccess="edit" onClick={() => setEditing(prev => ({ ...prev, [setEditingField]: true }))} /></p>
                }
            </div>
        );
    };

    const renderVersionInputRow = (label, name, thisValue, hookValue, hookChange, hookBlur, hookInvalid, isEditingField, setEditingField, type = 'text', placeholder = '', isSelect = false, options = []) => {
        const classesName = getClasses(hookInvalid);
        const onChange = wrapChange(hookChange);
        const onSelectChange = wrapSelectChange(hookChange);
        return (
        <div className={`${classesName} ${classes.statusWrapper}`}>
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
                        <textarea className="w-100" id={name} name={name} cols="30" rows="3" placeholder={placeholder} required onChange={onChange} onBlur={hookBlur} value={hookValue} />
                    ) : (
                        <input className="w-100" type={type} id={name} name={name} placeholder={placeholder} required={type !== 'url' && !placeholder.includes('URL')} onChange={onChange} onBlur={hookBlur} value={hookValue} step={type === 'number' ? "0.01" : undefined} min={type === 'number' ? "0" : undefined} />
                    )}
                    {hookInvalid && <p className={classes['error-text']}>Invalid input for {label}</p>}
                </>}
                {(thisValue && !isEditing[setEditingField]) &&
                    <p>{thisValue} <EditOutlinedIcon className={classes.editIcon} titleAccess="edit" onClick={() => setEditing(prev => ({ ...prev, [setEditingField]: true }))} /></p>
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
                            <div className={classes.formContainerWrapper}>
                                {/* SECTION 1: CORE IDENTITY (SIDE-BY-SIDE) */}
                                <FormIdentitySection 
                                    classes={classes}
                                    thisModel={thisModel}
                                    form={{ ...useModelFormReturn, dbCategories }}
                                    gallery={galleryReturn}
                                    renderInputRow={renderInputRow}
                                    renderVersionInputRow={renderVersionInputRow}
                                    getClasses={getClasses}
                                    handelStatusChange={handelStatusChange}
                                />

                                {/* SECTION 2: PUBLIC SPECIFICATIONS / VERSIONS */}
                                <FormVersionSpecsSection
                                    classes={classes}
                                    thisModel={thisModel}
                                    form={{ ...useModelFormReturn, dbModalities, dbBodyParts }}
                                    renderInputRow={renderInputRow}
                                    renderVersionInputRow={renderVersionInputRow}
                                    getClasses={getClasses}
                                    setNewVersionCode={setNewVersionCode}
                                    setNewVersionPrice={setNewVersionPrice}
                                    setAddVersionError={setAddVersionError}
                                    setShowAddVersionModal={setShowAddVersionModal}
                                    handelFdaChange={handelFdaChange}
                                    handelIsActiveChange={handelIsActiveChange}
                                    handelIsPrimaryChange={handelIsPrimaryChange}
                                    handleVersionSelect={handleVersionSelect}
                                />

                                {/* SECTION 3: DELIVERY ASSETS */}
                                <FormDeliveryAssetsSection 
                                    classes={classes}
                                    thisModel={thisModel}
                                    form={useModelFormReturn}
                                    getAsset={getAsset}
                                    renderVersionInputRow={renderVersionInputRow}
                                    assetWarning={assetWarning}
                                    onModelReload={onModelReload}
                                />

                                <Col className={classes.metaSection}>
                                    <h4 className={`gradient-text ${classes.sectionTitle}`}>Search & Performance Metadata</h4>
                                    {/* TAGS */}
                                    <Row className="flex gap-3 items-center mb-5">
                                        <Col xs={0} md lg className={`${getClasses(tagsIsInValid)} ${classes.inputWrapper}`} >
                                            <label>Model Tags</label>
                                            <div className={classes.metadataRow}>
                                                <div className={`${classes.relativeCol} ${classes.colHalf}`}>
                                                    <input type='text' placeholder="Add a Tag" value={tagInput} onChange={handleTagInputChange}
                                                        onBlur={() => setIsTouched({ ...isTouched, tags: true })}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                                                    {tagSuggestions.length > 0 && (
                                                        <ul className={classes.autocompleteList}>
                                                            {tagSuggestions.map((s, idx) => (
                                                                <li key={idx} className={classes.autocompleteItem}
                                                                    onMouseDown={() => { setTagInput(s); setTagSuggestions([]); }}
                                                                >
                                                                    {s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className={classes.colHalf}>
                                                    <button type="button" onClick={addTag} className="btn-glass-outline w-100">Add Tag</button>
                                                </div>
                                            </div>
                                            {tagsIsInValid && tagsRequired && <p className={classes['error-text']}>Set at least one Tag</p>}
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
                                        <Col xs={0} md lg className={`${getClasses(featuresIsInValid)} ${classes.inputWrapper}`} >
                                            <label htmlFor='feature'>Model Features</label>
                                            <div className={classes.metadataRow}>
                                                <div className={`${classes.relativeCol} ${classes.colHalf}`}>
                                                    <input type='text' id='feature' name="feature" placeholder="Enter Feature Name"
                                                        onChange={handleFeatureInputChange} onBlur={() => setIsTouched({ ...isTouched, features: true })} value={feature} />
                                                    {featureSuggestions.length > 0 && (
                                                        <ul className={classes.autocompleteList}>
                                                            {featureSuggestions.map((s, idx) => (
                                                                <li key={idx} className={classes.autocompleteItem}
                                                                    onMouseDown={() => { featureChangeHandler({ target: { value: s } }); setFeatureSuggestions([]); }}
                                                                >
                                                                    {s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className={classes.colHalf}>
                                                    <button type="button" onClick={addFeature} className="btn-glass-outline w-100">Add Feature</button>
                                                </div>
                                            </div>
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
                                        <Col xs={0} md lg className={`${getClasses(metricsIsInValid)} ${classes.inputWrapper}`} >
                                            <label>Model Metrics</label>
                                            <div className={classes.metadataRow}>
                                                <div className={`${classes.relativeCol} ${classes.col4}`}>
                                                    <input type='text' placeholder="Metric Name (e.g. Accuracy)" onChange={handleMetricInputChange} onBlur={() => setIsTouched({ ...isTouched, metrics: true })} value={metric} />
                                                    {metricSuggestions.length > 0 && (
                                                        <ul className={classes.autocompleteList}>
                                                            {metricSuggestions.map((s, idx) => (
                                                                <li key={idx} className={classes.autocompleteItem}
                                                                    onMouseDown={() => { metricChangeHandler({ target: { value: s } }); setMetricSuggestions([]); }}
                                                                >
                                                                    {s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className={classes.col3}>
                                                    <input type='text' placeholder="Value (e.g. 98%)" onChange={metricValueChangeHandler} value={metricValue} />
                                                </div>
                                                <div className={classes.col3}>
                                                    <input type='text' placeholder="URL (Optional)" onChange={metricUrlChangeHandler} value={metricUrl} />
                                                </div>
                                                <div className={classes.col2}>
                                                    <button type="button" onClick={addMetric} className="btn-glass-outline w-100 py-2">Add Metric</button>
                                                </div>
                                            </div>
                                            {metricsIsInValid && metricsRequired && <p className={classes['error-text']}>Set at least one Metric</p>}
                                            <Row className={classes.f_list_col}>
                                                {metrics.map((m, index) => (
                                                    <div key={`metric-${index}`} className={classes.metricCard}>
                                                        <div className={classes.metricCardContent}>
                                                            <strong>{m.metric}:</strong> <span>{m.value}</span>
                                                            {m.metricsUrl && <a href={m.metricsUrl} target="_blank" rel="noreferrer">Link</a>}
                                                        </div>
                                                        <span onClick={() => removeMetric(index)} className={classes.removeMetricBtn}>&times;</span>
                                                    </div>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>

                                {imgWarning && <p className={`${classes['error-text']} ${classes.imgWarningText}`}>Please Select a cover Image</p>}
                                <div className={classes.actionButtonsContainer}>
                                    <div className="flex-grow-1">
                                        <button onClick={handelSubmit} disabled={!formIsValid || isSubmitting} className="btn-glass-primary w-100 py-2 fs-6" type="submit">{isSubmitting ? 'Submitting...' : (thisModel ? "Update" : "Submit")}</button>
                                    </div>
                                    <div className="flex-grow-1">
                                        <button type="button" onClick={cancelHandler} className="btn-glass-danger w-100 py-2 fs-6">Cancel</button>
                                    </div>
                                </div>
                                <div className={classes.legalTextContainer}>
                                    <span>Publishing this model means you agree to the</span>
                                    <Link to="/policy?tab=terms" target="_blank" className={`legal-link ${classes.legalLink}`}>Developer Terms</Link>
                                    <span>,</span>
                                    <Link to="/policy?tab=content" target="_blank" className={`legal-link ${classes.legalLink}`}>Content Policy</Link>
                                    <span>, and</span>
                                    <Link to="/policy?tab=licensing" target="_blank" className={`legal-link ${classes.legalLink}`}>Licensing Rules</Link>
                                    <span>.</span>
                                </div>
                            </div>
                        </RouterForm>
                    </Col>
                </div>
            </section>
            {showAddVersionModal && (
                <Modal onClose={closeAddVersionModal}>
                    <div className={`p-4 ${classes.modalContainer}`}>
                        <div className={classes.modalHeader}>
                            <h5 className="mb-0 gradient-text">Add New Version</h5>
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={closeAddVersionModal} />
                        </div>
                        <form onSubmit={handleAddVersionSubmit} className={classes["contact-col"]}>
                            <div className={classes["form-control"]}>
                                <label>Version (semver)</label>
                                <input
                                    type="text"
                                    placeholder="1.1.0"
                                    value={newVersionCode}
                                    onChange={(e) => setNewVersionCode(e.target.value)}
                                    required
                                    className="w-100"
                                />
                            </div>
                            <div className={classes["form-control"]}>
                                <label>Price (USD)</label>
                                <input
                                    type="number"
                                    min={10}
                                    placeholder="10"
                                    value={newVersionPrice}
                                    onChange={(e) => setNewVersionPrice(e.target.value)}
                                    required
                                    className="w-100"
                                />
                            </div>
                            {addVersionError && <p className="text-danger mt-2">{addVersionError}</p>}
                            <div className={classes.modalFooter}>
                                <button type="button" className="btn-glass-danger py-2 px-4" onClick={closeAddVersionModal}>
                                    Close
                                </button>
                                <button type="submit" className="btn-glass-primary py-2 px-4" disabled={addVersionLoading}>
                                    {addVersionLoading ? 'Creating...' : 'Create Version'}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default FormActions;
