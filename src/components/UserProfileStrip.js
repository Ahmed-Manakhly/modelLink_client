import React from 'react';
import { Link } from 'react-router-dom';
import { FaLocationDot, FaPhone } from 'react-icons/fa6';
import { FaUserAlt, FaBuilding, FaIdBadge } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useSelector } from 'react-redux';
// import { FILES_BASE_API_URL } from '../lib/api';
import VerifiedBadge from './ui/VerifiedBadge';
import styles from './UserProfileStrip.module.scss';
import UserAvatar from './ui/UserAvatar';

export const getDisplayName = (user = {}) => {
    const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
    return full || user.org_username || '';
};

const formatMemberDate = (value) =>
    value ? new Date(value).toLocaleDateString('pt-PT') : null;

const formatVerifiedDate = (value) =>
    value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null;

const UserProfileStrip = ({
    user = {},
    variant = 'public',
    avatarNode = null,
    infoOnly = false,
    showViewProfileLink = false,
    profileLinkTo = null,
    modelCount = null,
    totalOrders = null,
    verifiedAt = null,
    viewProfileLabel = 'View Profile',
    truncateName = false,
    partyContactVisible = false,
    partyContactFallbackName = '',
    minimal = false,
}) => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    if (!user && !avatarNode) return null;

    const displayName = getDisplayName(user) || partyContactFallbackName;
    const titleName = truncateName
        ? (displayName?.toUpperCase()?.slice(0, 9) || user.org_username?.toUpperCase()?.slice(0, 9) || '')
        : displayName;

    const showEmail = isLoggedIn && ((variant === 'owner-settings' && user.email)
        || (variant === 'order-party' && partyContactVisible && user.email)
        || (variant === 'public' && user.email) || (variant === 'model-developer' && user.email));

    const showPhone = isLoggedIn && ((variant === 'owner-settings' && user.org_phone)
        || (variant === 'order-party' && partyContactVisible && user.org_phone)
        || (variant === 'public' && user.org_phone) || (variant === 'model-developer' && user.org_phone));
    const showOrgName = (variant === 'public' || variant === 'model-developer') && user.org_name;
    const showMemberSince = variant !== 'order-party' || Boolean(user.createdAt);
    const resolvedVerifiedAt = verifiedAt ?? user?.verification?.verifiedAt;
    const showVerifiedAt = ['public', 'model-developer'].includes(variant) && user.isVerified && resolvedVerifiedAt;
    const showPublicCounts = variant === 'public' && (modelCount != null || totalOrders != null);
    const showModelCount = variant === 'model-developer' && modelCount != null;

    const defaultAvatar = (
        <div className={styles.imgCon}>
            <UserAvatar user={user} />
        </div>
    );

    return (
        <div className={`${styles.mainProfileStrip} ${infoOnly ? styles.infoOnlyContainer : ''}`}>

            {/* 1. CENTERED TOP SECTION */}
            <div className={styles.centerSection}>
                {avatarNode || defaultAvatar}
                <div className={styles.titleContainer}>
                    <h3 className={styles.title_} title={displayName}>{titleName}</h3>
                </div>
                <VerifiedBadge isVerified={user.isVerified} />
            </div>

            {/* 2. LEFT ALIGNED INFO SECTION */}
            {!minimal && (
                <div className={styles.leftSection}>
                    {showOrgName && (
                        <h6 className={styles.info__}>
                            <FaBuilding style={{ color: '#5DB8DD' }} />
                            <span>Organization:</span> <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>{user.org_name}</span>
                        </h6>
                    )}
                    {user.role && (
                        <h6 className={styles.info__}>
                            <FaIdBadge style={{ color: '#5DB8DD' }} />
                            <span>Role:</span> <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>{user.role}</span>
                        </h6>
                    )}
                    {showVerifiedAt && (
                        <h6 className={styles.info__}>Verified since <span style={{ fontWeight: 'normal' }}>{formatVerifiedDate(resolvedVerifiedAt)}</span></h6>
                    )}
                    {user.country && (
                        <h6 className={styles.info__}>
                            <FaLocationDot style={{ color: '#5DB8DD' }} />
                            {'From '}<span style={{ fontWeight: 'normal' }}>{user.country}</span>
                        </h6>
                    )}
                    {showMemberSince && user.createdAt && (
                        <h6 className={styles.info__}>
                            <FaUserAlt style={{ color: '#5DB8DD' }} />
                            {'Member since '}<span style={{ fontWeight: 'normal' }}>{formatMemberDate(user.createdAt)}</span>
                        </h6>
                    )}
                    {showEmail && (
                        <h6 className={styles.info__}>
                            <MdEmail style={{ color: '#5DB8DD', fontSize: '17.5px' }} />
                            <span style={{ fontWeight: 'normal' }}>{user.email}</span>
                        </h6>
                    )}
                    {showPhone && (
                        <h6 className={styles.info__}>
                            <FaPhone style={{ color: '#5DB8DD' }} />
                            <span style={{ fontWeight: 'normal' }}>{user.org_phone}</span>
                        </h6>
                    )}
                    {!isLoggedIn && (user.email || user.org_phone) && (
                        <h6 className={styles.info__} style={{ fontSize: '13px', opacity: 0.8, color: '#f74040' }}>
                            <i>Log in to view contact details</i>
                        </h6>
                    )}
                    {variant === 'owner-settings' && (user.email || user.org_phone) && (
                        <h6 className={styles.info__} style={{ fontSize: '12px', opacity: 0.7 }}>
                            Edit contact details in the form below
                        </h6>
                    )}
                    {showPublicCounts && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: '13px', fontWeight: 600 }}>
                            {modelCount != null && (
                                <span>{modelCount} {modelCount === 1 ? 'Model' : 'Models'}</span>
                            )}
                            {totalOrders != null && (
                                <span>{totalOrders} {totalOrders === 1 ? 'Order' : 'Orders'}</span>
                            )}
                        </div>
                    )}
                    {showModelCount && (
                        <h6 className={styles.info__}>
                            {modelCount} {modelCount === 1 ? 'model' : 'models'} by this developer
                        </h6>
                    )}
                </div>
            )}

            {/* 3. CENTERED BUTTONS SECTION */}
            {showViewProfileLink && profileLinkTo && (
                <div className={styles.centerSection} style={{ marginTop: '15px' }}>
                    <Link to={profileLinkTo} className="btn-glass-primary">
                        {viewProfileLabel}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default UserProfileStrip;
