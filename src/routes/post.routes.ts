import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as Post from '../controllers/post.controller';
import multer from 'multer';

const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});

export const postRouter: Router = express.Router();

postRouter.post('/preview', Auth.authorize(), Post.preview);
postRouter.post('/', Auth.authorize(), upload.single('imagePost'), Post.createPost);

postRouter.get('/', Post.getAllPosts);
postRouter.get('/:idPost', Post.getPost);