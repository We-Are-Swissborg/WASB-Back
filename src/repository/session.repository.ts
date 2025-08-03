import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { Session, SessionStatus } from '../models/session.model';

const create = async (session: Session): Promise<Session> => {
    logger.info('session create', session);

    try {
        const sessionCreated = await session.save();
        logger.debug(`session create OK : ${sessionCreated.id}`, sessionCreated);
        return sessionCreated;
    } catch (e) {
        logger.error(`session create error : ${e}`);
        throw e;
    }
};

const getAll = async (): Promise<{ rows: Session[]; count: number }> => {
    logger.info('get all sessions');

    const allSessions = await Session.findAndCountAll({
        distinct: true, // avoid over-counting due to include
        // include: [PostCategory, User],
    });

    logger.debug(`get ${allSessions.count} sessions OK`);

    return allSessions;
};

/**
 *
 * @param skip
 * @param limit
 * @returns
 */
const getSessionsPagination = async (skip: number, limit: number): Promise<{ rows: Session[]; count: number }> => {
    logger.info('get sessions pagination');

    const sessions = await Session.findAndCountAll({
        where: {
            status: {
                [Op.ne]: SessionStatus.Draft,
            },
            // endDateTime: {
            //     [Op.gte]: new Date(),
            // },
        },
        limit: limit,
        offset: skip,
        distinct: true, // avoid over-counting due to include
        // include: [
        //     {
        //         model: User,
        //         attributes: ['username'],
        //     },
        //     {
        //         model: PostCategory,
        //         attributes: ['id', 'title'],
        //         through: { attributes: [] },
        //     },
        // ],
        order: [['startDateTime', 'DESC']],
    });

    logger.debug(`get ${sessions.count} sessions`);
    logger.debug(`get sessions :`, sessions);

    return sessions;
};

/**
 *
 * @param id
 * @returns
 */
const getById = async (id: number): Promise<Session | null> => {
    logger.info('get session by id');

    const session = await Session.findByPk(id);

    logger.debug('get session OK');

    return session;
};

/**
 *
 * @param slug
 * @returns
 */
const getBySlug = async (slug: string): Promise<Session | null> => {
    logger.info('get session by slug');

    const session = await Session.findOne({
        where: {
            slug: slug,
        },
        // include: [
        //     {
        //         model: User,
        //         attributes: ['username'],
        //     },
        //     {
        //         model: PostCategory,
        //         attributes: ['id', 'title'],
        //         through: { attributes: [] },
        //     },
        // ],
    });

    logger.debug('get session OK');

    return session;
};

const destroy = async (id: number): Promise<void> => {
    logger.info(`delete session ${id}`);

    const isDelete = await Session.destroy({ where: { id: id } });
    if (!isDelete) throw new Error('Error, session not exist for delete');

    logger.debug(`delete session ${id}`);
};

const update = async (session: Session): Promise<Session> => {
    logger.info(`update session ${session.id}`);

    session.isNewRecord = false;
    session = await session.save();

    logger.debug(`updated session ${session.id}!`);

    return session;
};

/**
 *
 * @param skip
 * @param limit
 * @param organizerId
 * @return sessions
 */
const getMySessionsPagination = async (skip: number, limit: number, organizerId: number): Promise<{ rows: Session[]; count: number }> => {
    logger.info('get my posts pagination');

    const sessions = await Session.findAndCountAll({
        where: {
            organizerById: {
                [Op.eq]: organizerId,
            },
        },
        limit: limit,
        offset: skip,
        distinct: true, // avoid over-counting due to include
        order: [['startDateTime', 'DESC']],
    });

    logger.debug(`get ${sessions.count} sessions`);
    logger.debug(`get my sessions :`, sessions);

    return sessions;
};

export {
    create,
    getAll,
    getSessionsPagination,
    getById,
    getBySlug,
    destroy,
    update,
    getMySessionsPagination
};
