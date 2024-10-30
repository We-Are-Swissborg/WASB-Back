import { logger } from '../middlewares/logger.middleware';
import { Post } from '../models/post.model';
import { PostCategory } from '../models/postcategory.model';
import { User } from '../models/user.model';

const create = async (post: Post): Promise<Post> => {
    logger.info('post create', post);

    const postCreated = await post.save();

    logger.debug(`post create OK : ${postCreated.id}`, postCreated);

    return postCreated;
};

const getAll = async (): Promise<{ rows: Post[]; count: number }> => {
    logger.info('get all posts');

    const allPosts = await Post.findAndCountAll({
        include: [PostCategory, User]
    });

    logger.debug(`get ${allPosts.count} posts OK`);

    return allPosts;
};

const getOnlyPublished = async (): Promise<{ rows: Post[]; count: number }> => {
    logger.info('get all posts');

    const allPosts = await Post.findAndCountAll({
        where: {
            isPublish: true
        },
        include: [PostCategory, User]
    });

    logger.debug(`get ${allPosts.count} posts OK`);

    return allPosts;
};

const get = async (id: number): Promise<Post | null> => {
    logger.info('get post');

    // const post = await Post.findByPk(id, {
    //     include: [
    //         {
    //             model: User,
    //             attributes: ['username'],
    //         },
    //     ],
    // });
    
    const post = await Post.findByPk(id);

    logger.debug('get post OK', post);

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

/**
 * Update a Post
 * @param {Post} post Update post
 * @returns {Promise<Post>} Update post
 */
const update = async (post: Post): Promise<Post> => {
    logger.info('post update', post);

    post = await post.save();

    logger.debug('post updated');

    return post;
};

export { create, getAll, getOnlyPublished, get, getPosts, destroy, update };
