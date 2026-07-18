import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DEVELOPER_REQUIRED = ['first_name', 'last_name', 'country', 'org_username', 'org_name'];
const CLIENT_REQUIRED = ['first_name', 'last_name', 'country'];

const ProfileCompletionGuard = ({ children }) => {
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);

    if (!userData) return null;

    const required = userData.role === 'DEVELOPER' ? DEVELOPER_REQUIRED : CLIENT_REQUIRED;
    const missing = required.filter(field => !userData[field]);

    if (missing.length > 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>Complete your profile first</h3>
                <p style={{ color: '#888', marginBottom: '1.5rem' }}>
                    You need to complete your profile before you can do this.
                    Missing: {missing.join(', ')}
                </p>
                <button
                    onClick={() => navigate('/profileSettings')}
                    className="btn-glass-primary mt-3"
                >
                    Go to Profile Settings
                </button>
            </div>
        );
    }

    return children;
};

export default ProfileCompletionGuard;
