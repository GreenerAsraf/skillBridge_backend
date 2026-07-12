import dotenv from 'dotenv'
import path from 'path'
import { z } from 'zod'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  BETTER_AUTH_URL: z.string().min(1, 'BETTER_AUTH_URL is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  SSLCOMMERZ_STORE_ID: z.string().min(1, 'SSLCOMMERZ_STORE_ID is required'),
  SSLCOMMERZ_STORE_PASSWORD: z.string().min(1, 'SSLCOMMERZ_STORE_PASSWORD is required'),
  SSLCOMMERZ_LIVE: z.string().default('false'),
  BACKEND_URL: z.string().min(1, 'BACKEND_URL is required'),
  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
})

const envParse = envSchema.safeParse(process.env)

if (!envParse.success) {
  console.error('❌ Invalid environment variables:', envParse.error.format())
  process.exit(1)
}

export default {
  port: envParse.data.PORT,
  database_url: envParse.data.DATABASE_URL,
  node_env: envParse.data.NODE_ENV,
  better_auth_secret: envParse.data.BETTER_AUTH_SECRET,
  better_auth_url: envParse.data.BETTER_AUTH_URL,
  google_client_id: envParse.data.GOOGLE_CLIENT_ID,
  google_client_secret: envParse.data.GOOGLE_CLIENT_SECRET,
  sslcommerz_store_id: envParse.data.SSLCOMMERZ_STORE_ID,
  sslcommerz_store_password: envParse.data.SSLCOMMERZ_STORE_PASSWORD,
  sslcommerz_live: envParse.data.SSLCOMMERZ_LIVE,
  backend_url: envParse.data.BACKEND_URL,
  frontend_url: envParse.data.FRONTEND_URL,
  cloudinary_cloud_name: envParse.data.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: envParse.data.CLOUDINARY_API_KEY,
  cloudinary_api_secret: envParse.data.CLOUDINARY_API_SECRET,
}
