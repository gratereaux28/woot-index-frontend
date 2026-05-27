import type { ProductItemPhoto, Product, ProductDetail } from '@shared/catalog';
import type { Language, TranslationKey } from '../i18n';

/**
 * Coerces string and numeric API values into a finite number when possible.
 */
const numberFrom = (value?: string | number | null): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

/**
 * Formats a raw price value as USD and falls back to a generic label when missing.
 */
export const formatPrice = (value?: string | number | null, language: Language = 'en', fallback = 'View price') => {
  const amount = numberFrom(value);
  return amount === null
    ? fallback
    : new Intl.NumberFormat(language === 'es' ? 'es-DO' : 'en-US', { style: 'currency', currency: 'USD' }).format(
        amount,
      );
};

/**
 * Computes a discount badge when both sale and list prices are available.
 */
export const discountLabel = (product: Product, formatter = (value: number) => `${value}% off`) => {
  const apiDiscount = numberFrom(product.discountPercentageMax ?? product.discountPercentageMin);

  if (apiDiscount && apiDiscount > 0) {
    return formatter(Math.round(apiDiscount));
  }

  const sale = numberFrom(product.salePriceMin);
  const list = numberFrom(product.listPriceMin);

  if (!sale || !list || sale >= list) {
    return null;
  }

  return formatter(Math.round((1 - sale / list) * 100));
};

/**
 * Chooses the best short description available for list and detail views.
 */
export const productDescription = (product: Product) => {
  return product.subtitle ?? product.teaser ?? product.fullTitle ?? product.title;
};

/**
 * Human-readable remaining time metadata used in card tooltips.
 */
export type TimeRemaining = {
  shortLabel: string;
  fullLabel: string;
};

/**
 * Converts a product expiration date into short and long status labels.
 */
type TimeLabelFormatter = (key: TranslationKey, values?: Record<string, number>) => string;

export const timeRemainingLabel = (endDate?: string | null, t?: TimeLabelFormatter): TimeRemaining => {
  const label = (key: TranslationKey, fallback: string, values?: Record<string, number>) => t?.(key, values) ?? fallback;

  if (!endDate) {
    return {
      shortLabel: label('time.active', 'Active'),
      fullLabel: label('time.activeFull', 'Deal active until sold out'),
    };
  }

  const end = new Date(endDate).getTime();

  if (Number.isNaN(end)) {
    return {
      shortLabel: label('time.active', 'Active'),
      fullLabel: label('time.activeFull', 'Deal active until sold out'),
    };
  }

  const diffMs = end - Date.now();

  if (diffMs <= 0) {
    return {
      shortLabel: label('time.expired', 'Expired'),
      fullLabel: label('time.expiredFull', 'Deal expired'),
    };
  }

  const minutes = Math.ceil(diffMs / 60_000);
  const hours = Math.ceil(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 60) {
    const shortLabel = `${minutes}m left`;
    return {
      shortLabel: label('time.minutesLeft', shortLabel, { value: minutes }),
      fullLabel: label('time.expiresMinutes', `Deal expires in ${minutes}m or until sold out`, { value: minutes }),
    };
  }

  if (hours < 24) {
    const shortLabel = `${hours}h left`;
    return {
      shortLabel: label('time.hoursLeft', shortLabel, { value: hours }),
      fullLabel: label('time.expiresHours', `Deal expires in ${hours}h or until sold out`, { value: hours }),
    };
  }

  const remainingHours = Math.ceil((diffMs - days * 86_400_000) / 3_600_000);

  if (remainingHours >= 24) {
    const shortLabel = `${days + 1}d left`;
    return {
      shortLabel: label('time.daysLeft', shortLabel, { value: days + 1 }),
      fullLabel: label('time.expiresDays', `Deal expires in ${days + 1}d or until sold out`, { value: days + 1 }),
    };
  }

  const shortLabel = `${days}d ${remainingHours}h left`;
  return {
    shortLabel: label('time.daysHoursLeft', shortLabel, { days, hours: remainingHours }),
    fullLabel: label('time.expiresDaysHours', `Deal expires in ${days}d ${remainingHours}h or until sold out`, {
      days,
      hours: remainingHours,
    }),
  };
};

/**
 * Flags deals that are close enough to expiring to merit an urgency badge.
 */
export const isExpiringSoon = (endDate?: string | null, thresholdHours = 6) => {
  if (!endDate) {
    return false;
  }

  const end = new Date(endDate).getTime();

  if (Number.isNaN(end)) {
    return false;
  }

  const diffMs = end - Date.now();
  return diffMs > 0 && diffMs <= thresholdHours * 3_600_000;
};

/**
 * Extracts the most specific category label available from a detailed product payload.
 */
export const productCategoryLabel = (product?: ProductDetail | null, fallback = 'Woot deal') => {
  const category = product?.categories?.find(item => item.category?.fullName)?.category;
  return category?.fullName ?? category?.name ?? fallback;
};

/**
 * Returns the first usable item-level image, falling back to the product thumbnail.
 */
export const firstItemPhoto = (product?: ProductDetail | null) => {
  const photos = product?.items?.flatMap(item => item.photoRows ?? item.photos ?? []) ?? [];
  const photo = photos.find((item): item is ProductItemPhoto => Boolean(item.url ?? item.Url));
  return photo?.url ?? photo?.Url ?? product?.photoUrl ?? null;
};

/**
 * Collects unique image URLs from the product summary and any item-level photos.
 */
export const productPhotos = (product?: ProductDetail | Product | null) => {
  if (!product) {
    return [];
  }

  const urls = [
    product.photoUrl,
    ...('items' in product
      ? product.items?.flatMap(item => item.photoRows ?? item.photos ?? []).map(photo => photo.url ?? photo.Url) ?? []
      : []),
  ].filter((url): url is string => Boolean(url));

  return [...new Set(urls)];
};

/**
 * Finds the first ASIN available on a product summary or detailed item payload.
 */
export const productAsin = (product?: ProductDetail | Product | null) => {
  if (!product) {
    return null;
  }

  const asin = product.asin ?? ('items' in product ? product.items?.find(item => item.asin)?.asin : null);
  return asin?.trim() || null;
};

/**
 * Builds the Amazon product URL for a product when an ASIN is available.
 */
export const amazonProductUrl = (product?: ProductDetail | Product | null) => {
  const asin = productAsin(product);
  return asin ? `https://www.amazon.com/gp/product/${encodeURIComponent(asin)}` : null;
};

/**
 * Builds the camelcamelcamel product URL for a product when an ASIN is available.
 */
export const camelcamelcamelProductUrl = (product?: ProductDetail | Product | null) => {
  const asin = productAsin(product);
  return asin ? `https://camelcamelcamel.com/product/${encodeURIComponent(asin)}` : null;
};
