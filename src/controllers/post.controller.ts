import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import * as PostServices from '../services/post.services';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Post } from '../models/post.model';
import { TokenPayload } from '../types/TokenPayload';
import { getUserFromContext } from '../middlewares/auth.middleware';
import { getFileToBase64 } from '../services/file.servies';
import { OUTPUT_DIR } from '../middlewares/upload.middleware';

const getPostBySlug = async (req: Request, res: Response) => {
    logger.info(`PostController: getPostBySlug ->`, req.params);

    try {
        const postDTO = await PostServices.getPostBySlug(req.params.slug);
        if (!postDTO) throw new Error('No post find');

        res.status(200).json(postDTO);
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getPosts = async (req: Request, res: Response) => {
    logger.info(`PostController: getPosts ->`, req.query);

    try {
        const language = String(req.params.lang || 'fr');
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '10'), 10);

        const postListDTO = await PostServices.getPostsPagination(language, page, limit);

        const totalPages = Math.ceil(postListDTO.count / limit);

        res.status(200).json({
            posts: postListDTO.rows,
            totalPages: totalPages,
            totalPosts: postListDTO.count,
            currentPage: page,
        });
    } catch (e: unknown) {
        logger.error(`Get posts list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Create Post
 * @param req
 * @param res
 */
const createPost = async (req: Request, res: Response) => {
    logger.info(`PostController : Create Post`);

    try {
        const post = plainToClass(Post, req.body as string, { groups: ['author'] });
        const newPost = await PostServices.createPost(post);
        await newPost.setCategories(post.categories.map((category) => category.id));

        res.status(201).json(newPost);
    } catch (e: unknown) {
        logger.error(`Create post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getMyPosts = async (req: Request, res: Response) => {
    logger.info('PostController: getMyPosts ->', req.query);
try {
        const language = String(req.params.lang || 'fr');
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '10'), 10);
        const userId = Number(req.query.userId);
        const userContext: TokenPayload = getUserFromContext()!;

        if (userId && userId !== userContext.userId) throw new Error('Error user id is not valid');

        const postListDTO = await PostServices.getMyPostsPagination(language, page, limit, userId);

        const totalPages = Math.ceil(postListDTO.count / limit);

        res.status(200).json({
            posts: postListDTO.rows,
            totalPages: totalPages,
            totalPosts: postListDTO.count,
            currentPage: page,
        });
    } catch (e: unknown) {
        logger.error('Get my posts list error', e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const deletePosts = async (req: Request, res: Response) => {
    logger.info('PostController: deletePosts');

    try {
        const listId = req.body.listId;

        if (!listId.length) throw new Error('The posts list to be deleted is empty.');

        listId.forEach(async (id: number) => {
            await PostServices.destroyPost(id);
        })

        res.status(200).end();
    } catch (e: unknown) {
        logger.error('Delete posts list error', e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const uploadImage = async (req: Request, res: Response) => {
    logger.info(`PostController : Upload Image Post`);

    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const filePath = `/${OUTPUT_DIR}/${req.file.filename}`;
        const base64String = getFileToBase64(filePath, req.file.mimetype);

        res.status(201).json({ base64: base64String, filePath });
    } catch (error) {
        console.error('Error uploading post image:', error);
        res.status(500).json({ message: 'Error uploading image' });
    }
};

/**
 * Retrieve post by id
 * @param req
 * @param res
 */
const getPostById = async (req: Request, res: Response) => {
    logger.info(`PostController : Get Post by ID`);

    try {
        const id: number = Number(req.params.id);
        const post = await PostServices.getPostById(id);
        const postDTO = instanceToPlain(post, { groups: ['author'], excludeExtraneousValues: true });
        
        res.status(200).json(postDTO);
    } catch (e: unknown) {
        logger.error(`Get post by ID error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Update Post
 * @param req
 * @param res
 */
const updatePost = async (req: Request, res: Response) => {
    logger.info(`PostController : Update Post`);

    try {
        const id: number = Number(req.params.id);
        const updatePost = plainToClass(Post, req.body as string, { groups: ['author'] });
        const postRetrieve = await Post.findByPk(id);
        if (!postRetrieve) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        Object.assign(postRetrieve, updatePost);
        await postRetrieve.setCategories(updatePost.categories.map((category) => category.id));

        const updatedPost = await PostServices.updatePost(id, postRetrieve);

        res.status(200).json(updatedPost);
    } catch (e: unknown) {
        logger.error(`Update post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

// /**
//  * Delete Post
//  * @param req
//  * @param res
//  */
// const deletePost = async (req: Request, res: Response) => {
//     logger.info(`Delete Post`);

//     try {
//         const id: number = Number(req.params.id);
//         await PostServices.destroy(id);

//         res.status(200).end();
//     } catch (e: unknown) {
//         logger.error(`Delete post error`, e);
//         if (e instanceof Error) res.status(400).json({ message: e.message });
//     }
// };

export {
    getPostBySlug,
    getPosts,
    createPost,
    getMyPosts,
    deletePosts,
    uploadImage,
    updatePost,
    getPostById
};
