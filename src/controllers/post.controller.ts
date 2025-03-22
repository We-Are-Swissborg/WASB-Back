import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import { instanceToPlain } from 'class-transformer';
import * as PostServices from '../services/post.services';

const getPost = async (req: Request, res: Response) => {
    logger.info(`PostController: getPost ->`, req.params);

    try {
        const post = await PostServices.getPostBySlug(req.params.slug);
        if (!post) throw new Error('No post find');

        const postDTO = instanceToPlain(post, { groups: ['post'], excludeExtraneousValues: true });

        res.status(200).json(postDTO);
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getPosts = async (req: Request, res: Response) => {
    logger.info(`PostController: getPosts ->`, req.query);

    try {
        const language = String(req.query.page || 'fr');
        const page = parseInt(String(req.query.page || '1'), 10);
        const limit = parseInt(String(req.query.limit || '10'), 10);

        const posts = await PostServices.getPostsPagination(language, page, limit);

        const postListDTO = instanceToPlain(posts.rows, { groups: ['blog'], excludeExtraneousValues: true });

        const totalPages = Math.ceil(posts.count / limit);

        res.status(200).json({
            posts: postListDTO,
            totalPages: totalPages,
            totalPosts: posts.count,
            currentPage: page,
        });
    } catch (e: unknown) {
        logger.error(`Get posts list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { getPost, getPosts };
