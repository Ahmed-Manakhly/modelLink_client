import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlobalWrapper from '../components/layout/GlobalWrapper';
import { FiFileText, FiShield, FiDollarSign, FiHelpCircle } from 'react-icons/fi';
import classes from './PolicyPage.module.scss';

const PolicyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('terms');

    // Parse query string to set initial tab
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab && ['terms', 'privacy', 'refunds', 'approach'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/policy?tab=${tab}`, { replace: true });
    };

    const tabs = [
        { id: 'terms', label: 'Terms & Conditions', icon: <FiFileText /> },
        { id: 'privacy', label: 'Privacy Policy', icon: <FiShield /> },
        { id: 'refunds', label: 'Refund Policy', icon: <FiDollarSign /> },
        { id: 'approach', label: 'How to Approach', icon: <FiHelpCircle /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'terms':
                return (
                    <>
                        <h1 className={classes.gradientTitle} style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'left', display: 'inline-block', width: '100%', marginBottom: '30px' }}>
                            <FiFileText style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' }} /> Terms & Conditions
                        </h1>
                        <p className={classes.paragraph}>
                            Welcome to ModelLink. By accessing or using our platform, you agree to be bound by these Terms & Conditions. ModelLink is an AI Model Marketplace designed to connect developers who create machine learning models with clients seeking robust, production-ready inference solutions.
                        </p>

                        <h2 className={classes.sectionTitle}>1. User Accounts</h2>
                        <p className={classes.paragraph}>
                            You must register for an account to buy or sell models. Developers must complete the Stripe Connect onboarding process before they can receive payouts. Clients must provide valid payment information to purchase and download models.
                        </p>

                        <h2 className={classes.sectionTitle}>2. Intellectual Property</h2>
                        <p className={classes.paragraph}>
                            Developers retain intellectual property rights to the models they upload, unless explicitly stated otherwise in a custom commercial agreement. Clients are granted a non-exclusive license to deploy the models in their production environments as per the specified license tier.
                        </p>

                        <h2 className={classes.sectionTitle}>3. Prohibited Activities</h2>
                        <ul className={classes.list}>
                            <li>Uploading malicious code, backdoors, or unverified binaries.</li>
                            <li>Attempting to bypass the ModelLink payment infrastructure.</li>
                            <li>Reverse-engineering models strictly licensed for API-only use.</li>
                        </ul>
                    </>
                );
            case 'privacy':
                return (
                    <>
                        <h1 className={classes.gradientTitle} style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'left', display: 'inline-block', width: '100%', marginBottom: '30px' }}>
                            <FiShield style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' }} /> Privacy Policy
                        </h1>
                        <p className={classes.paragraph}>
                            At ModelLink, we take your privacy seriously. This policy outlines how we collect, use, and protect your data across our Dual-Path Payment Architecture and AI marketplace infrastructure.
                        </p>

                        <h2 className={classes.sectionTitle}>1. Data Collection</h2>
                        <p className={classes.paragraph}>
                            We collect basic profile information (email, organization name, role) upon registration. Payment details are securely processed and stored by our payment provider (Stripe); ModelLink does not store full credit card numbers on our servers.
                        </p>

                        <h2 className={classes.sectionTitle}>2. Data Usage</h2>
                        <p className={classes.paragraph}>
                            Your data is used strictly to facilitate the exchange of AI models. Developer payout data is synced via Stripe Connect Express. Client order histories are maintained to provide access to purchased models and version updates.
                        </p>

                        <h2 className={classes.sectionTitle}>3. Security</h2>
                        <p className={classes.paragraph}>
                            Our platform utilizes standard cryptographic practices, secure webhooks, and authenticated API endpoints to ensure your data remains safe. We recommend enabling two-factor authentication (if available) for added security.
                        </p>
                    </>
                );
            case 'refunds':
                return (
                    <>
                        <h1 className={classes.gradientTitle} style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'left', display: 'inline-block', width: '100%', marginBottom: '30px' }}>
                            <FiDollarSign style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' }} /> Refund Policy
                        </h1>
                        <p className={classes.paragraph}>
                            Due to the digital nature of AI models, source code, and binaries available on ModelLink, refunds are handled on a case-by-case basis.
                        </p>

                        <h2 className={classes.sectionTitle}>1. Eligibility</h2>
                        <ul className={classes.list}>
                            <li>The model is demonstrably broken or fails to meet the specified performance metrics (e.g., accuracy, inference speed) as advertised.</li>
                            <li>The request is made within 14 days of the original purchase.</li>
                            <li>The model has not been extensively integrated into a commercial, live-production product prior to the refund request.</li>
                        </ul>

                        <h2 className={classes.sectionTitle}>2. Resolution Process</h2>
                        <p className={classes.paragraph}>
                            Before a refund is issued, developers are given a 7-day grace period to push a version update to resolve the reported issue. If the issue persists, the platform administrators will review the dispute and process the refund via Stripe.
                        </p>
                    </>
                );
            case 'approach':
                return (
                    <>
                        <h1 className={classes.gradientTitle} style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'left', display: 'inline-block', width: '100%', marginBottom: '30px' }}>
                            <FiHelpCircle style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: '10px', marginTop: '-4px' }} /> How to Approach
                        </h1>
                        <p className={classes.paragraph}>
                            ModelLink is built on a high-incentive, low-friction loop. Whether you're here to monetize your AI expertise or scale your business with state-of-the-art models, here is the best way to approach the platform.
                        </p>

                        <h2 className={classes.sectionTitle}>For Developers</h2>
                        <ul className={classes.list}>
                            <li><strong>Upload Immediately:</strong> You can upload models and start generating sales instantly. You don't need to connect a bank account until you're ready to withdraw funds.</li>
                            <li><strong>Version Control:</strong> Keep your models updated. Buyers are notified when new versions are published, which builds trust and encourages repeat business.</li>
                            <li><strong>Comprehensive Metrics:</strong> Provide detailed accuracy, latency, and throughput metrics to stand out in the marketplace.</li>
                        </ul>

                        <h2 className={classes.sectionTitle}>For Clients</h2>
                        <ul className={classes.list}>
                            <li><strong>Test Before Production:</strong> Use the provided documentation and sample inferences to validate a model against your specific dataset.</li>
                            <li><strong>Communicate:</strong> Use the platform's messaging system to request custom modifications or support from the developer.</li>
                            <li><strong>Review:</strong> Leave honest feedback. Community ratings drive the ModelLink ecosystem.</li>
                        </ul>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <GlobalWrapper className="global-banner-spacing global-page-margin-top">
            <div className={classes.policyPageContainer}>
                <aside className={`${classes.sidebar} glass-container`} style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)', zIndex: -1 }}></div>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={activeTab === tab.id ? 'btn-glass-primary' : 'btn-glass-outline'}
                            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}
                        >
                            <span style={{ fontSize: '1.2rem', display: 'flex' }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </aside>

                <main className={`${classes.contentArea} glass-container`} style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)', zIndex: -1 }}></div>
                    {renderContent()}
                </main>
            </div>
        </GlobalWrapper>
    );
};

export default PolicyPage;
