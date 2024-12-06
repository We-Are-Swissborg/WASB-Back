import { setupDatabase, sequelize } from '../src/models/sequelizeTestSetup';

beforeAll(async () => {
    await setupDatabase(); // Initialise la base de données en mémoire
});

afterAll(async () => {
    await sequelize.close(); // Ferme la connexion Sequelize après tous les tests
});

afterEach(async () => {
    await sequelize.truncate({ cascade: true }); // Nettoie les données entre chaque test
});
