export const ANALYTICS_EVENT_NAMES = [
  'page_view',
  'search_changed',
  'category_selected',
  'filter_changed',
  'product_detail_opened',
  'open_woot_clicked',
  'open_amazon_clicked',
  'language_changed',
  'theme_changed',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsEventPayload = {
  event: AnalyticsEventName;
  path: string;
  ip?: string;
  metadata?: Record<string, unknown>;
};

export type AnalyticsResponse = {
  ok?: boolean;
  id?: string;
  createdAt?: string;
  [key: string]: unknown;
};
