import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import * as SessionServices from '../services/session.services';

const fileNameLogger = 'sessionController';

const getSession = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getSession ->`, req.params);

    try {
        const post = await SessionServices.getSessionBySlug(req.params.slug);
        if (!post) throw new Error('No post find');

        const postDTO = instanceToPlain(post, { groups: ['all'], excludeExtraneousValues: true });

        res.status(200).json(postDTO);
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
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
        logger.error(`Get posts list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { getSession, getSessions };
