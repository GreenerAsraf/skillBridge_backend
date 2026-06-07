"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../lib/auth");
const authMiddleware = (...requiredRoles) => {
    return async (req, res, next) => {
        try {
            const session = await auth_1.auth.api.getSession({
                headers: req.headers
            });
            if (!session) {
                res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: 'You have no access to this route',
                });
                return;
            }
            // Check roles
            const userRole = session.user.role?.toUpperCase();
            const hasRole = requiredRoles.some((role) => role.toUpperCase() === userRole);
            if (requiredRoles.length > 0 && !hasRole) {
                res.status(403).json({
                    success: false,
                    statusCode: 403,
                    message: 'You are not authorized!',
                });
                return;
            }
            // Attach user to req
            req.user = {
                ...session.user,
                role: userRole
            };
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'Invalid or expired session!',
            });
        }
    };
};
exports.authMiddleware = authMiddleware;
