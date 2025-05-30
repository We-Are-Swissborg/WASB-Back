import { Expose, Type } from 'class-transformer';
import {
    AllowNull,
    AutoIncrement,
    BeforeCreate,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    Index,
    IsDate,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import slugify from 'slugify';
import { User } from './user.model';
import { Address } from './address.model';
import { getFileToBase64 } from '../services/file.servies';
import { NonAttribute } from 'sequelize';

interface ISession {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    startDateTime: Date;
    endDateTime?: Date;
    organizerBy?: User;
    numberOfParticipants: number;
    url: string;
    membersOnly: boolean;
    status: SessionStatus;
}

enum SessionStatus {
    Planned = 'Planned',
    Ongoing = 'Ongoing',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    Postponed = 'Postponed',
    Draft = 'Draft',
}

@Table
class Session extends Model implements ISession {
    @Expose({ groups: ['all', 'admin', 'organizer'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['all', 'admin', 'organizer'] })
    @AllowNull(false)
    @Column
    declare title: string;

    @Expose({ groups: ['admin', 'all', 'organizer'] })
    @Index
    @Column
    declare slug: string;

    @Expose({ groups: ['all', 'admin', 'organizer'] })
    @Column
    declare description: string;

    @Expose({ groups: ['all', 'admin', 'organizer'] })
    @Column
    declare image: string;

    @Expose({ groups: ['all', 'admin', 'organizer'] })
    @Column({
        type: DataType.ENUM(...Object.values(SessionStatus)),
    })
    declare status: SessionStatus;

    @Expose({ groups: ['admin', 'all', 'organizer'] })
    @IsDate
    @Column
    declare startDateTime: Date;

    @Expose({ groups: ['admin', 'all', 'organizer'] })
    @Column
    declare endDateTime?: Date;

    @ForeignKey(() => User)
    declare organizerById?: number;

    @Expose({ groups: ['admin', 'all', 'organizer'] })
    @Type(() => User)
    @BelongsTo(() => User)
    declare organizerBy?: User;

    @Expose({ groups: ['admin', 'organizer'] })
    @Column
    declare numberOfParticipants: number;

    @Expose({ groups: ['all, admin', 'organizer'] })
    @Type(() => Address)
    @BelongsTo(() => Address, 'addressId')
    declare address?: Address;

    @Expose({ groups: ['all', 'admin', 'organizer'] })
    @Column
    declare url: string;

    @Expose({ groups: ['all', 'admin', 'organizer'] })
    @Default(false)
    @Column
    declare membersOnly: boolean;

    @Expose({ groups: ['admin', 'organizer'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['admin', 'organizer'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @Expose({ groups: ['admin', 'organizer'] })
    @Type(() => User)
    @BelongsTo(() => User)
    declare createdBy: User;

    @Expose({ groups: ['admin', 'organizer'] })
    @Type(() => User)
    @BelongsTo(() => User)
    declare updatedBy: User;

    @Expose({ groups: ['admin', 'all', 'organizer'] })
    get image64(): NonAttribute<string | null> {
        if (this.image) {
            return getFileToBase64(this.image);
        }
        return null;
    }

    @BeforeCreate
    static async generateSlug(instance: Session) {
        const baseSlug = slugify(instance.title, { lower: true, strict: true });
        let slug = baseSlug;

        let sessionWithSlug = await Session.findOne({ where: { slug } });
        let counter = 1;

        while (sessionWithSlug) {
            slug = `${baseSlug}-${counter}`;
            sessionWithSlug = await Session.findOne({ where: { slug } });
            counter++;
        }

        instance.slug = slug;
    }
}

export { Session, ISession, SessionStatus };
