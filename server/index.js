const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 5001;

app.use(bodyParser.json());

app.use(cors());

// Sample data for products
let products = [
    { id: 1, name: "Product 1", price: 10.0, description: "Description of Product 1" },
    { id: 2, name: "Product 2", price: 20.0, description: "Description of Product 2" },
    { id: 3, name: "Product 3", price: 30.0, description: "Description of Product 3" }
];

// Route for getting all products
app.get('/products', (req, res) => {
    res.json(products);
});

// Route for getting a single product by ID
app.get('/products/:product_id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.product_id));
    if (!product) {
        res.status(404).json({ message: "Product not found" });
    } else {
        res.json(product);
    }
});

// Route for creating a new product
app.post('/products', (req, res) => {
    const data = req.body;
    const newProduct = {
        id: products.length + 1,
        name: data.name,
        price: data.price || 0,
        description: data.description
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Route for updating a product
app.put('/products/:product_id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.product_id));
    if (!product) {
        res.status(404).json({ message: "Product not found" });
    } else {
        Object.assign(product, req.body);
        res.json(product);
    }
});

// Route for deleting a product
app.delete('/products/:product_id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.product_id));
    res.json({ message: "Product deleted" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
