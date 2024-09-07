import { Expose, Type } from 'class-transformer';
import { DataTypes, NonAttribute } from 'sequelize';
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
} from 'sequelize-typescript';
import { User } from './user.model';

interface IPost {
    author: number;
    title: string;
    image: Buffer;
    content: string;
}

@Table
class Post extends Model implements IPost {
    @Expose({ groups: ['user', 'post', 'blog'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @AllowNull(false)
    @Column
    declare author: number;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @AllowNull(false)
    @Unique
    @Column
    declare title: string;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @AllowNull(false)
    @Column({
        type: DataTypes.BLOB,
    })
    declare image: Buffer;

    @Expose({ groups: ['user', 'post'] })
    @AllowNull(false)
    @Column
    declare content: string;

    @Expose({ groups: ['user', 'post'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['user', 'post', 'blog'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @Type(() => User)
    @Expose({ groups: ['post', 'blog'] })
    @BelongsTo(() => User, 'author')
    declare infoAuthor: NonAttribute<User>;
}

export { Post, IPost };
