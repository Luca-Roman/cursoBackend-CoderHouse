import { Router } from 'express';
import{ProductManager} from "../dao/productManager.js"
import{CartManager} from "../dao/cartManager.js"


export const router=Router()

router.get('/',async(req,res)=>{
    let products
    try {
        products = await ProductManager.getProducts()
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
    console.log(products)
    let {limit,skip} = req.query
    if (limit) {
        limit = Number(limit)
        if (isNaN(limit)) {
            return res.status(400).json({ error: `El argumento limit tiene que ser numerico` })
        }
    } else {
        limit = products.length
    }

    if (skip) {
        skip = Number(skip)
        if (isNaN(skip)) {
            return res.status(400).json({ error: `El argumento skip tiene que ser numerico` })
        }
    } else {
        skip = 0
    } 

    let resultado = products.slice(skip, skip + limit)
    //return res.status(200).json({resultado});
    res.status(200).render("home", {resultado});
})

router.get('/realtimeproducts',async(req,res)=>{
    res.status(200).render("realTimeProducts");
})