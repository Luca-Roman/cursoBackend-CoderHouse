import express from "express";
import { productRouter } from "./src/routes/productRoutes.js";
import { cartRouter } from "./src/routes/cartRoutes.js";
//const express=require("express");
//const ProductManager=require("./dao/productManager");

const PORT=8080
const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products",productRouter)
app.use("/api/carts",cartRouter)

app.use("/", (req, res)=> {
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('Home Page');
})




app.listen(PORT, ()=>console.log(`Server online en puerto ${PORT}`))
