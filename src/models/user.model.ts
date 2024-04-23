import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import seqConnection from '../db/sequelizeConfig.ts';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string | null;
  declare lastName: string | null;
  declare pseudo: string;
  declare email: string;
  declare walletAdress: string;
  declare certified: boolean;
  declare lastLogin: Date | null;
  declare country: string | null;
  declare referral: string | null;
  declare twitter: string | null;
  declare discord: string | null;
  declare tiktok: string | null;
  declare telegram: string | null;

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
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
}, {
  sequelize: seqConnection,
  modelName: 'User'
});

export { User };