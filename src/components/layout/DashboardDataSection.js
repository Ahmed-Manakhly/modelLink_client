import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageTable from './PageTable';
import BottomFeaturesBox from './BottomFeaturesBox';
import FeaturesBox from './FeaturesBox';
import WarningModal from './WarningModal';
import AppPageSection from './AppPageSection';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../store/UI-slice';

const DashboardDataSection = ({
    getData,
    deleteData,
    updateData,
    contentType,
    columns,
    tableTitle,
    lang = 'en',
    isAdmin = false,
    onDataLoaded,
    skeletonCols,
    skeletonRows = 5,
    emptyState,
    dataKey = null,
    statusConfig: statusConfigProp,
    selectConfig: selectConfigProp,
    defaultStatusArray = ['PUBLISHED', 'DRAFT'],
    statusFilterParam = 'status',
    statusOptions = null,
    extraFilters = null,
    enableBulkSelection = false,
    bulkActions = null,
}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sort, setSort] = useState('');
    const [statusArray, setStatusArray] = useState(defaultStatusArray);
    const [extraFilterValues, setExtraFilterValues] = useState({});
    const [applied, setApplied] = useState(false);
    const [activeFiltersString, setActiveFiltersString] = useState('');
    const [selectedRowIds, setSelectedRowIds] = useState([]);

    // In reality, developers will see all their models if no status is specified, but let's manage it simply
    const [warning, setWarning] = useState({ show: false, type: '', message: '', action: '', id: null });

    const [pagination, setPagination] = useState({
        page: 1,
        total_pages: 1,
        next_page: false,
        prev_page: false,
        page_data_count: 0
    });

    const getDataRef = useRef(getData);
    getDataRef.current = getData;
    const onDataLoadedRef = useRef(onDataLoaded);
    onDataLoadedRef.current = onDataLoaded;

    const defaultStatusKey = (defaultStatusArray || []).join(',');

    const loadingData = useCallback(async (page = 1, searchQuery = "", extraFilters = "") => {
        setIsLoading(true);
        setError(false);
        try {
            let filtersString = `?page=${page}`;
            if (searchQuery.trim()) filtersString += `&search=${encodeURIComponent(searchQuery)}`;
            if (extraFilters) filtersString += extraFilters;

            const res = await getDataRef.current(filtersString);
            const { data: resData } = res;

            let records = [];
            if (dataKey && resData?.data && dataKey in resData.data) {
                records = resData.data[dataKey] ?? [];
            } else if (Array.isArray(resData?.data?.orders)) {
                records = resData.data.orders;
            } else if (Array.isArray(resData?.data?.models)) {
                records = resData.data.models;
            } else if (Array.isArray(resData?.data)) {
                records = resData.data;
            }
            setData(records);

            if (resData?.pagination) {
                const { page: currPage, total_pages, next_Page, page_data_count } = resData.pagination;
                setPagination({
                    page: currPage || 1,
                    total_pages: total_pages || 1,
                    next_page: Boolean(next_Page),
                    prev_page: currPage > 1,
                    page_data_count: page_data_count || 0
                });

                if (onDataLoadedRef.current) onDataLoadedRef.current(page_data_count || records.length);
            } else {
                if (onDataLoadedRef.current) onDataLoadedRef.current(records.length);
            }
        } catch (err) {
            setError(true);
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to fetch data'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, dataKey]);

    const buildFiltersString = useCallback((statusList = statusArray) => {
        let filtersString = '';
        if (dateFrom) filtersString += `&createdAtFrom=${dateFrom}`;
        if (dateTo) filtersString += `&createdAtTo=${dateTo}`;
        if (sort) filtersString += `&sort=${sort}`;
        if (statusList.length === 1) {
            filtersString += `&${statusFilterParam}=${statusList[0]}`;
        } else if (statusList.length > 1) {
            filtersString += `&${statusFilterParam}=${statusList.join(',')}`;
        }
        (extraFilters || []).forEach((filter) => {
            const val = extraFilterValues[filter.param];
            if (val) filtersString += `&${filter.param}=${encodeURIComponent(val)}`;
        });
        return filtersString;
    }, [dateFrom, dateTo, sort, statusArray, extraFilterValues, extraFilters, statusFilterParam]);

    const fetchPage = useCallback((page = 1, searchQuery = search, filtersString = activeFiltersString) => {
        loadingData(page, searchQuery, filtersString);
    }, [loadingData, search, activeFiltersString]);

    useEffect(() => {
        setStatusArray(defaultStatusArray || []);
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setSort('');
        setExtraFilterValues({});

        const initialStatuses = defaultStatusArray || [];
        if (initialStatuses.length > 0) {
            let filtersString = '';
            if (initialStatuses.length === 1) {
                filtersString += `&${statusFilterParam}=${initialStatuses[0]}`;
            } else {
                filtersString += `&${statusFilterParam}=${initialStatuses.join(',')}`;
            }
            setActiveFiltersString(filtersString);
            setApplied(true);
            loadingData(1, '', filtersString);
        } else {
            setActiveFiltersString('');
            setApplied(false);
            loadingData(1);
        }
        // Only remount table data when the section identity or default filters change — not on every parent re-render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentType, defaultStatusKey, statusFilterParam]);


    const applyFiltersHandler = useCallback((page = 1) => {
        if (dateFrom && dateTo && dateFrom > dateTo) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Invalid date range',
                message: 'Start date must be on or before end date.',
            }));
            dispatch(uiActions.showNotification(true));
            return;
        }
        const filtersString = buildFiltersString();
        setActiveFiltersString(filtersString);
        setApplied(true);
        loadingData(page, search, filtersString);
    }, [dateFrom, dateTo, search, buildFiltersString, loadingData, dispatch]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (search.trim()) {
            applied ? applyFiltersHandler(1) : loadingData(1, search);
        }
    }, [search, applied, applyFiltersHandler, loadingData]);

    const handleRefresh = useCallback(() => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setSort('');
        setStatusArray(defaultStatusArray || []);
        setExtraFilterValues({});
        setActiveFiltersString('');
        setApplied(false);
        loadingData(1);
    }, [loadingData, defaultStatusArray]);

    const handlePageNumberChange = (page) => {
        if (applied) applyFiltersHandler(page);
        else fetchPage(page, search, '');
    };
    const handlePageNext = () => {
        if (!pagination.next_page) return;
        if (applied) applyFiltersHandler(pagination.page + 1);
        else fetchPage(pagination.page + 1, search, '');
    };
    const handlePagePrevious = () => {
        if (!pagination.prev_page) return;
        if (applied) applyFiltersHandler(pagination.page - 1);
        else fetchPage(pagination.page - 1, search, '');
    };

    const dateConfig = [
        { label: 'From', value: dateFrom, onChange: e => setDateFrom(e.target.value) },
        { label: 'To', value: dateTo, onChange: e => setDateTo(e.target.value) }
    ];

    const makeStatusOption = (value, label) => ({
        value,
        label,
        checked: (v) => statusArray.includes(v),
        onChange: (checked, v) => setStatusArray(prev => checked ? [...prev, v] : prev.filter(x => x !== v)),
    });

    const modelStatusConfig = [
        makeStatusOption('PUBLISHED', 'Published'),
        makeStatusOption('DRAFT', 'Draft'),
    ];

    const orderStatusConfig = [
        makeStatusOption('PENDING',   'Pending'),
        makeStatusOption('PAID',      'Paid'),
        makeStatusOption('DELIVERED', 'Delivered'),
        makeStatusOption('DISPUTED',  'Disputed'),
        makeStatusOption('REFUNDED',  'Refunded'),
        makeStatusOption('CANCELLED', 'Cancelled'),
    ];

    const modelSelectConfig = [
        {
            value: sort,
            label: 'Sort By',
            placeholder: 'Select Sorting',
            options: [
                { value: '-createdAt', label: 'Newest First' },
                { value: 'createdAt', label: 'Oldest First' },
                { value: 'title', label: 'Title (A-Z)' },
                { value: '-title', label: 'Title (Z-A)' },
            ],
            onChange: (val) => setSort(val)
        }
    ];

    const adminSelectConfig = [
        {
            value: sort,
            label: 'Sort By',
            placeholder: 'Select Sorting',
            options: [
                { value: '-createdAt', label: 'Newest First' },
                { value: 'createdAt', label: 'Oldest First' },
            ],
            onChange: (val) => setSort(val)
        }
    ];

    const buildStatusConfig = (options) => options.map((option) => ({
        value: option.value,
        label: option.label,
        checked: (value) => statusArray.includes(value),
        onChange: (checked, value) => {
            setStatusArray((prev) => (
                checked ? [...prev, value] : prev.filter((val) => val !== value)
            ));
        },
    }));

    const buttonsConfig = [
        {
            label: 'Reset Filters',
            onClick: handleRefresh,
            disabled: false
        },
        {
            label: 'Apply Filters',
            onClick: () => applyFiltersHandler(1),
            disabled: false
        }
    ];


    const closeModal = () => setWarning({ show: false, type: '', message: '', action: '', id: null });

    const handleDelete = (id) => {
        setWarning({
            show: true,
            type: 'action',
            message: 'Are you sure you want to perform this action?',
            action: 'Delete',
            id
        });
    };

    const onAction = async () => {
        if (!warning.id || !deleteData) return closeModal();
        try {
            setIsLoading(true);
            await deleteData(warning.id);
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Success',
                message: 'Action completed successfully.'
            }));
            dispatch(uiActions.showNotification(true));
            if (applied) applyFiltersHandler(pagination.page);
            else fetchPage(pagination.page, search, activeFiltersString);
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Action failed'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            closeModal();
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus, isRestore = false) => {
        if (!updateData) return;
        try {
            setIsLoading(true);
            await updateData(id, { status: newStatus, restore: isRestore });
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Success',
                message: 'Status updated successfully.'
            }));
            dispatch(uiActions.showNotification(true));
            if (applied) applyFiltersHandler(pagination.page);
            else fetchPage(pagination.page, search, activeFiltersString);
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Status update failed'
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setIsLoading(false);
        }
    };

    // Prepare columns (inject delete and status handlers if needed)
    const finalColumns = typeof columns === 'function' ? columns(handleDelete, handleStatusChange, isAdmin) : columns;

    const statusConfig = statusConfigProp
        ?? (statusOptions ? buildStatusConfig(statusOptions)
            : contentType === 'models' ? modelStatusConfig
            : contentType === 'orders' ? orderStatusConfig
            : undefined);
    const extraFilterSelectConfig = (extraFilters || []).map((filter) => ({
        value: extraFilterValues[filter.param] || '',
        label: filter.label,
        placeholder: filter.placeholder || 'All',
        options: filter.options,
        onChange: (val) => setExtraFilterValues((prev) => ({ ...prev, [filter.param]: val })),
    }));

    const baseSelectConfig = selectConfigProp ?? (contentType === 'models' ? modelSelectConfig : adminSelectConfig);
    const selectConfig = [...baseSelectConfig, ...extraFilterSelectConfig];

    const handleBulkAction = async (action) => {
        if (!bulkActions || selectedRowIds.length === 0 || !action?.handler) return;
        try {
            setIsLoading(true);
            await action.handler(selectedRowIds);
            dispatch(uiActions.notificationDataChanged({
                status: 'success',
                title: 'Success',
                message: action.successMessage || 'Bulk action completed.',
            }));
            dispatch(uiActions.showNotification(true));
            setSelectedRowIds([]);
            if (applied) applyFiltersHandler(pagination.page);
            else fetchPage(pagination.page, search, activeFiltersString);
        } catch (err) {
            dispatch(uiActions.notificationDataChanged({
                status: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Bulk action failed',
            }));
            dispatch(uiActions.showNotification(true));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppPageSection title={tableTitle}>
            {warning.show && <WarningModal onClose={closeModal} warning={warning} onAction={onAction} />}

            <FeaturesBox
                handleSubmit={handleSearch}
                searchPlaceholder={`Search ${tableTitle}...`}
                handleSearchChange={(e) => setSearch(e.target.value)}
                searchedValue={search}
                handelRefresh={handleRefresh}
                dateConfig={dateConfig}
                selectConfig={selectConfig}
                buttonsConfig={buttonsConfig}
                statusConfig={statusConfig}
            />

            {enableBulkSelection && selectedRowIds.length > 0 && bulkActions?.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0', width: '100%', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e4e5e7' }}>
                    <span style={{ alignSelf: 'center', fontWeight: 600, marginRight: '10px' }}>{selectedRowIds.length} item(s) selected:</span>
                    {bulkActions.map((action) => (
                        <button
                            key={action.label}
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleBulkAction(action)}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            <PageTable
                isLoading={isLoading}
                data={data}
                columns={finalColumns}
                error={error}
                skeletonCols={skeletonCols ?? (contentType === 'models' ? 6 : 5)}
                skeletonRows={skeletonRows}
                emptyState={emptyState}
                enableSelection={enableBulkSelection}
                rowSelectionModel={selectedRowIds}
                onRowSelectionModelChange={(ids) => setSelectedRowIds(ids)}
            />

            <BottomFeaturesBox
                pagination={pagination}
                handlePageNumberChange={handlePageNumberChange}
                handlePageNext={handlePageNext}
                handlePagePrevious={handlePagePrevious}
                footerMsg={`Total ${tableTitle}: `}
            />
        </AppPageSection>
    );
};

export default DashboardDataSection;
