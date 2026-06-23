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
        <DashboardDataSection
            getData={(query) => getAllReviewsReq(query, { Authorization: `Bearer ${token}` })}
            contentType="reviews"
            dataKey="reviews"
            columns={getDeveloperReviewColumns}
            tableTitle="Reviews On Your Models"
            defaultStatusArray={[]}
            statusOptions={[]}
            emptyState={{
                title: 'No reviews yet',
                subtitle: 'Client reviews on your models will appear here.',
            }}
        />
    );
}

export default ReviewsDev;
