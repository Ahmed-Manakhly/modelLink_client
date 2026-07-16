import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthToken } from '../utility/tokenLoader';
import DashboardDataSection from '../components/layout/DashboardDataSection';
import { getAllReviewsReq } from '../lib/loaders';
import { getClientReviewColumns } from '../utility/tableColumns';

function ReviewsClient() {
    const token = getAuthToken();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData) || {};

    const loadReviews = useCallback(
        (query) => getAllReviewsReq(query, { Authorization: `Bearer ${token}` }),
        [token]
    );

    useEffect(() => {
        if (!token || userData.role === 'DEVELOPER') {
            navigate(userData.role === 'DEVELOPER' ? '/reviews-dev' : '/auth?mode=login', { replace: true });
        }
    }, [token, userData.role, navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="mb-2">
                <h2 className="page-main-title" style={{ textAlign: 'left', margin: '0 0 0.5rem 0' }}>
                    <span className="gradient-text" style={{ fontSize: '2.5rem' }}>Reviews You Wrote</span>
                </h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--on-surface-variant)' }}>Manage the reviews you've left on completed orders.</p>
            </div>
            <DashboardDataSection
                getData={loadReviews}
                contentType="reviews"
                dataKey="reviews"
                columns={getClientReviewColumns}
                tableTitle="Reviews You Wrote"
                hideTitle={true}
                fluid={true}
                defaultStatusArray={[]}
                statusOptions={[]}
                emptyState={{
                    title: 'No reviews yet',
                    subtitle: 'Reviews you leave on completed orders will appear here.',
                }}
            />
        </div>
    );
}

export default ReviewsClient;
