import { Expose } from 'class-transformer';
import {
    AllowNull,
    AutoIncrement,
    Column,
    CreatedAt,
    IsDate,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt,
} from 'sequelize-typescript';

interface IParameter {
    id: number;
    name: string;
    code: string;
    value: string;
    isActive: boolean;
}

@Table
class Parameter extends Model implements IParameter {
    @Expose({ groups: ['all', 'admin'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['all', 'admin'] })
    @AllowNull(false)
    @Unique
    @Column
    declare name: string;

    @Expose({ groups: ['all', 'admin'] })
    @AllowNull(false)
    @Unique
    @Column
    declare code: string;

    @Expose({ groups: ['all', 'admin'] })
    @AllowNull(false)
    @Unique
    @Column
    declare value: string;

    @Expose({ groups: ['admin'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['admin'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @Expose({ groups: ['admin'] })
    @Column
    declare isActive: boolean;
}

export { Parameter, IParameter };
