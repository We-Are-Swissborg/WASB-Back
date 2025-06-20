import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import * as SessionServices from '../services/session.services';
import * as SessionRepository from '../repository/session.repository';
import { Session } from '../models/session.model';

const fileNameLogger = 'sessionController';

const getSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getSession ->`, req.params);

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
            if (e instanceof Error) res.status(400).json(e.message);
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
        SessionRepository.destroy(id);
        res.status(200).end();
    } catch (e) {
        logger.error(`deleteSession error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getSession, getSessions, createSession, updateSession, deleteSession };
