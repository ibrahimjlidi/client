import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import customFetch from '../../utils/setAuthToken';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        customFetch('/api/products').then(res => res.json()).then(data => setProducts(data));
        customFetch('/api/suppliers').then(res => res.json()).then(data => setSuppliers(data));
    }, []);

    // Data for Products per Supplier chart
    const productsPerSupplierData = {
        labels: suppliers.map(s => s.name),
        datasets: [{
            label: 'Nombre de Produits',
            data: suppliers.map(s => products.filter(p => p.supplier?._id === s._id).length),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
    };

    // Data for Stock Levels chart
    const stockLevelsData = {
        labels: ['En Stock', 'Stock Faible', 'En Rupture de Stock'],
        datasets: [{
            data: [
                products.filter(p => p.quantity > 10).length,
                products.filter(p => p.quantity > 0 && p.quantity <= 10).length,
                products.filter(p => p.quantity === 0).length,
            ],
            backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
        }],
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-5">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-xl font-bold">Total Produits</h2>
                    <p className="text-3xl">{products.length}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-xl font-bold">Total Fournisseurs</h2>
                    <p className="text-3xl">{suppliers.length}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-xl font-bold">Alertes de Stock</h2>
                    <p className="text-3xl">{products.filter(p => p.quantity <= 10).length}</p>
                </div>
            </div>

            {/* Stock Alerts Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-2 text-red-600">Produits en Stock Faible (moins de 5)</h2>
                <div className="bg-white p-4 rounded-lg shadow">
                    {products.filter(p => p.quantity < 5).length === 0 ? (
                        <p className="text-green-600">Aucun produit en stock faible.</p>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="py-2">Nom</th>
                                    <th className="py-2">Quantité</th>
                                    <th className="py-2">Fournisseur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.filter(p => p.quantity < 5).map(p => (
                                    <tr key={p._id}>
                                        <td className="border px-4 py-2">{p.name}</td>
                                        <td className="border px-4 py-2 text-red-600 font-bold">{p.quantity}</td>
                                        <td className="border px-4 py-2">{p.supplier?.name || p.supplier?.firstName + ' ' + p.supplier?.lastName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Produits par Fournisseur</h2>
                    <Bar data={productsPerSupplierData} />
                </div>
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Niveaux de Stock</h2>
                    <Pie data={stockLevelsData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 