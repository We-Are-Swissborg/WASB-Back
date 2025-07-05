import { Op, Transaction } from 'sequelize';
import { Logger } from 'winston';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Translation } from '../models/translation.model';
import { PostDto } from '../dto/post.dto';
import { mapPostToDto, mapPostBySlugToDto } from '../mappers/post.mapper';
import { plainToInstance } from 'class-transformer';
import { PostCategory } from '../models/postcategory.model';
import { EntityType } from '../enums/entityType.enum';

/**
 * Repository gérant les opérations CRUD des posts.
 */
export default class PostRepository {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    /**
     * Crée un nouveau post.
     * @param {Post} post - Données du post à créer.
     * @param {Transaction} [transaction] - Transaction Sequelize optionnelle.
     * @returns {Promise<Post>} - Le post créé.
     */
    async create(post: Post, transaction?: Transaction): Promise<Post> {
        this.logger.info('Creating post', { post });

        try {
            const postCreated = await Post.create(
                {
                    author: post.author,
                    image: post.image ?? undefined,
                    isPublish: post.isPublish ?? false,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                },
                { transaction },
            );
            this.logger.debug(`Post created successfully: ${postCreated.id}`, { postCreated });
            return postCreated;
        } catch (error) {
            this.logger.error('Error creating post', { error });
            throw new Error('Failed to create post');
        }
    }

    /**
     * Récupère tous les posts avec leurs catégories et utilisateurs associés.
     * @returns {Promise<{ rows: Post[]; count: number }>} - Liste paginée des posts.
     */
    async getAll(): Promise<{ rows: Post[]; count: number }> {
        this.logger.info('Fetching all posts');

        try {
            const allPosts = await Post.findAndCountAll({
                distinct: true,
                include: [
                    { model: User, attributes: ['username'] },
                    {
                        model: PostCategory,
                        attributes: ['id'],
                        through: { attributes: [] },
                        include: [
                            {
                                model: Translation,
                                attributes: ['id', 'title', 'languageCode'],
                                where: {
                                    entityType: EntityType.POSTCATEGORY,
                                    languageCode: 'fr',
                                },
                                required: false,
                            },
                        ],
                    },
                    {
                        model: Translation,
                        attributes: ['id', 'title', 'content', 'slug', 'languageCode', 'entityId'],
                        where: {
                            entityType: EntityType.POST,
                            entityId: { [Op.col]: 'Post.id' },
                        },
                        required: true,
                    },
                ],
            });

            this.logger.debug(`Fetched ${allPosts.count} posts`);
            return allPosts;
        } catch (error) {
            this.logger.error('Error fetching all posts', { error });
            throw new Error('Failed to fetch posts');
        }
    }

    /**
     * Récupère les posts paginés et publiés avec leur traduction et leur catégorie.
     * @param {string} language - Langue demandée.
     * @param {number} skip - Nombre d'éléments à sauter.
     * @param {number} limit - Nombre d'éléments par page.
     * @returns {Promise<{ rows: PostDto[]; count: number }>} - Liste paginée des posts.
     */
    async getPostsPagination(
        language: string,
        skip: number,
        limit: number,
    ): Promise<{ rows: PostDto[]; count: number }> {
        this.logger.info('Fetching paginated posts');

        try {
            const total = await Post.count({
                where: { isPublish: true },
            });
            const posts = await Post.findAll({
                where: { isPublish: true },
                limit,
                offset: skip,
                include: [
                    { model: User, attributes: ['username'] },
                    {
                        model: PostCategory,
                        attributes: ['id'],
                        through: { attributes: [] },
                        include: [
                            {
                                model: Translation,
                                attributes: ['id', 'title', 'languageCode'],
                                where: {
                                    entityType: EntityType.POSTCATEGORY,
                                    languageCode: language,
                                },
                                required: false,
                            },
                        ],
                    },
                    {
                        model: Translation,
                        attributes: ['id', 'title', 'slug', 'languageCode', 'entityId'],
                        where: {
                            entityType: EntityType.POST,
                            entityId: { [Op.col]: 'Post.id' },
                            languageCode: language,
                        },
                        required: true,
                    },
                ],
                order: [['publishedAt', 'DESC']],
            });

            this.logger.debug(`Fetched ${total} paginated posts`);

            const postDto = plainToInstance(
                PostDto,
                posts.map((p) => mapPostToDto(p, language)),
                {
                    excludeExtraneousValues: true,
                },
            );

            return { rows: postDto, count: total };
        } catch (error) {
            this.logger.error('Error fetching paginated posts', { error });
            throw new Error('Failed to fetch paginated posts');
        }
    }

