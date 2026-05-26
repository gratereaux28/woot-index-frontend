import { requestCatalogApi } from '../../_client';
import type { ProductDetail } from '../../../../shared/catalog';

const VALID_ID = /^[a-zA-Z0-9_-]+$/;

class HttpStatusError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpStatusError';
    this.status = status;
  }
}

/**
 * Returns the complete detail payload for a single product.
 */
export const get = async (id: string): Promise<ProductDetail> => {
  if (!VALID_ID.test(id)) {
    throw new HttpStatusError(400, 'Invalid product ID');
  }

  return requestCatalogApi<ProductDetail>(`/woot/products/${encodeURIComponent(id)}`);
};
