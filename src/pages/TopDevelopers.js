import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getPublicDevelopersReq } from '../lib/loaders';
import UserProfileStrip from '../components/UserProfileStrip';

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
        <div style={{ minHeight: '80vh', backgroundColor: '#f4f7f6', padding: '40px 0' }}>
            <Container>
                <div className="text-center mb-5">
                    <h2 style={{ fontWeight: 700, color: 'var(--main-blue)', textTransform: 'uppercase' }}>
                        Top AI Developers
                    </h2>
                    <p className="text-muted">
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
                        <h4 className="text-muted">No developers found at the moment.</h4>
                    </div>
                )}

                {!loading && !error && developers.length > 0 && (
                    <Row className="g-4">
                        {developers.map((dev) => (
                            <Col xs={12} md={6} lg={4} xl={3} key={dev.id}>
                                <div style={{ 
                                    background: '#fff', 
                                    borderRadius: '15px', 
                                    padding: '20px 10px', 
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    border: '1px solid #eaeaea',
                                    transition: 'transform 0.2s ease-in-out',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
            </Container>
        </div>
    );
};

export default TopDevelopers;
