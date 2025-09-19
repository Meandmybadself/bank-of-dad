# Repository Guidelines

## Project Structure & Module Organization
Bank of Dad is still being scaffolded, so treat this layout as the baseline. Place domain code in `src/` with folders such as `src/accounts/`, `src/ledger/`, and `src/ui/`. Shared helpers live in `src/lib/`, and API contract types in `src/contracts/`. Keep fixtures in `tests/fixtures/`, while static assets go in `public/` and configuration notes in `docs/`.

## Build, Test, and Development Commands
Run `npm install` after cloning (swap in `pnpm` or `yarn` if you standardize on those). Use `npm run dev` for the local server; it should watch `src/` and reload. `npm run build` generates the production bundle and surfaces type errors. Lint with `npm run lint`, and execute unit tests with `npm run test`. Add a `npm run check` meta-script that chains lint, type-check, and test before every PR.

## Coding Style & Naming Conventions
Adopt TypeScript with strict compiler options once `tsconfig.json` lands. Favor 2-space indentation, trailing commas, and single quotes to match the default Prettier profile. Name components and classes in PascalCase, hooks in `useCamelCase`, and files in kebab-case (`ledger-service.ts`). Keep business logic in services or hooks under `src/lib` so React components stay declarative. Enforce ESLint with the React, Testing Library, and security plugins.

## Testing Guidelines
Keep unit tests beside their modules as `*.spec.ts` and heavier flows under `tests/e2e/*.spec.ts`. Use Vitest or Jest with React Testing Library for UI coverage; mirror the folder structure so imports stay relative. Target at least 80% statements in the `accounts` and `ledger` areas. Snapshots are acceptable for visual components when paired with behavioral assertions. Run tests locally before every commit and require CI coverage output on pull requests.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) so release notes remain automatable. Keep commits focused and avoid mixing refactors with behavior changes. Every PR needs a short summary, verification steps, and linked issues. Attach before/after screenshots or GIFs for UI adjustments, and flag migrations or env changes in the description. Request review after CI passes and assign at least one maintainer.

## Security & Configuration Tips
Store secrets in `.env.local` and `.env.test`, never in git. Document required variables in `docs/configuration.md`, plus safe defaults in `.env.example`. Rotate tokens before sharing debugging artifacts. Audit third-party dependencies regularly and pin versions with `npm audit resolve` when needed.
