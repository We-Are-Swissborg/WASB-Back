import { Expose } from 'class-transformer';
import { DataTypes } from 'sequelize';
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
} from 'sequelize-typescript';

interface IPost {
    author: number;
    title: string;
    image: Buffer;
    content: string;
}

@Table
class Post extends Model implements IPost {
    @Expose({ groups: ['user', 'blog'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['user', 'blog'] })
    @AllowNull(false)
    @Column
    declare author: number;

    @Expose({ groups: ['user', 'blog'] })
    @AllowNull(false)
    @Unique
    @Column
    declare title: string;

    @Expose({ groups: ['user', 'blog'] })
    @AllowNull(false)
    @Column({
      type: DataTypes.BLOB,
    })
    declare image: Buffer;

    @Expose({ groups: ['user', 'blog'] })
    @AllowNull(false)
    @Column
    declare content: string;

    @Expose({ groups: ['user', 'blog'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['user', 'blog'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;
}

export { Post, IPost };