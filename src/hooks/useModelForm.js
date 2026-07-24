import { useState, useEffect, useRef } from 'react';
import useInput from './Use-Input';
import { isMedicalSubcategory } from '../lib/categoryHelpers';
import { getPrimaryVersion } from '../lib/modelHelpers';


const urlEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
const versionEx = /^\d+\.\d+\.\d+$/;

const getAssetFromVersion = (version, type) =>
    version?.assets?.find((a) => a.type === type)?.decryptedValue || '';

export const useModelForm = (thisModel, dbCategories, preferredVersionId) => {
    const { hasError: modelNameIsInvalid, valueIsValid: modelNameIsValid, value: title, valueChangeHandler: modelNameChangeHandler, inputBlurHandler: modelNameBlurHandler } = useInput(value => value.trim() !== '');
    const { hasError: categoryIsInvalid, valueIsValid: categoryIsValid, value: categoryId, valueChangeHandler: categoryChangeHandler, inputBlurHandler: categoryBlurHandler } = useInput(value => value !== '' && value !== '--Please Choose An Option--');
    const { hasError: useCasesIsInvalid, valueIsValid: useCasesIsValid, value: useCases, valueChangeHandler: handleUseCasesChange, inputBlurHandler: handleUseCasesBlur } = useInput(value => value.trim() !== '');
    const { hasError: modalityIsInvalid, valueIsValid: modalityIsValid, value: modalityId, valueChangeHandler: modalityChangeHandler, inputBlurHandler: modalityBlurHandler } = useInput(value => true);
    
    // showMedicalFields is computed from categoryId
    const showMedicalFields = isMedicalSubcategory(categoryId, dbCategories);

    const { hasError: fdaUrlIsInvalid, valueIsValid: fdaUrlIsValid, value: fdaUrl, valueChangeHandler: fdaUrlChangeHandler, inputBlurHandler: fdaUrlBlurHandler } = useInput(value => {
        if (showMedicalFields) return value.trim() !== '' && urlEx.test(value);
        return value.trim() === '' || urlEx.test(value);
    });

    // We will calculate hasAtLeastOneDeliveryAsset manually here for the closures
    // Wait, useInput relies on the latest value passed, but we don't have the values yet!
    // We can just rely on the fact that if a field is empty, and we want to validate it, we can't easily reference the other hooks' values before they are declared.
    // Let's declare the hooks first, then we can't use `endpointUrl` inside its own useInput initialization unless we pass a function that reads them.
    // Wait, React hooks closures will capture the values from the PREVIOUS render. This is fine!

    const { hasError: deliveryTimeIsInvalid, valueIsValid: deliveryTimeIsValid, value: deliveryTime, valueChangeHandler: deliveryTimeChangeHandler, inputBlurHandler: deliveryTimeBlurHandler } = useInput(value => value.trim() !== '' && +value.trim() > 0);
    const { hasError: priceIsInvalid, valueIsValid: priceIsValid, value: price, valueChangeHandler: priceChangeHandler, inputBlurHandler: priceBlurHandler } = useInput(value => value.trim() !== '' && +value.trim() >= 10);
    const { hasError: bodyPartIsInvalid, valueIsValid: bodyPartIsValid, value: bodyPartId, valueChangeHandler: bodyPartChangeHandler, inputBlurHandler: bodyPartBlurHandler } = useInput(value => true);
    const { hasError: descIsInvalid, valueIsValid: descIsValid, value: desc, valueChangeHandler: descChangeHandler, inputBlurHandler: descBlurHandler } = useInput(value => value.trim() !== '');
    const { hasError: versionIsInvalid, valueIsValid: versionIsValid, value: version, valueChangeHandler: versionChangeHandler, inputBlurHandler: versionBlurHandler } = useInput(value => value.trim() !== '' && versionEx.test(value));

    const endpointUrlData = useInput(value => value.trim() === '' || urlEx.test(value));
    const dockerImageData = useInput(value => value.trim() === '' || value.trim().length >= 3);
    const downloadLinkData = useInput(value => value.trim() === '' || urlEx.test(value));
    const licenseKeyData = useInput(value => value.trim() === '' || value.trim().length >= 3);
    const huggingFaceUrlData = useInput(value => value.trim() === '' || urlEx.test(value));

    const endpointUrl = endpointUrlData.value;
    const dockerImage = dockerImageData.value;
    const downloadLink = downloadLinkData.value;
    const licenseKey = licenseKeyData.value;
    const huggingFaceUrl = huggingFaceUrlData.value;

    const hasAtLeastOneDeliveryAsset = [
        endpointUrl, dockerImage, downloadLink, licenseKey, huggingFaceUrl
    ].some((value) => (value || '').trim() !== '');

    // Now override the hasError flag dynamically to enforce the "at least one" rule
    const endpointUrlIsInvalid = (!hasAtLeastOneDeliveryAsset && endpointUrlData.isTouched) || endpointUrlData.hasError;
    const dockerImageIsInvalid = (!hasAtLeastOneDeliveryAsset && dockerImageData.isTouched) || dockerImageData.hasError;
    const downloadLinkIsInvalid = (!hasAtLeastOneDeliveryAsset && downloadLinkData.isTouched) || downloadLinkData.hasError;
    const licenseKeyIsInvalid = (!hasAtLeastOneDeliveryAsset && licenseKeyData.isTouched) || licenseKeyData.hasError;
    const huggingFaceUrlIsInvalid = (!hasAtLeastOneDeliveryAsset && huggingFaceUrlData.isTouched) || huggingFaceUrlData.hasError;

    // Map everything to the same names expected by the return block
    const endpointUrlIsValid = endpointUrlData.valueIsValid;
    const endpointUrlChangeHandler = endpointUrlData.valueChangeHandler;
    const endpointUrlBlurHandler = endpointUrlData.inputBlurHandler;

    const dockerImageIsValid = dockerImageData.valueIsValid;
    const dockerImageChangeHandler = dockerImageData.valueChangeHandler;
    const dockerImageBlurHandler = dockerImageData.inputBlurHandler;

    const downloadLinkIsValid = downloadLinkData.valueIsValid;
    const downloadLinkChangeHandler = downloadLinkData.valueChangeHandler;
    const downloadLinkBlurHandler = downloadLinkData.inputBlurHandler;

    const licenseKeyIsValid = licenseKeyData.valueIsValid;
    const licenseKeyChangeHandler = licenseKeyData.valueChangeHandler;
    const licenseKeyBlurHandler = licenseKeyData.inputBlurHandler;

    const huggingFaceUrlIsValid = huggingFaceUrlData.valueIsValid;
    const huggingFaceUrlChangeHandler = huggingFaceUrlData.valueChangeHandler;
    const huggingFaceUrlBlurHandler = huggingFaceUrlData.inputBlurHandler;

    const { value: feature, reset: resetFeature, valueChangeHandler: featureChangeHandler } = useInput(value => value.trim() !== '');
    const { value: metric, reset: resetMetric, valueChangeHandler: metricChangeHandler } = useInput(value => value.trim() !== '');
    const { value: metricValue, reset: resetMetricValue, valueChangeHandler: metricValueChangeHandler } = useInput(value => value.trim() !== '');
    const { value: metricUrl, reset: resetMetricUrl, valueChangeHandler: metricUrlChangeHandler } = useInput(value => value.trim() === '' || urlEx.test(value));

    const [fda, setFda] = useState(thisModel ? (thisModel.versions?.[0]?.fda || false) : false);
    const [isActive, setIsActive] = useState(thisModel ? (thisModel.versions?.[0]?.isActive ?? true) : true);
    const [isPrimary, setIsPrimary] = useState(thisModel ? (thisModel.versions?.[0]?.isPrimary || false) : false);
    const [status, setStatus] = useState(thisModel ? (thisModel.status || 'DRAFT') : 'DRAFT');

    const [features, setFeatures] = useState(thisModel ? (thisModel.versions?.[0]?.features?.map(f => typeof f === 'string' ? f : f.feature) || []) : []);
    const [metrics, setMetrics] = useState(thisModel ? (thisModel.versions?.[0]?.metrics?.map(m => ({ metric: m.metric, value: m.value, metricsUrl: m.metricsUrl || '' })) || []) : []);
    const [tags, setTags] = useState(thisModel ? (thisModel.tags || []) : []);

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
    
    const [selectedVersionId, setSelectedVersionId] = useState(null);
    const versionDraftsRef = useRef({});



    useEffect(() => {
        if (!showMedicalFields) {
            modalityChangeHandler({ target: { value: '' } });
            bodyPartChangeHandler({ target: { value: '' } });
            fdaUrlChangeHandler({ target: { value: '' } });
            setFda(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showMedicalFields, categoryId]);

    useEffect(() => {
        if (!thisModel) {
            versionChangeHandler({ target: { value: '1.0.0' } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thisModel]);

    const modelVersions = thisModel?.versions || [];

    useEffect(() => {
        if (!thisModel?.id) return;
        const v = preferredVersionId
            ? modelVersions.find((row) => row.id === preferredVersionId) || getPrimaryVersion(thisModel)
            : getPrimaryVersion(thisModel);
        setSelectedVersionId(v?.id ?? modelVersions[0]?.id ?? null);
        versionDraftsRef.current = {};
        modelNameChangeHandler({ target: { value: thisModel.title || '' } });
        categoryChangeHandler({ target: { value: String(thisModel.categoryId || thisModel.categoryRel?.id || '') } });
        handleUseCasesChange({ target: { value: v?.indications || v?.useCases || '' } });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thisModel?.id, preferredVersionId]);

    const getSelectedVersion = () => {
        if (!modelVersions.length) return null;
        if (selectedVersionId != null) {
            return modelVersions.find((v) => v.id === selectedVersionId) || getPrimaryVersion(thisModel);
        }
        return getPrimaryVersion(thisModel);
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
        handleUseCasesChange({ target: { value: v.useCases || v.indications || '' } });
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

    return {
        title, modelNameIsValid, modelNameIsInvalid, modelNameChangeHandler, modelNameBlurHandler,
        categoryId, categoryIsValid, categoryIsInvalid, categoryChangeHandler, categoryBlurHandler,
        useCases, useCasesIsValid, useCasesIsInvalid, handleUseCasesChange, handleUseCasesBlur,
        modalityId, modalityIsValid, modalityIsInvalid, modalityChangeHandler, modalityBlurHandler,
        fdaUrl, fdaUrlIsValid, fdaUrlIsInvalid, fdaUrlChangeHandler, fdaUrlBlurHandler,
        endpointUrl, endpointUrlIsValid, endpointUrlIsInvalid, endpointUrlChangeHandler, endpointUrlBlurHandler,
        deliveryTime, deliveryTimeIsValid, deliveryTimeIsInvalid, deliveryTimeChangeHandler, deliveryTimeBlurHandler,
        price, priceIsValid, priceIsInvalid, priceChangeHandler, priceBlurHandler,
        bodyPartId, bodyPartIsValid, bodyPartIsInvalid, bodyPartChangeHandler, bodyPartBlurHandler,
        desc, descIsValid, descIsInvalid, descChangeHandler, descBlurHandler,
        version, versionIsValid, versionIsInvalid, versionChangeHandler, versionBlurHandler,
        dockerImage, dockerImageIsValid, dockerImageIsInvalid, dockerImageChangeHandler, dockerImageBlurHandler,
        downloadLink, downloadLinkIsValid, downloadLinkIsInvalid, downloadLinkChangeHandler, downloadLinkBlurHandler,
        licenseKey, licenseKeyIsValid, licenseKeyIsInvalid, licenseKeyChangeHandler, licenseKeyBlurHandler,
        huggingFaceUrl, huggingFaceUrlIsValid, huggingFaceUrlIsInvalid, huggingFaceUrlChangeHandler, huggingFaceUrlBlurHandler,
        feature, resetFeature, featureChangeHandler,
        metric, resetMetric, metricChangeHandler,
        metricValue, resetMetricValue, metricValueChangeHandler,
        metricUrl, resetMetricUrl, metricUrlChangeHandler,
        fda, setFda,
        isActive, setIsActive,
        isPrimary, setIsPrimary,
        status, setStatus,
        features, setFeatures,
        metrics, setMetrics,
        tags, setTags,
        tagInput, setTagInput,
        tagSuggestions, setTagSuggestions,
        featureSuggestions, setFeatureSuggestions,
        metricSuggestions, setMetricSuggestions,
        isEditing, setEditing,
        isTouched, setIsTouched,
        isChanged, setIsChanged,
        showMedicalFields,
        hasAtLeastOneDeliveryAsset,
        modelVersions,
        selectedVersionId,
        getSelectedVersion,
        handleVersionSelect,
    };
};
