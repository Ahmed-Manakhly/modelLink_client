import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableRowSkeleton from '../TableRowSkeleton';
import EmptyState from '../EmptyState';
import { normalizeGridColumns, dataGridShellSx } from '../../utility/gridColumns';

function PageTable({
    isLoading,
    data,
    columns,
    message,
    error = false,
    skeletonCols = 5,
    skeletonRows = 5,
    emptyState,
    enableSelection = false,
    rowSelectionModel = [],
    onRowSelectionModelChange,
    paginated = false,
    pageSize = 5,
}) {
    const resolvedColumns = useMemo(
        () => (Array.isArray(columns) ? normalizeGridColumns(columns) : columns),
        [columns]
    );

    const titleBlock = message ? (
        <p style={{ fontWeight: 'bold', marginBottom: '10px', width: '100%' }}>{message}</p>
    ) : null;

    return (
        <section style={{ width: '100%' }}>
            {error && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'red', width: '100%' }}>
                    Failed to load data.
                </div>
            )}
            {isLoading && (
                <Box width="100%" sx={dataGridShellSx}>
                    {titleBlock}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {Array.from({ length: skeletonRows }).map((_, i) => (
                                <TableRowSkeleton key={i} cols={skeletonCols} />
                            ))}
                        </tbody>
                    </table>
                </Box>
            )}
            {!isLoading && !error && data?.length === 0 && (
                emptyState ? (
                    <Box width="100%" sx={dataGridShellSx}>
                        {titleBlock}
                        <EmptyState {...emptyState} />
                    </Box>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>No records found.</div>
                )
            )}
            {!isLoading && !error && data?.length > 0 && (
                <Box width="100%" sx={dataGridShellSx}>
                    {titleBlock}
                    <DataGrid
                        rows={data}
                        columns={resolvedColumns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                        hideFooter={!paginated}
                        disableRowSelectionOnClick
                        checkboxSelection={enableSelection}
                        onRowSelectionModelChange={onRowSelectionModelChange}
                        rowSelectionModel={rowSelectionModel}
                        pagination={paginated}
                        hideFooterPagination={!paginated}
                        initialState={paginated ? { pagination: { paginationModel: { pageSize } } } : undefined}
                        pageSizeOptions={[5, 10, 25, 50]}
                        autoHeight
                        getRowHeight={() => 'auto'}
                        sx={{ width: '100%', minWidth: 0 }}
                    />
                </Box>
            )}
        </section>
    );
}

export default PageTable;
