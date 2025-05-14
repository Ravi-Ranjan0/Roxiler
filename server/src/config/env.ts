import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});

// Validate environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables');
}

// Export validated environment variables
export const config = {
  jwt: {
    secret: env.data.JWT_SECRET,
    expiresIn: env.data.JWT_EXPIRES_IN
  },
  port: env.data.PORT,
  env: env.data.NODE_ENV
};

export type Config = typeof config;