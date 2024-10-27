import {
    Model,
    Table,
    Column,
    ForeignKey,
} from 'sequelize-typescript';
import { Post } from './post.model';
import { PostCategory } from './postcategory.model';

@Table
class PostCategoryPost extends Model {
    @ForeignKey(() => Post)
    @Column
    declare postId: number;

    @ForeignKey(() => PostCategory)
    @Column
    declare postCategoryId: number;
}

export { PostCategoryPost };
