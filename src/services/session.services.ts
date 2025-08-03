import { Session } from '../models/session.model';
import { logger } from '../middlewares/logger.middleware';
import * as SessionRepository from '../repository/session.repository';
import domClean from './domPurify';

const createSession = async (session: Session): Promise<Session> => {
    logger.info('createSession : services', session);
    session.description = domClean(session.description);

    if (!session.title?.trim()) {
        throw new Error('A title for the session is required');
    }

    if (!session.description?.trim()) {
        throw new Error('A description for the session is required');
    }

    const sessionCreated = await SessionRepository.create(session);

    logger.debug('Session created', { sessionCreated: sessionCreated });

    return sessionCreated;
};

const getSessions = async (): Promise<{ rows: Session[]; count: number }> => {
    logger.info('getSessions : services');

    let sessions = null;

    // if (!!query) {
    //     sessions = await SessionRepository.getParametersByCode(code);
    // } else {
    sessions = await SessionRepository.getAll();

    logger.debug(`getSessions : ${sessions.count} item(s)`);

    return sessions;
};

/**
 *
 * @param page
 * @param limit
 * @returns
 */
const getSessionsPagination = async (page: number, limit: number): Promise<{ rows: Session[]; count: number }> => {
    logger.info('getSessionsPagination : services', { page: page, limit: limit });

    let sessions = null;
    const skip = (page - 1) * limit;

    sessions = await SessionRepository.getSessionsPagination(skip, limit);

    logger.debug(`getSessionsPagination : ${sessions.count} item(s)`);

    return sessions;
};

const getSessionById = async (id: number): Promise<Session | null> => {
    logger.info('getSessionById : services');

    const session = await SessionRepository.getById(id);

    logger.debug(`getSessionById`);

    return session;
};

const getSessionBySlug = async (slug: string): Promise<Session | null> => {
    logger.info('getSessionBySlug : services');

    const session = await SessionRepository.getBySlug(slug);

    logger.debug(`getSessionBySlug`);

    return session;
};

/**
 * Update Membership
 * @param userId user identifiant
 * @returns
 */
const updateSession = async (session: Session): Promise<Session> => {
    logger.info('updateSession : services');

    return await SessionRepository.update(session);
};

/**
 *
 * @param page
 * @param limit
 * @param userId
 * @returns
 */
const getMySessionsPagination = async (page: number, limit: number, userId: number): Promise<{ rows: Session[]; count: number }> => {
    logger.info('getMySessionsPagination : services', { page, limit, userId });

    let sessions = null;
    const skip = (page - 1) * limit;

    sessions = await SessionRepository.getMySessionsPagination(skip, limit, userId);

    logger.debug(`getMySessionsPagination : ${sessions.count} item(s)`);

    return sessions;
};

export {
    createSession,
    getSessions,
    getSessionsPagination,
    getSessionBySlug,
    getSessionById,
    updateSession,
    getMySessionsPagination
};
