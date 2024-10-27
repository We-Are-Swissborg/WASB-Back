import { Expose, Type } from 'class-transformer';
import { NonAttribute } from 'sequelize';
import {
    AllowNull,
    Column,
    CreatedAt,
    IsDate,
    Model,
    Table,
    UpdatedAt,
    Unique,
    AutoIncrement,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    BeforeCreate,
    BeforeUpdate,
    Index,
    BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import slugify from 'slugify';
import { PostCategory } from './postcategory.model';
import { PostCategoryPost } from './postcategorypost.model';

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
    @AllowNull(false)
    @Column
    @Index
    declare author: number;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @AllowNull(false)
    @Unique
    @Column({
        validate: {
            len: [5, 100],
            notEmpty: true
        }
    })
    declare title: string;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @AllowNull(false)
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

    @Expose({ groups: ['admin'] })
    @AllowNull(false)
    @Column
    declare isPublish: boolean;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @IsDate
    @Column
    declare publishedAt?: Date;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @Index
    @AllowNull(false)
    @Column
    declare slug: string;

    // Relation many-to-many avec Post
    @BelongsToMany(() => PostCategory, () => PostCategoryPost)
    declare categories: PostCategory[];

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
        if (post.isPublish && !post.publishedAt) {
            post.publishedAt = new Date();
        } else if (!post.isPublish) {
            post.publishedAt = undefined;
        }
    }
}

export { Post, IPost };
