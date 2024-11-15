import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { adminLogger as logger } from '../middlewares/logger.middleware';
import * as parameterServices from '../services/parameter.services';

/**
 * Retrieve all parameters
 * @param req
 * @param res
 */
const getParameters = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const parameters = await parameterServices.getParameters(query);
        const parametersDTO = instanceToPlain(parameters, { groups: ['user'], excludeExtraneousValues: true });
        res.status(200).json(parametersDTO);
    } catch (e) {
        logger.error(`getParameters error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getParameters };
