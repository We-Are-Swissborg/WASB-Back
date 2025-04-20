import { Expose } from "class-transformer";
import { AllowNull, AutoIncrement, BeforeBulkCreate, Column, CreatedAt, DataType, IsDate, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import slugify from "slugify";
import { EntityType } from "../enums/entityType.enum";
import { Transaction } from "sequelize";

interface ITranslation {
    entityType: EntityType;
    entityId: number;
    languageCode: string;
    title: string;
    content?: string;
    slug?: string;
}

@Table
class Translation extends Model<ITranslation> {
    @Expose({ groups: ['all', 'admin'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['all', 'admin'] })
    @AllowNull(false)
    @Column({
        type: DataType.ENUM(...Object.values(EntityType)),
    })
    declare entityType: EntityType;

    @Expose({ groups: ['all', 'admin'] })
    @AllowNull(false)
    @Column
    declare entityId: number;

    @Expose({ groups: ['all', 'admin', 'post', 'blog'] })
    @AllowNull(false)
    @Column
    declare languageCode: string;

    @Expose({ groups: ['all', 'admin', 'post', 'blog'] })
    @AllowNull(false)
    @Column
    declare title: string;

    @Expose({ groups: ['all', 'admin', 'post', 'blog'] })
    @AllowNull(true)
    @Column
    declare content?: string;

    @Expose({ groups: ['all', 'admin', 'post', 'blog'] })
    @AllowNull(true)
    @Unique
    @Column
    declare slug?: string;

    @Expose({ groups: ['admin'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['admin'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt?: Date;

    @BeforeBulkCreate
    static async generateSlug(translates: Translation[], options: { transaction?: Transaction }) {
        for (const t of translates) {
            const baseSlug = slugify(t.title, { lower: true, strict: true });
            let slug = baseSlug;
            let counter = 1;

            while (await Translation.findOne({ where: { slug: slug }, transaction: options.transaction })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            t.slug = slug;
        }
    }
}

export { Translation, ITranslation }; 