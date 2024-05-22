import { User } from './user.model';
import { Expose } from 'class-transformer';
import {
    AllowNull,
    Column,
    CreatedAt,
    ForeignKey,
    IsDate,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';

interface ISocialNetwork {
    userId: number;
    twitter: string;
    discord: string;
    tiktok: string;
    telegram: string;
}

@Table
class SocialNetwork extends Model implements ISocialNetwork {
    @Expose({ groups: ['user'] })
    @ForeignKey(() => User)
    @AllowNull(false)
    @PrimaryKey
    @Column
    declare userId: number;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare twitter: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare discord: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare tiktok: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare telegram: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;
}

export { SocialNetwork, ISocialNetwork };
