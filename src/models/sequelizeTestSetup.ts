import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    models: [`${__dirname}/*.model.*`],
    modelMatch: (filename: string, member: string) => {
        return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
});

export async function setupDatabase() {
    await sequelize.sync({ force: true });
}
