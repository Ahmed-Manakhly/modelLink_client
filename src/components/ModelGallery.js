import React, { useState } from 'react';
import classes from './ModelGallery.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { FILES_BASE_API_URL } from '../lib/api';
import imgHolder from '../assets/imgHolder.jpg';

const ModelGallery = ({ images = [], alt = 'Model Gallery' }) => {
    const [mainIndex, setMainIndex] = useState(0);
    const safeImages = (images || []).filter(Boolean);
    const mainSrc = safeImages[mainIndex];

    const selectImage = (src, idx) => {
        setMainIndex(idx);
    };

    return (
        <div className="w-100">
            <Row className={`${classes.galleryContainer} g-2 g-md-3`}>
                {/* Main Image Column */}
                <Col md={9} className="mb-2 mb-md-0 px-1 px-md-3">
                    <div className={classes.mainImageWrapper}>
                        {mainSrc ? (
                            <img
                                src={mainSrc.startsWith('http') ? mainSrc : FILES_BASE_API_URL + mainSrc}
                                alt={`${alt} - main`}
                                crossOrigin="anonymous"
                                className={classes.mainImage}
                            />
                        ) : (
                            <img src={imgHolder} alt="No image" className={classes.mainImage} />
                        )}
                        {safeImages.length > 0 && (
                            <div className={classes.counter}>
                                {mainIndex + 1} / {safeImages.length}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Vertical Thumbnails Column */}
                <Col md={3} className="d-flex flex-column">
                    <div className={classes.thumbnailTrackVertical}>
                        {safeImages.length > 0 ? (
                            safeImages.map((src, idx) => (
                                <div
                                    key={idx}
                                    className={`${classes.thumbnailWrapper} ${idx === mainIndex ? classes.active : ''}`}
                                    onClick={() => selectImage(src, idx)}
                                >
                                    <img
                                        src={src.startsWith('http') ? src : FILES_BASE_API_URL + src}
                                        alt={`${alt} - thumb ${idx}`}
                                        crossOrigin="anonymous"
                                        className={classes.thumbnail}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className={`${classes.thumbnailWrapper} ${classes.active}`}>
                                <img src={imgHolder} alt="No image thumb" className={classes.thumbnail} />
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ModelGallery;
