import React from 'react';
import ModelViewSection from './ModelViewSection';

const AssetDeliveryCallout = ({ hidden = false }) => {
    if (hidden) return null;

    return (
        <ModelViewSection>
            <div
                role="status"
                style={{
                    background: '#e8f4fd',
                    border: '1px solid #90caf9',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    color: '#1565c0',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    width: '100%',
                }}
            >
                Model assets are delivered securely after payment is confirmed.
            </div>
        </ModelViewSection>
    );
};

export default AssetDeliveryCallout;
