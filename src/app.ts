import express, { Application } from 'express'

import cors from 'cors';


import { AuthRoutes } from './modules/Auth/auth.route'
import { AdminRoutes } from './modules/User/user.route'
import { PublicTutorRoutes, TutorManagementRoutes } from './modules/tutor/tutor.route'
import { CategoryRoutes } from './modules/Category/category.route'
import { BookingRoutes, AdminBookingRoutes } from './modules/Booking/booking.route'
import { ReviewRoutes, AdminReviewRoutes } from './modules/Review/review.route'
import { PaymentRoutes } from './modules/Payment/payment.route'
import { auth } from './lib/auth'
import { toNodeHandler } from 'better-auth/node'
import globalErrorHandler from './middlewares/globalErrorHandler'
import notFound from './middlewares/notFound'

const app: Application = express()

const allowedOrigins = [
  'https://skill-bridge-client-pi.vercel.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean).map((url) => url!.replace(/\/$/, '')) as string[]

// Payment callback routes must accept cross-origin POSTs from SSLCommerz.
// When SSLCommerz redirects the browser via form POST, the browser sends
// Origin: null (a literal string). These routes must bypass strict CORS.
app.use('/api/payment/success', cors({ origin: true, credentials: false }))
app.use('/api/payment/fail', cors({ origin: true, credentials: false }))
app.use('/api/payment/cancel', cors({ origin: true, credentials: false }))
app.use('/api/payment/ipn', cors({ origin: true, credentials: false }))

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, same-origin)
    // Also allow origin "null" — browsers send this string on cross-origin
    // form POSTs after a redirect (e.g. from SSLCommerz gateway callbacks)
    if (
      !origin ||
      origin === 'null' ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.sslcommerz.com') ||
      origin === 'https://sandbox.sslcommerz.com' ||
      origin === 'https://securepay.sslcommerz.com'
    ) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true
}))

app.use(express.json()) // Middleware to parse JSON bodies

app.use('/api/auth', (req, res, next) => {
  const betterAuthRoutes = [
    '/sign-in', '/sign-up', '/session', '/callback', 
    '/sign-out', '/error', '/verify-email', 
    '/forget-password', '/reset-password'
  ];
  // req.path contains the path without the mount prefix in app.use, but for app.all it contains the full path
  // Wait, req.path in app.all('/api/auth(.*)') will be the full path e.g. /api/auth/sign-in
  const path = req.path.replace('/api/auth', '');
  if (betterAuthRoutes.some(route => path.startsWith(route))) {
    return toNodeHandler(auth)(req, res);
  }
  next();
});

app.use('/api/auth', AuthRoutes) // Use the custom JWT router for authentication routes
app.use('/api/admin', AdminRoutes) // Admin routes for managing users
app.use('/api/admin/bookings', AdminBookingRoutes) // Admin routes for managing bookings
app.use('/api/admin/reviews', AdminReviewRoutes) // Admin routes for managing reviews
app.use('/api/tutors', PublicTutorRoutes) // Public tutor browsing
app.use('/api/tutor', TutorManagementRoutes) // Private tutor management
app.use('/api/categories', CategoryRoutes) // Category management
app.use('/api/bookings', BookingRoutes) // Bookings management
app.use('/api/reviews', ReviewRoutes) // Reviews management
app.use('/api/payment', PaymentRoutes) // Payment management

app.get('/', (req, res) => {
  res.send('Hello World from skillbridge backend! 101 Hello World from skillbridge backend! 101')
})

// Global Error Handler
app.use(globalErrorHandler)

// Not Found Handler
app.use(notFound)

export default app
