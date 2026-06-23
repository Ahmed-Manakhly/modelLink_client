/**
 * Ensures MUI DataGrid columns have sensible minWidth + flex so tables
 * fill the container when there is room and scroll horizontally when not.
 */
export function normalizeGridColumns(columns) {
    if (typeof columns === 'function' || !Array.isArray(columns)) {
        return columns;
    }

    return columns.map((col) => {
        const flex = col.flex;
        const minWidth = col.minWidth ?? col.width ?? (flex ? Math.max(90, Math.round(flex * 600)) : 120);

        return {
            ...col,
            minWidth,
            flex: col.flex ?? (col.width ? undefined : 0.15),
        };
    });
}

export const dataGridShellSx = {
    backgroundColor: 'var(--white)',
    padding: 'var(--space-5)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-card)',
    width: '100%',
    '& .MuiDataGrid-root': {
        border: 'none',
        fontSize: 'var(--text-sm)',
        width: '100%',
    },
    '& .MuiDataGrid-main': {
        overflow: 'visible',
    },
    '& .MuiDataGrid-virtualScroller': {
        overflowX: 'auto',
    },
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'var(--eerie-black)',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 'bold',
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    '& .MuiDataGrid-columnHeader': {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    '& .MuiDataGrid-cell': {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: 1.45,
        alignItems: 'center',
        display: 'flex',
        py: 1,
    },
    '& .MuiDataGrid-row': {
        maxHeight: 'none !important',
    },
    '& .name-column--cell': {
        color: 'var(--color-primary)',
        fontWeight: 'bold',
    },
    '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
        color: 'var(--eerie-black) !important',
    },
};
