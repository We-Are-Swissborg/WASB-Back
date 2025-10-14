import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import * as SessionServices from '../services/session.services';
import { Session } from '../models/session.model';
import { getUserFromContext } from '../middlewares/auth.middleware';
import { TokenPayload } from '../types/TokenPayload';

const fileNameLogger = 'sessionController';

const getSessionBySlug = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getSessionBySlug ->`, req.params);

    try {
        const session = await SessionServices.getSessionBySlug(req.params.slug);
        if (!session) throw new Error('No session find');

        const sessionDTO = instanceToPlain(session, { groups: ['all'], excludeExtraneousValues: true });

        res.status(200).json(sessionDTO);
    } catch (e: unknown) {
        logger.error(`Get session error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getSessions = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getSessions ->`, req.query);

    try {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '10'), 10);

        const sessions = await SessionServices.getSessionsPagination(page, limit);

        const sessionListDTO = instanceToPlain(sessions.rows, { groups: ['all'], excludeExtraneousValues: true });

        const totalPages = Math.ceil(sessions.count / limit);

        res.status(200).json({
            sessions: sessionListDTO,
            totalPages: totalPages,
            totalSessions: sessions.count,
            currentPage: page,
        });
    } catch (e: unknown) {
        logger.error(`Get sessions list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const createSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Create Session`);
    const userContext: TokenPayload = getUserFromContext()!;

    req.body.createdById = userContext.userId;
    req.body.updatedById = userContext.userId;

    try {
        const session = plainToClass(Session, req.body as string, { groups: ['organizer'] });
        logger.debug(`session`, session);

        try {
            const sessionCreated = await SessionServices.createSession(session);
            const sessionDTO = instanceToPlain(sessionCreated, {
                groups: ['organizer'],
                excludeExtraneousValues: true,
            });
            res.status(201).json(sessionDTO);
        } catch (e: unknown) {
            if (e instanceof Error) res.status(400).json({ message: e.message });
        }
    } catch (e) {
        logger.error(`createSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

const updateSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Update Session`);

    try {
        const id: number = Number(req.params.id);
        const session = plainToClass(Session, req.body as string, { groups: ['organizer'] });

        if (session.id == id) {
            const contributionUpdated = await SessionServices.updateSession(session);
            const sessionDTO = instanceToPlain(contributionUpdated, {
                groups: ['organizer'],
                excludeExtraneousValues: true,
            });
            res.status(200).json(sessionDTO);
        } else {
            res.status(400).json({ message: `An error in your session` });
        }
    } catch (e) {
        logger.error(`updateSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

const deleteSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Delete Session`);

    try {
        const id: number = Number(req.params.id);
        await SessionServices.destroySession(id);
        res.status(200).end();
    } catch (e) {
        logger.error(`deleteSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

const getMySessions = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getMySessions ->`, req.query);

    try {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '10'), 10);
        const userId = Number(req.query.userId);
        const userContext: TokenPayload = getUserFromContext()!;

        if (userId && userId !== userContext.userId) throw new Error('Error user id is not valid');

        const sessions = await SessionServices.getMySessionsPagination(page, limit, userId);

        const sessionListDTO = instanceToPlain(sessions.rows, { groups: ['organizer'], excludeExtraneousValues: true });

        const totalPages = Math.ceil(sessions.count / limit);

        res.status(200).json({
            sessions: sessionListDTO,
            totalPages: totalPages,
            totalSessions: sessions.count,
            currentPage: page,
        });
    } catch (e: unknown) {
        logger.error(`Get my sessions list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const deleteSessions = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: deleteSessions`);

    try {
        const listId = req.body.listId;

        if (!listId.length) throw new Error('The sessions list to be deleted is empty.');

        listId.forEach(async (id: number) => {
            await SessionServices.destroySession(id);
        })

        res.status(200).end();
    } catch (e: unknown) {
        logger.error('Delete sessions list error', e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Retrieve an session by id
 * @param req
 * @param res
 */
const getSessionById = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger} : Get Session by ID`);

    try {
        const id: number = Number(req.params.id);
        const session = await SessionServices.getSessionById(id);
        const sessionDTO = instanceToPlain(session, { groups: ['organizer'], excludeExtraneousValues: true });
        res.status(200).json(sessionDTO);
    } catch (e) {
        logger.error(`getSessionById error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

export {
    getSessionBySlug,
    getSessions,
    createSession,
    updateSession,
    deleteSession,
    getMySessions,
    deleteSessions,
    getSessionById
};
