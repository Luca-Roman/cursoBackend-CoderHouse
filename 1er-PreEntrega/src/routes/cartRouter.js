import {Router} from "express"
import{CartManager} from "../dao/cartManager.js"

export const cartRouter = Router()

CartManager.path ="./src/data/carts.json"

cartRouter.get("/", async (req, res)=>{
    let carts
    try {
        carts = await CartManager.getCarts()
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
    console.log(carts)
    let {limit,skip} = req.query
    if (limit) {
        limit = Number(limit)
        if (isNaN(limit)) {
            return res.status(400).json({ error: `El argumento limit tiene que ser numerico` })
        }
    } else {
        limit = carts.length
    }

    if (skip) {
        skip = Number(skip)
        if (isNaN(skip)) {
            return res.status(400).json({ error: `El argumento skip tiene que ser numerico` })
        }
    } else {
        skip = 0
    } 

    let resultado = carts.slice(skip, skip + limit)
    return res.status(200).json({resultado});
})

cartRouter.get("/:cid", async (req, res)=>{
    try {    
        let { cid } = req.params
        cid = Number(cid)
        if (isNaN(cid)) {
            return res.status(400).json({ error: `id debe ser numerico` })
        }

        let cart = await CartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        return res.status(200).json({products: cart.products});
    } catch (error) {
        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
        })
    }
})

cartRouter.post("/", async(req, res) => {
    try {
        let newCart = await CartManager.addCart()
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(`Carro creado correctamente con ID ${newCart.id}`)
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

cartRouter.post("/:cid/product/:pid", async(req, res) => {
    try {
        let { cid, pid } = req.params
        cid = Number(cid)
        pid = Number(pid)
        if (isNaN(cid) | isNaN(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ambos id deben ser numerico` })
        }
        let cartUpdated = await CartManager.addProduct(cid, pid)
        return res.status(200).json({cartUpdated});
    }catch (error) {
        console.log("Console error:", error)
        if (error.message.includes('id')) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
        })
    }
})