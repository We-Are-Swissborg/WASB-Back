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
    logger.info(`Get Parameters`);

    try {
        const query = req.query.q as string;
        const parameters = await parameterServices.getParameters(query);
        const parametersDTO = instanceToPlain(parameters, { groups: ['admin'], excludeExtraneousValues: true });
        res.status(200).json(parametersDTO);
    } catch (e) {
        logger.error(`getParameters error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Retrieve parameter
 * @param req
 * @param res
 */
const getParameter = async (req: Request, res: Response) => {
    logger.info(`Get Parameter`);

    try {
        const id: number = Number(req.params.id);
        const parameter = await parameterServices.getParameter(id);

        if (parameter instanceof Parameter) {
            const parameterDTO = instanceToPlain(parameter, { groups: ['admin'], excludeExtraneousValues: true });
            res.status(200).json(parameterDTO);
        } else {
            res.status(404).json({ message: 'No records found' });
        }
    } catch (e) {
        logger.error(`getParameter error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Update parameter
 * @param req
 * @param res
 */
const updateParameter = async (req: Request, res: Response) => {
    logger.info(`Update parameter`);

    try {
        const id: number = Number(req.params.id);
        const parameter = plainToClass(Parameter, req.body as string, { groups: ['admin'] });

        if (parameter.id == id) {
            await parameterRepository.update(parameter);
            res.status(204).end();
        } else {
            res.status(400).json({ message: `An error in your parameter form` });
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
    logger.info(`Delete Parameter`, { id: req.params.id });

    try {
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
    logger.info(`Create Parameter`);

    try {
        const parameter = plainToClass(Parameter, req.body as string, { groups: ['admin'] });
        logger.debug(`parameter`, parameter);

        try {
            await parameterServices.createParameter(parameter);
            res.status(200);
        } catch (e: unknown) {
            if (e instanceof Error) res.status(400).json(e.message);
        }
    } catch (e: unknown) {
        logger.error(`createParameter error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getParameters, getParameter, updateParameter, deleteParameter, createParameter };
