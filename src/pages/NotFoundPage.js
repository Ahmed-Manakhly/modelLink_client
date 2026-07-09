import React from 'react';
import { Link } from 'react-router-dom';
import { RiRobot2Line } from "react-icons/ri";
import styles from './ErrorPage.module.scss';

const NotFoundPage = () => {
    return (
        <main className={styles['container']} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Link to={'/'} className={styles._headding} style={{ textDecoration: 'none' }}>
                <RiRobot2Line className={styles.iconImg} style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--primary)' }} />
                <br/>
                <span style={{ fontSize: '2rem', color: 'var(--main-color)' }}>404 - Page Not Found</span>
            </Link>
            <p style={{ marginTop: '20px', color: '#666', fontSize: '1.2rem' }}>
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to={'/'} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
                Go Back Home
            </Link>
        </main>
    );
};

export default NotFoundPage;
