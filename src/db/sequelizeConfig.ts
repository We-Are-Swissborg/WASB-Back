import { Sequelize } from "sequelize-typescript";
import { logger } from "../middlewares/logger.middleware";

const sequelize: Sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + `/database.sqlite`,
  models: [`${process.cwd()}${process.env.FOLDER_MODELS}`],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  },
});

const testConnection = async () => {
  try {
      await sequelize.authenticate();
      logger.debug('Connection has been established successfully.');
  } catch (error) {
      logger.error('Unable to connect to the database:', error);
  }
}

export { sequelize, testConnection };
