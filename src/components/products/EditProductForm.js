import React, { useState, useEffect } from 'react';
import customFetch from '../../utils/setAuthToken';

const EditProductForm = ({ product, onUpdate, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        customFetch('/api/suppliers')
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setImage(product.image || '');
            setPrice(product.price);
            setQuantity(product.quantity);
            setCategory(product.category);
            setSupplier(product.supplier?._id);
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = { ...product, name, description, image, price, quantity, category, supplier };
        onUpdate(updatedProduct);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative p-5 border w-full max-w-md mx-auto rounded-md bg-white">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-5">Modifier le Produit</h2>
                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border rounded" required />
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-2 border rounded" required />
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded" />
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="p-2 border rounded" placeholder="Image URL" />
                        <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="p-2 border rounded" required>
                            <option value="">Sélectionner un Fournisseur</option>
                            {suppliers.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 mt-4 border rounded"></textarea>
                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mr-2">Annuler</button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Mettre à jour</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm; 