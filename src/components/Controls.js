import classes from './Controls.module.scss';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategoriesReq } from '../lib/loaders';
import { buildCategoriesList } from '../lib/categoryHelpers';
import { CONTROL_MANAGED_PARAMS, SORT_OPTIONS, FDA_FILTER_QUERY_VALUES, fdaParamToUiValue } from '../utility/marketplaceFilters';
import {
    getSavedFilters,
    saveFilter,
    deleteSavedFilter,
    paramsStringFromSearchParams,
    searchParamsFromSaved,
} from '../utility/savedFilters';
import FilterChips from './FilterChips';
import CustomSelect from './ui/CustomSelect';
import GlobalWrapper from './layout/GlobalWrapper';

const Card = ({ title, items, img, onClickLink, activeCat }) => {
    const isParentActive = items.some(item => item.title === activeCat);

    return (
        <div className={`${classes['category-item']} ${isParentActive ? classes['parent-active'] : ''}`}>
            <h3 className={classes['category-item-title']}>{title}</h3>
            <div className={classes['category-content-box']}>
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={onClickLink?.bind(null, item?.title)}
                        className={`${classes['category-btn']} ${activeCat === item?.title ? classes.active : ''}`}
                    >
                        {item?.title}
                    </button>
                ))}
            </div>
            <div className={classes['category-img-box']}>
                <img src={img} alt={title} width="30" />
            </div>
        </div>
    );
};

function readControlsFromParams(searchParams) {
    const priceRule = searchParams.get('versions.priceRule');
    const priceVal = searchParams.get('versions.price');
    let price = null;
    if (priceVal === '300' && priceRule === 'lte') price = 'Less Than Or Equal To $300';
    if (priceVal === '300' && priceRule === 'gte') price = 'Greater Than Or Equal To $300';

    const deliveryRule = searchParams.get('versions.deliveryTimeRule');
    const deliveryVal = searchParams.get('versions.deliveryTime');
    let deliveryTime = null;
    if (deliveryVal === '5' && deliveryRule === 'lte') deliveryTime = 'Less Than Or Equal To 5 Days';
    if (deliveryVal === '5' && deliveryRule === 'gte') deliveryTime = 'Greater Than Or Equal To 5 Days';

    const highestRated =
        searchParams.get('reviewCount') === '1' && searchParams.get('reviewCountRule') === 'gte';

    const minPrice = searchParams.get('priceMin') || '';
    const maxPrice = searchParams.get('priceMax') || '';




    return {
        catFilter: searchParams.get('categoryRel.name') || searchParams.get('categoryRel.slug'),
        activeCat: searchParams.get('categoryRel.name') || searchParams.get('categoryRel.slug'),
        price,
        deliveryTime,
        highestRated,
        minPrice,
        maxPrice,
        modalityId: searchParams.get('versions.modalityId') || '',
        bodyPartId: searchParams.get('versions.bodyPartId') || '',
        fda: fdaParamToUiValue(searchParams.get('versions.fda')),
        feature: searchParams.get('versions.features.feature') || '',
        metric: searchParams.get('versions.metrics.metric') || '',
        verifiedOnly: searchParams.get('developer.isVerified') === 'true',
        sort: searchParams.get('sort') || '',
    };
}

