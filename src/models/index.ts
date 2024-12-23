import fg from 'fast-glob';
import path from 'path';

const modelFiles = fg.sync(path.join(__dirname, '*.model.{ts,js}'));

// Charger dynamiquement les modèles
const models = modelFiles.map(file => {
    return require(file).default || require(file); 
});

// Exporter tous les modèles
export default models;