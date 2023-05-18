let products = [
  {
    id: 1,
    name: "baju muslim",
    price: 1000,
    color: "white",
    size: "m",
    stock: 5,
    rating: 5,
    description: "ini adalah baju muslim pria",
    id_category: 1,
    id_seller: 1
  },
  {
    id: 2,
    name: "sepatu nike",
    price: 2000,
    color: "blue",
    size: 35,
    stock: 6,
    rating: 4,
    description: "ini adalah sepatu nike",
    id_category: 2,
    id_seller: 2
  },
  {
    id: 3,
    name: "t-shirt",
    price: 3000,
    color: "white",
    size: "l",
    stock: 7,
    rating: 3,
    description: "ini adalah t-shirt",
    id_category: 3,
    id_seller: 3
  },
];

let productController = {
  getAllProduct: (req, res) => {
    res.send(products);
  },
  getDetailProduct: (req, res) => {
    const id = Number(req.params.id);
    let product = products.find((product) => product.id === id);
    res.send(product);
  },
  createProduct: (req, res) => {
    const { name, price, color, size, stock, rating, description } = req.body;
    const newProduct = {
      id: products.length + 1,
      name,
      price,
      color,
      size,
      stock,
      rating,
      description
    };
    products.push(newProduct);
    res.json({ message: "product created" });
  },
  updateProduct: (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex((product) => product.id === id);
    const { name, price, color, size, stock, rating, description } = req.body;
    const updateProduct = {
      id: products[index].id,
      name,
      price,
      color,
      size,
      stock,
      rating,
      description
    };
    products[index] = updateProduct;
    res.json({ message: "product updated" });
  },
  deleteProduct: (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex((product) => product.id === id);
    products.splice(index, 1);
    res.json({ message: "product deleted" });
  },
};

module.exports = productController;