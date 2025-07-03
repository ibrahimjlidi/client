import React, { useState } from 'react';

const Reports = () => {
    const [message, setMessage] = useState('');

    const handleGenerate = (type) => {
        setMessage(`Génération du rapport ${type}... (simulation PDF)`);
        setTimeout(() => {
            setMessage(`Rapport ${type} téléchargé ! (simulation)`);
        }, 1500);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Rapports PDF</h1>
            {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>}
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
                <button onClick={() => handleGenerate('Produits')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Télécharger Rapport Produits</button>
                <button onClick={() => handleGenerate('Commandes')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Télécharger Rapport Commandes</button>
                <button onClick={() => handleGenerate('Livraisons')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Télécharger Rapport Livraisons</button>
            </div>
        </div>
    );
};

export default Reports; 