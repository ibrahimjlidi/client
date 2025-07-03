import React, { useState } from 'react';
import customFetch from '../../utils/setAuthToken';

const SupplierForm = ({ onSupplierAdded }) => {
    const [name, setName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSupplier = { name, contactPerson, email, phone, address };

        customFetch('/api/suppliers', {
            method: 'POST',
            body: JSON.stringify(newSupplier),
        })
        .then(res => res.json())
        .then(data => {
            if (onSupplierAdded) {
                onSupplierAdded(data);
            }
            // Clear form
            setName('');
            setContactPerson('');
            setEmail('');
            setPhone('');
            setAddress('');
        })
        .catch(err => console.error(err));
    };

    return (
        <form onSubmit={handleSubmit} className="mb-10 p-5 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-5">Ajouter un Fournisseur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Personne à Contacter"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <textarea
                placeholder="Adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 mt-4 border rounded"
            ></textarea>
            <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Ajouter
            </button>
        </form>
    );
};

export default SupplierForm; 