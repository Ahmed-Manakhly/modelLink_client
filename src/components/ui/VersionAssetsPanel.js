import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { getAuthToken } from '../../utility/tokenLoader';
import { createAssetReq, updateAssetReq } from '../../lib/versionRequests';
import classes from '../FormActions.module.scss';

const ASSET_TYPES = [
    { type: 'API_ENDPOINT', label: 'API Endpoint', placeholder: 'https://api.example.com' },
    { type: 'DOCKER_IMAGE', label: 'Docker Image', placeholder: 'docker.io/your/image:tag' },
    { type: 'DOWNLOAD_LINK', label: 'Download Link', placeholder: 'https://...' },
    { type: 'LICENSE_KEY', label: 'License Key', placeholder: 'Enter license key' },
    { type: 'HUGGINGFACE_URL', label: 'Hugging Face URL', placeholder: 'https://huggingface.co/...' },
];

const maskValue = (value) => {
    if (!value) return 'Not set';
    if (value.length <= 8) return '••••••••';
    return `${value.slice(0, 4)}••••${value.slice(-4)}`;
};

const VersionAssetsPanel = ({ version, onAssetsChanged, assetsLocked = false }) => {
    const token = getAuthToken();
    const [drafts, setDrafts] = useState({});
    const [saving, setSaving] = useState(null);
    const [error, setError] = useState('');

    if (!version?.id) return null;

    const assets = version.assets || [];

    const getAsset = (type) => assets.find((a) => a.type === type);

    const handleSave = async (type) => {
        if (assetsLocked) return;
        const value = (drafts[type] ?? '').trim();
        if (!value) return;

        if (['API_ENDPOINT', 'DOWNLOAD_LINK', 'HUGGINGFACE_URL'].includes(type)) {
            try {
                new URL(value);
            } catch (e) {
                setError(`Please enter a valid URL for ${type.replace('_', ' ')}`);
                return;
            }
        } else if (type === 'LICENSE_KEY' && value.length < 10) {
            setError(`Please enter a valid License Key (minimum 10 characters)`);
            return;
        }

        setSaving(type);
        setError('');
        try {
            const existing = getAsset(type);
            if (existing?.id) {
                await updateAssetReq(existing.id, { type, value }, token);
            } else {
                await createAssetReq(version.id, { type, value }, token);
            }
            setDrafts((prev) => ({ ...prev, [type]: '' }));
            onAssetsChanged?.();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Failed to save asset');
        } finally {
            setSaving(null);
        }
    };

    return (
        <Row className={`w-100 mb-4 glass-container p-4 ${classes.formSection}`}>
            <h4 className={`gradient-text ${classes.sectionTitle}`}>
                Delivery assets for v{version.version}
                <span className={classes.subtitle}>
                    {assetsLocked
                        ? 'Locked — this version has paid or delivered orders. Create a new version to ship updated delivery files.'
                        : 'Clients who purchase this version receive these assets. Changes apply to future orders on this version only.'}
                </span>
            </h4>
            {error && (
                <p className={classes['error-text']}>{error}</p>
            )}
            {assetsLocked && !error && (
                <p className={`${classes['error-text']} ${classes.warningText}`}>
                    These assets are locked because this version has been purchased. Create a new version to modify delivery assets.
                </p>
            )}
            {ASSET_TYPES.map(({ type, label, placeholder }) => {
                const existing = getAsset(type);
                return (
                    <Col xs={12} key={type} className={`${classes.assetCard} ${assetsLocked ? classes.locked : ''}`}>
                        <div className={classes.assetCardHeader}>
                            <strong>{label}</strong>
                            <span className={classes.assetTypeBadge}>{type}</span>
                        </div>
                        <p className={classes.assetCardText}>
                            Current: <code className={classes.assetCode}>{maskValue(existing?.decryptedValue)}</code>
                        </p>
                        <Form.Group className="d-flex gap-2 flex-wrap">
                            <Form.Control
                                type={['API_ENDPOINT', 'DOWNLOAD_LINK', 'HUGGINGFACE_URL'].includes(type) ? 'url' : 'text'}
                                placeholder={assetsLocked ? 'Locked for sold versions' : (existing ? 'Replace value…' : placeholder)}
                                value={drafts[type] ?? ''}
                                disabled={assetsLocked}
                                onChange={(e) => setDrafts((prev) => ({ ...prev, [type]: e.target.value }))}
                                className={classes.assetInput}
                            />
                            <button
                                type="button"
                                className={`btn-glass-outline btn-sm ${classes.assetBtn}`}
                                disabled={assetsLocked || !(drafts[type] ?? '').trim() || saving === type}
                                onClick={() => handleSave(type)}
                            >
                                {saving === type ? 'Saving…' : existing ? 'Update' : 'Add'}
                            </button>
                        </Form.Group>
                    </Col>
                );
            })}
        </Row>
    );
};

export default VersionAssetsPanel;
