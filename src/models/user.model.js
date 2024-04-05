import { Sequelize, DataTypes, Model } from 'sequelize';
import seqConnection from '../db/sequelizeConfig.js';

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
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
    type: DataTypes.DATE
  }
}, {
  sequelize: seqConnection,
  modelName: 'User'
});

export { User };