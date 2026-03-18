import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // Database
  DB_HOST: z.string().min(1, 'DB_HOST không được trống'),
  DB_PORT: z.coerce.number().min(1).max(65535),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(10, 'JWT_SECRET phải ít nhất 10 ký tự'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // Redis
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().default(6379),

  // Mail
  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_USER: z.string().email('MAIL_USER phải là email hợp lệ'),
  MAIL_PASS: z.string().min(1),
  MAIL_FROM: z.string().min(1, 'MAIL_FROM không được trống')
});

// Type tự động từ schema
export type EnvConfig = z.infer<typeof envSchema>;

// Hàm validate - dùng trong ConfigModule
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues
      .map(e => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n');

    throw new Error(
      `❌ Biến môi trường không hợp lệ:\n${errors}\n` +
      `Kiểm tra lại file .env.${process.env.NODE_ENV}`
    );
  }

  return result.data;
}