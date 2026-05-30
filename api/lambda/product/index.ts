import { requestCatalogApi } from '../_client';
import type { PaginatedProducts, ProductListQuery } from '../../../shared/catalog';

type RequestOption = {
  query?: ProductListQuery;
};

/**
 * Returns a paginated product list using the same filter contract consumed by the frontend.
 */
export const get = async ({ query }: RequestOption = {}): Promise<PaginatedProducts> => {
  return requestCatalogApi<PaginatedProducts>('/woot/products', {
    page: query?.page ?? 1,
    limit: query?.limit ?? 24,
    search: query?.search,
    category: query?.category,
    orderBy: query?.orderBy,
    isSoldOut: query?.isSoldOut,
    isFeatured: query?.isFeatured,
    minPrice: query?.minPrice,
    maxPrice: query?.maxPrice,
    discount: query?.discount,
    appOnly: query?.appOnly,
    amazonFulfilled: query?.amazonFulfilled,
  });
};
