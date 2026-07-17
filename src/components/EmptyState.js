import React from 'react';
import classes from './EmptyState.module.scss';

const EmptyState = ({ icon, title, subtitle, action }) => (
    <div className={classes.wrapper}>
        {icon && <div className={classes.icon}>{icon}</div>}
        <h3 className={classes.title}>{title}</h3>
        {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
        {action && (
            <button type="button" className={`btn-glass-primary mt-3`} onClick={action.onClick}>
                {action.label}
            </button>
        )}
    </div>
);

export default EmptyState;
