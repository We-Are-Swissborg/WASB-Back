import { logger } from '../middlewares/logger.middleware';
import { Post } from '../models/post.model';
import * as postRepository from '../repository/post.repository';
import domClean from './domPurify';

const createPost = async (post: Post): Promise<Post> => {
    logger.info('createPost : services', post);
    post.content = domClean(post.content);

    if (!post.title?.trim()) {
        throw new Error('A title for the post is required');
    }

    if (!post.content?.trim()) {
        throw new Error('A content for the post is required');
    }

    const postCreated = await postRepository.create(post);

    logger.debug('Post created', { postCreated });

    return postCreated;
};

const getPosts = async (query?: string | null): Promise<Post[]> => {
    logger.info('getPosts : services', { query: query });

    let posts = null;

    // if (!!query) {
    //     parameters = await postRepository.getPosts(query);
    // } else {
        posts = await postRepository.getAll();
    // }

    logger.debug(`getPosts : ${posts.count} item(s)`);

    return posts.rows;
};

const getPost = async (id: number): Promise<Post | null> => {
    logger.info('getPost : services', { id: id });

    const post = await postRepository.get(id);

    logger.debug(`getPost youhou :`, post);

    return post;
};

/**
 * Update a post
 * @param {Post} category Update post
 * @returns {Promise<Post>} Update post
 */
const updatePost = async (id: number, updatedPost: Post): Promise<Post> => {
    logger.info('update post : services');

    if(id !== updatedPost.id) {
        throw new Error('The encoded data do not coincide with those supplied');
    }

    if(!updatedPost.title) {
        throw new Error('A title for the post is required');
    }

    if(updatedPost.title.length < 3) {
        throw new Error('A title for the post must contain more than 3 characters');
    }

    updatedPost = await postRepository.update(updatedPost);
    return updatedPost;
};

export { createPost, getPosts, getPost, updatePost };