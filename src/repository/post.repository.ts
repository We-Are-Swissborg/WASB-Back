import { logger } from '../middlewares/logger.middleware';
import { IPost, Post } from '../models/post.model';
import { User } from '../models/user.model';
import domClean from '../services/domPurify';
import GetList from '../types/GetList';

const create = async (post: IPost): Promise<Post> => {
    logger.info('post create', post);
    const content = domClean(post.content);

    const postCreated = await Post.create({
        author: post.author,
        title: post.title,
        image: post.image,
        content: content,
    });

    logger.debug('post create OK');

    return postCreated;
};

const getAll = async (): Promise<Post[]> => {
    logger.info('get all posts');

    const allPosts = await Post.findAll();

    logger.debug('get all posts OK');

    return allPosts;
};

const get = async (id: string): Promise<Post | null> => {
    logger.info('get post');

    const post = await Post.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['username'],
            },
        ],
    });

    logger.debug('get post OK');

    return post;
};

const getList = async (scale: number, selection: number): Promise<GetList> => {
    logger.info('get posts list');

    const totalPost = await Post.count();

    const postList = await Post.findAll({
        limit: scale,
        offset: scale * (selection - 1),
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
        ],
    });

    logger.debug(`get ${scale} posts on ${totalPost}`);

    return { postList, totalPost };
};

const destroy = async (id: number) => {
    logger.info('delete post');

    const isDelete = await Post.destroy({ where: { id: id } });
    if (!isDelete) throw new Error('Error, post not exist for delete');

    logger.debug(`delete post ${id}`);
};

const update = async (id: number, data: Post) => {
    logger.info('update post');
    const post = await Post.update(data, { where: { id: id } });

    if (!post[0]) throw new Error('Post not exist');

    logger.debug(`update post ${id} OK!`);
};

export { create, getAll, get, getList, destroy, update };
