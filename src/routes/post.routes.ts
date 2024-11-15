import express, { Router } from 'express';
import * as Post from '../controllers/post.controller';

export const postRouter: Router = express.Router();

postRouter.get('/', Post.getPosts);
postRouter.get('/:slug', Post.getPost);
