import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

import { AuthRoutes } from './modules/Auth/auth.route'
import { AdminRoutes, UserRoutes } from './modules/User/user.route'
import { PublicTutorRoutes, TutorManagementRoutes } from './modules/tutor/tutor.route'
import { CategoryRoutes } from './modules/Category/category.route'
import { BookingRoutes, AdminBookingRoutes } from './modules/Booking/booking.route'
import { ReviewRoutes, AdminReviewRoutes } from './modules/Review/review.route'
import { PaymentRoutes } from './modules/Payment/payment.route'
import { StatsRoutes } from './modules/Stats/stats.route'
import { BlogRoutes } from './modules/Blog/blog.route'
import { auth } from './lib/auth'
import { toNodeHandler } from 'better-auth/node'
import globalErrorHandler from './middlewares/globalErrorHandler'
import notFound from './middlewares/notFound'

const app: Application = express()

// Production hardening
app.use(helmet())
app.use(compression())

// Rate limiting (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

// SSLCommerz payment callback paths
const PAYMENT_CALLBACK_PATHS = [
  '/api/payment/success',
  '/api/payment/fail',
  '/api/payment/cancel',
  '/api/payment/ipn',
]

const allowedOrigins = [
  'https://skill-bridge-client-pi.vercel.app',
  'https://sandbox.sslcommerz.com',
  'https://securepay.sslcommerz.com',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean).map((url) => url!.replace(/\/$/, '')) as string[]

// Unified CORS middleware
app.use((req, res, next) => {
  const cleanPath = req.path.replace(/\/$/, '')
  const isPaymentCallback = PAYMENT_CALLBACK_PATHS.some((p) => cleanPath === p.replace(/\/$/, ''))

  if (isPaymentCallback) {
    // Allow all for SSLCommerz callbacks
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    return next()
  }

  return cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      const norm = origin.replace(/\/$/, '')

      const isSslCommerz = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*sslcommerz\.com(?::\d+)?$/.test(norm)

      if (
        norm === 'null' ||
        allowedOrigins.includes(norm) ||
        isSslCommerz
      ) {
        return callback(null, true)
      }

      console.log('[CORS Debug] CORS denied for origin:', origin, 'norm:', norm)
      callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })(req, res, next)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import { ContactRoutes } from './modules/Contact/contact.route'

// Auth routes
app.use('/api/auth', (req, res, next) => {
  const betterAuthRoutes = [
    '/sign-in', '/sign-up', '/session', '/callback',
    '/sign-out', '/error', '/verify-email',
    '/forget-password', '/reset-password'
  ]
  const path = req.path.replace('/api/auth', '')
  if (betterAuthRoutes.some(route => path.startsWith(route))) {
    return toNodeHandler(auth)(req, res)
  }
  next()
})

app.use('/api/auth', AuthRoutes)
app.use('/api/admin', AdminRoutes)
app.use('/api/admin/bookings', AdminBookingRoutes)
app.use('/api/admin/reviews', AdminReviewRoutes)
app.use('/api/tutors', PublicTutorRoutes)
app.use('/api/tutor', TutorManagementRoutes)
app.use('/api/categories', CategoryRoutes)
app.use('/api/bookings', BookingRoutes)
app.use('/api/reviews', ReviewRoutes)
app.use('/api/payment', PaymentRoutes)
app.use('/api/stats', StatsRoutes)
app.use('/api/users', UserRoutes)
app.use('/api/blog', BlogRoutes)
app.use('/api/contact', ContactRoutes)


app.get('/', (req, res) => {
  res.send('Hello World from skillbridge backend!')
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
