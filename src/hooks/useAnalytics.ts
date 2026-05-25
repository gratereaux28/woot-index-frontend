import { useCallback } from 'react';

import type { AnalyticsEventName, AnalyticsEventPayload } from '@shared/analytics';

type TrackEventInput = {
  event: AnalyticsEventName;
  path?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Sends fire-and-forget analytics events through the frontend BFF.
 */
export function useAnalytics() {
  return useCallback((input: TrackEventInput) => {
    const payload: AnalyticsEventPayload = {
      event: input.event,
      path: input.path ?? window.location.pathname,
      ip: '',
      metadata: input.metadata,
    };

    window
      .fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      })
      .catch(() => {
        // Analytics must never interrupt the shopping flow.
      });
  }, []);
}
