import fs from "fs"

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

    static async addCart(products=[]){     
        let carts = await this.getCarts()
        let id=1
        if(carts.length>0){
            id=Math.max(...carts.map(p=>p.id))+1
        }
        let newCart = {
            id,
            products
        }
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        return newCart
    }

    static async updateProduct(id, productModified) {
        let products = await this.getProducts()
        let productIndex = products.findIndex(p => p.id === id)
        products[productIndex]={
            ...products[productIndex],
            ...productModified,
            id
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return products[productIndex]
    }

    static async deleteProduct(id) {
        let products = await this.getProducts()
        let productIndex = products.findIndex(p =>p.id ===id)
        let cantidad0=products.length
        products=products.filter(p=>p.id!==id)   
        let cantidad1=products.length
       
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))

        return cantidad0-cantidad1
    }
}