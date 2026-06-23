import React from 'react';
import classes from './ModelCardSkeleton.module.scss';

const ModelCardSkeleton = () => (
    <div className={classes.skeleton}>
        <div className={`${classes.block} ${classes.image}`} />
        <div className={classes.body}>
            <div className={`${classes.block} ${classes.title}`} />
            <div className={`${classes.block} ${classes.subtitle}`} />
            <div className={`${classes.block} ${classes.price}`} />
        </div>
    </div>
);

export default ModelCardSkeleton;
