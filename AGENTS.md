# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is "Startup State" — a React/Vite SPA for the Utah startup ecosystem, built on the Base44 BaaS platform. There is no local backend; all data, auth, and serverless functions are hosted on Base44's cloud.

### Running the dev server

```bash
npm run dev
```

Starts Vite on `http://localhost:5173`. The `vite.config.js` sets `logLevel: 'error'`, so the usual "ready in Xms" message is suppressed — verify the server is up by curling `http://localhost:5173/`.

### Linting

```bash
npm run lint        # ESLint (quiet mode)
npm run lint:fix    # auto-fix
```

ESLint only covers `src/components/**`, `src/pages/**`, and `src/Layout.jsx` (excludes `src/lib/`, `src/components/ui/`).

### Building

```bash
npm run build
```

### Environment variables

The app requires a `.env.local` at the repo root with:

| Variable | Required | Purpose |
|---|---|---|
| `VITE_BASE44_APP_ID` | Yes | Base44 app ID (value: `69fe5c22e01d3ef38f7bf78f` from `base44/.app.jsonc`) |
| `VITE_BASE44_APP_BASE_URL` | For backend connectivity | Enables the Vite proxy from `/api` to the Base44 backend. Without it, the frontend renders but API calls fail. |

### Gotchas

- **No backend proxy without `VITE_BASE44_APP_BASE_URL`**: The Base44 Vite plugin logs `[base44] Proxy not enabled (VITE_BASE44_APP_BASE_URL not set)` when this env var is missing. Pages that rely on static content (Home, Why Utah, Resources, Events) still render; pages requiring live data (Map, Admin) show loading spinners.
- **`VITE_BASE44_APP_BASE_URL` must be a full URL**: The value must include the protocol, e.g. `https://your-app-slug.base44.app`. A bare hash or token will crash the Vite proxy with `TypeError: Cannot read properties of null (reading 'split')` because Vite's HTTP proxy expects a parseable URL with a protocol.
- **No test suite**: The project has no automated test framework configured — there is no `test` script in `package.json`.
- **Unused imports cause lint failures**: The repo has ~23 pre-existing unused-import lint errors. These cause `npm run lint` to exit non-zero but are not regressions.
- **Path aliases**: `@/` maps to `./src/` (configured in `jsconfig.json` and resolved by Vite).
