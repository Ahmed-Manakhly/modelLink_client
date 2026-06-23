const STORAGE_KEY = 'modellink_marketplace_saved_filters';

export function getSavedFilters() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveFilter(name, paramsString) {
    const trimmed = (name || '').trim();
    if (!trimmed) return getSavedFilters();

    const filters = getSavedFilters().filter((f) => f.name !== trimmed);
    filters.unshift({ name: trimmed, params: paramsString, savedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters.slice(0, 20)));
    return getSavedFilters();
}

export function deleteSavedFilter(name) {
    const filters = getSavedFilters().filter((f) => f.name !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    return filters;
}

export function paramsStringFromSearchParams(searchParams) {
    const next = new URLSearchParams(searchParams);
    next.delete('page');
    return next.toString();
}

export function searchParamsFromSaved(paramsString) {
    return new URLSearchParams(paramsString || '');
}
