import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from "class-transformer";
import * as PostRepository from "../../repository/post.repository";
import * as PostServices from "../../services/post.services";
import { logger } from "../../middlewares/logger.middleware";
import { Post } from '../../models/post.model';
import { PostCategory } from '../../models/postcategory.model';

/**
 * Retrieve all posts
 * @param req
 * @param res
 */
const getAllPosts = async (req: Request, res: Response) => {
    logger.info(`Get All Posts`);

    try {
        const allPosts = await PostServices.getPosts();
        const allPostsDTO = instanceToPlain(allPosts, { groups: ['admin'], excludeExtraneousValues: true });

        // Replace object with just a Buffer array.
        // allPostsDTO.forEach((post: Post, id: number) => (allPostsDTO[id].image = Array.from(post.image)));

        res.status(200).json(allPostsDTO);
    } catch (e: unknown) {
        logger.error(`Get all posts error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Retrieve post
 * @param req
 * @param res
 */
const getPost = async (req: Request, res: Response) => {
    logger.info(`Get Post`);

    try {
        const id: number = Number(req.params.id);
        const post = await PostServices.getPost(id);
        const postDTO = instanceToPlain(post, { groups: ['post'], excludeExtraneousValues: true });

        // Replace object with just a Buffer array.
        // allPostsDTO.forEach((post: Post, id: number) => (allPostsDTO[id].image = Array.from(post.image)));

        res.status(200).json(postDTO);
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Create Post
 * @param req 
 * @param res 
 */
const createPost = async (req: Request, res: Response) => {
    logger.info(`Create Post`);

    try {
        const post = plainToClass(Post, req.body as string, { groups: ['post'] });
        post.author = 13; // Todo : to delete
        const newPost = await PostServices.createPost(post);
        newPost.setCategories(post.categories.map(category => category.id));

        res.status(201).json(newPost);
    } catch (e: unknown) {
        logger.error(`Create post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Update Post
 * @param req 
 * @param res 
 */
const updatePost = async (req: Request, res: Response) => {
    logger.info(`Update Post`);

    try {
        const id: number = Number(req.params.id);
        const updatePost = plainToClass(Post, req.body as string, { groups: ['post'] });
        const postRetrieve = await Post.findByPk(id);
        if (!postRetrieve) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        postRetrieve.set(req.body);
        await postRetrieve.setCategories(updatePost.categories.map(category => category.id));

        const updatedPost = await PostServices.updatePost(id, postRetrieve);

        res.status(200).json(updatedPost);
    } catch (e: unknown) {
        logger.error(`Update post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Delete Post
 * @param req 
 * @param res 
 */
const deletePost = async (req: Request, res: Response) => {
    logger.info(`Delete Post`);

    try {
        const id: number = Number(req.params.id);
        await PostRepository.destroy(id);

        res.status(200).end();
    } catch (e: unknown) {
        logger.error(`Delete post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { getPost, getAllPosts, createPost, updatePost, deletePost };