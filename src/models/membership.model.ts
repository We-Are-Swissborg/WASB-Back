import { User } from './user.model';
import { Expose } from 'class-transformer';
import {
    AllowNull,
    Column,
    ForeignKey,
    IsDate,
    Model,
    PrimaryKey,
    Table,
    DataType,
    Unique,
} from 'sequelize-typescript';
import ContributionStatus from '../types/ContributionStatus';

interface IMembership {
    userId: number;
    contributionStatus: ContributionStatus;
    dateContribution: Date | null;
    endDateContribution: Date | null;
    contribution: string | null;
}

@Table
class Membership extends Model implements IMembership {
    @Expose({ groups: ['user'] })
    @ForeignKey(() => User)
    @Unique
    @AllowNull(false)
    @PrimaryKey
    @Column
    declare userId: number;

    @Expose({ groups: ['user', 'profil'] })
    @Column({
      type: DataType.ENUM(...Object.values(ContributionStatus)),
      allowNull: false,
    })
    declare contributionStatus: ContributionStatus;
    
    @Expose({ groups: ['user', 'profil'] })
    @IsDate
    @Column
    declare dateContribution: Date;
    
    @Expose({ groups: ['user', 'profil'] })
    @IsDate
    @Column
    declare endDateContribution: Date;
    
    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare contribution: string;
}

export { Membership, IMembership };