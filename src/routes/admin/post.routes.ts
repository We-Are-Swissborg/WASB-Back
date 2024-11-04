import express, { Router } from 'express';
import * as Post from '../../controllers/adminController/postAdmin.controller';
import {uploadMiddleware} from '../../middlewares/upload.middleware';

export const postRouter: Router = express.Router();
const inputFileName = 'imagePost';

postRouter.get('/', Post.getAllPosts);
postRouter.get('/:id', Post.getPost);
postRouter.post('/', Post.createPost);
postRouter.post('/upload', uploadMiddleware().single(inputFileName), Post.uploadImage);
postRouter.put('/:id', Post.updatePost);
postRouter.delete('/:id', Post.deletePost);
