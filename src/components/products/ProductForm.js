import React, { useState, useEffect, useContext } from 'react';
import customFetch from '../../utils/setAuthToken';
import { AuthContext } from '../../context/AuthContext';

const ProductForm = ({ onProductAdded }) => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [type, setType] = useState('');
    const [supplier, setSupplier] = useState('');
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        customFetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
        if (user.role === 'admin') {
            customFetch('/api/suppliers')
                .then(res => res.json())
                .then(data => setSuppliers(data))
                .catch(err => console.error(err));
        }
    }, [user.role]);

    useEffect(() => {
        if (user.role === 'fournisseur') {
            setSupplier(user.id);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = { name, description, image, price, quantity, category, supplier, type };
        customFetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(newProduct),
        })
        .then(res => res.json())
        .then(data => {
            if (onProductAdded) {
                onProductAdded(data);
            }
            // Clear form
            setName('');
            setDescription('');
            setImage('');
            setPrice('');
            setQuantity('');
            setCategory('');
            setType('');
            if (user.role === 'admin') setSupplier('');
        })
        .catch(err => console.error(err));
    };

    return (
        <form onSubmit={handleSubmit} className="mb-10 p-5 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-5">Ajouter un Produit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
                <input type="number" placeholder="Prix" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border rounded" required />
                <input type="number" placeholder="Quantité" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-2 border rounded" required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded" required>
                    <option value="">Sélectionner une Catégorie</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded" />
                <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="p-2 border rounded" />
                {user.role === 'admin' ? (
                    <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="p-2 border rounded" required>
                        <option value="">Sélectionner un Fournisseur</option>
                        {suppliers.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                ) : (
                    <input type="hidden" value={supplier} readOnly />
                )}
            </div>
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 mt-4 border rounded"></textarea>
            <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Ajouter</button>
        </form>
    );
};

export default ProductForm; 