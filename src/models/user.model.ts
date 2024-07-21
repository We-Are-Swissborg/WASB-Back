import { Expose, Type } from 'class-transformer';
import {
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
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import { SocialNetwork } from './socialnetwork.model';
import { NonAttribute } from 'sequelize';
import Role from '../types/Role';
import { generateRandomCode } from '../utils/generator';

const NAME_REGEX =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
const PSEUDO_REGEX = /^[a-zA-Z0-9._]{2,32}$/;
const USER_REFERRAL_CODE_LENGTH: string = process.env.USER_REFERRAL_CODE_LENGTH || '5';

interface IUser {
    id: number;
    firstName: string | null;
    lastName: string | null;
    pseudo: string;
    password: string;
    email: string;
    walletAddress: string;
    certified: boolean;
    lastLogin: Date | null;
    country: string | null;
    city: string | null;
    aboutUs: string | null;
    confidentiality: boolean;
    beContacted: boolean;
    nonce: string | null;
    expiresIn: Date | null;
    roles: string | null;
    referralCode: string;
}

@Table
class User extends Model implements IUser {
    @Expose({ groups: ['user', 'profil'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['user', 'profil'] })
    @Is(NAME_REGEX)
    @Column
    declare firstName: string;

    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare lastName: string;

    @Expose({ groups: ['user', 'profil'] })
    @Unique(true)
    @Is(PSEUDO_REGEX)
    @Column
    declare pseudo: string;

    @Expose({ groups: ['user', 'profil', 'admin'] })
    @Column
    declare roles: string;

    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare password: string;

    @Expose({ groups: ['user', 'profil'] })
    @Unique(true)
    @IsEmail
    @Column
    declare email: string;

    @Expose({ groups: ['user', 'profil'] })
    @Unique(true)
    @Column
    declare walletAddress: string;

    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare certified: boolean;

    @Expose({ groups: ['user'] })
    @IsDate
    @Column
    declare lastLogin: Date;

    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare country: string;

    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare city: string;

    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare aboutUs: string;

    @Expose({ groups: ['user', 'profil'] })
    @Column
    declare confidentiality: boolean;

    @Expose({ groups: ['user', 'profil'] })
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
    @Expose({ groups: ['user', 'profil'] })
    @HasOne(() => SocialNetwork)
    declare socialNetwork: SocialNetwork | null;

    @Expose({ groups: ['user', 'profil'] })
    @Unique(true)
    @Column
    declare referralCode: string;

    @ForeignKey(() => User)
    @Column
    declare referringUserId?: number;

    @BelongsTo(() => User, 'referringUserId') //  A user can have a referral.
    declare referringUser?: User;

    @HasMany(() => User, 'referringUserId') // A user can have several godchildren.
    declare referrals: User[];

    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    @Expose({ groups: ['user', 'profil'] })
    get fullName(): NonAttribute<string> {
        return `${this.lastName} ${this.firstName}`;
    }

    @BeforeCreate
    static async addDefaultRoles(instance: User) {
        if (instance.roles === undefined) instance.roles = JSON.stringify([Role.User]);
        else {
            const currentRoles: string[] = JSON.parse(instance.roles);
            if (!currentRoles.includes(Role.User)) {
                currentRoles.splice(0, 0, Role.User);
            }
            instance.roles = JSON.stringify(currentRoles);
        }
    }

    /**
     * Generation of a new unique referral code
     * @param instance new user added
     */
    @BeforeCreate
    static async generateReferalCode(instance: User) {
        if (instance.referralCode === undefined) {
            let unique = false;
            while (!unique) {
                const code = generateRandomCode(Number(USER_REFERRAL_CODE_LENGTH));
                const userExist = await User.count({ where: { referralCode: code } });
                if (userExist == 0) {
                    instance.referralCode = code;
                    unique = !unique;
                }
            }
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
}

export { User, IUser };
