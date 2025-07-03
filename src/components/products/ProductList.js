import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProductForm from './ProductForm';
import EditProductForm from './EditProductForm';
import customFetch from '../../utils/setAuthToken';

const ProductList = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSupplier, setFilterSupplier] = useState('');

    const fetchProducts = () => {
        customFetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
        customFetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
        customFetch('/api/suppliers')
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error(err));
    }, []);

    const handleProductAdded = (newProduct) => {
        fetchProducts(); 
    };

    const handleDelete = (id) => {
        customFetch(`/api/products/${id}`, { method: 'DELETE' })
            .then(() => {
                setProducts(products.filter(p => p._id !== id));
            })
            .catch(err => console.error(err));
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleUpdate = (updatedProduct) => {
        customFetch(`/api/products/${updatedProduct._id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedProduct),
        })
        .then(res => res.json())
        .then(() => {
            fetchProducts();
            setIsEditing(false);
            setCurrentProduct(null);
        })
        .catch(err => console.error(err));
    };

    // Filtering logic
    let filteredProducts = products;
    if (user.role === 'fournisseur') {
        filteredProducts = filteredProducts.filter(p => p.supplier?._id === user.id);
    }
    if (filterCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === filterCategory || p.category?._id === filterCategory);
    }
    if (filterSupplier) {
        filteredProducts = filteredProducts.filter(p => p.supplier === filterSupplier || p.supplier?._id === filterSupplier);
    }

    return (
        <div className="container mx-auto mt-10">
            {(user && (user.role === 'Admin' || user.role === 'admin' || user.role === 'fournisseur')) && !isEditing && <ProductForm onProductAdded={handleProductAdded} />}

            {isEditing && (
                <EditProductForm
                    product={currentProduct}
                    onUpdate={handleUpdate}
                    onCancel={() => {
                        setIsEditing(false);
                        setCurrentProduct(null);
                    }}
                />
            )}

            <h1 className="text-3xl font-bold mb-5">Produits</h1>

            <div className="flex gap-4 mb-4">
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="p-2 border rounded">
                    <option value="">Toutes les catégories</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                {user.role === 'admin' && (
                    <select value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)} className="p-2 border rounded">
                        <option value="">Tous les fournisseurs</option>
                        {suppliers.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                )}
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Image</th>
                        <th className="py-2">Nom</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Catégorie</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Prix</th>
                        <th className="py-2">Quantité</th>
                        <th className="py-2">Fournisseur</th>
                        {(user && (user.role === 'Admin' || user.role === 'admin')) && <th className="py-2">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product._id}>
                            <td className="border px-4 py-2">{product.image && <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />}</td>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.type}</td>
                            <td className="border px-4 py-2">{product.category?.name || product.category}</td>
                            <td className="border px-4 py-2">{product.description}</td>
                            <td className="border px-4 py-2">{product.price} €</td>
                            <td className="border px-4 py-2">{product.quantity}</td>
                            <td className="border px-4 py-2">{product.supplier?.name || product.supplier?.firstName + ' ' + product.supplier?.lastName}</td>
                            {(user && (user.role === 'Admin' || user.role === 'admin')) && (
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2">Modifier</button>
                                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">Supprimer</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList; 