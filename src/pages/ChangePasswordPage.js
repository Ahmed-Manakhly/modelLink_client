import { Form, Link } from 'react-router-dom';
import classes from '../components/layout/auth/Auth.module.scss';
import { Row, Col } from 'react-bootstrap';
import ChangePassword from '../components/layout/auth/ChangePassword';

function AuthCard({ title }) {
    return (
        <div className={classes.card}>
            <h1 className={classes.title}>
                {title}
            </h1>
        </div>
    );
}

function ChangePasswordPage() {
    return (
        <main style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <Row md={2} xs={1} lg={3} className={` justify-content-center w-100 ${classes.mainRow}`} style={{ maxWidth: '1200px' }}>
                <Col className={`${classes['contact-col']} ${classes['contact-col2']} d-flex flex-column `}>
                    <Row className=' d-flex flex-column '>
                        <div className="brand-logo-text" style={{ marginBottom: '20px' }}>
                            Model<span>Link</span>
                        </div>
                        <Row>
                            <h1 className={classes.title_2}>Secure your account</h1>
                        </Row>
                        <Row>
                            <p className={`${classes["section__text__p2"]}`}>Keep your password safe and updated</p>
                        </Row>
                    </Row>
                </Col>

                <Col className={`${classes["contact-col"]} flex-fill`}>
                    <AuthCard title="Change Password" />
                    <Form method="post" className={classes.container__3}>
                        <ChangePassword />
                    </Form>
                    <div className={classes.container__2}>
                        <div className={classes.actions}>
                            <Row className={classes.actionsBox}>
                                <Link to={`/`}>Back to Home</Link>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </main>
    );
}

export default ChangePasswordPage;
