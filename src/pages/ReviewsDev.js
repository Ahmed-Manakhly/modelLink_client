import React from 'react';
import { getAuthToken } from '../utility/tokenLoader';
import { getAllReviewsReq } from '../lib/loaders';
import { getDeveloperReviewColumns } from '../utility/tableColumns';
import DashboardDataSection from '../components/layout/DashboardDataSection';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function ReviewsDev() {
    const token = getAuthToken();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData) || {};

    useEffect(() => {
        if (!token || userData.role !== 'DEVELOPER') {
            navigate(!token ? '/auth?mode=login' : '/', { replace: true });
        }
    }, [token, userData.role, navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="mb-2">
                <h2 className="page-main-title" style={{ textAlign: 'left', margin: '0 0 0.5rem 0' }}>
                    <span className="gradient-text" style={{ fontSize: '2.5rem' }}>Reviews On Your Models</span>
                </h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--on-surface-variant)' }}>Track and manage client feedback on your AI models.</p>
            </div>
            <DashboardDataSection
                getData={(query) => getAllReviewsReq(query, { Authorization: `Bearer ${token}` })}
                contentType="reviews"
                dataKey="reviews"
                columns={getDeveloperReviewColumns}
                tableTitle="Reviews On Your Models"
                hideTitle={true}
                fluid={true}
                defaultStatusArray={[]}
                statusOptions={[]}
                emptyState={{
                    title: 'No reviews yet',
                    subtitle: 'Client reviews on your models will appear here.',
                }}
            />
        </div>
    );
}

export default ReviewsDev;
