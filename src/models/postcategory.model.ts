import { Expose } from 'class-transformer';
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
    BelongsToMany,
} from 'sequelize-typescript';
import { Post } from './post.model';
import { PostCategoryPost } from './postcategorypost.model';

interface IPostCategory {
    title: string;
}

@Table
class PostCategory extends Model implements IPostCategory {
    @Expose({ groups: ['admin', 'post', 'blog'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['admin', 'post', 'blog'] })
    @AllowNull(false)
    @Unique
    @Column
    declare title: string;

    @Expose({ groups: ['admin', 'post'], toClassOnly: false })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['admin', 'post', 'blog'], toClassOnly: false })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @BelongsToMany(() => Post, () => PostCategoryPost)
    declare posts: Post[];
}

export { PostCategory, IPostCategory };
