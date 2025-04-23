import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  aud: z.string().optional(),
  role: z.string().optional(),
  app_metadata: z.record(z.any()).optional(),
  user_metadata: z.record(z.any()).optional(),
  created_at: z.string().optional()
});

export const sessionSchema = z.object({
  access_token: z.string(),
  expires_at: z.number(),
  refresh_token: z.string().optional(),
  token_type: z.string(),
  user: userSchema
});

export const validateUser = createValidator(userSchema, 'User');
export const validateSession = createValidator(sessionSchema, 'Session');