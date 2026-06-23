import React from 'react';
import { MdVerified } from 'react-icons/md';
import styles from './VerifiedBadge.module.scss';

const VerifiedBadge = ({ isVerified, className = '' }) => {
    if (isVerified !== true) return null;

    return (
        <span className={`${styles.badge} ${className}`} title="Verified developer">
            <MdVerified className={styles.icon} aria-hidden="true" />
            <span>Verified</span>
        </span>
    );
};

export default VerifiedBadge;
