//import express from "express";
const express=require("express");
const ProductManager=require("./dao/productManager");

const PORT=3000

const app=express()

const manager = new ProductManager("./data/products.json")

app.get("/", (req, res)=>{
    res.send("Home Page Express Server");
})

app.get("/verProductos", async (req, res)=>{
    let products = await manager.getProducts()
    console.log(products)
    res.send(products);
})

app.get("/products", async (req, res)=>{
    let products = await manager.getProducts()
    console.log(products)
    res.send(products);
})

app.listen(PORT, ()=>console.log(`Server online en puerto ${PORT}`))
