import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { adminLogger as logger } from '../../middlewares/logger.middleware';
import * as SessionServices from '../../services/session.services';
import * as SessionRepository from '../../repository/session.repository';
import { Session } from '../../models/session.model';

const fileNameLogger = 'sessionAdminController';

/**
 * Retrieve an session
 * @param req
 * @param res
 */
const getSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Get Session`);

    try {
        const id: number = Number(req.params.id);
        const session = await SessionServices.getSessionById(id);
        const sessionDTO = instanceToPlain(session, { groups: ['admin'], excludeExtraneousValues: true });
        res.status(200).json(sessionDTO);
    } catch (e) {
        logger.error(`getSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Retrieve sessions
 * @param req
 * @param res
 */
const getSessions = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : getSessions ->`, req.query);

    try {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '10'), 10);

        const sessions = await SessionServices.getSessionsPagination(page, limit);

        const sessionListDTO = instanceToPlain(sessions.rows, { groups: ['admin'], excludeExtraneousValues: true });

        res.status(200).json(sessionListDTO);
    } catch (e: unknown) {
        logger.error(`Get getSessions list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Create new session
 * @param req
 * @param res
 */
const createSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Create Session`);

    try {
        const session = plainToClass(Session, req.body as string, { groups: ['admin'] });
        logger.debug(`session`, session);

        try {
            const sessionCreated = await SessionServices.createSession(session);
            const sessionDTO = instanceToPlain(sessionCreated, {
                groups: ['admin'],
                excludeExtraneousValues: true,
            });
            res.status(201).json(sessionDTO);
        } catch (e: unknown) {
            if (e instanceof Error) res.status(400).json(e.message);
        }
    } catch (e) {
        logger.error(`createSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Update an session
 * @param req
 * @param res
 */
const updateSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Update Session`);

    try {
        const id: number = Number(req.params.id);
        const session = plainToClass(Session, req.body as string, { groups: ['admin'] });

        if (session.id == id) {
            const contributionUpdated = await SessionServices.updateSession(session);
            const sessionDTO = instanceToPlain(contributionUpdated, { groups: ['admin'], excludeExtraneousValues: true });
            res.status(200).json(sessionDTO);
        } else {
            res.status(400).json({ message: `An error in your session` });
        }        
    } catch (e) {
        logger.error(`updateSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Delete an session
 * @param req
 * @param res
 */
const deleteSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Delete Session`);

    try {
        const id: number = Number(req.params.id);
        SessionRepository.destroy(id);
        res.status(200).end();
    } catch (e) {
        logger.error(`deleteSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getSession, getSessions, createSession, updateSession, deleteSession };