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
        <DashboardDataSection
            getData={loadReviews}
            contentType="reviews"
            dataKey="reviews"
            columns={getClientReviewColumns}
            tableTitle="Reviews You Wrote"
            defaultStatusArray={[]}
            statusOptions={[]}
            emptyState={{
                title: 'No reviews yet',
                subtitle: 'Reviews you leave on completed orders will appear here.',
            }}
        />
    );
}

export default ReviewsClient;
