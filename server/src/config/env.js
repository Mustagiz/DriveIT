import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5050'),
  JWT_SECRET: z.string().min(8).default('driveit_jwt_secure_secret_key_2026'),
  DATABASE_URL: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  DIGILOCKER_CLIENT_ID: z.string().optional(),
  DIGILOCKER_CLIENT_SECRET: z.string().optional(),
  SUREPASS_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('*')
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment configuration validation failed:');
    console.error(result.error.format());
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  return result.data || envSchema.parse({});
}

export const env = validateEnv();
