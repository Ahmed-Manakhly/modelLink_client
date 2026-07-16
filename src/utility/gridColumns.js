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
    background: 'var(--bg-main, #0b0f19)',
    margin: 0,
    padding: 0,
    border: 'var(--border-standard, 1px solid rgba(255, 255, 255, 0.08))',
    borderRadius: 'var(--radius-card, 12px)',
    width: '100%',
    color: 'var(--on-surface, #E2E8F0)',
    '& .MuiDataGrid-root': {
        border: 'none',
        fontSize: 'var(--text-sm, 14px)',
        width: '100%',
        color: 'var(--on-surface, #E2E8F0)',
        '--DataGrid-rowBorderColor': 'var(--border-glass, rgba(255, 255, 255, 0.08))',
    },
    '& .MuiDataGrid-main': {
        overflow: 'visible',
    },
    '& .MuiDataGrid-virtualScroller': {
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'var(--bg-main, #0b0f19)',
            borderTop: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08))',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'var(--primary, #22D3EE)',
            border: '2px solid var(--bg-main, #0b0f19)',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: 'var(--primary-glow, var(--primary))',
        },
    },
    '& .MuiDataGrid-columnHeaders': {
        background: 'var(--bg-surface, #1e293b) !important',
        backgroundColor: 'var(--bg-surface, #1e293b) !important',
        color: 'var(--on-surface, #E2E8F0) !important',
        borderBottom: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08)) !important',
    },
    '& .MuiDataGrid-columnHeadersInner': {
        background: 'transparent !important',
    },
    '& .MuiDataGrid-columnHeader': {
        background: 'transparent !important',
        color: 'var(--on-surface, #E2E8F0) !important',
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
        background: 'transparent !important',
    },
    '& .MuiDataGrid-filler': {
        background: 'var(--bg-surface, #1e293b) !important',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 'bold',
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        color: 'var(--on-surface, #E2E8F0)',
    },
    '& .MuiDataGrid-root .MuiDataGrid-columnHeader': {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        '&:focus-within': {
            outline: 'none !important',
        },
    },
    '& .MuiDataGrid-cell': {
        wordBreak: 'break-word',
        lineHeight: 1.45,
        alignItems: 'center',
        display: 'flex',
        padding: '16px 12px !important',
        color: 'var(--on-surface, #E2E8F0)',
        borderBottom: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08))',
        '&:focus-within': {
            outline: 'none !important',
        },
    },
    '& .MuiDataGrid-row': {
        minHeight: '65px !important',
        maxHeight: 'none !important',
        transition: 'var(--transition-smooth, all 0.3s cubic-bezier(0.4, 0, 0.2, 1))',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04) !important',
        },
        '&.Mui-selected': {
            backgroundColor: 'rgba(34, 211, 238, 0.08) !important',
            '&:hover': {
                backgroundColor: 'rgba(34, 211, 238, 0.12) !important',
            },
        },
    },
    '& .name-column--cell': {
        color: 'var(--primary, #22D3EE)',
        fontWeight: 'bold',
    },
    '& .MuiDataGrid-toolbarContainer': {
        borderBottom: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08))',
        paddingBottom: '10px',
        marginBottom: '10px',
    },
    '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
        color: 'var(--primary, #22D3EE) !important',
    },
    '& .MuiDataGrid-footerContainer': {
        borderTop: '1px solid var(--border-glass, rgba(255, 255, 255, 0.08))',
        backgroundColor: 'transparent',
    },
    '& .MuiTablePagination-root': {
        color: 'var(--on-surface, #E2E8F0)',
    },
    '& .MuiTablePagination-selectIcon': {
        color: 'var(--on-surface, #E2E8F0)',
    },
    '& .MuiCheckbox-root': {
        color: 'var(--on-surface-variant, #94A3B8)',
    },
    '& .MuiCheckbox-root.Mui-checked': {
        color: 'var(--primary, #22D3EE) !important',
    },
    '& .MuiIconButton-root': {
        color: 'var(--on-surface-variant, #94A3B8)',
    },
    '& .MuiIconButton-root.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.2) !important',
    },
};
