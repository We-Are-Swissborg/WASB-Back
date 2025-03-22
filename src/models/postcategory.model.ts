import { Expose } from 'class-transformer';
import {
    Column,
    CreatedAt,
    IsDate,
    Model,
    Table,
    UpdatedAt,
    AutoIncrement,
    PrimaryKey,
    BelongsToMany,
    HasMany,
} from 'sequelize-typescript';
import { Post } from './post.model';
import { PostCategoryPost } from './postcategorypost.model';
import { Translation } from './translation.model';

interface IPostCategory {
    posts: Post[];
    translations: Translation[];
}

@Table
class PostCategory extends Model implements IPostCategory {
    @Expose({ groups: ['admin', 'post', 'blog'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

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

    @Expose({ groups: ['admin', 'post', 'blog'], toClassOnly: false })
    @HasMany(() => Translation, { foreignKey: 'entityId', scope: { entityType: 'PostCategory' } })
    declare translations: Translation[];
}

export { PostCategory, IPostCategory };
