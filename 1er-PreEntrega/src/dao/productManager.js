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

    static async getProductById(id){
        let products = await this.getProducts()
        let product = products.find(p => p.id === id)
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        } else {
            return product
        }
    }

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
        let cantidad0=products.length
        products=products.filter(p=>p.id!==id)   
        let cantidad1=products.length
       
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))

        return cantidad0-cantidad1
    }
}