/**
 * Root UI composition for the WootIndex application.
 */
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import type { Product } from '@shared/catalog';
import faviconUrl from './assets/favicon.ico';
import { AboutPage } from './components/InfoPages/AboutPage';
import { PrivacyPage } from './components/InfoPages/PrivacyPage';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal/ProductModal';
import { CatalogAppShell } from './components/AppShell/CatalogAppShell';
import { FloatingScrollTop } from './components/FloatingScrollTop';
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
                onSelect={setSelectedProduct}
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
