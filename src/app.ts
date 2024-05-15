import express, {Application} from "express";
import { createServer  } from "node:http";
// import { Server } from "socket.io";
import { User } from "./models/user.model";
import { router }  from "./routes/useRoutes";
import cors from "cors";
import { sequelize, testConnection } from "./db/sequelizeConfig";
import { SocialNetwork } from "./models/socialnetwork.model";
require('@dotenvx/dotenvx').config()

const PORT = process.env.PORT || 3000;
const app: Application = express();
const server = createServer(app);
const corsDomains = process.env.CORS_ORIGIN?.split(',');
const corsOptions = {
  origin: corsDomains,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600
}

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))


const initDb = () => {
  return sequelize.sync({force:true}).then(
      async (_) => {
          const jane = new User({
            firstName: "Jane",
            lastName: "Doe",
            pseudo:"Pseudo",
            email: "mail@test.dev",
            walletAddress: "5F1JU",
            certified: true
            });
          await jane.save();
          console.log(`jane id with : ${jane.id}`);

          const socialNetwork = new SocialNetwork({
            discord: 'WASB 1',
            userId: jane.id
          });
          await socialNetwork.save();
         console.log(`La base de données a bien été synchronisée.`);
      }
  );
}

testConnection();

if(process.env.NODE_ENV === "DEV")
{
  initDb();
}

//Routes
app.use("/api", router);

server.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
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