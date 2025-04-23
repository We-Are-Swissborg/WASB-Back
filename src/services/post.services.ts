import { logger } from '../middlewares/logger.middleware';
import sequelize from '../models';
import { Post } from '../models/post.model';
import PostRepository from '../repository/post.repository';
import TranslationService from './translation.services';
import { EntityType } from '../enums/entityType.enum';
import { PostDto } from '../dto/post.dto';

const translationService = new TranslationService(logger);
const postRepository = new PostRepository(logger);

const createPost = async (post: Post): Promise<Post> => {
    logger.info('createPost : services', post);

    const transaction = await sequelize.transaction();
    try {
        const postCreated = await postRepository.create(post, transaction);
        logger.debug('create Post : postRepository.create', postCreated);

        await translationService.bulkCreate(EntityType.POST, postCreated.id, post.translations, transaction);
        logger.debug('create Post : translationRepository.bulkCreate');

        await transaction.commit();
        logger.debug('Post created', { postCreated });
        return postCreated;
    } catch (error) {
        await transaction.rollback();
        console.error('Erreur lors de la création du post avec traductions :', error);
        throw error;
    } finally {
        logger.info('createPost : end');
    }
};

const getPosts = async (): Promise<Post[]> => {
    logger.info('getPosts : services');

    const posts = await postRepository.getAll();

    logger.debug(`getPosts : ${posts.count} item(s)`);

    return posts.rows;
};

/**
 *
 * @param page
 * @param limit
 * @returns
 */
const getPostsPagination = async (
    language: string,
    page: number,
    limit: number,
): Promise<{ rows: PostDto[]; count: number }> => {
    logger.info('getPostsPagination : services', { language, page, limit });

    let posts = null;
    const skip = (page - 1) * limit;

    posts = await postRepository.getPostsPagination(language, skip, limit);

    logger.debug(`getPostsPagination : ${posts.count} item(s)`);

    return posts;
};

const getPost = async (id: number): Promise<Post | null> => {
    logger.info('getPost : services', { id: id });

    return await postRepository.get(id);
};

/**
 *
 * @param slug
 * @returns
 */
const getPostBySlug = async (language: string, slug: string): Promise<PostDto | null> => {
    logger.info('getPostBySlug : services', { language, slug });

    return await postRepository.getBySlug(language, slug);
};

/**
 *
 * @param slug
 * @returns
 */
const destroy = async (id: number): Promise<void> => {
    logger.info('destroy post : services', { id: id });

    return await postRepository.destroy(id);
};

/**
 * Update a post
 * @param {Post} category Update post
 * @returns {Promise<Post>} Update post
 */
const updatePost = async (id: number, updatedPost: Post): Promise<Post> => {
    logger.info('update post : services');

    if (id !== updatedPost.id) {
        throw new Error('The encoded data do not coincide with those supplied');
    }

    const transaction = await sequelize.transaction();
    logger.info('update Post : transaction create');

    try {
        const postUpdated = await postRepository.update(updatedPost, transaction);
        logger.info('update Post : postRepository.update', updatedPost);
        logger.warn('update Post : postRepository.updatedPost.translations', updatedPost.translations);

        await translationService.bulkUpdate(EntityType.POST, updatedPost.translations);
        logger.info('update PostCategory : translationRepository.bulkUpdate');

        await transaction.commit();
        return postUpdated;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Erreur lors de la mise à jour du post : ${error}`);
    } finally {
        logger.info('updatePost : end');
    }
};

export { createPost, getPosts, getPostsPagination, getPost, getPostBySlug, updatePost, destroy };
