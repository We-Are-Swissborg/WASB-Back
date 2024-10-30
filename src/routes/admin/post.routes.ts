import express, { Router } from 'express';
import * as Post from '../../controllers/adminController/postAdmin.controller';

export const postRouter: Router = express.Router();

postRouter.get('/', Post.getAllPosts);
postRouter.get('/:id', Post.getPost);
postRouter.post('/', Post.createPost);
postRouter.put('/:id', Post.updatePost);
postRouter.delete('/:id', Post.deletePost);
