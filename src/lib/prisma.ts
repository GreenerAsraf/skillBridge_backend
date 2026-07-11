import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from '../../generated/prisma/client'

import { PrismaClient } from "@prisma/client";

const rawUrl = `${process.env.DATABASE_URL}`

// Remove sslmode/channel_binding params from the URL so pg doesn't parse them
// and emit the security warning. We handle SSL via the pool config below.
const connectionString = rawUrl
  .replace(/[?&]sslmode=[^&]*/g, '')
  .replace(/[?&]channel_binding=[^&]*/g, '')
  .replace(/\?&/, '?')
  .replace(/[?&]$/, '')

const pool = new Pool({
  connectionString,
  ssl: rawUrl.includes('neon.tech') || rawUrl.includes('railway.app') || rawUrl.includes('supabase')
    ? { rejectUnauthorized: false }
    : process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export { prisma }
