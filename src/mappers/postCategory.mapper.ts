import { PostCategoryDto } from '../dto/postCategory.dto';
import { PostCategory } from '../models/postcategory.model';

export function mapPostCategoryToDto(cat: PostCategory, language: string): PostCategoryDto {
    const translation = cat.translations?.find((t) => t.languageCode === language);

    return {
        id: cat.id,
        title: translation?.title || null,
    };
}
