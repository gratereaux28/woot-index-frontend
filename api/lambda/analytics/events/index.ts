import { postCatalogApi } from '../../_client';
import { ANALYTICS_EVENT_NAMES, type AnalyticsEventPayload, type AnalyticsResponse } from '../../../../shared/analytics';

type RequestOption = {
  data?: AnalyticsEventPayload;
  headers?: Record<string, string>;
};

const MAX_PATH_LENGTH = 2048;
const MAX_METADATA_BYTES = 4096;
const allowedEvents = new Set<string>(ANALYTICS_EVENT_NAMES);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isValidMetadata = (metadata: unknown) => {
  if (metadata === undefined) {
    return true;
  }

  if (!isRecord(metadata)) {
    return false;
  }

  return JSON.stringify(metadata).length <= MAX_METADATA_BYTES;
};

const isValidPayload = (data?: AnalyticsEventPayload) =>
  Boolean(
    data &&
      allowedEvents.has(data.event) &&
      typeof data.path === 'string' &&
      data.path.startsWith('/') &&
      data.path.length <= MAX_PATH_LENGTH &&
      isValidMetadata(data.metadata),
  );

/**
 * Proxies visitor analytics events to the upstream API.
 */
export const post = async ({ headers, data }: RequestOption = {}): Promise<AnalyticsResponse> => {
  const cfHeaders: Record<string, string> = {};
  
  for (const header of ['cf-connecting-ip', 'cf-ipcountry', 'x-forwarded-for', 'user-agent', 'referer']) {
    const value = headers?.[header];
    if (value) cfHeaders[header] = value;
  }

  if (!isValidPayload(data)) {
    return { ok: false };
  }

  return postCatalogApi<AnalyticsResponse>('/analytics/events', {
    ...data,
    ip: data!.ip ?? '',
    headers: cfHeaders,
  });
};
