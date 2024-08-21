import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as Post from '../controllers/post.controller';
import multer from 'multer';
import Role from '../types/Role';

const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});

export const postRouter: Router = express.Router();

postRouter.post('/preview', Auth.authorize([Role.Admin, Role.Moderator]), upload.single('imagePost'), Post.preview);
postRouter.post('/', Auth.authorize([Role.Admin, Role.Moderator]), Post.createPost);

postRouter.get('/', Post.getAllPosts);
postRouter.get('/:idPost', Post.getPost);
postRouter.get('/range/:pageId', Post.getPostRange);