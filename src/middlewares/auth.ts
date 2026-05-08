import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { secret } from '../modules/Auth/auth.service';

export const authMiddleware = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      const decoded = jwt.verify(token, secret) as JwtPayload;

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
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid or expired token!',
      });
    }
  };
};
