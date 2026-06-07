import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';

export const authMiddleware = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any
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
      const userRole = (session.user.role as string)?.toUpperCase();
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
      (req as any).user = {
        ...session.user,
        role: userRole
      };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid or expired session!',
      });
    }
  };
};
