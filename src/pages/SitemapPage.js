import React from 'react';
import { Link } from 'react-router-dom';
import GlobalWrapper from '../components/layout/GlobalWrapper';
import { FiMap, FiHome, FiInfo, FiHelpCircle, FiUser, FiGrid, FiUserPlus, FiShoppingCart, FiActivity, FiFileText, FiShield, FiDollarSign } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import classes from './SitemapPage.module.scss';

const SitemapPage = () => {
    return (
        <GlobalWrapper className="global-banner-spacing global-page-margin-top">
            <div className={`${classes.sitemapContainer} glass-container`} style={{ position: 'relative', overflow: 'hidden', padding: '40px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)', zIndex: -1 }}></div>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 className={classes.gradientTitle} style={{ fontSize: '3rem', fontWeight: '800', textAlign: 'left', display: 'inline-block', width: '100%' }}>
                        🌐 Explore ModelLink
                    </h1>
                    <p style={{ color: 'var(--sonic-silver)', fontSize: '1.2rem', marginTop: '10px', textAlign: 'left' }}>
                        Your comprehensive directory to navigate the ModelLink ecosystem and resources.
                    </p>
                </div>

                <div className={classes.grid}>
                    {/* Main Pages */}
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Main Platform</h2>
                        <ul className={classes.linkList}>
                            <li><Link to="/" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiHome style={{ color: 'var(--primary)' }} /> Home</Link></li>
                            <li><Link to="/about" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiInfo style={{ color: 'var(--primary)' }} /> About Us</Link></li>
                            <li><Link to="/models" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiRobot2Line style={{ color: 'var(--primary)' }} /> AI Models Marketplace</Link></li>
                            <li><Link to="/contact" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiHelpCircle style={{ color: 'var(--primary)' }} /> Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Authentication & User */}
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Account & Access</h2>
                        <ul className={classes.linkList}>
                            <li><Link to="/auth?mode=login" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiUser style={{ color: 'var(--primary)' }} /> Log In</Link></li>
                            <li><Link to="/auth?mode=signup&role=developer" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiGrid style={{ color: 'var(--primary)' }} /> Join as Developer</Link></li>
                            <li><Link to="/auth?mode=signup&role=client" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiUserPlus style={{ color: 'var(--primary)' }} /> Join as Client</Link></li>
                            <li><Link to="/cart" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiShoppingCart style={{ color: 'var(--primary)' }} /> Cart</Link></li>
                        </ul>
                    </div>

                    {/* AI Categories */}
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Popular AI Categories</h2>
                        <ul className={classes.linkList}>
                            <li><Link to="/models?categoryRel.name=X-ray%20Analysis" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiActivity style={{ color: 'var(--primary)' }} /> X-ray Analysis</Link></li>
                            <li><Link to="/models?categoryRel.name=MRI%20Interpretation" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiActivity style={{ color: 'var(--primary)' }} /> MRI Interpretation</Link></li>
                            <li><Link to="/models?categoryRel.name=Disease%20Prediction" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiActivity style={{ color: 'var(--primary)' }} /> Disease Prediction</Link></li>
                            <li><Link to="/models?categoryRel.name=Cancer%20Detection" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiActivity style={{ color: 'var(--primary)' }} /> Cancer Detection</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className={classes.section}>
                        <h2 className={classes.sectionTitle}>Legal & Policies</h2>
                        <ul className={classes.linkList}>
                            <li><Link to="/policy?tab=terms" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiFileText style={{ color: 'var(--primary)' }} /> Terms & Conditions</Link></li>
                            <li><Link to="/policy?tab=privacy" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiShield style={{ color: 'var(--primary)' }} /> Privacy Policy</Link></li>
                            <li><Link to="/policy?tab=refunds" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiDollarSign style={{ color: 'var(--primary)' }} /> Refund Policy</Link></li>
                            <li><Link to="/policy?tab=approach" className={classes.link} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiHelpCircle style={{ color: 'var(--primary)' }} /> How to Approach</Link></li>
                        </ul>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '50px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
                    <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sonic-silver)', textDecoration: 'underline', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <FiMap style={{ fontSize: '1rem', color: 'var(--primary)' }} /> View XML Sitemap
                    </a>
                </div>
            </div>
        </GlobalWrapper>
    );
};

export default SitemapPage;
