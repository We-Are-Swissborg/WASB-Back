import express from "express";
import { createServer  } from "node:http";
import { Server } from "socket.io";
import seqConnection from "./src/db/sequelizeConfig.js";
import { User } from "./src/models/user.model.js";
import { router }  from "./src/routes/useRoutes.js"

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initDb = () => {
  return seqConnection.sync({force:true}).then(
      async _ => {
          const jane = User.build({
            firstName: "Jane",
            lastName: "Doe",
            pseudo:"Pseudo",
            email: "mail@test.dev",
            walletAdress: "5F1JU",
            certified: true
            });
          await jane.save();
          console.log(`La base de données a bien été synchronisée.`);
      }
  );
}

initDb();

//Routes
app.use("/api", router)

server.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
});


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