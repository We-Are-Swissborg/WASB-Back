import { PostDto } from '../dto/post.dto';
import { Post } from '../models/post.model';
import { mapPostCategoryToDto } from './postCategory.mapper';

export function mapPostToDto(post: Post, language: string): PostDto {
    const translation = post.translations?.find((t) => t.languageCode === language);

    const categories =
        post.categories?.map((cat) => {
            return mapPostCategoryToDto(cat, language);
        }) || [];

    return {
        id: post.id,
        author: post.infoAuthor?.username || null,
        image64: post.image64,
        isPublish: post.isPublish,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        title: translation?.title || null,
        content: translation?.content || null,
        slug: translation?.slug || null,
        categories,
    };
}

export function mapPostBySlugToDto(post: Post): PostDto {
    const translation = post.translations?.[0]; // Prend la première traduction car on filtre déjà par slug

    const categories =
        post.categories?.map((cat) => {
            const catTranslation = cat.translations?.[0];
            return {
                id: cat.id,
                title: catTranslation?.title || null,
            };
        }) || [];

    return {
        id: post.id,
        author: post.infoAuthor?.username || null,
        image64: post.image64,
        isPublish: post.isPublish,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        title: translation?.title || null,
        content: translation?.content || null,
        slug: translation?.slug || null,
        categories,
    };
}
