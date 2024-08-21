import { logger } from "../middlewares/logger.middleware";
import { IPost, Post } from "../models/post.model";
import domClean from "../services/domPurify";
import GetRange from "../types/GetRange";

const create = async (post: IPost): Promise<Post> => {
  logger.info('post create', post);
  const content = domClean(post.content);

  const postCreated = await Post.create({
    author : post.author,
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

  const post = await Post.findByPk(id);

  logger.debug('get post OK');

  return post;
};

const getRange = async (scale: number, selection: number): Promise<GetRange> => {
  logger.info('get posts range');

  const totalPost = await Post.count();

  const postRange = await Post.findAll({
    limit: scale,
    offset: scale * (selection - 1),
    order: [['createdAt', 'DESC']],
  });

  logger.debug(`get ${scale} posts on ${totalPost}`);

  return { postRange, totalPost };
};

export { create, getAll, get, getRange };