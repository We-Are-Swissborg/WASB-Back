import { Expose, Type } from 'class-transformer';
import {
    Column,
    IsDate,
    Model,
    Table,
    AutoIncrement,
    PrimaryKey,
    AllowNull,
} from 'sequelize-typescript';
import { Post } from './post.model';

interface IPostView {
  id: number;
  postId: number;
  clientId: string;
  viewedAt: Date;
}

@Table({ timestamps: false })
class PostView extends Model implements IPostView {
    @Expose({ groups: ['admin', 'author'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Type(() => Post)
    @Expose({ groups: ['admin', 'author'] })
    @AllowNull(false)
    @Column
    declare postId: number;

    @AllowNull(false)
    @Column
    declare clientId: string;

    @Expose({ groups: ['admin', 'author'] })
    @IsDate
    @Column({defaultValue: () => new Date()})
    declare viewedAt: Date;
}

export { PostView, IPostView };