import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../services/jwt.services';
import { TokenExpiredError } from 'jsonwebtoken';
import { logger } from './logger.middleware';

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 */
export const authorize = () => (req: Request, res: Response, next: NextFunction) => {
  try {
    let jwt = req.headers.authorization;

    if (!jwt) {
      logger.warn('Invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    // remove Bearer if using Bearer Authorization mechanism
    if (jwt.toLowerCase().startsWith('bearer')) {
      jwt = jwt.slice('bearer'.length).trim();
    }

    // verify token hasn't expired yet
    validateToken(jwt);

    // const hasAccessToEndpoint = allowedAccessTypes.some(
    //   (at) => decodedToken.accessTypes.some((uat) => uat === at)
    // );

    // if (!hasAccessToEndpoint) {
    //   return res.status(401).json({ message: 'No enough privileges to access endpoint' });
    // }

    next();
  } catch (error) {
    logger.error('Failed to authenticate user', error);
    if (error as TokenExpiredError) {
      res.status(401).json({ message: 'Expired token' });
      return;
    }

    res.status(500).json({ message: 'Failed to authenticate user' });
  }
};