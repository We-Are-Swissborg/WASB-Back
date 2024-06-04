import { Expose, Type } from 'class-transformer';
import {
    AllowNull,
    AutoIncrement,
    Column,
    CreatedAt,
    HasOne,
    IsDate,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt,
    IsEmail,
    Is
} from 'sequelize-typescript';
import { SocialNetwork } from './socialnetwork.model';

const NAME_REGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
const PSEUDO_REGEX = /^[a-z0-9._]{2,32}$/;

interface IUser {
    id: number;
    firstName: string | null;
    lastName: string | null;
    pseudo: string;
    email: string;
    walletAddress: string;
    certified: boolean;
    lastLogin: Date | null;
    country: string | null;
    city: string | null;
    referral: string | null;
    aboutUs: string | null;
    confidentiality: boolean;
    beContacted: boolean;
}

@Table
class User extends Model implements IUser {
    @Expose({ groups: ['user', 'register', 'profil'] })
    @AllowNull(false)
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Is(NAME_REGEX)
    @Column
    declare firstName: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare lastName: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @AllowNull(false)
    @Unique(true)
    @Is(PSEUDO_REGEX)
    @Column
    declare pseudo: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @AllowNull(false)
    @Unique(true)
    @IsEmail
    @Column
    declare email: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @AllowNull(false)
    @Unique(true)
    @Column
    declare walletAddress: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare certified: boolean;

    @Expose({ groups: ['user'] })
    @IsDate
    @Column
    declare lastLogin: Date;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare country: string;
    
    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare city: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare referral: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare aboutUs: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare confidentiality: boolean;

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare beContacted: boolean;

    @Expose({ groups: ['user'] })
    @CreatedAt
    @IsDate
    @Column
    declare createdAt: Date;

    @Expose({ groups: ['user'] })
    @UpdatedAt
    @IsDate
    @Column
    declare updatedAt: Date;

    @Type(() => SocialNetwork)
    @Expose({ groups: ['user', 'register', 'profil'] })
    @HasOne(() => SocialNetwork)
    declare socialNetwork: SocialNetwork | null;

    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    // @Expose({ groups: ['user', 'profil'] })
    // get fullName(): NonAttribute<string> {
    //   return `${this.lastName} ${this.firstName}`;
    // }
}

export { User, IUser };