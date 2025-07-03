import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, user } = useContext(AuthContext);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) {
        return <div className="p-8">Chargement...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">
                {user.role === 'admin' ? 'Toutes les Commandes' : 
                 user.role === 'fournisseur' ? 'Commandes Reçues' : 'Mes Commandes'}
            </h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {order.client.firstName} {order.client.lastName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{order.total.toFixed(2)} €</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.status}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList; 