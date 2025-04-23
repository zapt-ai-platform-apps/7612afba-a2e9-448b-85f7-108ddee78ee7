import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';

export const itemSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  purchasePrice: z.number().optional(),
  currentValue: z.number().optional(),
  purchaseDate: z.string().optional(),
  purchasePlace: z.string().optional(),
  condition: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  images: z.array(z.string()).optional(),
  forSale: z.boolean().default(false),
  askingPrice: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  currency: z.string().default('USD'),
  proofOfPurchase: z.array(z.any()).optional()
});

export const validateItem = createValidator(itemSchema, 'Item');