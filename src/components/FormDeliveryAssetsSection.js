import React from 'react';
import VersionAssetsPanel from './ui/VersionAssetsPanel';

const FormDeliveryAssetsSection = ({
    classes, thisModel, form, getAsset,
    renderVersionInputRow, assetWarning, onModelReload
}) => {
    const {
        selectedVersion, selectedVersionId,
        endpointUrl, endpointUrlChangeHandler, endpointUrlBlurHandler, endpointUrlIsInvalid,
        dockerImage, dockerImageChangeHandler, dockerImageBlurHandler, dockerImageIsInvalid,
        downloadLink, downloadLinkChangeHandler, downloadLinkBlurHandler, downloadLinkIsInvalid,
        licenseKey, licenseKeyChangeHandler, licenseKeyBlurHandler, licenseKeyIsInvalid,
        huggingFaceUrl, huggingFaceUrlChangeHandler, huggingFaceUrlBlurHandler, huggingFaceUrlIsInvalid
    } = form;

    return (
        <>
            {thisModel && selectedVersion && (
                <VersionAssetsPanel
                    version={selectedVersion}
                    assetsLocked={selectedVersion?.hasPaidOrders === true}
                    onAssetsChanged={() => onModelReload?.(selectedVersionId)}
                />
            )}
            {!thisModel && (
                <div className={`w-100 mb-4 glass-container p-4 ${classes.formSection}`}>
                    <h4 className={`gradient-text ${classes.sectionTitle}`}>
                        Delivery assets (v1.0.0)
                        <span className={classes.subtitle}>
                            At least one field is required (API endpoint, Docker image, download link, license key, or Hugging Face URL).
                        </span>
                    </h4>
                    {assetWarning && (
                        <p className={classes['error-text']}>Add at least one delivery asset before submitting.</p>
                    )}
                    <div className={classes.assetRow}>
                        <div className={classes.flexFill}>
                            {renderVersionInputRow('Endpoint URL', 'endpointUrl', getAsset('API_ENDPOINT'), endpointUrl, endpointUrlChangeHandler, endpointUrlBlurHandler, endpointUrlIsInvalid, 'endpointUrl', 'endpointUrl', 'url', 'https://api.example.com')}
                        </div>
                        <div className={classes.flexFill}>
                            {renderVersionInputRow('Docker Image', 'dockerImage', getAsset('DOCKER_IMAGE'), dockerImage, dockerImageChangeHandler, dockerImageBlurHandler, dockerImageIsInvalid, 'dockerImage', 'dockerImage', 'text', 'docker.io/your/image:tag')}
                        </div>
                    </div>
                    <div className={classes.assetRow}>
                        <div className={classes.flexFill}>
                            {renderVersionInputRow('Download Link', 'downloadLink', getAsset('DOWNLOAD_LINK'), downloadLink, downloadLinkChangeHandler, downloadLinkBlurHandler, downloadLinkIsInvalid, 'downloadLink', 'downloadLink', 'url', 'https://...')}
                        </div>
                        <div className={classes.flexFill}>
                            {renderVersionInputRow('License Key', 'licenseKey', getAsset('LICENSE_KEY'), licenseKey, licenseKeyChangeHandler, licenseKeyBlurHandler, licenseKeyIsInvalid, 'licenseKey', 'licenseKey')}
                        </div>
                    </div>
                    <div className={classes.assetRow}>
                        <div className={classes.flexFill}>
                            {renderVersionInputRow('HuggingFace URL', 'huggingFaceUrl', getAsset('HUGGINGFACE_URL'), huggingFaceUrl, huggingFaceUrlChangeHandler, huggingFaceUrlBlurHandler, huggingFaceUrlIsInvalid, 'huggingFaceUrl', 'huggingFaceUrl', 'url', 'https://huggingface.co/...')}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormDeliveryAssetsSection;
