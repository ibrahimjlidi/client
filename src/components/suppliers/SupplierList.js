import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SupplierForm from './SupplierForm';
import EditSupplierForm from './EditSupplierForm';
import customFetch from '../../utils/setAuthToken';

const SupplierList = () => {
    const { user } = useContext(AuthContext);
    const [suppliers, setSuppliers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);

    const fetchSuppliers = () => {
        customFetch('/api/suppliers')
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSupplierAdded = (newSupplier) => {
        setSuppliers([...suppliers, newSupplier]);
    };

    const handleDelete = (id) => {
        customFetch(`/api/suppliers/${id}`, { method: 'DELETE' })
            .then(() => {
                setSuppliers(suppliers.filter(s => s._id !== id));
            })
            .catch(err => console.error(err));
    };

    const handleEdit = (supplier) => {
        setCurrentSupplier(supplier);
        setIsEditing(true);
    };

    const handleUpdate = (updatedSupplier) => {
        customFetch(`/api/suppliers/${updatedSupplier._id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedSupplier),
        })
        .then(res => res.json())
        .then(data => {
            setSuppliers(suppliers.map(s => s._id === data._id ? data : s));
            setIsEditing(false);
            setCurrentSupplier(null);
        })
        .catch(err => console.error(err));
    };

    return (
        <div className="container mx-auto mt-10">
            {user && user.role === 'Admin' && !isEditing && <SupplierForm onSupplierAdded={handleSupplierAdded} />}

            {isEditing && (
                <EditSupplierForm 
                    supplier={currentSupplier} 
                    onUpdate={handleUpdate} 
                    onCancel={() => {
                        setIsEditing(false);
                        setCurrentSupplier(null);
                    }} 
                />
            )}
            
            <h1 className="text-3xl font-bold mb-5">Fournisseurs</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Nom</th>
                        <th className="py-2">Personne à Contacter</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Téléphone</th>
                        {user && user.role === 'Admin' && <th className="py-2">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(supplier => (
                        <tr key={supplier._id}>
                            <td className="border px-4 py-2">{supplier.name}</td>
                            <td className="border px-4 py-2">{supplier.contactPerson}</td>
                            <td className="border px-4 py-2">{supplier.email}</td>
                            <td className="border px-4 py-2">{supplier.phone}</td>
                            {user && user.role === 'Admin' && (
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(supplier)} className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2">Modifier</button>
                                    <button onClick={() => handleDelete(supplier._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">Supprimer</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierList; 