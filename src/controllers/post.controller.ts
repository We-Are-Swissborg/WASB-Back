import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import domClean from '../services/domPurify';
import { destroy, getOnlyPublished } from '../repository/post.repository';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Post } from '../models/post.model';
import imageConvert from '../services/imageConvert';
import * as PostServices from '../services/post.services';

const preview = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const file = req.file;
        const clean = body.contentPost && domClean(body.contentPost);
        const sizeImage = {
            x: Number(process.env.SIZE_X_IMAGE_POST),
            y: Number(process.env.SIZE_Y_IMAGE_POST),
        };
        const convertToWebp = file && Array.from(await imageConvert(file, { x: sizeImage.x, y: sizeImage.y }));

        res.status(200).json({ clean, convertToWebp });
    } catch (e) {
        logger.error(`Error with the preview`, e);
        res.status(500).json({ message: 'Oops !, error with the preview.' });
    }
};

const createPost = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const newPost = await PostServices.createPost(body);

        res.status(201).json(newPost);
    } catch (e: unknown) {
        logger.error(`Creation post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const allPosts = await getOnlyPublished();
        const allPostsDTO = instanceToPlain(allPosts, { groups: ['blog'], excludeExtraneousValues: true });

        // Replace object with just a Buffer array.
        allPostsDTO.forEach((post: Post, id: number) => (allPostsDTO[id].image = Array.from(post.image)));

        res.status(200).json(allPostsDTO);
    } catch (e: unknown) {
        logger.error(`Get all posts error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getPost = async (req: Request, res: Response) => {
    logger.info(`PostController: getPost ->`, req.params);

    try {
        const post = await PostServices.getPostBySlug(req.params.slug);
        const postDTO = instanceToPlain(post, { groups: ['post'], excludeExtraneousValues: true });

        if (!post) throw new Error('No post find');
        // Replace object with just a Buffer array.
        // postDTO.image = Array.from(post.image);

        res.status(200).json(postDTO);
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getPosts = async (req: Request, res: Response) => {
    logger.info(`PostController: getPosts ->`, req.query);

    try {
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '10'), 10);

        const posts = await PostServices.getPostsPagination(page, limit);

        const postListDTO = instanceToPlain(posts.rows, { groups: ['blog'], excludeExtraneousValues: true });

        const totalPages = Math.ceil(posts.count / limit);

        // Replace object with just a Buffer array.
        // postListDTO.forEach((post: Post, id: number) => (postListDTO[id].image = Array.from(post.image)));

        res.status(200).json({ posts: postListDTO, totalPages: totalPages, totalPosts: posts.count, currentPage: page });
    } catch (e: unknown) {
        logger.error(`Get post list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const deletePost = async (req: Request, res: Response) => {
    try {
        const idPost = Number(req.params.idPost);
        await destroy(idPost);

        res.status(204).end();
    } catch (e: unknown) {
        logger.error(`Delete post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const updatePost = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);

        const post = await Post.findByPk(id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        post.set(req.body);
        const updatedPost = await PostServices.updatePost(id, post);

        res.status(200).json(updatedPost);
    } catch (e: unknown) {
        logger.error(`Update post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { preview, createPost, getAllPosts, getPost, getPosts, deletePost, updatePost };
