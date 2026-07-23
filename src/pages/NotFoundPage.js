import React from 'react';
import { Link } from 'react-router-dom';
import { RiRobot2Line } from "react-icons/ri";
import styles from './ErrorPage.module.scss';

const NotFoundPage = () => {
    return (
        <main className={styles['container']} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Link to={'/'} className={styles._headding} style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <RiRobot2Line className={styles.iconImg} style={{ fontSize: '180px', marginBottom: '20px', color: 'var(--primary)', filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.4))' }} />
                </div>
                <span style={{ fontSize: '2rem', color: 'var(--main-color)', textAlign: 'center' }}>404 - Page Not Found</span>
            </Link>
            <p style={{ marginTop: '20px', color: '#666', fontSize: '1.2rem' }}>
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to={'/'} className="btn-glass-primary" style={{ marginTop: '30px' }}>
                Go Back Home
            </Link>
        </main>
    );
};

export default NotFoundPage;
