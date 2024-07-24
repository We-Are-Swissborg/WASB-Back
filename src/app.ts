import express, { Application } from 'express';
import { createServer } from 'node:http';
import { apiRouter } from './routes/useRoutes';
import cors from 'cors';
import { sequelize, testConnection } from './db/sequelizeConfig';
import { logger } from './middlewares/logger.middleware';
import initDb from './dev/init-db';
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

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

testConnection();
if (process.env.NODE_ENV === 'DEV') {
    initDb();
} else {
    sequelize.sync({ alter: true });
}

//Routes
app.use('/api', apiRouter);

server.listen(PORT, () => {
    logger.info(`Listen on port ${PORT}`);
});

/******
 * Use only for WebSocket
 ******/
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"]
//   }
// });

// io.on("connection", (socket) => {
//   console.log(`connect ${socket.id}`);

//   if (socket.recovered) {
//     console.log("recovered!");
//     console.log("socket.rooms:", socket.rooms);
//     console.log("socket.data:", socket.data);
//   } else {
//     console.log("new connection");
//     socket.join("sample room");
//     socket.data.foo = "bar";
//   }

//   socket.on("roucoule", (cb) => {
//     console.log("ping...");
//     cb();
//   });

//   socket.on("disconnect", (reason) => {
//     console.log(`disconnect ${socket.id} due to ${reason}`);
//   });
// });
