# Bank of Dad

Bank of Dad is a browser-based allowance tracker built with [Lit](https://lit.dev/) that helps parents model savings, interest, and spending habits for their kids. The project is currently a small static prototype and will grow into a full TypeScript application as the scaffolding lands.

## Features
- Authenticate as the household admin and persist simple sessions in local storage.
- Manage multiple child accounts, including deposits, withdrawals, and running balances.
- Track transaction history with contextual memos so kids understand each change.
- Estimate and apply configurable interest payouts to reinforce savings habits.
- Edit the "parent" profile and credentials directly from the UI.

## Tech Stack
- [Lit](https://lit.dev/) custom elements rendered as a single-page experience.
- Vanilla Web Components served from a static `index.html` entry point.
- Local storage services for auth and account state while the real API is designed.

## Project Structure
```
.
├── index.html          # Static entry file wiring up the Lit application
├── src/
│   ├── app.js          # Root <bank-of-dad-app> component and orchestration logic
│   ├── components/     # Presentation components (dashboard, login, dialogs, etc.)
│   ├── services/       # Local storage backed auth and account helpers
│   └── styles/         # Global and component-specific CSS
├── AGENTS.md           # Notes for collaborators experimenting with the codebase
└── README.md
```
As the domain model expands, prefer placing feature-specific logic under `src/accounts`, `src/ledger`, and `src/ui`, with shared utilities in `src/lib/` and contract types in `src/contracts/`.

## Local Development
The current prototype ships as static assets, so any local HTTP server will work. For example:

```bash
# from the repository root
npx serve@latest .
```

Then open the printed URL (default `http://localhost:3000`) to interact with the app.

We plan to add a `package.json` that wires up the following scripts once the TypeScript toolchain lands:
- `npm run dev` — Start the watched development server
- `npm run build` — Produce the production bundle and surface type errors
- `npm run lint` — Run ESLint with the React, Testing Library, and security plugins
- `npm run test` — Execute unit tests (Vitest/Jest + Testing Library)
- `npm run check` — Meta-task that runs lint, type-check, and test in sequence

## Testing
Unit specs should live next to their modules as `*.spec.ts` files, while higher-level flows and e2e journeys belong in `tests/e2e/*.spec.ts`. Target ≥80% statement coverage in the `accounts` and `ledger` areas. Snapshot tests are fine when paired with behavioral assertions. Run the planned `npm run check` command locally before opening a pull request.

## Configuration & Security
- Store secrets in `.env.local` or `.env.test` (never commit them). Document required variables in `docs/configuration.md` and provide safe defaults via `.env.example`.
- Rotate tokens before sharing debugging artifacts, and audit dependencies periodically (e.g., `npm audit resolve`).

## Contributing
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) and keep each change focused. Every PR should include a short summary, verification steps, linked issues, and before/after screenshots for UI tweaks. Request review after CI passes and tag at least one maintainer.

Ready to help build the family bank of the future—just clone the repo, spin up a static server, and start iterating.
