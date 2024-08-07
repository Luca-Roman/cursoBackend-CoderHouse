import fs from "fs"

export class ProductManager{

    static path
    
    static async getProducts(){
        if(fs.existsSync(this.path)){
            let products=JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"}))
            return products 
        }else{
            return []
        }
    }

    // async getProductById(id){
    //     if(fs.existsSync(this.path)){
    //         let products=JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"}))
    //         let productById=products.find(p => p.id === id)
    //         return productById
    //     }else{
    //         return []
    //     }
    // }

    static async addProduct(product={}){     
        let products = await this.getProducts()
        let id=1
        if(products.length>0){
            id=Math.max(...products.map(d=>d.id))+1
        }
        let newProduct = {
            id,
            ...product
        }
        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return newProduct
    }
}