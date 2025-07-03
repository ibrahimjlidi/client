import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const PublicProductList = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    const handleAddToCart = (product) => {
        const qty = quantities[product._id] ? parseInt(quantities[product._id], 10) : 1;
        addToCart(product, qty);
    };

    const handleQuantityChange = (productId, value) => {
        setQuantities(q => ({ ...q, [productId]: value }));
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-5 text-center">Nos Produits</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {product.image && (
                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                            <p className="text-gray-700 mb-4">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">{product.price} €</span>
                                <span className="text-sm font-semibold text-gray-600">En stock: {product.quantity}</span>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-gray-500">Fournisseur: {product.supplier?.name}</span>
                            </div>
                            <div className="mt-4 flex gap-2 items-center">
                                <input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantities[product._id] || 1}
                                    onChange={e => handleQuantityChange(product._id, e.target.value)}
                                    className="w-16 p-1 border rounded"
                                />
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={product.quantity === 0}
                                >
                                    Ajouter au Panier
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicProductList; 