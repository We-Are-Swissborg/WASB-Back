import { sequelize } from './../db/sequelizeConfig';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { Exclude, Expose } from 'class-transformer';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare id: CreationOptional<number>;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare firstName: string | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare lastName: string | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare pseudo: string;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare email: string;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare walletAdress: string;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare certified: boolean;
  @Expose({ groups: ['user', 'profil'] })
  declare lastLogin: Date | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare country: string | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare referral: string | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare twitter: string | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare discord: string | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare tiktok: string | null;
  @Expose({ groups: ['user', 'register', 'profil'] })
  declare telegram: string | null;
  @Expose({ groups: ['user', 'profil'] })
  declare createdAt: Date | null;
  @Expose({ groups: ['user', 'profil'] })
  declare updatedAt: Date | null;

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  @Expose({ name: 'fullName', groups: ['user', 'profil'] })
  get fullName(): NonAttribute<string> {
    return `${this.lastName} ${this.firstName}`;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  pseudo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  walletAdress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  certified: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
  country: {
    type: DataTypes.STRING,
  },
  referral: {
    type: DataTypes.STRING,
  },
  twitter: {
    type: DataTypes.STRING,
  },
  discord: {
    type: DataTypes.STRING,
  },
  tiktok: {
    type: DataTypes.STRING,
  },
  telegram: {
    type: DataTypes.STRING,
  },
  // technically, `createdAt` & `updatedAt` are added by Sequelize and don't need to be configured in Model.init
  // but the typings of Model.init do not know this. Add the following to mute the typing error:
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'User'
});

export { User };
