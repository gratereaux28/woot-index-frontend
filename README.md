# WootIndex Frontend

WootIndex is an independent search interface for browsing Woot product data. It exists because Woot does not provide a broad product search experience, so this frontend indexes the product catalog exposed by the WootIndex API and gives users search, filtering, category navigation, product details, and direct outbound links to Woot and Amazon.

WootIndex is not affiliated with, endorsed by, sponsored by, or officially connected to Woot, Amazon, or any of their affiliates. It is only a search tool.

## What This App Does

- Searches products returned by the upstream API.
- Filters products by category, subcategory, price range, minimum discount, app-only status, Amazon fulfillment, featured status, and sold-out visibility.
- Loads paginated product results with infinite scroll.
- Opens product details in a modal with image carousel, variants, prices, and marketplace links.
- Links directly to Woot product pages and Amazon product pages when an ASIN is available.
- Supports English and Spanish UI text with a header language menu.
- Supports dark and light color schemes, with dark mode as the default.
- Sends privacy-conscious usage analytics events through the BFF.
- Provides About and Privacy pages with the required independent-tool disclosure.

## Tech Stack

- React 19
- TypeScript 5
- Modern.js 3
- Modern.js BFF plugin
- Mantine 9
- Mantine Carousel / Embla
- React Router
- Tabler Icons
- Docker

## Project Structure

```text
api/lambda/                  Modern.js BFF routes
api/lambda/_client.ts         Shared upstream API client
api/lambda/analytics/events/  Analytics event proxy
api/lambda/categories/        Category endpoint proxy
api/lambda/product/           Product list and detail endpoint proxies
api/lambda/feed/              Feed endpoint proxy
shared/                       Types shared by BFF and frontend
src/                          React application
src/components/AppShell/      Header, sidebar, navigation, filters
src/components/ProductCard/   Catalog product cards
src/components/ProductModal/  Product detail modal
src/components/InfoPages/     About and Privacy pages
src/hooks/                    Catalog and analytics hooks
src/i18n.tsx                  English/Spanish dictionaries and provider
src/utils/                    Product formatting helpers
```

## Runtime Flow

The browser does not call the upstream API directly. It calls Modern.js BFF routes under `/api/*`, and the BFF forwards requests to the upstream API configured by environment variables.

```text
Browser
  -> Modern.js frontend and BFF
  -> WootIndex API
  -> product/category/analytics data
```

For production behind Cloudflare Tunnel and Nginx, the typical request path is:

```text
Visitor
  -> Cloudflare
  -> Cloudflare Tunnel
  -> Nginx
  -> WootIndex frontend container
  -> WootIndex API container
```

If analytics need the real visitor IP, Cloudflare/Nginx must forward headers such as `CF-Connecting-IP`, `X-Real-IP`, and `X-Forwarded-For`, and the API should prefer those headers over the internal Docker source IP.

## Environment Variables

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `WOOT_INDEX_API_BASE_URL` | Yes | Base URL for the upstream WootIndex API used by the BFF. | `http://localhost:3200` |
| `WOOT_API_BASE_URL` | No | Backward-compatible fallback name for the upstream API URL. | `http://localhost:3200` |
| `WOOT_INDEX_API_ADMIN_KEY` | No | Optional admin/API key sent as `X-Admin-Key` to the upstream API. | `secret-value` |
| `PORT` | No | Port used by the Modern.js server. | `3300` |

If `WOOT_INDEX_API_BASE_URL` and `WOOT_API_BASE_URL` are not set, the BFF falls back to `http://localhost:3200`. That fallback is useful for local development, but it is usually wrong inside Docker because `localhost` points to the frontend container itself.

## Upstream API Contract

