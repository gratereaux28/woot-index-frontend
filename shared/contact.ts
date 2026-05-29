export type ContactMessagePayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export type ContactResponse = {
  ok: boolean;
  error?: 'invalid_payload' | 'contact_not_configured' | 'delivery_failed';
};
