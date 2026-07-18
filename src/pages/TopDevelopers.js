import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getPublicDevelopersReq } from '../lib/loaders';
import UserProfileStrip from '../components/UserProfileStrip';
import cardClasses from '../components/Card.module.scss';
import GlobalWrapper from '../components/layout/GlobalWrapper';

const TopDevelopers = () => {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                // Fetch developers who are verified (assuming verified devs have higher priority or sorting can be added)
                const res = await getPublicDevelopersReq('limit=50&sort=-createdAt');
                setDevelopers(res.data?.data?.users || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load developers.');
            } finally {
                setLoading(false);
            }
        };

        fetchDevelopers();
    }, []);

    return (
        <GlobalWrapper className="global-section-spacing global-page-margin-top">
            <div>
                <div style={{ marginBottom: '40px' }}>
                    <h2 className="page-main-title" style={{ textAlign: 'left', marginBottom: '1rem', marginTop: '0' }}>
                        <span className="gradient-text" style={{ fontSize: '2.5rem' }}>Top AI Developers</span>
                    </h2>
                    <p style={{
                        color: 'var(--on-surface-variant)',
                        fontSize: '1.1rem',
                        maxWidth: '800px',
                        lineHeight: '1.6',
                        margin: '0'
                    }}>
                        Discover and connect with verified, world-class developers building the future of AI.
                    </p>
                </div>

                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {error && (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                )}

                {!loading && !error && developers.length === 0 && (
                    <div className="text-center py-5">
                        <h4 style={{ color: 'var(--primary)', fontWeight: 'var(--weight-700)', fontSize: 'var(--text-xl)' }}>No developers found at the moment.</h4>
                    </div>
                )}

                {!loading && !error && developers.length > 0 && (
                    <Row className="g-4">
                        {developers.map((dev) => (
                            <Col xs={12} md={6} lg={4} xl={3} key={dev.id}>
                                <div className={cardClasses.showcase} style={{ 
                                    padding: '25px 20px', 
                                    height: '100%',
                                    cursor: 'pointer'
                                }}
                                onClick={() => window.location.href = `/profile/${dev.id}`}
                                >
                                    <UserProfileStrip 
                                        user={dev} 
                                        variant="public" 
                                        showViewProfileLink={true} 
                                        profileLinkTo={`/profile/${dev.id}`}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </GlobalWrapper>
    );
};

export default TopDevelopers;
