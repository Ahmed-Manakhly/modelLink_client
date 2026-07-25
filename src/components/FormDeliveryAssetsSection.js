import React from 'react';
import { Row, Col } from 'react-bootstrap';
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
        </>
    );
};

export default FormDeliveryAssetsSection;
