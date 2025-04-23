import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';

export const collectionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  typeId: z.number(),
  coverImage: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isPrivate: z.boolean().default(false),
  itemCount: z.number().default(0),
  totalValue: z.number().optional()
});

export const collectionTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  fields: z.record(z.any()),
  icon: z.string().optional()
});

export const validateCollection = createValidator(collectionSchema, 'Collection');
export const validateCollectionType = createValidator(collectionTypeSchema, 'CollectionType');