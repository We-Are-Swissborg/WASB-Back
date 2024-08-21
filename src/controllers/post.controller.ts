import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import domClean from '../services/domPurify';
import { create, get, getAll, getRange } from '../repository/post.repository';
import { instanceToPlain } from 'class-transformer';
import { Post } from '../models/post.model';
import imageConvert from '../services/imageConvert';

const preview = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const file = req.file;
        const clean = body.contentPost && domClean(body.contentPost);
        const convertToWebp = file && Array.from(await imageConvert(file, {x: 907, y: 445}));

        res.status(200).json({ clean, convertToWebp });
    } catch (e) {
        logger.error(`Error with the preview`, e);
        res.status(500).json({ message: 'Oops !, error with the preview.' });
    }
};

const createPost = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const newPost = await create(body);

        res.status(201).json(newPost);
    } catch (e: unknown) {
        logger.error(`Creation post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const allPosts = await getAll();
        const allPostsDTO = instanceToPlain(allPosts, { groups: ['blog'], excludeExtraneousValues: true });

        // Replace object with just a Buffer array.
        allPostsDTO.forEach((post: Post, id: number) => allPostsDTO[id].image = Array.from(post.image));

        res.status(200).json(allPostsDTO);
    } catch (e: unknown) {
        logger.error(`Get all posts error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getPost = async (req: Request, res: Response) => {
    try {
        const idPost = req.params.idPost.split('-')[1];
        const post = await get(idPost);
        const postDTO = instanceToPlain(post, { groups: ['blog'], excludeExtraneousValues: true });

        if(!post) throw new Error('No post find with this id :' + idPost);
        // Replace object with just a Buffer array.
        postDTO.image = Array.from(post.image);

        res.status(200).json(postDTO);
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

const getPostRange = async (req: Request, res: Response) => {
    try {
        const pageId = Number(req.params.pageId);
        const infoPost = await getRange(9, pageId);
        const postRangeDTO = instanceToPlain(infoPost.postRange, { groups: ['blog'], excludeExtraneousValues: true });

        // Replace object with just a Buffer array.
        postRangeDTO.forEach((post: Post, id: number) => postRangeDTO[id].image = Array.from(post.image));

        res.status(200).json({postRangeDTO, totalPost: infoPost.totalPost});
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { preview, createPost, getAllPosts, getPost, getPostRange };
