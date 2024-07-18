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
    Is,
    BeforeCreate,
    AfterSave,
} from 'sequelize-typescript';
import { SocialNetwork } from './socialnetwork.model';
import { NonAttribute } from 'sequelize';
import Role from '../types/Role';
import { getUserByPseudo, updateUser } from '../services/user.services';

const NAME_REGEX =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
const PSEUDO_REGEX = /^[a-zA-Z0-9._]{2,32}$/;

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
    nonce: string | null;
    expiresIn: Date | null;
    roles: string | null;
    userReferred: string | null;
}

@Table
class User extends Model implements IUser {
    @Expose({ groups: ['user', 'register', 'profil'] })
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
    @Unique(true)
    @Is(PSEUDO_REGEX)
    @Column
    declare pseudo: string;

    @Expose({ groups: ['user', 'profil', 'admin'] })
    @Column
    declare roles: string;

    @Expose({ groups: ['user', 'register', 'profil'] })
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

    @Expose({ groups: ['auth'] })
    @Column
    declare nonce: string;

    @IsDate
    @Column
    declare expiresIn: Date;

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

    @Expose({ groups: ['user', 'register', 'profil'] })
    @Column
    declare userReferred: string;

    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    @Expose({ groups: ['user', 'profil'] })
    get fullName(): NonAttribute<string> {
        return `${this.lastName} ${this.firstName}`;
    }

    @BeforeCreate
    static async addDefaultValue(instance: User) {
        instance.userReferred = JSON.stringify([]);

        if (instance.roles === undefined) instance.roles = JSON.stringify([Role.User]);
        else {
            const currentRoles: string[] = JSON.parse(instance.roles);
            if (!currentRoles.includes(Role.User)) {
                currentRoles.splice(0, 0, Role.User);
            }
            instance.roles = JSON.stringify(currentRoles);
        }

        if(instance.referral) {
            const referent = await getUserByPseudo(instance.referral);
            if (!referent) throw new Error("This referent don't exist");
        }
    }

    addRoles(roles: Role[]): User {
        if (!this.roles) this.roles = JSON.stringify(roles);
        else {
            const currentRoles: string[] = JSON.parse(this.roles);
            roles.forEach((r) => {
                if (!currentRoles.includes(r)) currentRoles.push(r);
            });
            this.roles = JSON.stringify(currentRoles);
        }

        return this;
    }

    removeRoles(roles: Role[]): User {
        if (this.roles.length > 0) {
            const currentRoles: string[] = JSON.parse(this.roles);
            roles.forEach((r) => {
                // Never remove user roles
                if (r === Role.User) {
                    return;
                }

                if (currentRoles.includes(r)) currentRoles.splice(currentRoles.indexOf(r), 1);
            });
            this.roles = JSON.stringify(currentRoles);
        }

        return this;
    }

    @AfterSave
    static async addReferralAfterRegister(instance: User) {
        if(instance.referral) {
            const referent = await getUserByPseudo(instance.referral);
            const arrayReferred = JSON.parse(referent?.userReferred || '');
            const checkUserReferred = arrayReferred.find((referred: number) => referred === instance.id);

            if (!referent) throw new Error("Error add referent after register");
            if(!checkUserReferred) await updateUser(referent, instance, 'userReferred');
        }
    }
}

export { User, IUser };
