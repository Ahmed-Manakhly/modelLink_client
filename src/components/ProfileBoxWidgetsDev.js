import React from "react";
import styles from "./ProfileBoxWidgetsDev.module.scss";
import { RiRobot2Line } from "react-icons/ri";
import { Row, Col } from 'react-bootstrap';
import { FILES_BASE_API_URL } from '../lib/api';
import ProfileHeroCard from './ui/ProfileHeroCard';
import UserProfileStrip, { getDisplayName } from './UserProfileStrip';
import { useSelector } from 'react-redux';

const ProfileBoxWidgetsDev = ({ user, modelCount, totalOrders }) => {
    const {
        org_username, avatar, first_name, org_name,
        last_name, org_desc,
    } = user || {};

    const displayName = getDisplayName(user);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const leftInfo = (
        <>
            <div className={styles.widget_1_con}>
                <RiRobot2Line className={styles.iconImg} />
                <h4 className={`${styles.wel} gradient-text`}>User Profile</h4>
            </div>
            <UserProfileStrip
                user={user}
                variant="public"
                modelCount={modelCount}
                totalOrders={totalOrders}
                verifiedAt={user?.verification?.verifiedAt}
            />
        </>
    );

    return (
        <ProfileHeroCard avatar={null} leftInfo={leftInfo}>
            <Row className="justify-content-md-center d-flex flex-column justify-content-center p-lg-4 align-items-center">
                <Row className="mb-3">
                    <Col xs={0} md lg className="d-flex flex-column align-items-left w-100">
                        <label htmlFor="first_name" className={styles.inputLabel}>First Name</label>
                        <p className={styles.user}>{first_name}</p>
                    </Col>
                    <Col xs={0} md lg className="d-flex flex-column align-items-left w-100">
                        <label htmlFor="last_name" className={styles.inputLabel}>Last Name</label>
                        <p className={styles.user}>{last_name}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={0} md lg className="d-flex flex-column align-items-left w-100">
                        <label htmlFor="email" className={styles.inputLabel}>Email</label>
                        <p className={styles.user}>
                            {isLoggedIn ? (user?.email || 'N/A') : <i style={{color: '#f74040', fontSize: '14px'}}>Log in to view contact details</i>}
                        </p>
                    </Col>
                    <Col xs={0} md lg className="d-flex flex-column align-items-left w-100">
                        <label htmlFor="org_phone" className={styles.inputLabel}>Phone Number</label>
                        <p className={styles.user}>
                            {isLoggedIn ? (user?.org_phone || 'N/A') : <i style={{color: '#f74040', fontSize: '14px'}}>Log in to view contact details</i>}
                        </p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={0} md lg className="d-flex flex-column align-items-left w-100">
                        <label htmlFor="org_name" className={styles.inputLabel}>Organization Name</label>
                        <p className={styles.user}>{org_name}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={0} md lg className="d-flex flex-column align-items-left w-100">
                        <label htmlFor="org_desc" className={styles.inputLabel}>{`About ${displayName.toUpperCase()}`}</label>
                        <p className={styles.user}>{org_desc}</p>
                    </Col>
                </Row>
            </Row>
        </ProfileHeroCard>
    );
};

export default ProfileBoxWidgetsDev;
