import { Expose, Type } from 'class-transformer';
import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, NonAttribute } from 'sequelize';
import {
    AllowNull,
    Column,
    CreatedAt,
    IsDate,
    Model,
    Table,
    UpdatedAt,
    AutoIncrement,
    PrimaryKey,
    ForeignKey,
    BeforeCreate,
    BeforeUpdate,
    Index,
    BelongsToMany,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import slugify from 'slugify';
import { PostCategory } from './postcategory.model';
import { PostCategoryPost } from './postcategorypost.model';
import { logger } from '../middlewares/logger.middleware';

interface IPost {
    author: number;
    title: string;
    image: string;
    content: string;
    isPublish: boolean;
    publishedAt?: Date;
    slug: string;
}

@Table
class Post extends Model implements IPost {
    @Expose({ groups: ['user', 'post', 'blog'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @ForeignKey(() => User)
    @Column
    declare author: number;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @AllowNull(false)
    @Column({
        validate: {
            len: [3, 100],
            notEmpty: true
        }
    })
    declare title: string;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @Column
    declare image: string;

    @Expose({ groups: ['user', 'post'] })
    @AllowNull(false)
    @Column
    declare content: string;

    @Expose({ groups: ['user', 'post'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['user', 'post'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @Type(() => User)
    @Expose({ groups: ['post', 'blog'] })
    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true })
    declare infoAuthor: NonAttribute<User>;

    @Expose({ groups: ['post', 'blog'] })
    @Column
    declare isPublish: boolean;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @IsDate
    @Column
    declare publishedAt?: Date;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @Index
    @Column
    declare slug: string;

    // Relation many-to-many avec Post
    @Expose({ groups: ['user', 'post', 'blog'] })
    @BelongsToMany(() => PostCategory, () => PostCategoryPost)
    declare categories: NonAttribute<PostCategory[]>;

    declare addCategory: BelongsToManyAddAssociationMixin<
        PostCategory,
        PostCategory['id']
    >;

    declare addCategories: BelongsToManyAddAssociationsMixin<
        PostCategory,
        PostCategory['id']
    >;

    @BeforeCreate
    @BeforeUpdate
    static async generateSlug(post: Post) {
        if (!post.slug) {
            const baseSlug = slugify(post.title, { lower: true, strict: true });
            let slug = baseSlug;

            let postWithSlug = await Post.findOne({ where: { slug } });
            let counter = 1;

            while (postWithSlug) {
                slug = `${baseSlug}-${counter}`;
                postWithSlug = await Post.findOne({ where: { slug } });
                counter++;
            }

            post.slug = slug;
        }
    }

    @BeforeCreate
    @BeforeUpdate
    static setPublishedAt(post: Post) {
        if (post.isPublish && post.changed('isPublish')) {
            post.publishedAt = new Date();
        }
    }
}

export { Post, IPost };
