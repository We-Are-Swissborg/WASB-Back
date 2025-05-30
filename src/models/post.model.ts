import { Expose, Type } from 'class-transformer';
import {
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
    BelongsToMany,
    BelongsTo,
    HasMany,
    BeforeDestroy,
} from 'sequelize-typescript';
import { User } from './user.model';
import { PostCategory } from './postcategory.model';
import { PostCategoryPost } from './postcategorypost.model';
import { BelongsToManySetAssociationsMixin, NonAttribute } from 'sequelize';
import { getFileToBase64 } from '../services/file.servies';
import { Translation } from './translation.model';
import { EntityType } from '../enums/entityType.enum';

interface IPost {
    id: number;
    author: number;
    image: string;
    isPublish: boolean;
    publishedAt?: Date;
    translations: Translation[];
}

@Table
class Post extends Model implements IPost {
    @Expose({ groups: ['admin', 'user', 'post', 'blog', 'author', 'editor'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['admin', 'user', 'post', 'blog', 'author', 'editor'] })
    @ForeignKey(() => User)
    @Column
    declare author: number;

    @Expose({ groups: ['admin', 'user', 'post', 'blog', 'author', 'editor'] })
    @Column
    declare image: string;

    @Expose({ groups: ['admin', 'user', 'post', 'author', 'editor'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['user', 'post', 'author', 'editor'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @Type(() => User)
    @Expose({ groups: ['admin', 'post', 'blog', 'editor'] })
    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true })
    declare infoAuthor: User;

    @Expose({ groups: ['admin', 'post', 'blog', 'author', 'editor'] })
    @Column
    declare isPublish: boolean;

    @Expose({ groups: ['admin', 'user', 'post', 'blog', 'author', 'editor'] })
    @IsDate
    @Column
    declare publishedAt?: Date;

    // Relation many-to-many avec Post
    @Expose({ groups: ['admin', 'user', 'post', 'blog', 'author', 'editor'] })
    @BelongsToMany(() => PostCategory, () => PostCategoryPost)
    declare categories: PostCategory[];

    @Expose({ groups: ['admin', 'post', 'blog', 'author', 'editor'], toClassOnly: false })
    @HasMany(() => Translation, { foreignKey: 'entityId', scope: { entityType: EntityType.POST }, onDelete: 'CASCADE', hooks: true})

    declare translations: Translation[];

    declare setCategories: BelongsToManySetAssociationsMixin<PostCategory, number>;

    @Expose({ groups: ['admin', 'user', 'post', 'blog', 'author', 'editor'] })
    get image64(): NonAttribute<string | null> {
        if (this.image) {
            return getFileToBase64(this.image);
        }
        return null;
    }

    @BeforeCreate
    @BeforeUpdate
    static setPublishedAt(post: Post) {
        if (post.isPublish && post.changed('isPublish')) {
            post.publishedAt = new Date();
        }
    }

    @BeforeDestroy
    static async deleteTranslations(instance: Post) {
        await Translation.destroy({
            where: {
                entityType: EntityType.POST,
                entityId: instance.id
            }
        });
    }
}

export { Post, IPost };
