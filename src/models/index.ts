import process from 'process';
import { logger } from '../middlewares/logger.middleware';
import { Sequelize } from 'sequelize-typescript';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../config/config.json')[env];

const sequelize = new Sequelize({
  ...config, 
  models: [`${__dirname}/*.model.*`],
  modelMatch: (filename: string, member: string) => {
      return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  },
  logging: (...msg) => logger.debug(msg),
});

export default sequelize;