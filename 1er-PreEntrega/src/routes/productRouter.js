import {Router} from "express"
import{ProductManager} from "../dao/productManager.js"

export const router = Router()

ProductManager.path ="./src/data/products.json"

router.get("/", async (req, res)=>{
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
    return res.status(200).json({resultado});
})

router.get("/:pid", async (req, res)=>{
    let { pid } = req.params
    pid = Number(pid)
    if (isNaN(pid)) {
        return res.status(400).json({ error: `id debe ser numerico` })
    }
    
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
    let product = products.find(p => p.id === pid)
    if (!product) {
        return res.status(400).json({ error: `Producto con id ${pid} not found` })
    }
    return res.status(200).json({product});
})

router.post("/", async(req, res) => {
    let product = req.body
    //VALIDACIONES
    try {

        if (!product.title) {
            return res.status(400).json({ error: `Falta el titulo del producto` })
        }
        else {
            if (typeof product.title !== "string") {
                console.log("hola paola")
                return res.status(400).json({ error: `El titulo debe estar en formato texto` })
            }
        }
    
        if (!product.description) {
            return res.status(400).json({ error: `Falta la descripcion del producto` })
        }
        else {
            if (typeof product.description !== "string") {
                return res.status(400).json({ error: `La descripcion debe estar en formato texto` })
            }
        }
        if (!product.code) {
            return res.status(400).json({ error: `Falta el codigo del producto` })
        }
        else {
            if (typeof product.code!== "string") {
                return res.status(400).json({ error: `El codigo debe estar en formato texto` })
            }
        }
        if (!product.price) {
            return res.status(400).json({ error: `Falta el precio del producto` })
        }
        else {
            if (typeof product.price !== "number") {
                return res.status(400).json({ error: `El precio debe estar en formato numerico` })
            }
        }
        if (!product.stock) {
            return res.status(400).json({ error: `Falta el stock del producto` })
        }
        else {
            if (typeof product.stock !== "number") {
                return res.status(400).json({ error: `El stock debe estar en formato numerico` })
            }
        }
        if (!product.category) {
            return res.status(400).json({ error: `Falta la categoria del producto` })
        }
        else {
            if (typeof product.category !== "string") {
                return res.status(400).json({ error: `La categoria debe estar en formato texto` })
            }
        }
        product.status = true

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
    // Agregamos el nuevo producto verificando que no haya un codigo repetido
    try {
        let products = await ProductManager.getProducts()

        let existe = products.find(p => p.code.toLowerCase() === product.code)
        if (existe) {
            return res.status(400).json({ error: `Ya existe un producto con codigo ${product.code}`})
        }
        else {
            let newProduct = await ProductManager.addProduct(product)
            return res.status(200).json(`Producto ${newProduct.title} generado con id ${newProduct.id}`)
        }
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

router.put("/:pid", async(req, res)=>{
    try {
        let id = req.params.pid
        id = Number(id)
        if (isNaN(id)) {
            return res.status(400).json({ error: `id debe ser numerico` })
        }
        let product = await ProductManager.getProductById(id)
        let productToUpdate = req.body
        delete productToUpdate.id
        if (productToUpdate.code) {
            let products = await ProductManager.getProducts()
            let exist = products.find(p => p.code === productToUpdate.code && p.id !== id)
            if (exist) {
                return res.status(400).json({ error: `Ya hay otro producto con codigo ${productToUpdate.code}`})
            }
        }
        let productUpdated = await ProductManager.updateProduct(id, productToUpdate)
        return res.status(200).json({ productUpdated });
    }catch (error) {
        console.log("Console error:", error)
        if (error.message.includes('id')) {
            return res.status(404).json({ error: error.message });
        } else {
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }
    }
})

router.delete("/:pid", async(req, res)=> {
    try {
        let id = req.params.pid
        id = Number(id)
        if (isNaN(id)) {
            return res.status(400).json({ error: `id debe ser numerico` })
        }
        let product = await ProductManager.getProductById(id)
        let resultado = await ProductManager.deleteProduct(id)
        if (resultado > 0) {
            return res.status(200).json({ payload: "Producto eliminado" });
        } else {
            return res.status(500).json({ error: `Error al eliminar` })
        }        
    } catch (error) {
        if (error.message.includes('id')) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})