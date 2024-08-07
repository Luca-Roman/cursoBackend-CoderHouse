const fs=require("fs")
class ProductManager{

    productManager(path) {
        this.path = path
    }
    
    async getProducts(){
        if(fs.existsSync(this.path)){
            let products=JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"}))
            return products 
        }else{
            return []
        }
    }

    async existe(code) {
        if(fs.existsSync(this.path)){
            let products = await this.getProducts()
            return products.find(id=>products.code===code)
        }
        else {
            return []
        }
    }

    // async addProduct( title, description, price, thumbnail, code, stock){
    //     // if(typeof title!=="string" || typeof description!=="string" || typeof thumbnail!=="string" || typeof price!=="number" || typeof code!=="number" || typeof stock!=="number"){
    //     //     console.log(`Argumentos en formato invalido...!!!`)
    //     //     return 
    //     // }
    
    //     // if(!title.trim() || !description.trim() || !price.trim() || !thumbnail.trim()|| !code.trim()|| !stock.trim()){
    //     //     console.log(`Complete los datos`)
    //     //     return 
    //     // }
    
    //     let existe= await this.existe(code)
    //     if(existe){
    //         console.log(`Ya existe el producto con codigo ${code}`)
    //         return 
    //     }
    
        
    //     let id=1
    //     let products = this.getProducts()
    //     if(products.length>0){
    //         id=Math.max(...products.map(p=>p.id))+1  //[{id:1, nombre:"Juan"}]
    //     }
    
    //     let nuevoProducto={
    //         id,
    //         title,
    //         description,
    //         price,
    //         thumbnail,
    //         code,
    //         stock
    //     }
    //     products.push(nuevoProducto)
    //     await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
    //     console.log(`Producto ${title} generado con id ${id}`)
    // }

    async addProduct(product){
        // if(typeof title!=="string" || typeof description!=="string" || typeof thumbnail!=="string" || typeof price!=="number" || typeof code!=="number" || typeof stock!=="number"){
        //     console.log(`Argumentos en formato invalido...!!!`)
        //     return 
        // }
    
        // if(!title.trim() || !description.trim() || !price.trim() || !thumbnail.trim()|| !code.trim()|| !stock.trim()){
        //     console.log(`Complete los datos`)
        //     return 
        // }
    
        let existe= await this.existe(product.code)
        if(existe){
            console.log(`Ya existe el producto con codigo ${code}`)
            return 
        }
    
        
        let id=1
        let products = this.getProducts()
        if(products.length>0){
            id=Math.max(...products.map(p=>p.id))+1  //[{id:1, nombre:"Juan"}]
        }
        product.id=id
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        console.log(`Producto ${title} generado con id ${id}`)
    }
}

module.exports=ProductManager