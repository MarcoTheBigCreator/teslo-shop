import { z } from 'zod';

const moneySchema = z.object({
  currency_code: z.literal('USD'),
  value: z.string().regex(/^\d+(?:\.\d{1,2})?$/),
});

const paymentSchema = z.object({
  id: z.string(),
  status: z.literal('COMPLETED'),
  purchase_units: z.array(z.object({
    invoice_id: z.string(),
    amount: moneySchema,
    payments: z.object({
      captures: z.array(z.object({
        status: z.string(),
        amount: moneySchema,
      })).min(1),
    }),
  })).length(1),
});

export const isPayPalOrderId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-zA-Z0-9-]{1,128}$/.test(value);

const toCents = (value: string) => {
  const [whole, fraction = ''] = value.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(cents) ? cents : null;
};

export function paymentMatchesOrder(
  payment: unknown,
  order: { id: string; total: number; transactionId: string | null }
) {
  const parsed = paymentSchema.safeParse(payment);
  const expectedCents = Math.round(order.total * 100);
  if (!parsed.success || !Number.isSafeInteger(expectedCents) || expectedCents <= 0) return false;
  if (!order.transactionId || parsed.data.id !== order.transactionId) return false;

  const unit = parsed.data.purchase_units[0];
  return unit.invoice_id === order.id &&
    toCents(unit.amount.value) === expectedCents &&
    unit.payments.captures.some((capture) =>
      capture.status === 'COMPLETED' && toCents(capture.amount.value) === expectedCents
    );
}