    /**
     * Récupère uniquement les posts publiés.
     * @returns {Promise<{ rows: Post[]; count: number }>} - Liste des posts publiés.
     */
    async getOnlyPublished(skip: number, limit: number): Promise<{ rows: Post[]; count: number }> {
        this.logger.info('Fetching only published posts');

        try {
            const total = await Post.count({
                where: { isPublish: true },
            });
            const posts = await Post.findAll({
                where: { isPublish: true },
                offset: skip,
                limit,
                include: [
                    { model: User, attributes: ['username'] },
                    {
                        model: PostCategory,
                        attributes: ['id'],
                        through: { attributes: [] },
                        include: [
                            {
                                model: Translation,
                                attributes: ['id', 'title', 'languageCode'],
                                where: {
                                    entityType: EntityType.POSTCATEGORY,
                                },
                                required: false,
                            },
                        ],
                    },
                    {
                        model: Translation,
                        attributes: ['id', 'title', 'content', 'slug', 'languageCode', 'entityId'],
                        where: {
                            entityType: EntityType.POST,
                        },
                        required: true,
                    },
                ],
            });

            this.logger.debug(`Fetched ${total} published posts`);
            return { rows: posts, count: total };
        } catch (error) {
            this.logger.error('Error fetching published posts', { error });
            throw new Error('Failed to fetch published posts');
        }
    }

    /**
     * Récupère un post par son identifiant.
     * @param {number} id - Identifiant du post.
     * @returns {Promise<Post | null>} - Le post trouvé ou null.
     */
    async get(id: number): Promise<Post | null> {
        this.logger.info('Fetching post by ID', { id });

        try {
            const post = await Post.findByPk(id, {
                include: [
                    { model: User, attributes: ['username'] },
                    {
                        model: PostCategory,
                        attributes: ['id'],
                        through: { attributes: [] },
                        include: [
                            {
                                model: Translation,
                                attributes: ['id', 'title', 'languageCode'],
                                where: {
                                    entityType: EntityType.POSTCATEGORY,
                                },
                                required: false,
                            },
                        ],
                    },
                    {
                        model: Translation,
                        attributes: ['id', 'title', 'content', 'slug', 'languageCode', 'entityId'],
                        where: {
                            entityType: EntityType.POST,
                            entityId: { [Op.col]: 'Post.id' },
                        },
                        required: true,
                    },
                ],
            });

            this.logger.debug('Fetched post by ID', { post });
            return post;
        } catch (error) {
            this.logger.error('Error fetching post by ID', { error });
            throw new Error('Failed to fetch post');
        }
    }

    /**
     * Supprime un post par son identifiant.
     * @param {number} id - Identifiant du post à supprimer.
     * @param {Transaction} [transaction] - Transaction Sequelize optionnelle.
     * @throws {Error} - Si le post n'existe pas.
     */
    async destroy(id: number, transaction?: Transaction): Promise<void> {
        this.logger.info('Deleting post', { id });

        try {
            const post = await Post.findByPk(id);
            if (!post) throw new Error('Error, post not exist for delete');

            await post.destroy({transaction});

            this.logger.debug(`Post ${id} deleted`);
        } catch (error) {
            this.logger.error('Error deleting post', { error });
            throw new Error('Failed to delete post');
        }
    }

    /**
     * Met à jour un post existant.
     * @param {Post} post - Le post mis à jour.
     * @param {Transaction} [transaction] - Transaction Sequelize optionnelle.
     * @returns {Promise<Post>} - Le post mis à jour.
     */
    async update(post: Post, transaction?: Transaction): Promise<Post> {
        this.logger.info('Updating post', { post });

        try {
            post.isNewRecord = false;
            post = await post.save({ transaction });

            this.logger.debug('Post updated', { post });
            return post;
        } catch (error) {
            this.logger.error('Error updating post', { error });
            throw new Error('Failed to update post');
        }
    }

    /**
     * Récupère un post publié par son slug.
     * @param {string} slug - Slug du post recherché.
     * @returns {Promise<Post | null>} - Le post trouvé ou null.
     */
    async getBySlug(slug: string): Promise<PostDto | null> {
        this.logger.info('Fetching post by slug', { slug: slug });

        try {
            const post = await Post.findOne({
                where: {
                    isPublish: true,
                },
                include: [
                    { model: User, attributes: ['username'] },
                    {
                        model: PostCategory,
                        attributes: ['id'],
                        through: { attributes: [] },
                        include: [
                            {
                                model: Translation,
                                attributes: ['id', 'title', 'languageCode'],
                                where: {
                                    entityType: EntityType.POSTCATEGORY,
                                },
                                required: false,
                            },
                        ],
                    },
                    {
                        model: Translation,
                        attributes: ['id', 'title', 'content', 'slug', 'languageCode', 'entityId'],
                        where: {
                            entityType: EntityType.POST,
                            entityId: { [Op.col]: 'Post.id' },
                            slug: slug,
                        },
                        required: true,
                    },
                ],
            });

            if (!post) {
                this.logger.warn('Post not found by slug', { slug });
                return null;
            }

            this.logger.debug('Fetched post by slug', { post });
            const raw = mapPostBySlugToDto(post);

            return plainToInstance(PostDto, raw, { excludeExtraneousValues: true });
        } catch (error) {
            this.logger.error('Error fetching post by slug', { error });
            throw new Error('Failed to fetch post by slug');
        }
    }
}
