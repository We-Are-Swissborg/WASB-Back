import { Sequelize } from 'sequelize';

const sequelize: Sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + `/database.sqlite`,
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
