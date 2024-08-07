class productManager {

    constructor() {
        this.id = 0;
        this.prodcutos = [];
    };

    addProducto (title, description, price, thumbnail, code, stock) {
        if (this.prodcutos.find(producto => producto.code === code)) {
            console.log("El codigo ya se encuentra cargado")
        }
        else {
            this.id++
            this.prodcutos.push({
                id : this.id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            })
        }
    }

    getProducts = ()=> this.prodcutos;

    getProductsById (id) {
        if (!this.prodcutos.find(producto => producto.id === id)) {
            return "Not found"
        }
        else {
            return this.prodcutos.find(producto => producto.id === id)
        }
    }
}


const manejador = new productManager;

manejador.addProducto("Primero", "Soy el primero", 700, "Nose", 56987, 10)
manejador.addProducto("Segundo", "Soy el segundo", 700, "Nose", 56981, 10)
manejador.addProducto("Tercero", "Soy el tercero", 700, "Nose", 56982, 10)
manejador.addProducto("Cuarto", "Soy el cuarto", 700, "Nose", 56980, 10)
manejador.addProducto("Repetido", "Soy el primero", 700, "Nose", 56987, 10)
manejador.addProducto("Quinto", "Soy el quinto", 700, "Nose", 56986, 10)

console.log(manejador.getProducts());
console.log(manejador.getProductsById(75));
console.log(manejador.getProductsById(3));