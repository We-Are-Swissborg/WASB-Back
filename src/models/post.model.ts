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
    userId: number;
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
    declare userId: number;

    @Expose({ groups: ['user', 'blog'] })
    @Unique
    @Column
    declare title: string;

    @Expose({ groups: ['user', 'blog'] })
    @Column({
      type: DataTypes.BLOB,
    })
    declare image: Buffer;

    @Expose({ groups: ['user', 'blog'] })
    @Unique
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