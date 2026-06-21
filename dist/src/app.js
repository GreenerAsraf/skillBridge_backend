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
const payment_route_1 = require("./modules/Payment/payment.route");
const auth_1 = require("./lib/auth");
const node_1 = require("better-auth/node");
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const app = (0, express_1.default)();
// SSLCommerz payment callback paths
const PAYMENT_CALLBACK_PATHS = [
    '/api/payment/success',
    '/api/payment/fail',
    '/api/payment/cancel',
    '/api/payment/ipn',
];
const allowedOrigins = [
    'https://skill-bridge-client-pi.vercel.app',
    'https://sandbox.sslcommerz.com',
    'https://securepay.sslcommerz.com',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean).map((url) => url.replace(/\/$/, ''));
// Unified CORS middleware
app.use((req, res, next) => {
    const cleanPath = req.path.replace(/\/$/, '');
    const isPaymentCallback = PAYMENT_CALLBACK_PATHS.some((p) => cleanPath === p.replace(/\/$/, ''));
    console.log('[CORS Debug] req.path:', req.path, 'cleanPath:', cleanPath, 'isPaymentCallback:', isPaymentCallback, 'origin:', req.headers.origin);
    if (isPaymentCallback) {
        // Allow all for SSLCommerz callbacks
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS')
            return res.sendStatus(200);
        return next();
    }
    return (0, cors_1.default)({
        origin: (origin, callback) => {
            console.log('[CORS Debug] cors origin function called with origin:', origin);
            if (!origin)
                return callback(null, true);
            const norm = origin.replace(/\/$/, '');
            const isSslCommerz = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*sslcommerz\.com(?::\d+)?$/.test(norm);
            if (norm === 'null' ||
                allowedOrigins.includes(norm) ||
                isSslCommerz) {
                return callback(null, true);
            }
            console.log('[CORS Debug] CORS denied for origin:', origin, 'norm:', norm);
            callback(new Error(`CORS: origin ${origin} not allowed`));
        },
        credentials: true,
    })(req, res, next);
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Auth routes
app.use('/api/auth', (req, res, next) => {
    const betterAuthRoutes = [
        '/sign-in', '/sign-up', '/session', '/callback',
        '/sign-out', '/error', '/verify-email',
        '/forget-password', '/reset-password'
    ];
    const path = req.path.replace('/api/auth', '');
    if (betterAuthRoutes.some(route => path.startsWith(route))) {
        return (0, node_1.toNodeHandler)(auth_1.auth)(req, res);
    }
    next();
});
app.use('/api/auth', auth_route_1.AuthRoutes);
app.use('/api/admin', user_route_1.AdminRoutes);
app.use('/api/admin/bookings', booking_route_1.AdminBookingRoutes);
app.use('/api/admin/reviews', review_route_1.AdminReviewRoutes);
app.use('/api/tutors', tutor_route_1.PublicTutorRoutes);
app.use('/api/tutor', tutor_route_1.TutorManagementRoutes);
app.use('/api/categories', category_route_1.CategoryRoutes);
app.use('/api/bookings', booking_route_1.BookingRoutes);
app.use('/api/reviews', review_route_1.ReviewRoutes);
app.use('/api/payment', payment_route_1.PaymentRoutes);
app.get('/', (req, res) => {
    res.send('Hello World from skillbridge backend!');
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
