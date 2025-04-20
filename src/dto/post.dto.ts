import { Expose, Type } from 'class-transformer';
import { PostCategoryDto } from './postCategory.dto';

export class PostDto {
    @Expose()
    id: number;

    @Expose()
    image64: string | null;

    @Expose()
    isPublish: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt?: Date;

    @Expose()
    publishedAt?: Date;

    @Expose()
    title: string | null;

    @Expose()
    slug: string | null;

    @Expose()
    content: string | null;

    @Expose()
    author: string | null;

    @Expose()
    @Type(() => PostCategoryDto)
    categories: PostCategoryDto[];
}
