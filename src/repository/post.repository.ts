import { Op, Transaction } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { IPost, Post } from '../models/post.model';
import { PostCategory } from '../models/postcategory.model';
import { User } from '../models/user.model';
import { Translation } from '../models/translation.model';

const create = async (post: Partial<IPost>, transaction?: Transaction): Promise<Post> => {
    logger.info('post create', post);

    const postCreated = await Post.create(post, {transaction});

    logger.debug(`post create OK : ${postCreated.id}`, postCreated);

    return postCreated;
};

const getAll = async (): Promise<{ rows: Post[]; count: number }> => {
    logger.info('get all posts');

    const allPosts = await Post.findAndCountAll({
        distinct: true, // avoid over-counting due to include
        include: [PostCategory, User],
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
const getPostsPagination = async (language: string, skip: number, limit: number): Promise<{ rows: Post[]; count: number }> => {
    logger.info('get posts pagination');

    const posts = await Post.findAndCountAll({
        where: {
            isPublish: true,
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
                where: {
                    languageCode: language,
                    entityType: "PostCategory",
                    entityId: { [Op.col]: "PostCategory.id" },
                },
                required: true,
                through: { attributes: [] },
            },
            {
                model: Translation,
                attributes: ['title', 'content', 'slug'],
                where: {
                    languageCode: language,
                    entityType: "Post",
                    entityId: { [Op.col]: "Post.id" },
                },
                required: true,
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
            isPublish: true,
        },
        include: [PostCategory, User],
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
                through: { attributes: [] },
            },
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
            slug: slug,
        },
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: PostCategory,
                attributes: ['id', 'title'],
                through: { attributes: [] },
            },
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
const update = async (post: Post, transaction?: Transaction): Promise<Post> => {
    logger.info('post update', post);

    await Post.update(post, {where: { id: post.id }, transaction});

    logger.debug('post updated');

    return post;
};

export { create, getAll, getOnlyPublished, get, getBySlug, getPostsPagination, destroy, update };
