import React from 'react';
import { Col, Row } from 'react-bootstrap';
import classes from '../ModelData.module.scss';

const AppPageSection = ({ title, children, className = '', fluid = false }) => {
    return (
        <div className={fluid ? className : `global-container global-banner-spacing justify-content-center ${className}`.trim()}>
            <Col className={`${classes['contact-col']} flex-fill w-100 px-0`} style={{ padding: 0, minWidth: 0 }}>
                <Row 
                    className={`justify-content-md-center d-flex flex-column justify-content-center align-items-stretch w-100 g-0`}
                >
                    {title && (
                        <div className="mb-4 w-100" style={{ padding: 0 }}>
                            <h2 className="page-main-title m-0">
                                <span className="gradient-text">{title}</span>
                            </h2>
                        </div>
                    )}
                    {children}
                </Row>
            </Col>
        </div>
    );
};

export default AppPageSection;
