import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { Parameter } from '../models/parameter.model';

const create = async (parameter: Parameter): Promise<Parameter> => {
    logger.info('parameter create', parameter);

    const newParameter = await parameter.save();

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

    logger.debug('getParameter : parameters', { parameter: parameter });

    return parameter;
};

const getParametersByCode = async (code: string): Promise<Parameter[]> => {
    logger.info('getParametersByCode', { code: code });

    const parameters = await Parameter.findAll({
        where: {
            code: { [Op.like]: `%${code}%` },
            isActive: true,
        },
    });

    logger.debug('getParametersByCode : parameters', { parameters: parameters });

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

export { create, getAll, getParametersByCode, getParameter, destroy, update };
