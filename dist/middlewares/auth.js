"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../modules/Auth/auth.service");
const authMiddleware = (...requiredRoles) => {
    return async (req, res, next) => {
        try {
            // Get token from headers
            const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
            if (!token) {
                res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: 'You have no access to this route',
                });
                return;
            }
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, auth_service_1.secret);
            // Check roles
            if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
                res.status(403).json({
                    success: false,
                    statusCode: 403,
                    message: 'You are not authorized!',
                });
                return;
            }
            // Attach user to req
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'Invalid or expired token!',
            });
        }
    };
};
exports.authMiddleware = authMiddleware;
