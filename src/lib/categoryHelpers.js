import { FILES_BASE_API_URL } from './api';
export const MEDICAL_PARENT_SLUGS = new Set([
    'medical-imaging',
    'clinical-decision-support',
    'telemedicine-remote-monitoring',
    'pathology-histopathology',
    'genomics-personalized-medicine',
    'medical-ai',
]);

/** Static first entry — always shown before fetched parent categories */
export const allModelsCategory = {
    title: 'AI Models',
    img: '',
    to: '/',
    items: [{ title: 'All Models', to: '/models' }],
};

/**
 * Maps DB parent categories (with children) to nav/filter card shape.
 */
export function mapDbCategoriesToNavShape(categories, filesBaseUrl = FILES_BASE_API_URL) {
    if (!Array.isArray(categories)) return [];

    return categories.map((parent) => ({
        title: parent.name,
        slug: parent.slug,
        img: parent.svg ? `${filesBaseUrl}${parent.svg}` : '',
        to: '/',
        items: (parent.children || []).map((child) => ({
            title: child.name,
            to: child.slug
                ? `/models?categoryRel.slug=${encodeURIComponent(child.slug)}`
                : `/models?categoryRel.name=${encodeURIComponent(child.name)}`,
        })),
    }));
}

/** Prepends the static "All Models" group before fetched parent categories */
export function buildCategoriesList(dbCategories, { includeAllModels = true, filesBaseUrl } = {}) {
    const mapped = mapDbCategoriesToNavShape(dbCategories, filesBaseUrl);
    return includeAllModels ? [allModelsCategory, ...mapped] : mapped;
}

/** Parent-only cards for home page — one action per parent group */
export function mapParentCategoriesToHomeCards(categories, filesBaseUrl = FILES_BASE_API_URL) {
    if (!Array.isArray(categories)) return [];
    return categories.map((parent) => ({
        title: parent.name,
        slug: parent.slug,
        img: parent.svg ? `${filesBaseUrl}${parent.svg}` : '',
        to: '/models',
    }));
}

/** True when selected subcategory belongs under a medical parent group */
export function isMedicalSubcategory(categoryId, subcategories = []) {
    if (!categoryId) return false;
    const found = subcategories.find((c) => String(c.id) === String(categoryId));
    if (!found?.parent?.slug) return false;
    return MEDICAL_PARENT_SLUGS.has(found.parent.slug);
}
