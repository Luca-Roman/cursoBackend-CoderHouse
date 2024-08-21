import express from "express";
import {Server} from "socket.io";
import {engine} from "express-handlebars"
import { router as productRouter } from "./src/routes/productRouter.js";
import { router as cartRouter} from "./src/routes/cartRouter.js";
import { router as vistasRouter } from './src/routes/vistasRouter.js';

const PORT=8080
const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"))
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")



app.use("/api/products",productRouter)
app.use("/api/carts",cartRouter)

// app.use("/", (req, res)=> {
//     res.setHeader('Content-Type','text/plain');
//     res.status(200).send('Home Page');
// })

app.use("/", vistasRouter)

const httpServer =app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const socketServer = new Server(httpServer)

// socketServer.on("connection", socket=>{
//     console.log(`Se conecto un cliente con id ${socket.id}`)

//     socket.emit("saludo",`Bienvenido. Soy el server. Identificate...!!!`)

//     socket.on("id", nombre=>{
//         console.log(`El cliente con id ${socket.id} se ha identificado como ${nombre}`)
//         socket.broadcast.emit("nuevoUsuario", nombre)
//     })

// })