The API configured in `WOOT_INDEX_API_BASE_URL` must expose these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/woot/categories` | Returns category and subcategory navigation data. |
| `GET` | `/woot/products` | Returns paginated product results. |
| `GET` | `/woot/products/:id` | Returns a detailed product payload. |
| `GET` | `/woot/feeds` | Returns feed metadata. |
| `POST` | `/analytics/events` | Stores visitor usage events. |

### Product Query Parameters

The frontend currently sends these query parameters to `/woot/products` through the BFF:

| Parameter | Description |
| --- | --- |
| `page` | Page number, starting at `1`. |
| `limit` | Page size. The UI uses `24`. |
| `search` | Search text typed by the user. |
| `category` | Category or subcategory slug. |
| `isSoldOut` | `false` hides sold-out products. Omitted when sold-out products should be included. |
| `isFeatured` | Filters featured products when enabled. |
| `minPrice` | Minimum sale price. |
| `maxPrice` | Maximum sale price. |
| `discount` | Minimum discount percentage. |
| `appOnly` | Filters app-only products. |
| `amazonFulfilled` | Filters products fulfilled by Amazon. |

### Analytics Events

The frontend emits events to:

```text
POST /api/analytics/events
```

The BFF proxies them to:

```text
POST /analytics/events
```

The event payload shape is:

```json
{
  "event": "search_changed",
  "path": "/",
  "ip": "",
  "metadata": {
    "searchLength": 8,
    "hasSearch": true,
    "category": "electronics"
  }
}
```

The frontend intentionally does not send the raw search text in analytics events. It sends metadata such as search length, selected category, active filters, product ID, theme, language, and external-link click type.

Current event names:

- `page_view`
- `search_changed`
- `category_selected`
- `filter_changed`
- `product_detail_opened`
- `open_woot_clicked`
- `open_amazon_clicked`
- `language_changed`
- `theme_changed`

The API may respond with any JSON object. The current implementation accepts responses such as:

```json
{
  "id": "event-id",
  "createdAt": "2026-05-25T21:35:03.276Z"
}
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:3300
```

For local development, make sure the API is running and reachable from the frontend process:

```bash
export WOOT_INDEX_API_BASE_URL=http://localhost:3200
npm run dev
```

## Build and Typecheck

Run the TypeScript check:

```bash
npm run lint
```

Build the production bundle:

```bash
npm run build
```

Serve the generated production build locally:

```bash
npm run serve
```

## Docker Deployment

Build the production image:

```bash
docker build -t woot-index-frontend:latest .
```

Run with Docker Compose:

```bash
WOOT_INDEX_API_BASE_URL=http://localhost:3200 \
WOOT_INDEX_API_ADMIN_KEY=your-key-if-needed \
docker compose up -d
```

The included `docker-compose.yml` publishes the frontend on port `3300`.

Important deployment note: when the app runs inside Docker, do not use `http://localhost:3200` for `WOOT_INDEX_API_BASE_URL` unless the API is running in the same frontend container. Use the API container name on the same Docker network, or use a reachable host/LAN address such as:

```text
http://localhost:3200
```

## Nginx and Cloudflare Tunnel Notes

If the app is served behind Nginx and Cloudflare Tunnel, forward the original visitor headers so the API can record real visitor IPs instead of Docker gateway addresses such as `::ffff:172.20.0.1`.

Recommended Nginx proxy headers:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
proxy_set_header CF-Ray $http_cf_ray;
proxy_set_header CF-IPCountry $http_cf_ipcountry;
```

The API should prefer the following values when resolving visitor IP:

1. `CF-Connecting-IP`
2. First IP in `X-Forwarded-For`
3. `X-Real-IP`
4. Framework request IP fallback

For Express or NestJS, enable trust proxy in the API server when it is behind a trusted proxy:

```ts
app.set('trust proxy', true);
```

## Privacy and Data Collection

WootIndex records usage analytics events to understand usage, debug reliability issues, and improve the product. Events are intentionally limited and should not include sensitive personal information or raw search text.

The Privacy page in the application discloses:

- Technical logs may include IP address, timestamps, requested URLs, browser user agent, and error details.
- Usage events may include page views, search length, selected categories, filter changes, product detail opens, external link clicks, language changes, and theme changes.
- Product images and outbound links may involve third-party services.
- WootIndex is not affiliated with Woot or Amazon.

## Internationalization

The app supports English and Spanish. Translations live in:

```text
src/i18n.tsx
```

The selected language is stored in `localStorage` under:

```text
wootindex-language
```

Product names, category names, and other upstream content are displayed as returned by the API.

## Important Files

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Root providers for Mantine, i18n, and React Router. |
| `src/AppContent.tsx` | Main app composition, routing, page-level analytics, modal state. |
| `src/hooks/useCatalog.ts` | Catalog query state, filters, pagination, category loading. |
| `src/hooks/useAnalytics.ts` | Fire-and-forget analytics sender. |
| `src/i18n.tsx` | English and Spanish dictionaries. |
| `src/components/AppShell/CatalogAppShell.tsx` | Header, theme toggle, language menu, sidebar container. |
| `src/components/AppShell/Navbar.tsx` | Search, filters, navigation, categories. |
| `api/lambda/_client.ts` | Shared GET/POST client for upstream API calls. |
| `api/lambda/analytics/events/index.ts` | BFF analytics proxy. |
| `shared/catalog.ts` | Product, category, feed, and filter types. |
| `shared/analytics.ts` | Analytics event types. |

## Maintenance Guidelines

- Keep documentation in English.
- Keep UI text in `src/i18n.tsx` instead of hardcoding visible labels inside components.
- Add new product filters to `shared/catalog.ts`, `src/hooks/useCatalog.ts`, `api/lambda/product/index.ts`, and `src/components/AppShell/Navbar.tsx`.
- Add new analytics events to `shared/analytics.ts` before emitting them from React.
- Do not send sensitive values or raw search text in analytics metadata.
- If the upstream API payload changes, update shared types first, then update UI components.
