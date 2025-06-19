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
    BeforeDestroy,
} from 'sequelize-typescript';
import { Post } from './post.model';
import { PostCategoryPost } from './postcategorypost.model';
import { Translation } from './translation.model';
import { EntityType } from '../enums/entityType.enum';

interface IPostCategory {
    posts: Post[];
    translations: Translation[];
}

@Table
class PostCategory extends Model implements IPostCategory {
    @Expose({ groups: ['admin', 'post', 'blog', 'author', 'editor'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['admin', 'post', 'author', 'editor'], toClassOnly: false })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['admin', 'post', 'blog', 'author', 'editor'], toClassOnly: false })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @BelongsToMany(() => Post, () => PostCategoryPost)
    declare posts: Post[];

    @Expose({ groups: ['admin', 'post', 'blog', 'author', 'editor'], toClassOnly: false })
    @HasMany(() => Translation, { foreignKey: 'entityId', scope: { entityType: EntityType.POSTCATEGORY }, onDelete: 'CASCADE', hooks: true})
    declare translations: Translation[];

    @BeforeDestroy
    static async deleteTranslations(instance: PostCategory) {
        await Translation.destroy({
            where: {
                entityType: EntityType.POSTCATEGORY,
                entityId: instance.id
            }
        });
    }
}

export { PostCategory, IPostCategory };
