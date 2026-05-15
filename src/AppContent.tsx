/**
 * Root UI composition for the Woot Finder application.
 */
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css';

import { useEffect, useState } from 'react';
import type { WootProduct } from '@shared/woot';
import faviconUrl from './assets/favicon.ico';
import { AboutPage } from './components/InfoPages/AboutPage';
import { PrivacyPage } from './components/InfoPages/PrivacyPage';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal/ProductModal';
import { WootAppShell } from './components/WootAppShell/WootAppShell';
import { FloatingScrollTop } from './components/FloatingScrollTop';
import { useWootCatalog } from './hooks/useWootCatalog';

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
  const [selectedProduct, setSelectedProduct] = useState<WootProduct | null>(null);
  const [activePage, setActivePage] = useState<AppPage>(() =>
    pageFromPathname(typeof window === 'undefined' ? '/' : window.location.pathname),
  );
  const catalog = useWootCatalog();

  useEffect(() => {
    document.title = 'WootFinder';

    const currentIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const iconElement = currentIcon ?? document.createElement('link');

    iconElement.rel = 'icon';
    iconElement.type = 'image/svg+xml';
    iconElement.href = faviconUrl;

    if (!currentIcon) {
      document.head.appendChild(iconElement);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(pageFromPathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: '/' | '/about' | '/privacy') => {
    const nextPage = pageFromPathname(path);

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }

    setActivePage(nextPage);
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
      <WootAppShell
        categories={catalog.categories}
        search={catalog.search}
        showSoldOut={catalog.showSoldOut}
        activeCategory={catalog.activeCategory}
        activePage={activePage}
        totalProducts={catalog.products.meta.total}
        onNavigate={navigate}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onShowSoldOutChange={catalog.setShowSoldOut}
      >
        {activePage === 'catalog' ? (
          <ProductGrid
            products={catalog.products.data}
            loading={catalog.loadingProducts}
            loadingMore={catalog.loadingMore}
            hasNextPage={catalog.products.meta.hasNextPage}
            onLoadMore={catalog.loadNextPage}
            onSelect={setSelectedProduct}
          />
        ) : null}

        {activePage === 'about' ? <AboutPage /> : null}
        {activePage === 'privacy' ? <PrivacyPage /> : null}
      </WootAppShell>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <FloatingScrollTop />
    </>
  );
}

export default AppContent;
