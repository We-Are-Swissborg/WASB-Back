import express, { Router } from 'express';
import * as Post from '../controllers/post.controller';
import * as Auth from '../middlewares/auth.middleware';
import Role from '../types/Role';

export const postRouter: Router = express.Router();

postRouter.get('/:lang', Post.getPosts);
postRouter.get('/:lang/:slug', Post.getPost);

postRouter.post('/', Auth.authorize([Role.Author]), Post.createPost);
// postRouter.post('/preview', Auth.authorize([Role.Admin, Role.Moderator]), upload.single('imagePost'), Post.preview);
// postRouter.delete('/:idPost', Auth.authorize([Role.Admin, Role.Moderator]), Post.deletePost);

// postRouter.put('/:idPost', Auth.authorize([Role.Admin, Role.Moderator]), Post.updatePost);