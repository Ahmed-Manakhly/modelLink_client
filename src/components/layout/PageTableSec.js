import React, { useMemo } from 'react';
import AppPageSection from './AppPageSection';
import PageTable from './PageTable';
import { normalizeGridColumns } from '../../utility/gridColumns';

function PageTableSec({ data, columns, tableTitle }) {
    const gridColumns = useMemo(() => normalizeGridColumns(columns), [columns]);

    return (
        <AppPageSection title={tableTitle}>
            <PageTable
                isLoading={false}
                data={data}
                columns={gridColumns}
                error={false}
                paginated
                enableSelection
            />
        </AppPageSection>
    );
}

export default PageTableSec;




