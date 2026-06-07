"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = require("./modules/Auth/auth.route");
const user_route_1 = require("./modules/User/user.route");
const tutor_route_1 = require("./modules/tutor/tutor.route");
const category_route_1 = require("./modules/Category/category.route");
const booking_route_1 = require("./modules/Booking/booking.route");
const review_route_1 = require("./modules/Review/review.route");
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const app = (0, express_1.default)();
const allowedOrigins = [
    'https://skill-bridge-client-pi.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean).map((url) => url.replace(/\/$/, ''));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, same-origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true
}));
app.use(express_1.default.json()); // Middleware to parse JSON bodies
app.use('/api/auth', auth_route_1.AuthRoutes); // Use the custom JWT router for authentication routes
app.use('/api/admin', user_route_1.AdminRoutes); // Admin routes for managing users
app.use('/api/admin/bookings', booking_route_1.AdminBookingRoutes); // Admin routes for managing bookings
app.use('/api/admin/reviews', review_route_1.AdminReviewRoutes); // Admin routes for managing reviews
app.use('/api/tutors', tutor_route_1.PublicTutorRoutes); // Public tutor browsing
app.use('/api/tutor', tutor_route_1.TutorManagementRoutes); // Private tutor management
app.use('/api/categories', category_route_1.CategoryRoutes); // Category management
app.use('/api/bookings', booking_route_1.BookingRoutes); // Bookings management
app.use('/api/reviews', review_route_1.ReviewRoutes); // Reviews management
app.get('/', (req, res) => {
    res.send('Hello World from skillbridge backend! 101 Hello World from skillbridge backend! 101');
});
// Global Error Handler
app.use(globalErrorHandler_1.default);
// Not Found Handler
app.use(notFound_1.default);
exports.default = app;
