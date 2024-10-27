import { logger } from '../middlewares/logger.middleware';
import { IPost, Post } from '../models/post.model';
import { User } from '../models/user.model';

const create = async (post: IPost): Promise<IPost> => {
    logger.info('post create', post);

    const postCreated = await Post.create({
        author: post.author,
        title: post.title,
        image: post.image,
        content: post.content,
    });

    logger.debug('post create OK');

    return postCreated;
};

const getAll = async (): Promise<{ rows: Post[]; count: number }> => {
    logger.info('get all posts');

    const allPosts = await Post.findAndCountAll({
        where: {
            isPublish: true
        }
    });

    logger.debug(`get ${allPosts.count} posts OK`);

    return allPosts;
};

const get = async (id: number): Promise<Post | null> => {
    logger.info('get post');

    const post = await Post.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['username'],
            },
        ],
    });

    logger.debug('get post OK');

    return post;
};

const getPosts = async (scale: number, selection: number): Promise<{ rows: Post[]; count: number }> => {
    logger.info('get posts list');

    const postList = await Post.findAndCountAll({
        limit: scale,
        offset: scale * (selection - 1),
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
        ],
        where: {
            isPublish: true
        }
    });

    logger.debug(`get ${scale} posts on ${postList.count}`);

    return postList;
};

const destroy = async (id: number) => {
    logger.info('delete post');

    const isDelete = await Post.destroy({ where: { id: id } });
    if (!isDelete) throw new Error('Error, post not exist for delete');

    logger.debug(`delete post ${id}`);
};

const update = async (id: number, data: Post) => {
    logger.info('update post');
    const post = await Post.update(data, { where: { id: id } });

    if (!post[0]) throw new Error('Post not exist');

    logger.debug(`update post ${id} OK!`);
};

export { create, getAll, get, getPosts, destroy, update };
