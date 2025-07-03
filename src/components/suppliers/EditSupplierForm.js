import React, { useState, useEffect } from 'react';

const EditSupplierForm = ({ supplier, onUpdate, onCancel }) => {
    const [name, setName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (supplier) {
            setName(supplier.name);
            setContactPerson(supplier.contactPerson);
            setEmail(supplier.email);
            setPhone(supplier.phone);
            setAddress(supplier.address);
        }
    }, [supplier]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedSupplier = { ...supplier, name, contactPerson, email, phone, address };
        onUpdate(updatedSupplier);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative p-5 border w-full max-w-md mx-auto rounded-md bg-white">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-5">Modifier le Fournisseur</h2>
                    {/* Form fields are similar to SupplierForm */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
                        <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="p-2 border rounded" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded" required />
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2 border rounded" />
                    </div>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 mt-4 border rounded"></textarea>
                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mr-2">Annuler</button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Mettre à jour</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSupplierForm; 