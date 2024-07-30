//import express from express;
const express=require("express");
const PORT=3000

const app=express()

app.get("/", (req, res)=>{
    res.send("Home Page Express Server");
})

app.listen(PORT, ()=>console.log(`Server online en puerto ${PORT}`))
