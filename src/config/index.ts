import dotenv from 'dotenv'
import path from 'path'
import { z } from 'zod'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
})

const envParse = envSchema.safeParse(process.env)

if (!envParse.success) {
  console.error('❌ Invalid environment variables:', envParse.error.format())
  process.exit(1)
}

export default {
  port: envParse.data.PORT,
  database_url: envParse.data.DATABASE_URL,
}
