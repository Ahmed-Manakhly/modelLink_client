/**
 * ModelLink SEO Utility
 * Centralises all meta-tag, Open Graph, Twitter Card, and JSON-LD
 * structured-data logic for the platform.
 *
 * URL strategy:
 *   - Mirrors the sitemap generator: if NODE_ENV !== 'production' (local or
 *     Docker local) we use the DEV URLs so you can inspect meta tags locally.
 *   - In production Docker builds, PROD URLs are used — which is what search
 *     engines will index.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

// ─── Constants ──────────────────────────────────────────────────────────────

const isDev = process.env.NODE_ENV !== 'production';

const BASE_URL   = isDev
    ? (process.env.REACT_APP_CLIENT_URL_DEV  || 'http://127.0.0.1:3000')
    : (process.env.REACT_APP_CLIENT_URL_PROD || 'https://www.modellink.com');

const FILES_BASE = isDev
    ? (process.env.REACT_APP_FILES_BASE_API_DEV  || 'http://127.0.0.1:8000/public/')
    : (process.env.REACT_APP_FILES_BASE_API_PROD || 'https://api.modellink.com/public/');

// Canonical / OG URLs always point to production so search engines index
// the real domain, not localhost.  Override in dev only if you need local testing.
const PROD_URL   = process.env.REACT_APP_CLIENT_URL_PROD || 'https://www.modellink.com';

const SITE_NAME  = 'ModelLink';
const DEFAULT_OG = `${BASE_URL}/og-image.png`;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Resolve a relative server file path to a full, properly encoded public URL */
export function resolveFileUrl(filePath) {
    if (!filePath) return DEFAULT_OG;
    // Already a full URL — just ensure it is well-formed
    if (filePath.startsWith('http')) {
        try { return new URL(filePath).href; } catch { return filePath; }
    }
    // Encode each path segment individually (preserves "/" separators)
    const encodedPath = filePath
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
    return `${FILES_BASE}${encodedPath}`;
}

/** Trim a string to maxLen and append "…" if needed */
function truncate(str, maxLen = 160) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}

// ─── Site-wide (Home / About / static pages) ────────────────────────────────

/**
 * SiteSEO — inject site-level meta for Home, About, etc.
 *
 * Props:
 *   title        string  Page title (appended with " | ModelLink")
 *   description  string
 *   keywords     string  Comma-separated keywords
 *   path         string  Canonical path, e.g. "/about"
 *   ogImage      string  Full URL to OG image (optional)
 *   type         string  OG type (default "website")
 *   lang         string  HTML lang (default "en")
 */
export function SiteSEO({
    title = 'AI Model Marketplace',
    description = 'ModelLink is the premier AI model marketplace. Discover, purchase, and deploy production-ready AI models built by expert developers.',
    keywords = 'AI models, machine learning, AI marketplace, deep learning, model deployment, MLOps',
    path = '/',
    ogImage = DEFAULT_OG,
    type = 'website',
    lang = 'en',
}) {
    const fullTitle    = `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${PROD_URL}${path}`;

    // Organisation / WebSite structured data
    const orgStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: PROD_URL,
        logo: `${PROD_URL}/favicon.svg`,
        description,
        sameAs: [],                             // add social links here later
        foundingDate: '2025',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'EG',
        },
    };

    const websiteStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: PROD_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${PROD_URL}/models?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <Helmet htmlAttributes={{ lang }}>
            {/* ── Primary ── */}
            <title>{fullTitle}</title>
            <meta name="description"        content={truncate(description)} />
            <meta name="keywords"           content={keywords} />
            <link rel="canonical"           href={canonicalUrl} />
            <meta name="robots"             content="index, follow" />

            {/* ── Open Graph ── */}
            <meta property="og:type"        content={type} />
            <meta property="og:site_name"   content={SITE_NAME} />
            <meta property="og:title"       content={fullTitle} />
            <meta property="og:description" content={truncate(description)} />
            <meta property="og:url"         content={canonicalUrl} />
            <meta property="og:image"       content={ogImage} />
            <meta property="og:locale"      content="en_US" />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card"        content="summary_large_image" />
            <meta name="twitter:site"        content="@ModelLink" />
            <meta name="twitter:creator"     content="@ModelLink" />
            <meta name="twitter:title"       content={fullTitle} />
            <meta name="twitter:description" content={truncate(description)} />
            <meta name="twitter:image"       content={ogImage} />

            {/* ── JSON-LD ── */}
            <script type="application/ld+json">
                {JSON.stringify(orgStructuredData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteStructuredData)}
            </script>
        </Helmet>
    );
}

// ─── Models listing page ─────────────────────────────────────────────────────

/**
 * ModelsSEO — inject meta for /models (the marketplace listing page)
 */
