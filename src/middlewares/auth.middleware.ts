import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../services/jwt.services';
import { TokenExpiredError } from 'jsonwebtoken';
import { logger } from './logger.middleware';
import { TokenPayload } from '../types/TokenPayload';

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 * @param allowSelfModification Checks whether the user can make their own changes
 */
export const authorize =
    (allowedAccessTypes?: string[], allowSelfModification: boolean = false) => {
        return (req: Request, res: Response, next: NextFunction): void => {
        try {
            let jwt = req.headers.authorization;
            logger.debug('token jwt', { jwt });

            if (!jwt) {
                logger.warn('Invalid token');
                res.status(401).json({ message: 'Invalid token' });
                return;
            }

            // remove Bearer if using Bearer Authorization mechanism
            if (jwt?.toLowerCase().startsWith('bearer')) {
                jwt = jwt.slice('bearer'.length).trim();
            }

            // verify token hasn't expired yet
            const decodedToken: TokenPayload = validateToken(jwt!) as TokenPayload;
            logger.debug('token jwt decodedToken', decodedToken.roles);

            // Specific so that a user can modify their profile without having admin rights
            if (allowSelfModification) {
                const userIdFromToken = decodedToken.userId;
                const userIdFromRequest = req.params.id || req.body.id; // Adjust this to match your route parameter or body structure

                if (userIdFromToken == userIdFromRequest) {
                    next(); // Allow self-modification
                    return;
                }
            }

            if (allowedAccessTypes === undefined) {
                next();
                return;
            }
            // check access
            const hasAccessToEndpoint = allowedAccessTypes?.some((at) => decodedToken.roles?.some((uat) => uat === at));

            if (!hasAccessToEndpoint) {
                res.status(401).json({ message: 'No enough privileges to access endpoint' });
                return;
            }

            next();
        } catch (error) {
            if (error as TokenExpiredError) {
                logger.error('Expired token', error);
                res.status(401).json({ message: 'Expired token' });
                return;
            }

            logger.error('Failed to authorize user', error);
            res.status(500).json({ message: 'Failed to authorize user' });
            return;
        }
    };
}
