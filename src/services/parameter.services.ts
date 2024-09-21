import { logger } from '../middlewares/logger.middleware';
import { Parameter } from '../models/parameter.model';
import * as parameterRepository from '../repository/parameter.repository';

const createParameter = async (parameter: Parameter) => {
    logger.info('createParameter : services', parameter);

    if (!parameter.name || !parameter.name.trim()) {
        throw new Error('A name for the parameter is required');
    }

    if (!parameter.value || !parameter.value.trim()) {
        throw new Error('A value for the parameter is required');
    }

    parameterRepository.create(parameter);
};

export { createParameter };
