import { createSlice } from '@reduxjs/toolkit';
import { getModelMarketingFields, getPrimaryVersion, getVersionById } from '../lib/modelHelpers';

const cartLineKey = (modelId, versionId) => `${modelId}-${versionId}`;

const normalizeLegacyItem = (item) => {
    if (!item || item.versionId != null) return item;
    const primary = getPrimaryVersion(item);
    const marketing = getModelMarketingFields(item, primary?.id);
    return {
        ...item,
        versionId: primary?.id ?? null,
        versionLabel: marketing.version || 'Primary',
        linePrice: Number(marketing.price ?? 0),
    };
};

const buildCartLine = (model, versionId = null) => {
    const version = getVersionById(model, versionId);
    const marketing = getModelMarketingFields(model, version?.id);
    const resolvedVersionId = version?.id ?? null;
    return {
        ...model,
        versionId: resolvedVersionId,
        versionLabel: marketing.version || 'Primary',
        linePrice: Number(marketing.price ?? 0),
        cartKey: cartLineKey(model.id, resolvedVersionId),
    };
};

const computeTotalAmount = (items) =>
    items.reduce((sum, item) => sum + Number(item.linePrice ?? 0), 0);

const loadPersistedItems = () => {
    try {
        const raw = localStorage.getItem('cartItems');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(normalizeLegacyItem);
    } catch {
        return [];
    }
};

const persistedItems = loadPersistedItems();

const cartInitialState = {
    quantity: persistedItems.length,
    totalAmount: computeTotalAmount(persistedItems),
    items: persistedItems,
};

const persistCart = (items) => {
    const keys = items.map(i => ({ id: i.id, versionId: i.versionId }));
    localStorage.setItem('cartItems', JSON.stringify(keys));
};

const cartReducer = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
        addToCart(state, action) {
            const payload = action?.payload || {};
            const model = payload.model || payload;
            const versionId = payload.versionId ?? null;
            const line = buildCartLine(model, versionId);
            const key = line.cartKey;
            const exists = state.items.find((i) => i.cartKey === key || (i.id === line.id && i.versionId === line.versionId));
            if (exists) return;
            state.items = [...state.items, line];
            state.quantity = state.items.length;
            state.totalAmount = computeTotalAmount(state.items);
            persistCart(state.items);
        },
        removeFromCart(state, action) {
            const payload = action?.payload || {};
            const key = payload.cartKey || cartLineKey(payload.id, payload.versionId);
            state.items = state.items.filter((i) => {
                if (i.cartKey) return i.cartKey !== key;
                return !(i.id === payload.id && (payload.versionId == null || i.versionId === payload.versionId));
            });
            state.quantity = state.items.length;
            state.totalAmount = computeTotalAmount(state.items);
            persistCart(state.items);
        },
        onSetCart(state, action) {
            const items = (action.payload || []).map(item => buildCartLine(item, item.versionId));
            state.items = items;
            state.quantity = items.length;
            state.totalAmount = computeTotalAmount(items);
            // We intentionally DO NOT persistCart here, so we don't accidentally overwrite 
            // the user's cart with an empty array if hydration fails or loads slowly.
        },
    },
});

export const cartActions = cartReducer.actions;
export default cartReducer.reducer;
