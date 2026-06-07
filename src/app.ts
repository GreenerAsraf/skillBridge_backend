import express, { Application } from 'express'

import cors from 'cors';


import { AuthRoutes } from './modules/Auth/auth.route'
import { AdminRoutes } from './modules/User/user.route'
import { PublicTutorRoutes, TutorManagementRoutes } from './modules/tutor/tutor.route'
import { CategoryRoutes } from './modules/Category/category.route'
import { BookingRoutes, AdminBookingRoutes } from './modules/Booking/booking.route'
import { ReviewRoutes, AdminReviewRoutes } from './modules/Review/review.route'
import globalErrorHandler from './middlewares/globalErrorHandler'
import notFound from './middlewares/notFound'


const app: Application = express()

const allowedOrigins = [
  'https://skill-bridge-client-pi.vercel.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean).map((url) => url!.replace(/\/$/, '')) as string[]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true
}))

app.use(express.json()) // Middleware to parse JSON bodies

app.use('/api/auth', AuthRoutes) // Use the custom JWT router for authentication routes
app.use('/api/admin', AdminRoutes) // Admin routes for managing users
app.use('/api/admin/bookings', AdminBookingRoutes) // Admin routes for managing bookings
app.use('/api/admin/reviews', AdminReviewRoutes) // Admin routes for managing reviews
app.use('/api/tutors', PublicTutorRoutes) // Public tutor browsing
app.use('/api/tutor', TutorManagementRoutes) // Private tutor management
app.use('/api/categories', CategoryRoutes) // Category management
app.use('/api/bookings', BookingRoutes) // Bookings management
app.use('/api/reviews', ReviewRoutes) // Reviews management

app.get('/', (req, res) => {
  res.send('Hello World from skillbridge backend! 101 Hello World from skillbridge backend! 101')
})

// Global Error Handler
app.use(globalErrorHandler)

// Not Found Handler
app.use(notFound)

export default app
