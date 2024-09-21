import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { adminLogger as logger } from '../../middlewares/logger.middleware';
import { Parameter } from '../../models/parameter.model';
import * as parameterRepository from '../../repository/parameter.repository';
import * as parameterServices from '../../services/parameter.services';

/**
 * Retrieve all parameters
 * @param req
 * @param res
 */
const getParameters = async (req: Request, res: Response) => {
    logger.debug(`getParameters`);

    try {
        const query = req.query.q as string;
        let parameters = null;

        if (!!query) {
            parameters = await parameterRepository.getParametersByQuery(query);
        } else {
            parameters = await parameterRepository.getAll();
        }

        const parametersDTO = instanceToPlain(parameters, { groups: ['admin'], excludeExtraneousValues: true });
        res.status(200).json(parametersDTO);
    } catch (e) {
        logger.error(`getParameters error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Update parameter
 * @param req
 * @param res
 */
const updateParameter = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        logger.debug(`Update parameter`, req.body);

        const parameter = plainToClass(Parameter, req.body as string, { groups: ['admin'] });

        if (parameter.id == id) {
            await parameterRepository.update(parameter);
            res.status(204).end();
        } else {
            res.status(400).json(`An error in your parameter form`);
        }
    } catch (e) {
        logger.error(`updateParameter error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Delete parameter
 * @param req
 * @param res
 */
const deleteParameter = async (req: Request, res: Response) => {
    try {
        logger.info(`Delete Parameter`, req.params.id);
        const id: number = Number(req.params.id);
        parameterRepository.destroy(id);
        res.status(200).end();
    } catch (e) {
        logger.error(`deleteParameter error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Create parameter
 * @param req
 * @param res
 */
const createParameter = async (req: Request, res: Response) => {
    try {
        logger.info(`Create Parameter`);
        const parameter = plainToClass(Parameter, req.body as string, { groups: ['admin'] });
        logger.debug(`parameter`, parameter);

        try {
            await parameterServices.createParameter(parameter);
            res.status(200).end();
        } catch (e: unknown) {
            if (e instanceof Error) res.status(400).json(e.message);
        }
    } catch (e: unknown) {
        logger.error(`createParameter error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getParameters, updateParameter, deleteParameter, createParameter };
