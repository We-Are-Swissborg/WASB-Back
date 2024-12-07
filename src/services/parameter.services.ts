import { logger } from '../middlewares/logger.middleware';
import { Parameter } from '../models/parameter.model';
import * as parameterRepository from '../repository/parameter.repository';

const createParameter = async (parameter: Parameter): Promise<Parameter> => {
    logger.info('createParameter : services', parameter);

    if (!parameter.name?.trim()) {
        throw new Error('A Name for the parameter is required');
    }

    if (!parameter.value?.trim()) {
        throw new Error('A Value for the parameter is required');
    }

    if (!parameter.code?.trim()) {
        throw new Error('A Code for the parameter is required');
    }

    return await parameterRepository.create(parameter);
};

const getParameters = async (code: string | null): Promise<Parameter[]> => {
    logger.info('getParameters : services', { code: code });

    let parameters = null;

    if (!!code) {
        parameters = await parameterRepository.getParametersByCode(code);
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
