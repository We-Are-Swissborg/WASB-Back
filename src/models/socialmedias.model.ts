import { Expose } from 'class-transformer';
import {
    AllowNull,
    Column,
    CreatedAt,
    IsDate,
    Model,
    Table,
    UpdatedAt,
    Is,
    Unique,
    AutoIncrement,
    PrimaryKey,
} from 'sequelize-typescript';

const TWITTER_REGEX = /^[a-zA-Z0-9_]+$/;
const DISCORD_REGEX = /^[a-z0-9._]{2,32}$/;
const TIKTOK_REGEX = /^[a-zA-Z0-9_.]+$/;
const TELEGRAM_REGEX = /^[a-zA-Z0-9_]+$/;

interface ISocialMedias {
    userId: number | null;
    twitter: string | null;
    discord: string | null;
    tiktok: string | null;
    telegram: string | null;
}

@Table
class SocialMedias extends Model implements ISocialMedias {
    @Expose({ groups: ['user'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['user'] })
    @AllowNull(false)
    @Unique
    @Column
    declare userId: number;

    @Expose({ groups: ['user', 'profil'] })
    @Is(TWITTER_REGEX)
    @Unique
    @Column
    declare twitter: string;

    @Expose({ groups: ['user', 'profil'] })
    @Is(DISCORD_REGEX)
    @Unique
    @Column
    declare discord: string;

    @Expose({ groups: ['user', 'profil'] })
    @Is(TIKTOK_REGEX)
    @Unique
    @Column
    declare tiktok: string;

    @Expose({ groups: ['user', 'profil'] })
    @Is(TELEGRAM_REGEX)
    @Unique
    @Column
    declare telegram: string;

    @Expose({ groups: ['user', 'profil'] })
    @Unique
    @Column
    declare facebook: string;

    @Expose({ groups: ['user', 'profil'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['user', 'profil'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;
}

export { SocialMedias, ISocialMedias };
