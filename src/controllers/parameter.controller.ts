import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import * as parameterServices from '../services/parameter.services';

const fileNameLogger = 'parameterController';

/**
 * Retrieve all parameters
 * @param req
 * @param res
 */
const getParameters = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: Get Parameters`);

    try {
        const code = req.params.code;
        const parameters = await parameterServices.getParameters(code);
        const parametersDTO = instanceToPlain(parameters, { groups: ['all'], excludeExtraneousValues: true });
        logger.info(`${parametersDTO}: Get Parameters`, parametersDTO);
        
        res.status(200).json(parametersDTO);
    } catch (e) {
        logger.error(`getParameters error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getParameters };
