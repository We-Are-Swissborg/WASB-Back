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
    Is,
} from 'sequelize-typescript';

const TWITTER_REGEX = /^twitter\.com\/[a-zA-Z0-9_]+/;
const DISCORD_REGEX = /^[a-z0-9._]{2,32}$/;
const TIKTOK_REGEX = /^tiktok\.com\/@[a-zA-Z0-9_,.']+/;
const TELEGRAM_REGEX = /^t\.me\/[a-zA-Z0-9_]+/;

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
    @Is(TWITTER_REGEX)
    @Column
    declare twitter: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Is(DISCORD_REGEX)
    @Column
    declare discord: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Is(TIKTOK_REGEX)
    @Column
    declare tiktok: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Is(TELEGRAM_REGEX)
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
