# 🎨 ModelLink Frontend Web Application

> **Senior Software Engineering Portfolio Project**
>
> Architected and developed by **Ahmed Manakhly** ([manakhly.tech](https://manakhly.tech) | [GitHub Profile](https://github.com/Ahmed-Manakhly))
>
> 🌐 **Live Demo Application**: [https://www.modellink.manakhly.tech/](https://www.modellink.manakhly.tech/)

---

## 🚀 Quick Start & How to Use

Looking to just run the app, seed the database, or run the tests?
👉 **[Read the Full QUICKSTART Guide (Shared BE/FE)](./QUICKSTART.md)**

---

## 📖 Client Documentation Framework

The client application includes technical architecture documentation inside the [`docs/`](./docs) directory:

| Document File                                                                                | Architecture Scope                                                                                                                |
| :------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| 📄 **[01_FRONTEND_ARCHITECTURE_AND_STATE.md](./docs/01_FRONTEND_ARCHITECTURE_AND_STATE.md)** | React Router v6 Data API, Redux Toolkit state design, custom hooks (`useSocket` + `useRealtimeSession`), and inline route guards. |
| 📄 **[02_DESIGN_SYSTEM_AND_UX.md](./docs/02_DESIGN_SYSTEM_AND_UX.md)**                       | **Neural Midnight** CSS tokens, glassmorphism UI utilities, responsive breakpoints, toast notifications.                          |
| 📄 **[03_DYNAMIC_SEO_AND_PUBLIC_ASSETS.md](./docs/03_DYNAMIC_SEO_AND_PUBLIC_ASSETS.md)**     | Dynamic client-side metadata & JSON-LD schemas (`react-helmet-async`), static asset rules (`robots.txt`, `manifest.json`).        |
| 📄 **[04_API_INTEGRATION_AND_LOADERS.md](./docs/04_API_INTEGRATION_AND_LOADERS.md)**         | Axios interceptors, Bearer token injection, React Router pre-render loaders, Stripe Elements integration.                         |

---

## ⚡ Quickstart Commands

```bash
# 1. Install client dependencies
npm install

# 2. Start local dev server (React 18 SPA)
npm start
```

---

## 📜 License & Copyright

Distributed under the **MIT License**.  
Copyright (c) 2026 **Ahmed Manakhly** ([manakhly.tech](https://manakhly.tech) - <https://github.com/Ahmed-Manakhly>). See `LICENSE` for full terms.
