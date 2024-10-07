import { logger } from '../middlewares/logger.middleware';
import { Parameter } from '../models/parameter.model';
import * as parameterRepository from '../repository/parameter.repository';

const createParameter = async (parameter: Parameter) => {
    logger.info('createParameter : services', parameter);

    if (!parameter.name?.trim()) {
        throw new Error('A name for the parameter is required');
    }

    if (!parameter.value?.trim()) {
        throw new Error('A value for the parameter is required');
    }

    parameterRepository.create(parameter);
};

const getParameters = async (query: string | null): Promise<Parameter[]> => {
    logger.info('getParameters : services', { query: query });

    let parameters = null;

    if (!!query) {
        parameters = await parameterRepository.getParametersByQuery(query);
    } else {
        parameters = await parameterRepository.getAll();
    }

    logger.debug(`getParameters : ${parameters.length} item(s)`);

    return parameters;
};

const getParameter = async (id: number): Promise<Parameter | null> => {
    logger.info('getParameter : services', { id: id });

    const parameter = await parameterRepository.getParameter(id);

    logger.debug(`getParameter : ${parameter}`);

    return parameter;
};

export { createParameter, getParameters, getParameter };
