import { get as getCategories } from '@api/categories';
import { get as getProducts } from '@api/product';
import { useDebouncedValue } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import {
  PRODUCT_ORDER_BY_VALUES,
  type CatalogFilters,
  type Category,
  type PaginatedProducts,
  type ProductListQuery,
  type ProductOrderBy,
} from '@shared/catalog';

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
  orderBy: 'default',
  minPrice: '',
  maxPrice: '',
  discount: '',
  appOnly: false,
  amazonFulfilled: false,
  featuredOnly: false,
};

const searchParamKeys = {
  search: 'search',
  category: 'category',
  showSoldOut: 'showSoldOut',
  orderBy: 'orderBy',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  discount: 'discount',
  appOnly: 'appOnly',
  amazonFulfilled: 'amazonFulfilled',
  featuredOnly: 'featuredOnly',
} as const;

function readBooleanParam(params: URLSearchParams, key: string) {
  const value = params.get(key);

  return value === 'true' || value === '1';
}

function setOptionalParam(params: URLSearchParams, key: string, value: string | null | undefined) {
  const cleanValue = value?.trimStart();

  if (cleanValue) {
    params.set(key, cleanValue);
    return;
  }

  params.delete(key);
}

function normalizeSearchValue(value: string) {
  return value.replace(/ +$/, ' ');
}

function setBooleanParam(params: URLSearchParams, key: string, value: boolean) {
  if (value) {
    params.set(key, 'true');
    return;
  }

  params.delete(key);
}

function readOrderByParam(params: URLSearchParams) {
  const value = params.get(searchParamKeys.orderBy);

  return PRODUCT_ORDER_BY_VALUES.includes(value as ProductOrderBy) ? (value as ProductOrderBy) : initialFilters.orderBy;
}

/**
 * Encapsulates catalog URL state, filters, initial loading, pagination and remote errors.
 */
export function useCatalog() {
  const [products, setProducts] = useState<PaginatedProducts>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const search = searchParams.get(searchParamKeys.search) ?? '';
  const activeCategory = searchParams.get(searchParamKeys.category) || null;
  const showSoldOut = readBooleanParam(searchParams, searchParamKeys.showSoldOut);
  const orderBy = readOrderByParam(searchParams);
  const minPrice = searchParams.get(searchParamKeys.minPrice) ?? initialFilters.minPrice;
  const maxPrice = searchParams.get(searchParamKeys.maxPrice) ?? initialFilters.maxPrice;
  const discount = searchParams.get(searchParamKeys.discount) ?? initialFilters.discount;
  const appOnly = readBooleanParam(searchParams, searchParamKeys.appOnly);
  const amazonFulfilled = readBooleanParam(searchParams, searchParamKeys.amazonFulfilled);
  const featuredOnly = readBooleanParam(searchParams, searchParamKeys.featuredOnly);
  const filters = useMemo<CatalogFilters>(
    () => ({
      orderBy,
      minPrice,
      maxPrice,
      discount,
      appOnly,
      amazonFulfilled,
      featuredOnly,
    }),
    [amazonFulfilled, appOnly, discount, featuredOnly, maxPrice, minPrice, orderBy],
  );
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const updateCatalogParams = useCallback(
    (updater: (nextParams: URLSearchParams) => void) => {
      const currentSearch =
        typeof window === 'undefined' ? searchParams.toString() : window.location.search;
      const nextParams = new URLSearchParams(currentSearch);

      updater(nextParams);

      const nextSearch = nextParams.toString();

      navigate(
        {
          pathname: location.pathname === '/' ? location.pathname : '/',
          search: nextSearch ? `?${nextSearch}` : '',
        },
        { replace: true },
      );
    },
    [location.pathname, navigate, searchParams],
  );

  const query = useMemo<ProductListQuery>(
    () => ({
      page: 1,
      limit: 24,
      search: debouncedSearch.trim() || undefined,
      category: activeCategory ?? undefined,
      orderBy: filters.orderBy === 'default' ? undefined : filters.orderBy,
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

  const setCatalogFilters = useCallback(
    (nextFilters: Partial<CatalogFilters>) => {
      updateCatalogParams(nextParams => {
        if (nextFilters.minPrice !== undefined) {
          setOptionalParam(nextParams, searchParamKeys.minPrice, nextFilters.minPrice);
        }

        if (nextFilters.orderBy !== undefined) {
          setOptionalParam(
            nextParams,
            searchParamKeys.orderBy,
            nextFilters.orderBy === initialFilters.orderBy ? '' : nextFilters.orderBy,
          );
        }

        if (nextFilters.maxPrice !== undefined) {
          setOptionalParam(nextParams, searchParamKeys.maxPrice, nextFilters.maxPrice);
        }

        if (nextFilters.discount !== undefined) {
          setOptionalParam(nextParams, searchParamKeys.discount, nextFilters.discount);
        }

        if (nextFilters.appOnly !== undefined) {
          setBooleanParam(nextParams, searchParamKeys.appOnly, nextFilters.appOnly);
        }

        if (nextFilters.amazonFulfilled !== undefined) {
          setBooleanParam(nextParams, searchParamKeys.amazonFulfilled, nextFilters.amazonFulfilled);
        }

        if (nextFilters.featuredOnly !== undefined) {
          setBooleanParam(nextParams, searchParamKeys.featuredOnly, nextFilters.featuredOnly);
        }
      });
    },
    [updateCatalogParams],
  );

  const resetCatalogFilters = useCallback(() => {
    updateCatalogParams(nextParams => {
      nextParams.delete(searchParamKeys.showSoldOut);
      nextParams.delete(searchParamKeys.orderBy);
      nextParams.delete(searchParamKeys.minPrice);
      nextParams.delete(searchParamKeys.maxPrice);
      nextParams.delete(searchParamKeys.discount);
      nextParams.delete(searchParamKeys.appOnly);
      nextParams.delete(searchParamKeys.amazonFulfilled);
      nextParams.delete(searchParamKeys.featuredOnly);
    });
  }, [updateCatalogParams]);

  const setSearch = useCallback(
    (value: string) => {
      updateCatalogParams(nextParams => {
        setOptionalParam(nextParams, searchParamKeys.search, normalizeSearchValue(value));
      });
    },
    [updateCatalogParams],
  );

  const setActiveCategory = useCallback(
    (value: string | null) => {
      updateCatalogParams(nextParams => {
        setOptionalParam(nextParams, searchParamKeys.category, value);
      });
    },
    [updateCatalogParams],
  );

  const setShowSoldOut = useCallback(
    (value: boolean) => {
      updateCatalogParams(nextParams => {
        setBooleanParam(nextParams, searchParamKeys.showSoldOut, value);
      });
    },
    [updateCatalogParams],
  );

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
