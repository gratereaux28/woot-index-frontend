/**
 * Root UI composition for the WootIndex application.
 */
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css';

import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import type { Product } from '@shared/catalog';
import faviconUrl from './assets/favicon.ico';
import { AboutPage } from './components/InfoPages/AboutPage';
import { PrivacyPage } from './components/InfoPages/PrivacyPage';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal/ProductModal';
import { CatalogAppShell } from './components/AppShell/CatalogAppShell';
import { FloatingScrollTop } from './components/FloatingScrollTop';
import { useAnalytics } from './hooks/useAnalytics';
import { useCatalog } from './hooks/useCatalog';

type AppPage = 'catalog' | 'about' | 'privacy';

function pageFromPathname(pathname: string): AppPage {
  if (pathname === '/about') {
    return 'about';
  }

  if (pathname === '/privacy') {
    return 'privacy';
  }

  return 'catalog';
}

/**
 * Connects catalog state with the shell, grid, modal and utility widgets.
 */
function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const catalog = useCatalog();
  const location = useLocation();
  const routerNavigate = useNavigate();
  const activePage = pageFromPathname(location.pathname);
  const track = useAnalytics();
  const didTrackCategory = useRef(false);
  const didTrackFilters = useRef(false);
  const didTrackSearch = useRef(false);

  useEffect(() => {
    document.title = 'WootIndex';

    const currentIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const iconElement = currentIcon ?? document.createElement('link');

    iconElement.rel = 'icon';
    iconElement.type = 'image/svg+xml';
    iconElement.href = faviconUrl;

    if (!currentIcon) {
      document.head.appendChild(iconElement);
    }
  }, []);

  const navigate = (path: '/' | '/about' | '/privacy') => {
    if (location.pathname !== path) {
      routerNavigate(path);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    track({
      event: 'page_view',
      path: location.pathname,
      metadata: { page: activePage },
    });
  }, [activePage, location.pathname, track]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!didTrackSearch.current) {
        didTrackSearch.current = true;
        return;
      }

      track({
        event: 'search_changed',
        path: location.pathname,
        metadata: {
          searchLength: catalog.search.trim().length,
          hasSearch: catalog.search.trim().length > 0,
          category: catalog.activeCategory,
        },
      });
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [catalog.activeCategory, catalog.search, location.pathname, track]);

  useEffect(() => {
    if (!didTrackCategory.current) {
      didTrackCategory.current = true;
      return;
    }

    track({
      event: 'category_selected',
      path: location.pathname,
      metadata: {
        category: catalog.activeCategory,
      },
    });
  }, [catalog.activeCategory, location.pathname, track]);

  useEffect(() => {
    if (!didTrackFilters.current) {
      didTrackFilters.current = true;
      return;
    }

    track({
      event: 'filter_changed',
      path: location.pathname,
      metadata: {
        showSoldOut: catalog.showSoldOut,
        filters: catalog.filters,
      },
    });
  }, [catalog.filters, catalog.showSoldOut, location.pathname, track]);

  const handleSearchChange = (value: string) => {
    catalog.setSearch(value);

    if (activePage !== 'catalog') {
      navigate('/');
    }
  };

  const handleCategoryChange = (value: string | null) => {
    catalog.setActiveCategory(value);

    if (activePage !== 'catalog') {
      navigate('/');
    }
  };

  const handleProductSelect = (product: Product) => {
    track({
      event: 'product_detail_opened',
      path: location.pathname,
      metadata: {
        productId: product.id,
        isSoldOut: product.isSoldOut,
        salePriceMin: product.salePriceMin,
      },
    });
    setSelectedProduct(product);
  };

  return (
    <>
      <CatalogAppShell
        categories={catalog.categories}
        search={catalog.search}
        showSoldOut={catalog.showSoldOut}
        filters={catalog.filters}
        activeCategory={catalog.activeCategory}
        activePage={activePage}
        totalProducts={catalog.products.meta.total}
        onNavigate={navigate}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onShowSoldOutChange={catalog.setShowSoldOut}
        onFiltersChange={catalog.setCatalogFilters}
        onResetFilters={catalog.resetCatalogFilters}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProductGrid
                products={catalog.products.data}
                loading={catalog.loadingProducts}
                loadingMore={catalog.loadingMore}
                hasNextPage={catalog.products.meta.hasNextPage}
                onLoadMore={catalog.loadNextPage}
                onSelect={handleProductSelect}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CatalogAppShell>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <FloatingScrollTop />
    </>
  );
}

export default AppContent;
