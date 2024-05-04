import { Sequelize } from "sequelize-typescript";

const sequelize: Sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + `/database.sqlite`,
  models: [`${process.cwd()}/src/models/**/*.model.ts`],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  },
});

const testConnection = async () => {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
}

export { sequelize, testConnection };
