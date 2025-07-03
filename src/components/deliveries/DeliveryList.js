import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';

const DeliveryList = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const { token, user } = useContext(AuthContext);

    const fetchDeliveries = useCallback(async () => {
        try {
            const response = await fetch('/api/deliveries', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDeliveries(data);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    const handleStatusUpdate = async (deliveryId, newStatus) => {
        try {
            const response = await fetch(`/api/deliveries/${deliveryId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchDeliveries();
            }
        } catch (error) {
            console.error('Error updating delivery status:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            assigned: 'bg-blue-100 text-blue-800',
            picked_up: 'bg-orange-100 text-orange-800',
            in_transit: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'En attente',
            assigned: 'Assignée',
            picked_up: 'Récupérée',
            in_transit: 'En transit',
            delivered: 'Livrée',
            failed: 'Échouée'
        };
        return texts[status] || status;
    };

    const canUpdateStatus = (delivery) => {
        if (user.role === 'admin') return true;
        if (user.role === 'fournisseur' && delivery.delivererId._id === user.id) return true;
        return false;
    };

    if (loading) {
        return <div className="p-8">Chargement...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    {user.role === 'admin' ? 'Toutes les Livraisons' : 
                     user.role === 'fournisseur' ? 'Mes Livraisons' : 'Suivi des Livraisons'}
                </h1>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                N° Suivi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                N° Commande
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Livreur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Estimée
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {deliveries.map((delivery) => (
                            <tr key={delivery._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {delivery.trackingNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {delivery.orderId.orderNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {delivery.delivererId.firstName} {delivery.delivererId.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                                        {getStatusText(delivery.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {delivery.estimatedDeliveryDate 
                                        ? new Date(delivery.estimatedDeliveryDate).toLocaleDateString()
                                        : 'Non définie'
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedDelivery(delivery);
                                            setShowDetails(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        Détails
                                    </button>
                                    {canUpdateStatus(delivery) && (
                                        <select
                                            value={delivery.status}
                                            onChange={(e) => handleStatusUpdate(delivery._id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="assigned">Assignée</option>
                                            <option value="picked_up">Récupérée</option>
                                            <option value="in_transit">En transit</option>
                                            <option value="delivered">Livrée</option>
                                            <option value="failed">Échouée</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delivery Details Modal */}
            {showDetails && selectedDelivery && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Détails de la Livraison {selectedDelivery.trackingNumber}</h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">Informations Commande</h4>
                                    <p>N° Commande: {selectedDelivery.orderId.orderNumber}</p>
                                    <p>Total: {selectedDelivery.orderId.total.toFixed(2)} €</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Informations Livreur</h4>
                                    <p>{selectedDelivery.delivererId.firstName} {selectedDelivery.delivererId.lastName}</p>
                                    <p>{selectedDelivery.delivererId.email}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold">Adresse de Livraison</h4>
                                <p>{selectedDelivery.deliveryAddress.street}</p>
                                <p>{selectedDelivery.deliveryAddress.city}, {selectedDelivery.deliveryAddress.postalCode}</p>
                                <p>{selectedDelivery.deliveryAddress.country}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">Dates</h4>
                                    {selectedDelivery.pickupDate && (
                                        <p>Récupération: {new Date(selectedDelivery.pickupDate).toLocaleDateString()}</p>
                                    )}
                                    {selectedDelivery.estimatedDeliveryDate && (
                                        <p>Livraison estimée: {new Date(selectedDelivery.estimatedDeliveryDate).toLocaleDateString()}</p>
                                    )}
                                    {selectedDelivery.actualDeliveryDate && (
                                        <p>Livraison effective: {new Date(selectedDelivery.actualDeliveryDate).toLocaleDateString()}</p>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold">Statut</h4>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedDelivery.status)}`}>
                                        {getStatusText(selectedDelivery.status)}
                                    </span>
                                </div>
                            </div>

                            {selectedDelivery.notes && (
                                <div>
                                    <h4 className="font-semibold">Notes</h4>
                                    <p className="text-gray-600">{selectedDelivery.notes}</p>
                                </div>
                            )}

                            {selectedDelivery.signature && (
                                <div>
                                    <h4 className="font-semibold">Signature</h4>
                                    <p className="text-gray-600">{selectedDelivery.signature}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryList; 