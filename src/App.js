import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './App.css'

function App() {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch('http://localhost:5001/products')
            .then(response => response.json())
            .then(products => {
                setProducts(products);
            });
    }

    const addProduct = (event) => {
        event.preventDefault();
        fetch('http://localhost:5001/products', {
            method: 'POST',
            body: JSON.stringify({
                name: productName,
                price: parseFloat(productPrice),
                description: productDescription
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(newProduct => {
            fetchProducts();
            setProductName('');
            setProductPrice('');
            setProductDescription('');
        });
    }

    const deleteProduct = (productId) => {
      fetch(`http://localhost:5001/products/${productId}`, {
          method: 'DELETE'
      })
      .then(response => {
          if (response.ok) {
             // Remove the deleted product from the products list
            setProducts(products.filter(product => product.id !== productId));
            // Remove the deleted product from the selected products list
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
          }
      });
  }

    const handleProductSelection = (productId) => {
        const index = selectedProducts.indexOf(productId);
        if (index === -1) {
            setSelectedProducts([...selectedProducts, productId]);
        } else {
            const updatedSelectedProducts = [...selectedProducts];
            updatedSelectedProducts.splice(index, 1);
            setSelectedProducts(updatedSelectedProducts);
        }
    }

    useEffect(() => {
        // Calculate total cost based on selected products
        const total = selectedProducts.reduce((acc, productId) => {
            const product = products.find(p => p.id === productId);
            if(typeof product.price == "NaN"){
              product.price=0
            }
            return acc + product.price;
        }, 0);
        setTotalCost(total);
    }, [selectedProducts, products]);

    const handleLogout = () => {
        // Remove the isLoggedIn cookie
        Cookies.remove('isLoggedIn');
        // Redirect to the login page
        window.location.href = '/';
    };

    return (
        <>
            {isLoggedIn ?
                <div className="container">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                    <h1>Product Management</h1>

                    {/* Form to add a new product */}
                    <h2>Add New Product</h2>
                    <form className="form" onSubmit={addProduct}>
                        <label htmlFor="productName">Product Name:</label><br />
                        <input type="text" id="productName" name="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required /><br />
                        <label htmlFor="productPrice">Price:</label><br />
                        <input type="number" id="productPrice" name="productPrice" value={productPrice} min="0" step="0.01" onChange={(e) => setProductPrice(e.target.value)} required /><br />
                        <label htmlFor="productDescription">Description:</label><br />
                        <textarea id="productDescription" name="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required /><br />
                        <button type="submit">Add Product</button>
                    </form>

                    {/* Product List */}
                    <h2>Product List</h2>
                    <ul className="product-list">
                        {products.map(product => (
                            <li key={product.id}>
                                <input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => handleProductSelection(product.id)} />
                                <strong>{product.name}</strong>: ${product.price} - {product.description}
                                <button onClick={() => deleteProduct(product.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>

                    {/* Total cost */}
                    <div>
                        <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
                    </div>
                </div> : <div>Not logged In Yet</div>}
        </>
    );
}

export default App;
