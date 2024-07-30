import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../services/jwt.services';
import { TokenExpiredError } from 'jsonwebtoken';
import { logger } from './logger.middleware';
import { TokenPayload } from '../types/TokenPayload';

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 */
export const authorize = (allowedAccessTypes?: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwt = req.headers.authorization;
        logger.debug('token jwt', {jwt});

        if (!jwt) {
            logger.warn('Invalid token');
            return res.status(401).json({ message: 'Invalid token' });
        }

        // remove Bearer if using Bearer Authorization mechanism
        if (jwt.toLowerCase().startsWith('bearer')) {
            jwt = jwt.slice('bearer'.length).trim();
        }


        // verify token hasn't expired yet
        const decodedToken: TokenPayload = validateToken(jwt) as TokenPayload;
        logger.debug('token jwt decodedToken', decodedToken.roles);

        if (allowedAccessTypes === undefined) return next();
        // check access
        const hasAccessToEndpoint = allowedAccessTypes?.some((at) => decodedToken.roles?.some((uat) => uat === at));

        if (!hasAccessToEndpoint) {
            return res.status(401).json({ message: 'No enough privileges to access endpoint' });
        }

        return next();
    } catch (error) {
        if (error as TokenExpiredError) {
            logger.error('Expired token', error);
            return res.status(401).json({ message: 'Expired token' });
        }

        logger.error('Failed to authorize user', error);
        return res.status(500).json({ message: 'Failed to authorize user' });
    }
};