export function ModelsSEO() {
    const title       = 'Browse AI Models';
    const description = 'Explore hundreds of production-ready AI models on ModelLink. Filter by category, modality, and use-case to find the perfect model for your project.';
    const keywords    = 'AI models, machine learning models, buy AI, computer vision, NLP, clinical AI, generative AI, model marketplace';
    const canonicalUrl = `${PROD_URL}/models`;

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',   item: PROD_URL },
            { '@type': 'ListItem', position: 2, name: 'Models', item: canonicalUrl },
        ],
    };

    const collectionPage = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${title} | ${SITE_NAME}`,
        description,
        url: canonicalUrl,
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: PROD_URL,
        },
    };

    return (
        <Helmet>
            <title>{title} | {SITE_NAME}</title>
            <meta name="description"        content={truncate(description)} />
            <meta name="keywords"           content={keywords} />
            <link rel="canonical"           href={canonicalUrl} />
            <meta name="robots"             content="index, follow" />

            <meta property="og:type"        content="website" />
            <meta property="og:site_name"   content={SITE_NAME} />
            <meta property="og:title"       content={`${title} | ${SITE_NAME}`} />
            <meta property="og:description" content={truncate(description)} />
            <meta property="og:url"         content={canonicalUrl} />

            <meta name="twitter:card"        content="summary" />
            <meta name="twitter:title"       content={`${title} | ${SITE_NAME}`} />
            <meta name="twitter:description" content={truncate(description)} />

            <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
            <script type="application/ld+json">{JSON.stringify(collectionPage)}</script>
        </Helmet>
    );
}

// ─── Single Model page ───────────────────────────────────────────────────────

/**
 * ModelViewSEO — inject full per-model meta + JSON-LD structured data.
 *
 * Props:
 *   model  object  The model object returned by getModelByIdReq
 */
export function ModelViewSEO({ model }) {
    if (!model?.id) return null;

    const title       = model.title || 'AI Model';
    const description = model.desc  || `Explore ${title} on ModelLink — a production-ready AI model available for purchase and deployment.`;
    const keywords    = [
        model.category,
        model.categoryRel?.name,
        model.categoryRel?.parent?.name,
        ...(model.tags?.map(t => t.name) || []),
        'AI model',
        'machine learning',
        SITE_NAME,
    ].filter(Boolean).join(', ');

    const firstImage   = resolveFileUrl(model.galleryImages?.[0]);
    const canonicalUrl = `${PROD_URL}/models/${model.id}`;
    const developerName = model.developer
        ? `${model.developer.firstName || ''} ${model.developer.lastName || ''}`.trim() || model.developer.username
        : 'ModelLink Developer';

    // ── Breadcrumb ──
    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',   item: PROD_URL },
            { '@type': 'ListItem', position: 2, name: 'Models', item: `${PROD_URL}/models` },
            { '@type': 'ListItem', position: 3, name: title,    item: canonicalUrl },
        ],
    };

    // ── Product / SoftwareApplication structured data ──
    const productStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': canonicalUrl,
        name: title,
        description: truncate(description, 300),
        url: canonicalUrl,
        image: firstImage,
        applicationCategory: 'AIApplication',
        operatingSystem: 'Any',
        dateCreated: model.createdAt ? model.createdAt.split('T')[0] : undefined,
        dateModified: model.updatedAt ? model.updatedAt.split('T')[0] : undefined,
        identifier: String(model.id),
        author: {
            '@type': 'Person',
            name: developerName,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: PROD_URL,
        },
        ...(model.avgRating && model.starFrequency ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: parseFloat(model.avgRating).toFixed(1),
                reviewCount: model.starFrequency,
                bestRating: 5,
                worstRating: 1,
            },
        } : {}),
        ...(model.versions?.length ? {
            softwareVersion: model.versions.find(v => v.isPrimary)?.version
                || model.versions[model.versions.length - 1]?.version,
        } : {}),
    };

    return (
        <Helmet>
            {/* ── Primary ── */}
            <title>{title} | {SITE_NAME}</title>
            <meta name="description"        content={truncate(description)} />
            <meta name="keywords"           content={keywords} />
            <link rel="canonical"           href={canonicalUrl} />
            <meta name="robots"             content="index, follow" />

            {/* ── Open Graph ── */}
            <meta property="og:type"        content="product" />
            <meta property="og:site_name"   content={SITE_NAME} />
            <meta property="og:title"       content={`${title} | ${SITE_NAME}`} />
            <meta property="og:description" content={truncate(description)} />
            <meta property="og:url"         content={canonicalUrl} />
            <meta property="og:image"       content={firstImage} />
            <meta property="og:locale"      content="en_US" />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card"        content="summary_large_image" />
            <meta name="twitter:site"        content="@ModelLink" />
            <meta name="twitter:title"       content={`${title} | ${SITE_NAME}`} />
            <meta name="twitter:description" content={truncate(description)} />
            <meta name="twitter:image"       content={firstImage} />

            {/* ── JSON-LD ── */}
            <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
            <script type="application/ld+json">{JSON.stringify(productStructuredData)}</script>
        </Helmet>
    );
}
