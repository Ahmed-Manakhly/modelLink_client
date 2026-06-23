const STORAGE_KEY = 'modelLink_recent_searches';
const MAX_RECENT = 8;

export const getRecentSearches = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const saveRecentSearch = (field, value) => {
    const trimmed = String(value || '').trim();
    if (!field || !trimmed) return getRecentSearches();

    const entry = { field, value: trimmed, ts: Date.now() };
    const existing = getRecentSearches().filter(
        (item) => !(item.field === field && item.value === trimmed)
    );
    const next = [entry, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
};

export const clearRecentSearches = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};
