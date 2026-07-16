import React from 'react';
import ModelViewSection from './ModelViewSection';

const AssetDeliveryCallout = ({ hidden = false, fluid = false }) => {
    if (hidden) return null;

    return (
        <ModelViewSection fluid={fluid}>
            <div
                role="status"
                className="global-read-only-field"
                style={{
                    minHeight: 'auto',
                    padding: '16px 20px',
                    marginTop: '2rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    borderLeft: '4px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <ion-icon name="shield-checkmark-outline" style={{ fontSize: '24px', color: 'var(--primary)' }}></ion-icon>
                Model assets are delivered securely after payment is confirmed.
            </div>
        </ModelViewSection>
    );
};

export default AssetDeliveryCallout;
