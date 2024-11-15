import { Expose } from 'class-transformer';
import {
    Column,
    IsDate,
    Model,
    Table,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    AllowNull,
} from 'sequelize-typescript';

interface IContribution {
    id: number;
    title: string;
    amount: number;
    duration: number;
    isActive: boolean;
}

@Table
class Contribution extends Model implements IContribution {
    @Expose({ groups: ['admin', 'user'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['admin', 'user'] })
    @AllowNull(false)
    @Column
    declare title: string;

    @Expose({ groups: ['admin'] })
    @AllowNull(false)
    @Column
    declare amount: number;

    @Expose({ groups: ['admin'] })
    @AllowNull(false)
    @Column
    declare duration: number;

    @Expose({ groups: ['admin'] })
    @AllowNull(false)
    @Column
    declare isActive: boolean;

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
}

export { Contribution, IContribution };
