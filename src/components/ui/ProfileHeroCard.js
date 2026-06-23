import React from 'react';
import styles from './ProfileHeroCard.module.scss';

/**
 * Shared profile hero layout shell.
 * Interim spacing: 95% width, max-width 1140px, 2rem column gap, bordered container.
 * Consumers supply avatar + left info nodes and right-column children via slots.
 */
const ProfileHeroCard = ({ avatar, leftInfo, children, className = '' }) => {
    return (
        <section className={`${styles.container} ${className}`.trim()}>
            <div className={styles.card}>
                <div className={styles.main}>
                    <div className={styles.left}>
                        {avatar && <div className={styles.avatarSlot}>{avatar}</div>}
                        {leftInfo && <div className={styles.infoSlot}>{leftInfo}</div>}
                    </div>
                    <div className={styles.right}>{children}</div>
                </div>
            </div>
        </section>
    );
};

export default ProfileHeroCard;
