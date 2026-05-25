import { postCatalogApi } from '../../_client';
import type { AnalyticsEventPayload, AnalyticsResponse } from '../../../../shared/analytics';

type RequestOption = {
  data?: AnalyticsEventPayload;
};

/**
 * Proxies visitor analytics events to the upstream API.
 */
export const post = async ({ data }: RequestOption = {}): Promise<AnalyticsResponse> => {
  if (!data?.event || !data.path) {
    return { ok: false };
  }

  return postCatalogApi<AnalyticsResponse>('/analytics/events', {
    ...data,
    ip: data.ip ?? '',
  });
};
