# ModelLink Client

React single-page app for **ModelLink** — browse AI models, place orders, chat with developers, manage wallet and profile.

## Stack

- React 18 + React Router
- Redux Toolkit (auth, realtime)
- Socket.IO client
- SCSS

## Quick start

```bash
cp .env.example .env
npm install
npm start   # http://localhost:3000
```

Start the [server](../modelLink_server) on port 8000 first.

## Portfolio demo mode

Set `REACT_APP_MARKETPLACE_DEMO=true` in `.env` (default in `.env.example`). Matches server `MARKETPLACE_DEMO=true` for mock payments without Stripe.

## Build

```bash
npm run build
```

Output goes to `build/` (gitignored).

## Architecture (high level)

| Layer | Location |
|-------|----------|
| Pages | `src/pages/` |
| Shared components | `src/components/` |
| API calls | `src/api/` |
| Redux | `src/store/` (`authSlice`, `realtimeSlice`) |
| Sockets | `src/hooks/useSocket.js` |
| Routes | `src/App.js` |

Realtime: navbar badges refresh via `chatRefreshTick` on incoming messages; notifications via `setNotify`.

## Environment

| Variable | Purpose |
|----------|---------|
| `REACT_APP_BASE_API_DEV` | API base URL (development) |
| `REACT_APP_FILES_BASE_API_DEV` | Static files base URL |
| `REACT_APP_MARKETPLACE_DEMO` | Mock payment UI |

## Related repos

- **Server:** `modelLink_server`
- **Planning:** pre-push reports and Postman collection

## License

MIT — see [LICENSE](LICENSE).
