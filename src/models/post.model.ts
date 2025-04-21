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
    @Expose({ groups: ['admin', 'user', 'post', 'blog'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['admin', 'user', 'post', 'blog'] })
    @ForeignKey(() => User)
    @Column
    declare author: number;

    @Expose({ groups: ['admin', 'user', 'post', 'blog'] })
    @Column
    declare image: string;

    @Expose({ groups: ['admin', 'user', 'post'] })
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
    @Expose({ groups: ['admin', 'post', 'blog'] })
    @BelongsTo(() => User, { onDelete: 'SET NULL', hooks: true })
    declare infoAuthor: User;

    @Expose({ groups: ['admin', 'post', 'blog'] })
    @Column
    declare isPublish: boolean;

    @Expose({ groups: ['admin', 'user', 'post', 'blog'] })
    @IsDate
    @Column
    declare publishedAt?: Date;

    // Relation many-to-many avec Post
    @Expose({ groups: ['admin', 'user', 'post', 'blog'] })
    @BelongsToMany(() => PostCategory, () => PostCategoryPost)
    declare categories: PostCategory[];

    @Expose({ groups: ['admin', 'post', 'blog'], toClassOnly: false })
    @HasMany(() => Translation, { foreignKey: 'entityId', scope: { entityType: EntityType.POST }, onDelete: 'CASCADE', hooks: true})

    declare translations: Translation[];

    declare setCategories: BelongsToManySetAssociationsMixin<PostCategory, number>;

    @Expose({ groups: ['admin', 'user', 'post', 'blog'] })
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
