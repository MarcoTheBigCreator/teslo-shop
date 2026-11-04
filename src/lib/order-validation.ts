import { z } from 'zod';

export const orderItemsSchema = z.array(z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
})).min(1);
