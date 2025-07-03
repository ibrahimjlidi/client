import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
    const { token, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const taxes = subtotal * 0.1;
    const total = subtotal + taxes;

    const handleCheckout = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const orderData = {
                products: cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
                supplier: cart[0]?.product.supplier?._id || cart[0]?.product.supplier, // assumes single supplier per order
                shippingAddress: user.address,
                notes: ''
            };
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            if (res.ok) {
                setSuccess('Commande passée avec succès !');
                clearCart();
                setTimeout(() => navigate('/orders'), 1500);
            } else {
                const data = await res.json();
                setError(data.msg || 'Erreur lors de la commande');
            }
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return <div className="p-8 text-center text-xl">Votre panier est vide.</div>;
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Mon Panier</h1>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
            <table className="min-w-full bg-white mb-6">
                <thead>
                    <tr>
                        <th className="py-2">Image</th>
                        <th className="py-2">Nom</th>
                        <th className="py-2">Prix</th>
                        <th className="py-2">Quantité</th>
                        <th className="py-2">Total</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.product._id}>
                            <td className="border px-4 py-2">{item.product.image && <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover" />}</td>
                            <td className="border px-4 py-2">{item.product.name}</td>
                            <td className="border px-4 py-2">{item.product.price} €</td>
                            <td className="border px-4 py-2">
                                <input
                                    type="number"
                                    min="1"
                                    max={item.product.quantity}
                                    value={item.quantity}
                                    onChange={e => updateQuantity(item.product._id, parseInt(e.target.value, 10))}
                                    className="w-16 p-1 border rounded"
                                />
                            </td>
                            <td className="border px-4 py-2">{(item.product.price * item.quantity).toFixed(2)} €</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => removeFromCart(item.product._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex flex-col items-end mb-6">
                <div className="mb-1">Sous-total : <span className="font-semibold">{subtotal.toFixed(2)} €</span></div>
                <div className="mb-1">Taxes (10%) : <span className="font-semibold">{taxes.toFixed(2)} €</span></div>
                <div className="text-xl font-bold">Total : {total.toFixed(2)} €</div>
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={clearCart} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Vider le panier</button>
                <button
                    onClick={handleCheckout}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? 'Commande en cours...' : 'Commander'}
                </button>
            </div>
        </div>
    );
};

export default CartPage; 