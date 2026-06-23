import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { getAuthToken } from '../../utility/tokenLoader';
import { createAssetReq, updateAssetReq } from '../../lib/versionRequests';

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
        <Row className="w-100 mb-5 d-flex flex-column gap-3">
            <h4 style={{ textAlign: 'left', color: 'red', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                Delivery assets for v{version.version}
                <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal', display: 'block', marginTop: '6px' }}>
                    {assetsLocked
                        ? 'Locked — this version has paid or delivered orders. Create a new version to ship updated delivery files.'
                        : 'Clients who purchase this version receive these assets. Changes apply to future orders on this version only.'}
                </span>
            </h4>
            {error && (
                <p style={{ color: '#c0392b', fontSize: '14px', margin: 0 }}>{error}</p>
            )}
            {ASSET_TYPES.map(({ type, label, placeholder }) => {
                const existing = getAsset(type);
                return (
                    <Col xs={12} key={type} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px', opacity: assetsLocked ? 0.75 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>{label}</strong>
                            <span style={{ fontSize: '12px', color: '#666' }}>{type}</span>
                        </div>
                        <p style={{ fontSize: '13px', marginBottom: '8px' }}>
                            Current: <code>{maskValue(existing?.decryptedValue)}</code>
                        </p>
                        <Form.Group className="d-flex gap-2 flex-wrap">
                            <Form.Control
                                type="text"
                                placeholder={assetsLocked ? 'Locked for sold versions' : (existing ? 'Replace value…' : placeholder)}
                                value={drafts[type] ?? ''}
                                disabled={assetsLocked}
                                onChange={(e) => setDrafts((prev) => ({ ...prev, [type]: e.target.value }))}
                            />
                            <Button
                                type="button"
                                variant="outline-primary"
                                size="sm"
                                disabled={assetsLocked || !(drafts[type] ?? '').trim() || saving === type}
                                onClick={() => handleSave(type)}
                            >
                                {saving === type ? 'Saving…' : existing ? 'Update' : 'Add'}
                            </Button>
                        </Form.Group>
                    </Col>
                );
            })}
        </Row>
    );
};

export default VersionAssetsPanel;
