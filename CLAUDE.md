# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TVL IDO (Initial DEX Offering) platform built with React, TypeScript, Vite, and Web3 integration. The application uses Monad testnet for blockchain interactions and features a token sale system with referral tracking.

## Development Commands

### Running the Application

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Type check with `tsc` then build for production
- `pnpm preview` - Preview production build

### Code Quality

- `pnpm tsc` - Type check without emitting files
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier (auto-organizes imports and sorts Tailwind classes)

### Testing

- `pnpm test` - Run Vitest unit tests
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:e2e` - Run Playwright e2e tests (starts dev server automatically)
- `pnpm test:e2e:ui` - Run Playwright with UI
- `pnpm test:e2e:debug` - Debug Playwright tests

## Architecture & Key Patterns

### Project Structure

- **src/features/** - Feature-based modules (home, dashboard, user, order-history, withdrawal-history). Each feature contains its components, hooks, stores, and interfaces
- **src/shared/** - Reusable UI components (50+ components based on Ark UI), hooks, utilities, and icons
- **src/services/** - API service layer (event.service.ts, user.service.ts)
- **src/libs/** - Third-party library configurations (axios-instance, react-query, toaster)
- **src/config/** - App configuration (env, web3, storage, mode, version)
- **src/i18n/** - Internationalization setup

### State Management

- **Valtio** with `use-valtio-store` for global state
- State stored in class-based models (e.g., `UserModel` in `user.model.ts`)
- Stores created with `createStore()` and automatically persisted to localStorage using `storageKeys` from `storage.config.ts`
- Example: `UserStore` manages authentication state with `jwt`, `user`, and methods like `login()`, `logout()`, `update()`

### Web3 Integration

- **Reown AppKit** (formerly WalletConnect) for wallet connections
- **Wagmi** for Ethereum interactions
- **Viem** for low-level blockchain operations
- Configuration in `web3.config.ts` defines supported networks (Monad testnet)
- Project ID: d6f18e980b17dbc0cbf4395373231804

### API & Data Fetching

- **Axios** instance with JWT bearer token authentication (from `UserStore`)
- Request interceptor adds auth headers automatically
- Response interceptor handles pagination transformation and 401 errors (triggers logout)
- **React Query** for data fetching and caching
- Base URL configured per environment via `ENV.API_URL`

### Routing & Authentication

- **React Router** with loader-based auth guards
- `authLoader()` in `router.tsx` redirects unauthenticated users to home
- Protected routes: `/dashboard`, `/order-history`, `/withdrawal-history`
- Layout wrapper in `features/root/layout.tsx`

### Styling

- **Tailwind CSS** with custom configuration
- **tailwind-schemes** for theming (dark mode by default)
- Custom animations: `collapse`, `aero`, `miniping`
- Plugins: tailwindcss-animate, tailwindcss-motion, tailwind-scrollbar
- Custom font: "Barlow" (sans), "a Autobus Omnibus" (brand)
- Use `tv()` function from `tailwind-variants` for component variants (configured in Prettier)

### TypeScript Configuration

- Path alias: `@/*` maps to `src/*`
- Strict mode enabled with unused locals/parameters warnings
- JSX preservation for SWC transformation

### Environment Management

- Three environments: development, staging (stg), production (prd)
- Mode determined by `VITE_MODE` in `.env.*` files
- API URLs differ per environment
- `Mode` enum in `mode.config.ts` defines available modes

### Version Management

- Auto-generated patch version from git hash + timestamp in `vite.config.ts`
- Accessible via `__PATCH_VERSION__` global
- Auto-update version feature monitors for new deployments

### Service Worker

- PWA with service worker for offline capability
- Registered in `main.tsx`
- Listens for `CLEAR_STORAGE` message to clear localStorage on updates

## Code Style Notes

### Prettier Configuration

- No semicolons
- Double quotes
- 2 spaces indentation
- Arrow function parens: avoid
- Trailing commas: all
- Plugins auto-organize imports and format Tailwind classes

### ESLint Rules

- React in JSX scope not required (React 18)
- Unused variables prefixed with `_` are allowed
- `any` type allowed
- Display name warnings only
- Prop types disabled (TypeScript handles this)

## Prerequisites

- Node.js >= 20
- pnpm >= 8 (uses pnpm for package management)

## Important Notes

- When creating new stores, follow the pattern: class model → `createStore()` with storage key
- Protected routes must use `authLoader` in router configuration
- API responses with pagination are automatically transformed by axios interceptor
- SVG imports use SVGR plugin (import as React components with currentColor fill)
- The project uses feature-based organization - keep related code together in feature folders
- Husky git hooks run on commits (configured via `postinstall` script)
