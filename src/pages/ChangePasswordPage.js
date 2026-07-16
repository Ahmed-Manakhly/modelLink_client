import { Form, Link } from 'react-router-dom';
import classes from '../components/layout/auth/Auth.module.scss';
import { Row, Col } from 'react-bootstrap';
import ChangePassword from '../components/layout/auth/ChangePassword';
import aiFace from '../assets/ai-face.png';

function AuthCard({ title }) {
    return (
        <div className={classes.card}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h1 className={`${classes.title} page-main-title`} style={{ textAlign: 'left' }}>
                    <span className="gradient-text">{title}</span>
                </h1>
            </div>
        </div>
    );
}

function ChangePasswordPage() {
    return (
        <main style={{ width: '100%' }}>
            <div className="glass-container p-4 w-100" style={{ minHeight: '60vh' }}>
                <AuthCard title="Change Password" />
                <div style={{ marginTop: '2rem' }}>
                    <Form method="post" className={classes.container__3}>
                        <ChangePassword />
                    </Form>
                </div>
                <div className={classes.container__2} style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                    <div className={classes.actions}>
                        <Row className={classes.actionsBox}>
                            <Link to={`/`} style={{ textDecoration: 'none', color: 'var(--primary)' }}>Back to Home</Link>
                        </Row>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ChangePasswordPage;
