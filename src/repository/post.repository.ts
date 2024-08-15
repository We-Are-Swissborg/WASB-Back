import { logger } from "../middlewares/logger.middleware";
import { IPost, Post } from "../models/post.model";
import domClean from "../services/domPurify";
import isFileImage from "../utils/isFileImage";

const create = async (post: IPost, file: Express.Multer.File): Promise<Post> => {
  logger.info('post create', post);

  const content = domClean(post.content);
  const isImage = isFileImage(file);
  if(!isImage) throw new Error('File is not an image');

  const postCreated = await Post.create({
    author : post.author,
    title: post.title,
    image: file.buffer,
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

export { create, getAll, get };