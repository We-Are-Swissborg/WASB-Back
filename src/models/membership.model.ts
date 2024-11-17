import { Expose } from 'class-transformer';
import {
    Column,
    IsDate,
    Model,
    Table,
    DataType,
    PrimaryKey,
    AutoIncrement,
    BelongsTo,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
    BeforeUpdate,
} from 'sequelize-typescript';
import ContributionStatus from '../types/ContributionStatus';
import { User } from './user.model';
import { Contribution } from './contribution.model';

interface IMembership {
    userId: number;
    contributionStatus: ContributionStatus;
    dateContribution: Date | null;
    endDateContribution: Date | null;
    contributionId: number;
    note: string;
    validateUserId: number;
}

@Table
class Membership extends Model implements IMembership {
    @Expose({ groups: ['admin', 'user'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['admin', 'user'] })
    @ForeignKey(() => User)
    @Column
    declare userId: number;

    @Expose({ groups: ['admin'] })
    @BelongsTo(() => User, 'userId')
    declare user: User;

    @Expose({ groups: ['admin', 'user', 'profil'] })
    @Column({
        type: DataType.ENUM(...Object.values(ContributionStatus)),
    })
    declare contributionStatus: ContributionStatus;

    @Expose({ groups: ['admin'] })
    @ForeignKey(() => User)
    declare validateUserId: number;

    @Expose({ groups: ['admin'] })
    @BelongsTo(() => User, 'validateUserId')
    declare validateBy?: User;

    @Expose({ groups: ['admin', 'user', 'profil'] })
    @IsDate
    @Column
    declare dateContribution: Date;

    @Expose({ groups: ['admin', 'user', 'profil'] })
    @IsDate
    @Column
    declare endDateContribution: Date;

    @Expose({ groups: ['admin', 'user', 'profil'] })
    @ForeignKey(() => Contribution)
    @Column
    declare contributionId: number;

    @Expose({ groups: ['admin', 'user'] })
    @BelongsTo(() => Contribution, 'contributionId')
    declare contribution?: Contribution;

    @Expose({ groups: ['admin', 'user', 'profil'] })
    @Column
    declare note: string;

    @Expose({ groups: ['admin', 'user'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['admin'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @BeforeCreate
    static async addDefaultStatus(instance: Membership) {
        instance.contributionStatus = ContributionStatus.IN_PROGRESS;
    }

    @BeforeUpdate
    static async contributionStatusChanged(instance: Membership) {
        if (instance.changed('contributionStatus') && instance.contributionStatus === ContributionStatus.ACCEPTED) {
            const now = new Date();
            instance.dateContribution = new Date(now);
            instance.endDateContribution = new Date(now);
            instance.endDateContribution.setMonth(now.getMonth() + instance.contribution!.duration);
        }
    }
}

export { Membership, IMembership };
