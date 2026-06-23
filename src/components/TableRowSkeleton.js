import React from 'react';
import classes from './TableRowSkeleton.module.scss';

const TableRowSkeleton = ({ cols = 5 }) => (
    <tr className={classes.skeletonRow}>
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i}>
                <div className={classes.block} />
            </td>
        ))}
    </tr>
);

export default TableRowSkeleton;