function Controls({ filterOptions = {}, children }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categoriesList, setCategoriesList] = useState([]);
    const [catFilter, setCatFilter] = useState(null);
    const [activeCat, setActiveCat] = useState(null);
    const [price, setPrice] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [deliveryTime, setDeliveryTime] = useState(null);
    const [highestRated, setHighestRated] = useState(false);
    const [modalityId, setModalityId] = useState('');
    const [bodyPartId, setBodyPartId] = useState('');
    const [fda, setFda] = useState('');
    const [feature, setFeature] = useState('');
    const [metric, setMetric] = useState('');
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [sort, setSort] = useState('');
    const [savedFilters, setSavedFilters] = useState([]);
    const [saveFilterName, setSaveFilterName] = useState('');
    const [selectedSavedFilter, setSelectedSavedFilter] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const { modalities = [], bodyParts = [], features = [], metrics = [] } = filterOptions;

    const syncFromUrl = useCallback(() => {
        const state = readControlsFromParams(searchParams);
        setCatFilter(state.catFilter);
        setActiveCat(state.activeCat);
        setPrice(state.price);
        setMinPrice(state.minPrice);
        setMaxPrice(state.maxPrice);
        setDeliveryTime(state.deliveryTime);
        setHighestRated(state.highestRated);
        setModalityId(state.modalityId);
        setBodyPartId(state.bodyPartId);
        setFda(state.fda);
        setFeature(state.feature);
        setMetric(state.metric);
        setVerifiedOnly(state.verifiedOnly);
        setSort(state.sort);
    }, [searchParams]);

    useEffect(() => {
        syncFromUrl();
    }, [syncFromUrl]);

    useEffect(() => {
        getCategoriesReq('?parentId=null&limit=100')
            .then((res) => {
                const cats = res.data?.data?.categories || [];
                setCategoriesList(buildCategoriesList(cats, { includeAllModels: false }));
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        setSavedFilters(getSavedFilters());
    }, []);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    const onClickCatFilter = (cat) => {
        setCatFilter(cat);
        setActiveCat(cat);
    };



    const buildNextParams = () => {
        const next = new URLSearchParams(searchParams);
        CONTROL_MANAGED_PARAMS.forEach((key) => next.delete(key));

        if (catFilter) {
            if (searchParams.get('categoryRel.slug') === catFilter) {
                next.set('categoryRel.slug', catFilter);
            } else {
                next.set('categoryRel.name', catFilter);
            }
        }
        if (price === 'Less Than Or Equal To $300') {
            next.set('versions.price', '300');
            next.set('versions.priceRule', 'lte');
        } else if (price === 'Greater Than Or Equal To $300') {
            next.set('versions.price', '300');
            next.set('versions.priceRule', 'gte');
        }
        if (minPrice) next.set('priceMin', minPrice);
        if (maxPrice) next.set('priceMax', maxPrice);
        if (deliveryTime === 'Less Than Or Equal To 5 Days') {
            next.set('versions.deliveryTime', '5');
            next.set('versions.deliveryTimeRule', 'lte');
        } else if (deliveryTime === 'Greater Than Or Equal To 5 Days') {
            next.set('versions.deliveryTime', '5');
            next.set('versions.deliveryTimeRule', 'gte');
        }
        if (highestRated) {
            next.set('reviewCount', '1');
            next.set('reviewCountRule', 'gte');
        }
        if (modalityId) next.set('versions.modalityId', modalityId);
        if (bodyPartId) next.set('versions.bodyPartId', bodyPartId);
        if (fda) next.set('versions.fda', FDA_FILTER_QUERY_VALUES[fda] ?? fda);
        if (feature) next.set('versions.features.feature', feature);
        if (metric) next.set('versions.metrics.metric', metric);
        if (verifiedOnly) next.set('developer.isVerified', 'true');
        if (sort) next.set('sort', sort);

        next.delete('page');
        return next;
    };

    const ApplyFilters = () => {
        setSearchParams(buildNextParams());
    };

    const clearAll = () => {
        setCatFilter(null);
        setActiveCat(null);
        setPrice(null);
        setMinPrice('');
        setMaxPrice('');
        setDeliveryTime(null);
        setHighestRated(false);
        setModalityId('');
        setBodyPartId('');
        setFda('');
        setFeature('');
        setMetric('');
        setVerifiedOnly(false);
        setSort('');
        setSelectedSavedFilter('');
        setSearchParams(new URLSearchParams());
    };

    const pendingParams = buildNextParams();

    const handleRemoveChip = (removeKeys) => {
        let shouldApplyImmediately = false;

        removeKeys.forEach((key) => {
            if (key.startsWith('categoryRel')) { setCatFilter(null); setActiveCat(null); }
            if (key === 'versions.price') { setPrice(null); setMinPrice(''); setMaxPrice(''); }
            if (key === 'priceMin') { setMinPrice(''); }
            if (key === 'priceMax') { setMaxPrice(''); }
            if (key === 'versions.deliveryTime') { setDeliveryTime(null); }
            if (key === 'reviewCount') { setHighestRated(false); }
            if (key === 'versions.modalityId') { setModalityId(''); }
            if (key === 'versions.bodyPartId') { setBodyPartId(''); }
            if (key === 'versions.fda') { setFda(''); }
            if (key === 'versions.features.feature') { setFeature(''); }
            if (key === 'versions.metrics.metric') { setMetric(''); }
            if (key === 'developer.isVerified') { setVerifiedOnly(false); }
            if (key === 'sort') { setSort(''); }

            if (!CONTROL_MANAGED_PARAMS.includes(key)) {
                shouldApplyImmediately = true;
            }
        });

        if (shouldApplyImmediately) {
            const nextParams = buildNextParams();
            removeKeys.forEach((key) => {
                if (!CONTROL_MANAGED_PARAMS.includes(key)) {
                    nextParams.delete(key);
                }
            });
            setSearchParams(nextParams);
        }
    };

    const handleSaveCurrentFilter = () => {
        const paramsString = paramsStringFromSearchParams(buildNextParams());
        if (!paramsString) return;
        saveFilter(saveFilterName, paramsString);
        setSavedFilters(getSavedFilters());
        setSaveFilterName('');
    };

    const handleLoadSavedFilter = (name) => {
        setSelectedSavedFilter(name);
        const saved = getSavedFilters().find((f) => f.name === name);
        if (!saved) return;
        setSearchParams(searchParamsFromSaved(saved.params));
    };

    const handleDeleteSavedFilter = (name) => {
        deleteSavedFilter(name);
        setSavedFilters(getSavedFilters());
        if (selectedSavedFilter === name) setSelectedSavedFilter('');
    };

    return (
        <GlobalWrapper className={`global-banner-spacing global-page-margin-top ${classes.discoveryContainer}`}>
            <div className={classes.categoriesTopBar}>
                <h2 className={classes.mainTitle}>
                    <span className={classes.gradientText}>Discover Premium Production-Ready AI Models 🚀</span>
                    <span className={classes.subTitle}>Explore, filter, and deploy the next generation of artificial intelligence. Tailored exactly to your workflow and industry needs. 🎯</span>
                </h2>
                <Carousel responsive={responsive} showDots infinite keyBoardControl swipeable draggable className="filters" itemClass={classes.carouselItem}>
                    {categoriesList.map((item, index) => (
                        <Card
                            key={index}
                            title={item.title}
                            onClickLink={onClickCatFilter}
                            items={item.items}
                            img={item.img}
                            activeCat={activeCat}
                        />
                    ))}
                </Carousel>
            </div>

            <div className={classes.layoutGrid}>
                <aside className={classes.sidebar}>
                    <h3 className={classes.sidebarTitle}>Filters</h3>
                    <div className={classes.facets}>
                        <div className={classes.presetSection}>
                            <label className={classes['facet-field']}>
                                <span>Saved Presets</span>
                                <CustomSelect
                                    value={selectedSavedFilter}
                                    onChange={(val) => {
                                        if (val) handleLoadSavedFilter(val);
                                        else {
                                            setSelectedSavedFilter('');
                                            setSearchParams(new URLSearchParams());
                                        }
                                    }}
                                    options={[
                                        { value: '', label: 'Load Saved Preset...' },
                                        ...savedFilters.map(f => ({ value: f.name, label: f.name }))
                                    ]}
                                    placeholder="Load saved filter..."
                                />
                            </label>

                            <div className={classes.saveFilterFooter}>
                                <input
                                    type="text"
                                    placeholder="Preset name (e.g., 'Cheap MRIs')"
                                    value={saveFilterName}
                                    onChange={(e) => setSaveFilterName(e.target.value)}
                                    className={classes['save-filter-input']}
                                />
                                <button onClick={handleSaveCurrentFilter} disabled={!saveFilterName.trim()} className={classes['save-filter-btn']}>
                                    Save
                                </button>
                            </div>
                            {selectedSavedFilter && (
                                <button onClick={() => handleDeleteSavedFilter(selectedSavedFilter)} className={classes['delete-saved-btn']}>
                                    Delete Preset
                                </button>
                            )}
                        </div>

                        <div className={classes.priceSection}>
                            <label className={classes['facet-field']}>
                                <span>Price Range ($)</span>
                                <div className={classes.priceInputs}>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        min="0"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        min="0"
                                    />
                                </div>
                                <div className={classes.dualRange}>
                                    <input type="range" min="0" max="10000" step="50" value={minPrice || 0} onChange={(e) => setMinPrice(e.target.value)} className={classes.thumbLeft} />
                                    <input type="range" min="0" max="10000" step="50" value={maxPrice || 10000} onChange={(e) => setMaxPrice(e.target.value)} className={classes.thumbRight} />
                                    <div className={classes.sliderTrack}></div>
                                    <div className={classes.sliderRange} style={{ left: `${Math.min(100, Math.max(0, (minPrice || 0) / 100))}%`, right: `${100 - Math.min(100, Math.max(0, (maxPrice || 10000) / 100))}%` }}></div>
                                </div>
                            </label>
                        </div>

                        <button type="button" className={classes.advancedFiltersBtn} onClick={() => setShowAdvanced(true)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <ion-icon name="options-outline" style={{ fontSize: '18px' }}></ion-icon> Advanced Filters
                        </button>

                        <div className={classes.desktopApply}>
                            {pendingParams.toString() !== searchParams.toString() && (
                                <button type="button" className={classes.applyBtn} onClick={ApplyFilters}>
                                    Apply filters
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                <main className={classes.mainContent}>
                    <div className={classes.topUtilityBar}>
                        <div className={classes.filterActions}>
                            <FilterChips
                                labelContext={filterOptions}
                                currentParams={pendingParams}
                                onRemoveChip={handleRemoveChip}
                                onClearAllChips={clearAll}
                            />
                        </div>

                        <div className={classes.utilityControls}>
                            <label className={`${classes['facet-field']} ${classes['facet-toggle']}`}>
                                <input
                                    type="checkbox"
                                    checked={verifiedOnly}
                                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                                />
                                <span>Verified developers only</span>
                            </label>

                            <label className={`${classes['facet-field']} ${classes.sortField}`}>
                                <CustomSelect
                                    value={sort}
                                    onChange={(val) => {
                                        setSort(val);
                                    }}
                                    options={SORT_OPTIONS.map(opt =>
                                        opt.value === ''
                                            ? { ...opt, label: 'Sort By: Default' }
                                            : opt
                                    )}
                                />
                            </label>
                        </div>
                    </div>

                    {children}
                </main>
            </div>

            {showAdvanced && (
                <div className={classes.modalOverlay} onClick={() => setShowAdvanced(false)}>
                    <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={classes.modalHeader}>
                            <h3>Advanced Filters</h3>
                            <button className={classes.closeModalBtn} onClick={() => setShowAdvanced(false)}>×</button>
                        </div>
                        <div className={classes.modalBody}>
                            <label className={classes['facet-field']}>
                                <span>Modality</span>
                                <CustomSelect
                                    value={modalityId}
                                    onChange={setModalityId}
                                    options={[
                                        { value: '', label: 'Any' },
                                        ...modalities.map(m => ({ value: m.id.toString(), label: m.name }))
                                    ]}
                                />
                            </label>
                            <label className={classes['facet-field']}>
                                <span>Body Part</span>
                                <CustomSelect
                                    value={bodyPartId}
                                    onChange={setBodyPartId}
                                    options={[
                                        { value: '', label: 'Any' },
                                        ...bodyParts.map(b => ({ value: b.id.toString(), label: b.name }))
                                    ]}
                                />
                            </label>
                            <label className={classes['facet-field']}>
                                <span>Feature</span>
                                <CustomSelect
                                    value={feature}
                                    onChange={setFeature}
                                    options={[
                                        { value: '', label: 'Any' },
                                        ...features.map(f => ({ value: f, label: f }))
                                    ]}
                                />
                            </label>
                            <label className={classes['facet-field']}>
                                <span>Metric</span>
                                <CustomSelect
                                    value={metric}
                                    onChange={setMetric}
                                    options={[
                                        { value: '', label: 'Any' },
                                        ...metrics.map(m => ({ value: m, label: m }))
                                    ]}
                                />
                            </label>
                            <label className={classes['facet-field']}>
                                <span>Delivery Time</span>
                                <CustomSelect
                                    value={deliveryTime || ''}
                                    onChange={(val) => setDeliveryTime(val || null)}
                                    options={[
                                        { value: '', label: 'Any' },
                                        { value: 'Less Than Or Equal To 5 Days', label: '<= 5 Days' },
                                        { value: 'Greater Than Or Equal To 5 Days', label: '>= 5 Days' }
                                    ]}
                                />
                            </label>
                            <label className={classes['facet-field']}>
                                <span>Rating Filter</span>
                                <CustomSelect
                                    value={highestRated ? 'Has Reviews' : ''}
                                    onChange={(val) => setHighestRated(val === 'Has Reviews')}
                                    options={[
                                        { value: '', label: 'Any' },
                                        { value: 'Has Reviews', label: 'Has Reviews' }
                                    ]}
                                />
                            </label>
                            <label className={classes['facet-field']}>
                                <span>FDA Status</span>
                                <CustomSelect
                                    value={fda}
                                    onChange={setFda}
                                    options={[
                                        { value: '', label: 'Any' },
                                        { value: 'Cleared', label: 'Cleared' },
                                        { value: 'Pending', label: 'Pending' },
                                        { value: 'Not Required', label: 'Not Required' }
                                    ]}
                                />
                            </label>
                        </div>
                        <div className={classes.modalFooter}>
                            {pendingParams.toString() !== searchParams.toString() && (
                                <button type="button" className={classes.applyBtn} onClick={() => { ApplyFilters(); setShowAdvanced(false); }}>
                                    Apply & Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </GlobalWrapper>
    );
}

export default Controls;
