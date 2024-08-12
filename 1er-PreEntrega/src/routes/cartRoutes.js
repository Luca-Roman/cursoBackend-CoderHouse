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
        res.setHeader('Content-Type', 'application/json');
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
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El argumento limit tiene que ser numerico` })
        }
    } else {
        limit = carts.length
    }

    if (skip) {
        skip = Number(skip)
        if (isNaN(skip)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El argumento skip tiene que ser numerico` })
        }
    } else {
        skip = 0
    } 

    let resultado = carts.slice(skip, skip + limit)
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({resultado});
})

cartRouter.get("/:id", async (req, res)=>{
    let { id } = req.params
    id = Number(id)
    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `id debe ser numerico` })
    }
    
    let products
    try {
        products = await CartManager.getProducts()
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
    let product = products.find(p => p.id === id)
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Producto con id ${id} not found` })
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({product});
})

cartRouter.post("/", async(req, res) => {
    let products = req.body.products
    console.log("Productos en el carrito ", products)

    try {
        if (products.length < 1) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El carrito debe contener al menos un producto` })
        }
    } catch (error) {
        
    }
    // Agregamos el nuevo producto verificando que no haya un codigo repetido
    try {
        let newCart = await CartManager.addCart(products)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(`Carro generado correctamente con ID ${newCart.id}`)
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

cartRouter.put("/:pid", async(req, res)=>{
    let id = req.params.pid
    id = Number(id)
    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `id debe ser numerico` })
    }

    let products
    try {
        products = await CartManager.getProducts()
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }

    let product = products.find(p => p.id === id)
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Producto con id ${id} not found` })
    }

    let productToUpdate = req.body
    delete productToUpdate.id

    if (productToUpdate.code) {
        let exist = products.find(p => p.code === productToUpdate.code && p.id !== id)
        if (exist) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya hay otro producto con codigo ${productToUpdate.code}`})
        }
    }

    try {
        let productUpdated = await CartManager.updateProduct(id, productToUpdate)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productUpdated });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

cartRouter.delete("/:pid", async(req, res)=> {
    let id = req.params.pid
    id = Number(id)
    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `id debe ser numerico` })
    }

    let products
    try {
        products = await CartManager.getProducts()
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }

    let product = products.find(p => p.id === id)
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Producto con id ${id} not found` })
    }

    try {
        let resultado = await CartManager.deleteProduct(id)
        if (resultado > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Producto eliminado" });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error al eliminar` })
        }
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})