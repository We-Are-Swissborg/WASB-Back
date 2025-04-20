import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import * as PostServices from '../services/post.services';

const getPost = async (req: Request, res: Response) => {
    logger.info(`PostController: getPost ->`, req.params);

    try {
        const postDTO = await PostServices.getPostBySlug(req.params.lang, req.params.slug);
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

export { getPost, getPosts };
