import { get as getCategories } from '@api/categories';
import { get as getProducts } from '@api/product';
import { useDebouncedValue } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { CatalogFilters, Category, PaginatedProducts, ProductListQuery } from '@shared/catalog';

const initialProducts: PaginatedProducts = {
  meta: {
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  data: [],
};

const initialFilters: CatalogFilters = {
  minPrice: '',
  maxPrice: '',
  discount: '',
  appOnly: false,
  amazonFulfilled: false,
  featuredOnly: false,
};

/**
 * Encapsulates all catalog state: filters, initial loading, pagination and remote errors.
 */
export function useCatalog() {
  const [products, setProducts] = useState<PaginatedProducts>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const query = useMemo<ProductListQuery>(
    () => ({
      page: 1,
      limit: 24,
      search: debouncedSearch.trim() || undefined,
      category: activeCategory ?? undefined,
      isSoldOut: showSoldOut ? undefined : false,
      isFeatured: filters.featuredOnly ? true : undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      discount: filters.discount || undefined,
      appOnly: filters.appOnly ? true : undefined,
      amazonFulfilled: filters.amazonFulfilled ? true : undefined,
    }),
    [activeCategory, debouncedSearch, filters, showSoldOut],
  );

  const setCatalogFilters = useCallback((nextFilters: Partial<CatalogFilters>) => {
    setFilters(current => ({ ...current, ...nextFilters }));
  }, []);

  const resetCatalogFilters = useCallback(() => {
    setFilters(initialFilters);
    setShowSoldOut(false);
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingFilters(true);

    getCategories()
      .then(nextCategories => {
        if (!active) {
          return;
        }

        setCategories(nextCategories);
      })
      .catch(() => {
        if (active) {
          setError('Filters could not be loaded.');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingFilters(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingProducts(true);

    getProducts({ query })
      .then(nextProducts => {
        if (active) {
          setProducts(nextProducts);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setProducts(initialProducts);
          setError('Products could not be loaded from Woot.');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingProducts(false);
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  const loadNextPage = useCallback(() => {
    if (loadingProducts || loadingMore || !products.meta.hasNextPage) {
      return;
    }

    setLoadingMore(true);

    getProducts({ query: { ...query, page: products.meta.page + 1 } })
      .then(nextProducts => {
        setProducts(current => ({
          meta: nextProducts.meta,
          data: [...current.data, ...nextProducts.data],
        }));
      })
      .catch(() => {
        setError('The next page of products could not be loaded.');
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }, [loadingMore, loadingProducts, products.meta.hasNextPage, products.meta.page, query]);

  return {
    products,
    categories,
    search,
    activeCategory,
    showSoldOut,
    filters,
    loadingProducts,
    loadingMore,
    loadingFilters,
    error,
    setSearch,
    setActiveCategory,
    setShowSoldOut,
    setCatalogFilters,
    resetCatalogFilters,
    loadNextPage,
  };
}
