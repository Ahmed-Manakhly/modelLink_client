import React from 'react';
import { Link } from 'react-router-dom';
import { FILES_BASE_API_URL } from '../../lib/api';
import VerifiedBadge from './VerifiedBadge';
import styles from './UserChip.module.scss';
import UserAvatar from './UserAvatar';

import { getDisplayName } from '../UserProfileStrip';

const UserChip = ({ user, showVerified = false, linkTo = null, className = '', logoUrl = null }) => {
    if (!user) return null;

    // eslint-disable-next-line
    const { avatar, isVerified } = user;
    const resolvedLogoUrl = logoUrl || user.logoUrl;
    const displayName = getDisplayName(user);
    // eslint-disable-next-line
    const initial = displayName[0]?.toUpperCase() || '?';

    const content = (
        <>
            <div className={styles.avatar}>
                <UserAvatar user={user} />
                {resolvedLogoUrl && (
                    <img
                        className={styles.orgLogo}
                        src={resolvedLogoUrl.startsWith('http') ? resolvedLogoUrl : FILES_BASE_API_URL + resolvedLogoUrl}
                        alt={`${displayName} logo`}
                        crossOrigin="anonymous"
                    />
                )}
            </div>
            <div className={styles.meta}>
                <span className={styles.name} title={displayName}>
                    {displayName}
                </span>
                {showVerified && <VerifiedBadge isVerified={isVerified} />}
            </div>
        </>
    );

    const rootClass = `${styles.chip} ${className}`.trim();

    if (linkTo) {
        return (
            <Link to={linkTo} className={rootClass}>
                {content}
            </Link>
        );
    }

    return <div className={rootClass}>{content}</div>;
};

export default UserChip;
