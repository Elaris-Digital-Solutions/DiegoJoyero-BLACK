import type { OrderSummary } from '../types/order';

interface SendOrderEmailOptions {
  summary: OrderSummary;
  endpoint?: string;
}

/**
 * Sends the order confirmation payload to the backend email handler.
 * Accepts a custom endpoint via env var for easier integration changes.
 */
export async function sendOrderEmail({ summary, endpoint }: SendOrderEmailOptions) {
  const target = endpoint ?? import.meta.env.VITE_EMAIL_ENDPOINT ?? '/api/send-email';

  const response = await fetch(target, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template: 'order-confirmation',
      brand: 'Diego Joyero',
      payload: summary,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || 'No se pudo enviar la confirmación de pedido.');
  }

  return response.json().catch(() => null);
}
