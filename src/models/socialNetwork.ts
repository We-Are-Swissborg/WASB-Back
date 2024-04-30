import { sequelize } from '../db/sequelizeConfig';
import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { User } from './user';

class SocialNetwork extends Model<InferAttributes<SocialNetwork>, InferCreationAttributes<SocialNetwork>> {
  declare userId: ForeignKey<User['id']>;
  declare twitter: string | null;
  declare discord: string | null;
  declare tiktok: string | null;
  declare telegram: string | null;
  declare createdAt: Date | null;
  declare updatedAt: Date | null;
}

SocialNetwork.init({
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  // technically, `createdAt` & `updatedAt` are added by Sequelize and don't need to be configured in Model.init
  // but the typings of Model.init do not know this. Add the following to mute the typing error:
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'socialNetwork'
});

SocialNetwork.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(SocialNetwork, { foreignKey: 'userId' });

export { SocialNetwork };
