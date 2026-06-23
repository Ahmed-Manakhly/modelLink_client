import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import classes from '../ModelData.module.scss';

const AppPageSection = ({ title, children, className = '' }) => (
    <Container className={`my-5 justify-content-center ${className}`.trim()}>
        <Col className={`${classes['contact-col']} flex-fill w-100`}>
            <Row className="justify-content-md-center d-flex flex-column justify-content-center p-lg-4 align-items-stretch w-100">
                {title && (
                    <h3 className="title_2" style={{ marginBottom: '12px', width: '100%' }}>
                        {title}
                    </h3>
                )}
                {children}
            </Row>
        </Col>
    </Container>
);

export default AppPageSection;
