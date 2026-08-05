# 🎨 Design System, Tokens & UX Architecture

> **Document Scope**: "Neural Midnight" CSS variable design tokens catalog, SCSS module structure, glassmorphic styling, responsive layout scaling, and button component classes.

---

## 1. "Neural Midnight" Design System Tokens

**Catalog Reference**: `BRANDING.txt` Design System Tokens

The UI visual hierarchy uses vanilla CSS custom properties for uniform styling across components:

```css
:root {
  /* ====================================
     1. Backgrounds (Solid)
     ==================================== */
  --bg-main: #0a0c10; /* Absolute darkest background wrapper */
  --bg-surface: #111318; /* Rich dark tone for cards & surfaces */

  /* ====================================
     2. Backgrounds (Gradients & Glassmorphism)
     ==================================== */
  --gradient-marketing:
    radial-gradient(
      circle at top right,
      rgba(34, 211, 238, 0.15) 0%,
      transparent 60%
    ),
    var(--bg-surface);
  --gradient-marketing-transparent: radial-gradient(
    circle at top right,
    rgba(34, 211, 238, 0.15) 0%,
    rgba(17, 19, 24, 0.85) 80%
  );
  --bg-glassy-solid:
    linear-gradient(
      135deg,
      rgba(34, 211, 238, 0.15) 0%,
      rgba(34, 211, 238, 0.02) 100%
    ),
    var(--bg-surface);
  --bg-glassy-primary: linear-gradient(
    135deg,
    rgba(34, 211, 238, 0.15) 0%,
    rgba(34, 211, 238, 0.02) 100%
  );

  /* ====================================
     3. Brand Accents
     ==================================== */
  --primary: #22d3ee; /* Signature Neon Cyan - active states, borders */
  --color-success: #10b981; /* Emerald Green - verified badges */
  --color-danger: #f44336; /* Red - error states, destructive actions */

  /* ====================================
     4. Typography Colors
     ==================================== */
  --on-surface: #e2e8f0; /* Off-white primary text (No pure white #fff) */
  --sonic-silver: hsl(0, 0%, 47%); /* Secondary muted text */
}
```

---

## 2. Component Class Standards & Utilities

1. **`.btn-glass-primary`**: Semi-transparent cyan fill with a bright cyan border. Glows brighter cyan and lifts up on hover.
2. **`.btn-glass-outline`**: Transparent fill, cyan border, cyan text. Fills with a subtle cyan tint on hover.
3. **`.global-rounded`**: Uniform border-radius utility class applied to cards, inputs, buttons, and images.

---

## 3. Responsive Breakpoint Strategy

- **Mobile / Desktop Layout Split**: 1024px standard breakpoint (`@media (max-width: 1024px)`).
- **Navigation & Drawers**: On desktop (≥1024px), navigation renders as a full topbar header. On mobile (<1024px), navigation toggles a slide-out hamburger overlay.
