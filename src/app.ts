import express, { Application } from 'express';
import { createServer } from 'node:http';
import { apiRouter } from './routes/useRoutes';
import cors from 'cors';
import { logger } from './middlewares/logger.middleware';
import sequelize from './models';
import helmet from 'helmet';

/* eslint-disable */
require('@dotenvx/dotenvx').config();
/* eslint-enable */

logger.info(`Start application`);

const PORT = process.env.PORT || 3000;
const app: Application = express();
const server = createServer(app);
const corsDomains = process.env.CORS_ORIGIN?.split(',');
const corsOptions = {
    origin: corsDomains,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 3600,
};

sequelize.authenticate().catch(() => logger.error(`Authentication error`));

// Body parsing Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//Routes
app.use('/api', apiRouter);

server.listen(PORT, () => {
    logger.info(`Listen on port ${PORT}`);
});

