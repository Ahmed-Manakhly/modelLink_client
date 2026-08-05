# 🔍 Dynamic SEO & Public Directory Assets

> **Document Scope**: `react-helmet-async` dynamic meta tag injection, JSON-LD structured data schemas (`Organization`, `SoftwareApplication`), XML sitemap integration, and public static file specifications.

---

## 1. Dynamic SEO System Architecture (`seo.js`)

**Implementation**: [`src/lib/seo.js`](../src/lib/seo.js)

The application utilizes **`react-helmet-async`** for dynamic runtime `<head>` tag injection, ensuring search engines index dynamic model data correctly:

```text
Component Render ──► Helmet Context ──► Injects Dynamic Meta, OG, Twitter & JSON-LD
```

### 1.1 Dynamic SEO Components Breakdown

| Component          | Scope                                | Injected Metadata & JSON-LD Schemas                                                                                                                        |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`SiteSEO`**      | Home, About, Static pages            | Title, Meta Description, Open Graph, Twitter Cards, Canonical URL, `Organization` & `WebSite` JSON-LD schema with `SearchAction` target.                   |
| **`ModelsSEO`**    | Marketplace listing page (`/models`) | Collection page meta, `BreadcrumbList` & `CollectionPage` JSON-LD schema.                                                                                  |
| **`ModelViewSEO`** | Product View (`/models/view/:id`)    | Dynamic model title, category keywords, dynamic OG image (via `resolveFileUrl`), `SoftwareApplication` JSON-LD with `AggregateRating` & `softwareVersion`. |

---

## 2. JSON-LD Structured Data Examples

### `SoftwareApplication` Schema (`ModelViewSEO`)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.modellink.manakhly.tech/models/view/42",
  "name": "ChestScan Classifier AI",
  "description": "Production-ready X-Ray classification model.",
  "applicationCategory": "AIApplication",
  "operatingSystem": "Any",
  "author": {
    "@type": "Person",
    "name": "Dr. Sarah Chen"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": 18,
    "bestRating": 5,
    "worstRating": 1
  }
}
```

---

## 3. Public Directory Static Assets

**Directory**: [`public/`](../public)

1. **`index.html`**: Root HTML template containing pre-loaded Google Poppins font, Ionicons script, default Open Graph fallback tags, and `<div id="overlays"></div>` modal portal target.
2. **`robots.txt`**: Crawling directives: allows public pages, disallows private routes (`/auth/`, `/cart/`, `/dashboard-dev/`, `/wallet/`), sets `Crawl-delay: 2`, and points to `https://www.modellink.manakhly.tech/sitemap.xml`.
3. **`manifest.json`**: PWA manifest configuring standalone display (`"display": "standalone"`) and dark theme colors (`#0f172a`).
4. **`favicon.svg`**, **`og-image.jpg`**, **`og-image.png`**: Brand vector logo icon and Open Graph social sharing link preview images.
