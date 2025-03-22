import { Transaction } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import sequelize from '../models';
import { Post } from '../models/post.model';
import * as postRepository from '../repository/post.repository';
import * as translationRepository from '../repository/translation.repository';
import domClean from './domPurify';
import { TranslationService } from './translation.services';

const translationService = new TranslationService(logger);

const createPost = async (post: Post): Promise<Post> => {
    logger.info('createPost : services', post);

    post.translations.forEach((t) => {
        t.content = domClean(t.content!);
        if (!t.title?.trim()) { throw new Error('A title for the post is required'); }
        if (!t.content?.trim()) { throw new Error('A title for the post is required'); }
    });

    const transaction = await sequelize.transaction();
    try {
        const postCreated = await postRepository.create(post, transaction);

        // const translationsData = post.translations.map((t) => ({
        //     entityType: "Post",
        //     entityId: post.id,
        //     languageCode: t.languageCode,
        //     title: t.title,
        //     content: t.content,
        //     slug: t.slug,
        // }));

        // await translationService.

        // await translationRepository.bulkCreate(translationsData, transaction);

        await transaction.commit();
        logger.debug('Post created', { postCreated });
        return postCreated;
    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de la création du post avec traductions :", error);
        throw error;
    }
    finally
    {
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
const getPostsPagination = async (language: string, page: number, limit: number): Promise<{ rows: Post[]; count: number }> => {
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
const getPostBySlug = async (slug: string): Promise<Post | null> => {
    logger.info('getPostBySlug : services', { slug: slug });

    return await postRepository.getBySlug(slug);
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

    updatedPost.translations.forEach((t) => {
        t.content = domClean(t.content!);
        if (!t.title?.trim()) { throw new Error('A title for the post is required'); }
        if (!t.content?.trim()) { throw new Error('A title for the post is required'); }
    });

    const transaction: Transaction = await sequelize.transaction();
    try 
    {
        updatedPost = await postRepository.update(updatedPost, transaction);
        return updatedPost;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Erreur lors de la mise à jour du post : ${error}`);
    }
    finally
    {
        logger.info('updatePost : end');
    }
};

export { createPost, getPosts, getPostsPagination, getPost, getPostBySlug, updatePost };
