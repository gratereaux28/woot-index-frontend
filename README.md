# WootIndex

WootIndex is a web application for searching and browsing Woot deals through a modern interface built with React and Mantine. The project uses Modern.js to serve the frontend and a BFF layer that encapsulates HTTP calls to an external API configured through environment variables.

## Features

- Searches products by text with debounce to avoid unnecessary requests.
- Filters by category and subcategory using the taxonomy returned by the API.
- Lets users include or hide sold-out products.
- Loads results incrementally with infinite scroll.
- Opens a modal with product details, variants, and additional images.
- Supports switching between light and dark themes.

## Tech Stack

- React 19
- TypeScript 5
- Mantine 9
- Modern.js 3 with the BFF plugin
- Tabler Icons

## Requirements

- Node.js compatible with Modern.js 3
- npm
- An HTTP API reachable at the URL configured in `WOOT_INDEX_API_BASE_URL`

## Getting Started

1. Install dependencies with `npm install`.
2. Create `.env` from `.env.example`.
3. Set `WOOT_INDEX_API_BASE_URL` to point to your API.
4. Start the local environment with `npm run dev`.
5. Build for production with `npm run build`.

## Environment Variables

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `WOOT_INDEX_API_BASE_URL` | Yes | Base URL of the upstream API that exposes categories, products, feeds, and product detail endpoints. | `http://localhost:3200` |
| `PORT` | No | Port used by the Modern.js development/runtime server. | `3300` |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Modern.js development environment. |
| `npm run build` | Generates the production bundle. |
| `npm run serve` | Serves the generated build. |
| `npm run lint` | Runs the TypeScript typecheck without emitting files. |

## Architecture

The application is split into three layers:

- `src/`: React UI, visual components, hooks, and presentation utilities.
- `api/lambda/`: Modern.js BFF layer that encapsulates calls to the external API.
- `shared/`: shared type contracts used by the frontend and the BFF.

### Main Flow

1. `src/App.tsx` mounts the visual shell and connects catalog state to the UI.
2. `src/hooks/useCatalog.ts` loads categories, fetches products, and manages pagination.
3. `api/lambda/*.ts` turns frontend calls into HTTP requests to `WOOT_INDEX_API_BASE_URL`.
4. `src/components/ProductModal/ProductModal.tsx` retrieves the full product detail on demand when a product is opened.
5. `src/utils/product.ts` normalizes prices, descriptions, photos, and time labels.

## Relevant Structure

- `modern.config.ts`: server configuration and BFF plugin registration.
- `src/App.tsx`: root application composition.
- `src/hooks/useCatalog.ts`: catalog state and data-fetching logic.
- `src/components/ProductGrid.tsx`: results grid and infinite scroll behavior.
- `src/components/ProductCard/ProductCard.tsx`: summary card for each product.
- `src/components/ProductModal/ProductModal.tsx`: enriched product detail view.
- `src/components/AppShell/`: shell, navbar, and sidebar summary UI.
- `api/lambda/_client.ts`: shared HTTP client for the external API.
- `shared/catalog.ts`: shared product, category, feed, and pagination types.

## Expected API Contracts

The backend configured in `WOOT_INDEX_API_BASE_URL` must respond to these routes:

- `GET /woot/categories`
- `GET /woot/products`
- `GET /woot/products/:id`
- `GET /woot/feeds`

The expected response types for these endpoints are documented in `shared/catalog.ts`.

## Maintenance

- If you change the backend payload shape, update `shared/catalog.ts` first and then adjust the UI.
- If you add new filters, the correct entry point is `src/hooks/useCatalog.ts` together with the matching wrapper in `api/lambda/products.ts`.
- If you change the remote API origin, validate `.env`, `.env.example`, and `api/lambda/_client.ts`.
