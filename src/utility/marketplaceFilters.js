import { SEARCH_URL_PARAMS } from './Consts';

/** UI labels → API boolean strings (schema: versions.fda is Boolean) */
export const FDA_FILTER_QUERY_VALUES = {
    Cleared: 'true',
    Pending: 'false',
    'Not Required': 'false',
};

/** Restore UI select value from URL param */
export function fdaParamToUiValue(param) {
    if (!param) return '';
    if (param === 'true') return 'Cleared';
    if (param === 'false') return 'Pending';
    return param;
}

export const MARKETPLACE_FILTER_PARAMS = Array.from(new Set([
    'categoryRel.name',
    'categoryRel.slug',
    'categoryParentSlug',
    'versions.modalityId',
    'versions.bodyPartId',
    'versions.fda',
    'versions.features.feature',
    'versions.metrics.metric',
    'versions.price',
    'versions.priceRule',
    'versions.deliveryTime',
    'versions.deliveryTimeRule',
    'reviewCount',
    'reviewCountRule',
    'developer.isVerified',
    'featured',
    'priceMin',
    'priceMax',
    'sort',
    'tags',
    'search',
    ...SEARCH_URL_PARAMS,
]));

export const CONTROL_MANAGED_PARAMS = [
    'categoryRel.name',
    'categoryRel.slug',
    'versions.modalityId',
    'versions.bodyPartId',
    'versions.fda',
    'versions.features.feature',
    'versions.metrics.metric',
    'versions.price',
    'versions.priceRule',
    'versions.deliveryTime',
    'versions.deliveryTimeRule',
    'reviewCount',
    'reviewCountRule',
    'developer.isVerified',
    'featured',
    'priceMin',
    'priceMax',
    'sort',
];

export const SORT_OPTIONS = [
    { value: '', label: 'Default' },
    { value: '-createdAt', label: 'Newest' },
    { value: '-sales', label: 'Best Selling' },
    { value: '-views', label: 'Most Viewed' },
    { value: '-avgRating', label: 'Highest Rated' },
    { value: '-totalStars', label: 'Most Stars' },
];

const SEARCH_FIELD_LABELS = {
    search: 'Search Any',
    title: 'Title',
    desc: 'Description',
    'categoryRel.name': 'Category',
    'developer.org_username': 'Developer',
    'developer.org_name': 'Developer Org',
    'developer.country': 'Developer Country',
    'versions.indications': 'Use Cases',
};

export function buildModelsApiPath(searchParams, page) {
    const parts = [];

    MARKETPLACE_FILTER_PARAMS.forEach((param) => {
        const value = searchParams.get(param);
        if (value) parts.push(`${param}=${encodeURIComponent(value)}`);
    });

    const legacyCategory = searchParams.get('category');
    if (legacyCategory && !searchParams.get('categoryRel.name')) {
        parts.push(`categoryRel.name=${encodeURIComponent(legacyCategory)}`);
    }

    let query = parts.length ? `?${parts.join('&')}` : '?';
    if (!query.endsWith('&') && !query.endsWith('?')) query += '&';
    if (page != null) query += `page=${page}`;
    return query;
}

export function getSortLabel(sortValue) {
    return SORT_OPTIONS.find((o) => o.value === sortValue)?.label || sortValue;
}

