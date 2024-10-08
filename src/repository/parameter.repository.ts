import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { IParameter, Parameter } from '../models/parameter.model';

const create = async (parameter: IParameter): Promise<Parameter> => {
    logger.info('parameter create', parameter);

    const newParameter = await Parameter.create({
        name: parameter.name,
        value: parameter.value,
    });

    logger.debug('parameter created');

    return newParameter;
};

const getAll = async (): Promise<Parameter[]> => {
    logger.info('get all parameters');
    return await Parameter.findAll();
};

const getParameter = async (id: number): Promise<Parameter | null> => {
    logger.info('getParameter', { id: id });

    const parameter = await Parameter.findByPk(id);

    logger.debug('getParametersByQuery : parameters', { parameter: parameter });

    return parameter;
};

const getParametersByQuery = async (query: string): Promise<Parameter[]> => {
    logger.info('getParametersByQuery', { query: query });

    const parameters = await Parameter.findAll({
        where: {
            name: { [Op.like]: `%${query}%` },
        },
    });

    logger.debug('getParametersByQuery : parameters', { parameters: parameters });

    return parameters;
};

const destroy = async (id: number): Promise<void> => {
    logger.info(`delete parameter ${id}`);

    const isDelete = await Parameter.destroy({ where: { id: id } });
    if (!isDelete) throw new Error('Error, parameter not exist for delete');

    logger.debug(`delete parameter ${id}`);
};

const update = async (parameter: Parameter): Promise<void> => {
    logger.info(`update parameter ${parameter.id}`);

    parameter.isNewRecord = false;
    await parameter.save();

    logger.debug(`updated parameter ${parameter.id}!`);
};

export { create, getAll, getParametersByQuery, getParameter, destroy, update };
