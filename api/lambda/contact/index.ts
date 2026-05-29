import type { ContactMessagePayload, ContactResponse } from '../../../shared/contact';

type RequestOption = {
  data?: ContactMessagePayload;
  headers?: Record<string, string>;
};

const CONTACT_RECIPIENT = process.env.WOOT_INDEX_CONTACT_RECIPIENT || 'info@wootindex.com';
const CONTACT_WEBHOOK_URL = process.env.WOOT_INDEX_CONTACT_WEBHOOK_URL || '';
const CONTACT_WEBHOOK_TOKEN = process.env.WOOT_INDEX_CONTACT_WEBHOOK_TOKEN || '';
const MAX_FIELD_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 5000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function isValidPayload(data?: ContactMessagePayload) {
  if (!data) {
    return false;
  }

  const name = cleanText(data.name, MAX_FIELD_LENGTH);
  const email = cleanText(data.email, MAX_FIELD_LENGTH);
  const message = cleanText(data.message, MAX_MESSAGE_LENGTH);
  const subject = cleanText(data.subject, MAX_FIELD_LENGTH);

  return Boolean(name && emailPattern.test(email) && message && (!subject || subject.length <= MAX_FIELD_LENGTH));
}

/**
 * Accepts contact form submissions and forwards them to a configured server-side mail/webhook provider.
 */
export const post = async ({ data, headers }: RequestOption = {}): Promise<ContactResponse> => {
  if (!isValidPayload(data)) {
    return { ok: false, error: 'invalid_payload' };
  }

  if (!CONTACT_WEBHOOK_URL) {
    return { ok: false, error: 'contact_not_configured' };
  }

  const payload = {
    to: CONTACT_RECIPIENT,
    name: cleanText(data!.name, MAX_FIELD_LENGTH),
    email: cleanText(data!.email, MAX_FIELD_LENGTH),
    subject: cleanText(data!.subject, MAX_FIELD_LENGTH) || 'WootIndex contact form',
    message: cleanText(data!.message, MAX_MESSAGE_LENGTH),
    metadata: {
      userAgent: headers?.['user-agent'] ?? '',
      referer: headers?.referer ?? '',
    },
  };

  try {
    const response = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${CONTACT_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, error: 'delivery_failed' };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: 'delivery_failed' };
  }
};
