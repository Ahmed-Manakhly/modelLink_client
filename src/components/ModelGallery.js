/* eslint-disable */
import React, { useState, useEffect } from 'react';
import classes from './ModelGallery.module.scss';
import { Container } from 'react-bootstrap';
import { FILES_BASE_API_URL } from '../lib/api';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CloseIcon from '@mui/icons-material/Close';
import imgHolder from '../assets/imgHolder.jpg';

const ModelGallery = ({ images = [], alt = 'Model Gallery' }) => {
    const [mainIndex, setMainIndex] = useState(0);
    const safeImages = (images || []).filter(Boolean);
    const mainSrc = safeImages[mainIndex];

    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 4 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 3 }
    };

    const selectImage = (src, idx) => {
        setMainIndex(idx);
    };

    return (
        <Container>
            <div className={classes.galleryContainer}>
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
                    {safeImages.length > 1 && (
                        <div className={classes.counter}>
                            {mainIndex + 1} / {safeImages.length}
                        </div>
                    )}
                </div>

                {safeImages.length > 1 && (
                    <Carousel
                        responsive={responsive}
                        showDots={false}
                        infinite={false}
                        keyBoardControl
                        swipeable
                        draggable
                        containerClass={classes.thumbnailTrack}
                        itemClass={classes.thumbnailItem}
                        customLeftArrow={<button className={classes.customArrow}>‹</button>}
                        customRightArrow={<button className={classes.customArrow}>›</button>}
                    >
                        {safeImages.map((src, idx) => (
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
                        ))}
                    </Carousel>
                )}
            </div>
        </Container>
    );
};

export default ModelGallery;
