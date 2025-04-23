import express, { Router } from 'express';
import * as Post from '../controllers/post.controller';

export const postRouter: Router = express.Router();

postRouter.get('/:lang', Post.getPosts);
postRouter.get('/:lang/:slug', Post.getPost);
