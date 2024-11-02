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
        distinct: true, // avoid over-counting due to include
        include: [PostCategory, User]
    });

    logger.debug(`get ${allPosts.count} posts OK`);

    return allPosts;
};

/**
 * 
 * @param skip 
 * @param limit 
 * @returns 
 */
const getPostsPagination = async (skip: number, limit: number): Promise<{ rows: Post[]; count: number }> => {
    logger.info('get posts pagination');

    const posts  = await Post.findAndCountAll({
        where: {
            isPublish: true
        },
        limit: limit,
        offset: skip,
        distinct: true, // avoid over-counting due to include
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: PostCategory,
                attributes: ['id', 'title'],
                through: { attributes: [] }
            }
        ],
        order: [['publishedAt', 'DESC']],
    });

    logger.debug(`get ${posts.count} posts`);

    return posts;
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

    const post = await Post.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: PostCategory,
                attributes: ['id', 'title'],
                through: { attributes: [] }
            }
        ],
    });

    logger.debug('get post OK');

    return post;
};

/**
 * 
 * @param slug 
 * @returns 
 */
const getBySlug = async (slug: string): Promise<Post | null> => {
    logger.info('get post by slug');

    const post = await Post.findOne({
        where: {
            isPublish: true,
            slug: slug
        },
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: PostCategory,
                attributes: ['id', 'title'],
                through: { attributes: [] }
            }
        ],
    });

    logger.debug('get post OK');

    return post;
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

export { create, getAll, getOnlyPublished, get, getBySlug, getPostsPagination, destroy, update };
