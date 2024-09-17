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

    const allPosts = await Parameter.findAll();

    logger.debug('get all parameters');

    return allPosts;
};

const destroy = async (id: number) => {
    logger.info('delete post');

    const isDelete = await Parameter.destroy({ where: { id: id } });
    if (!isDelete) throw new Error('Error, post not exist for delete');

    logger.debug(`delete post ${id}`);
};

const update = async (id: number) => {
    logger.info('update post');


    logger.debug(`update post ${id} OK!`);
};

export { create, getAll, destroy, update };
