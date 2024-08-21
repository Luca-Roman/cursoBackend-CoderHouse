import fs from "fs"
import { ProductManager } from "./productManager.js"

export class CartManager{

    static path
    
    static async getCarts(){
        if(fs.existsSync(this.path)){
            let carts=JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"}))
            return carts 
        }else{
            return []
        }
    }

    static async getCartById(id){
        let carts = await this.getCarts()
        let cart = carts.find(c => c.id === id)
        if (!cart) {
            throw new Error (`Cart with id ${id} not found`)
        } else {
            return cart
        }
    }

    static async addCart(){     
        let carts = await this.getCarts()
        let id=1
        if(carts.length>0){
            id=Math.max(...carts.map(p=>p.id))+1
        }
        let newCart = {
            id,
            products : []
        }
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        return newCart
    }

    static async addProduct(cid, pid){
        try {
            let carts = await this.getCarts()
            let cartIndex = carts.findIndex(c => c.id === cid)
            if (cartIndex < 0) {
                throw new Error(`Cart with id: ${cid} not found`);
            }
            else {
                let products = await ProductManager.getProductById(pid)
                let productIndex = carts[cartIndex].products.findIndex(p => p.pid === pid)
                if (productIndex >= 0) {
                    carts[cartIndex].products[productIndex].quantity++
                } else {
                    let product = {
                        pid,
                        quantity : 1
                    }
                    carts[cartIndex].products.push(product)
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
                return carts[cartIndex]
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}
