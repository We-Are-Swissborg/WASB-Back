import path, { dirname } from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const seqConnection = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + `/database.sqlite`,
});

try {
    await seqConnection.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
export default seqConnection
