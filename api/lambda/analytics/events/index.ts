import { postCatalogApi } from '../../_client';
import type { AnalyticsEventPayload, AnalyticsResponse } from '../../../../shared/analytics';

type RequestOption = {
  data?: AnalyticsEventPayload;
  headers?: Record<string, string>;
};

/**
 * Proxies visitor analytics events to the upstream API.
 */
export const post = async ({ headers, data }: RequestOption = {}): Promise<AnalyticsResponse> => {
    const cfHeaders: Record<string, string> = {};
  
  // Propagar headers de Cloudflare
  for (const header of ['cf-connecting-ip', 'cf-ipcountry', 'x-forwarded-for', 'user-agent', 'referer']) {
    const value = headers?.[header];
    if (value) cfHeaders[header] = value;
  }

  if (!data?.event || !data.path) {
    return { ok: false };
  }

  return postCatalogApi<AnalyticsResponse>('/analytics/events', {
    ...data,
    ip: data.ip ?? '',
    headers: cfHeaders,
  });
};
