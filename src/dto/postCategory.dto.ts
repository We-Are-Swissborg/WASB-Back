import { Expose } from 'class-transformer';

export class PostCategoryDto {
    @Expose()
    id: number;

    @Expose()
    title: string | null;
}
