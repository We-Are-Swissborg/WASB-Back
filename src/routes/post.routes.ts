import express, { Router } from 'express';
import * as Post from '../controllers/post.controller';
import * as Auth from '../middlewares/auth.middleware';
import Role from '../types/Role';
import { uploadMiddleware } from '../middlewares/upload.middleware';

export const postRouter: Router = express.Router();
const inputFileName = 'imagePost';

postRouter.get('/:lang', Post.getPosts);
postRouter.get('/myPosts/:lang', Auth.authorize([Role.Author]), Post.getMyPosts);
postRouter.get('/:lang/:slug', Post.getPost);

postRouter.post('/', Auth.authorize([Role.Author]), Post.createPost);
postRouter.post('/delete', Post.deletePosts);
postRouter.post('/upload', Auth.authorize([Role.Author, Role.Organizer, Role.Editor]), uploadMiddleware().single(inputFileName), Post.uploadImage);
// postRouter.post('/preview', Auth.authorize([Role.Admin, Role.Moderator]), upload.single('imagePost'), Post.preview);
// postRouter.delete('/:idPost', Auth.authorize([Role.Admin, Role.Moderator]), Post.deletePost);

// postRouter.put('/:idPost', Auth.authorize([Role.Admin, Role.Moderator]), Post.updatePost);