export function getFilterChips(searchParams, labelContext = {}) {
    const chips = [];
    const {
        modalities = [],
        bodyParts = [],
        parentCategories = [],
    } = labelContext;

    const categorySlug = searchParams.get('categoryRel.slug');
    if (categorySlug) {
        chips.push({ id: 'category-slug', label: `Category: ${categorySlug}`, removeKeys: ['categoryRel.slug'] });
    }

    const parentSlug = searchParams.get('categoryParentSlug');
    if (parentSlug) {
        const parent = parentCategories.find((p) => p.slug === parentSlug);
        chips.push({
            id: 'category-parent',
            label: `Group: ${parent?.name || parentSlug}`,
            removeKeys: ['categoryParentSlug'],
        });
    }

    const modalityId = searchParams.get('versions.modalityId');
    if (modalityId) {
        const modality = modalities.find((m) => String(m.id) === modalityId);
        chips.push({
            id: 'modality',
            label: `Modality: ${modality?.name || modalityId}`,
            removeKeys: ['versions.modalityId'],
        });
    }

    const bodyPartId = searchParams.get('versions.bodyPartId');
    if (bodyPartId) {
        const bodyPart = bodyParts.find((b) => String(b.id) === bodyPartId);
        chips.push({
            id: 'body-part',
            label: `Body Part: ${bodyPart?.name || bodyPartId}`,
            removeKeys: ['versions.bodyPartId'],
        });
    }

    const fda = searchParams.get('versions.fda');
    if (fda === 'true' || fda === 'Cleared') {
        chips.push({
            id: 'fda',
            label: 'FDA Cleared',
            removeKeys: ['versions.fda'],
        });
    } else if (fda === 'false' || fda === 'Pending') {
        chips.push({
            id: 'fda',
            label: 'FDA Pending',
            removeKeys: ['versions.fda'],
        });
    } else if (fda === 'Not Required') {
        chips.push({
            id: 'fda',
            label: 'FDA Not Required',
            removeKeys: ['versions.fda'],
        });
    }

    const feature = searchParams.get('versions.features.feature');
    if (feature) {
        chips.push({
            id: 'feature',
            label: `Feature: ${feature}`,
            removeKeys: ['versions.features.feature'],
        });
    }

    const metric = searchParams.get('versions.metrics.metric');
    if (metric) {
        chips.push({
            id: 'metric',
            label: `Metric: ${metric}`,
            removeKeys: ['versions.metrics.metric'],
        });
    }

    const price = searchParams.get('versions.price');
    const priceRule = searchParams.get('versions.priceRule');
    if (price && priceRule) {
        const label =
            priceRule === 'lte'
                ? `Price: ≤ $${price}`
                : priceRule === 'gte'
                  ? `Price: ≥ $${price}`
                  : `Price: $${price}`;
        chips.push({
            id: 'price',
            label,
            removeKeys: ['versions.price', 'versions.priceRule'],
        });
    }

    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (priceMin) {
        chips.push({ id: 'price-min', label: `Min price: $${priceMin}`, removeKeys: ['priceMin'] });
    }
    if (priceMax) {
        chips.push({ id: 'price-max', label: `Max price: $${priceMax}`, removeKeys: ['priceMax'] });
    }

    const deliveryTime = searchParams.get('versions.deliveryTime');
    const deliveryRule = searchParams.get('versions.deliveryTimeRule');
    if (deliveryTime && deliveryRule) {
        const label =
            deliveryRule === 'lte'
                ? `Delivery: ≤ ${deliveryTime} days`
                : deliveryRule === 'gte'
                  ? `Delivery: ≥ ${deliveryTime} days`
                  : `Delivery: ${deliveryTime} days`;
        chips.push({
            id: 'delivery',
            label,
            removeKeys: ['versions.deliveryTime', 'versions.deliveryTimeRule'],
        });
    }

    if (searchParams.get('reviewCount') === '1' && searchParams.get('reviewCountRule') === 'gte') {
        chips.push({
            id: 'reviews',
            label: 'Has Reviews',
            removeKeys: ['reviewCount', 'reviewCountRule'],
        });
    }

    if (searchParams.get('developer.isVerified') === 'true') {
        chips.push({
            id: 'verified',
            label: 'Verified Developers',
            removeKeys: ['developer.isVerified'],
        });
    }

    if (searchParams.get('featured') === 'true') {
        chips.push({
            id: 'featured',
            label: 'Featured Only',
            removeKeys: ['featured'],
        });
    }

    const sort = searchParams.get('sort');
    if (sort) {
        chips.push({
            id: 'sort',
            label: `Sort: ${getSortLabel(sort)}`,
            removeKeys: ['sort'],
        });
    }

    const tags = searchParams.get('tags');
    if (tags) {
        chips.push({ id: 'tags', label: `Tag: ${tags}`, removeKeys: ['tags'] });
    }

    SEARCH_URL_PARAMS.forEach((field) => {
        const value = searchParams.get(field);
        if (value) {
            chips.push({
                id: `search-${field}`,
                label: `${SEARCH_FIELD_LABELS[field] || field}: ${value}`,
                removeKeys: [field],
            });
        }
    });
    return chips;
}

export function removeFilterKeys(searchParams, keys) {
    const next = new URLSearchParams(searchParams);
    keys.forEach((key) => next.delete(key));
    next.delete('page');
    return next;
}
