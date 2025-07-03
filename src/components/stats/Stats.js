import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token, user } = useContext(AuthContext);

    const fetchStats = useCallback(async () => {
        try {
            let endpoint = '';
            if (user.role === 'fournisseur') {
                endpoint = '/api/orders/stats/supplier';
            } else if (user.role === 'admin') {
                endpoint = '/api/stats/admin';
            }

            if (endpoint) {
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }, [token, user.role]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return <div className="p-8">Chargement...</div>;
    }

    if (!stats) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Statistiques</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-gray-600">Aucune statistique disponible pour votre rôle.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Statistiques</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Orders */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Commandes</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Commandes en Attente</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Completed Orders */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Commandes Terminées</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.completedOrders || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                            <p className="text-2xl font-semibold text-gray-900">{(stats.totalRevenue || 0).toFixed(2)} €</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Stats for Fournisseur */}
            {user.role === 'fournisseur' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des Livraisons</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Livraisons en cours:</span>
                                <span className="font-medium">{stats.inTransitDeliveries || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Livraisons terminées:</span>
                                <span className="font-medium">{stats.completedDeliveries || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Taux de complétion:</span>
                                <span className="font-medium">
                                    {stats.totalOrders > 0 
                                        ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
                                        : 0}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Revenu moyen/commande:</span>
                                <span className="font-medium">
                                    {stats.completedOrders > 0 
                                        ? (stats.totalRevenue / stats.completedOrders).toFixed(2)
                                        : 0} €
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Stats for Admin */}
            {user.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total utilisateurs:</span>
                                <span className="font-medium">{stats.totalUsers || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Clients:</span>
                                <span className="font-medium">{stats.totalClients || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fournisseurs:</span>
                                <span className="font-medium">{stats.totalSuppliers || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total produits:</span>
                                <span className="font-medium">{stats.totalProducts || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Catégories:</span>
                                <span className="font-medium">{stats.totalCategories || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Stock faible:</span>
                                <span className="font-medium text-red-600">{stats.lowStockProducts || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Livraisons</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total livraisons:</span>
                                <span className="font-medium">{stats.totalDeliveries || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">En transit:</span>
                                <span className="font-medium">{stats.inTransitDeliveries || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Livrées:</span>
                                <span className="font-medium">{stats.completedDeliveries || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stats; 