/**
 * Root UI composition for the WootIndex application.
 */
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css';

import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import type { Product } from '@shared/catalog';
import faviconUrl from './assets/favicon.ico';
import { AboutPage } from './components/InfoPages/AboutPage';
import { ContactPage } from './components/InfoPages/ContactPage';
import { NotFoundPage } from './components/InfoPages/NotFoundPage';
import { PrivacyPage } from './components/InfoPages/PrivacyPage';
import { TermsPage } from './components/InfoPages/TermsPage';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal/ProductModal';
import { CatalogAppShell } from './components/AppShell/CatalogAppShell';
import { FloatingScrollTop } from './components/FloatingScrollTop';
import { useAnalytics } from './hooks/useAnalytics';
import { useCatalog } from './hooks/useCatalog';

type AppPage = 'catalog' | 'about' | 'privacy' | 'terms' | 'contact';

function pageFromPathname(pathname: string): AppPage {
  if (pathname === '/about') {
    return 'about';
  }

  if (pathname === '/privacy') {
    return 'privacy';
  }

  if (pathname === '/terms') {
    return 'terms';
  }

  if (pathname === '/contact') {
    return 'contact';
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

  const navigate = (path: '/' | '/about' | '/privacy' | '/terms' | '/contact') => {
    if (location.pathname !== path) {
      routerNavigate({
        pathname: path,
        search: path === '/' ? window.location.search : '',
      });
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
                search={catalog.search}
                onLoadMore={catalog.loadNextPage}
                onSelect={handleProductSelect}
                onSearchChange={handleSearchChange}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/notfound" element={<NotFoundPage />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </CatalogAppShell>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <FloatingScrollTop />
    </>
  );
}

export default AppContent;
