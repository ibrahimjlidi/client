import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    let role = user?.role?.toLowerCase();

    const adminLinks = (
        <>
            <Link to="/" className="text-gray-300 hover:text-white px-3">Dashboard</Link>
            <Link to="/products" className="text-gray-300 hover:text-white px-3">Gérer Produits</Link>
            <Link to="/suppliers" className="text-gray-300 hover:text-white px-3">Gérer Fournisseurs</Link>
            <Link to="/categories" className="text-gray-300 hover:text-white px-3">Gérer Catégories</Link>
            <Link to="/orders" className="text-gray-300 hover:text-white px-3">Commandes</Link>
            <Link to="/deliveries" className="text-gray-300 hover:text-white px-3">Livraisons</Link>
            <Link to="/users" className="text-gray-300 hover:text-white px-3">Utilisateurs</Link>
            <Link to="/reports" className="text-gray-300 hover:text-white px-3">Rapports</Link>
        </>
    );

    const fournisseurLinks = (
        <>
            <Link to="/products" className="text-gray-300 hover:text-white px-3">Mes Produits</Link>
            <Link to="/orders" className="text-gray-300 hover:text-white px-3">Commandes Reçues</Link>
            <Link to="/deliveries" className="text-gray-300 hover:text-white px-3">Livraisons</Link>
            <Link to="/stats" className="text-gray-300 hover:text-white px-3">Statistiques</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white px-3">Profil</Link>
        </>
    );

    const clientLinks = (
        <>
            <Link to="/products-public" className="text-gray-300 hover:text-white px-3">Catalogue</Link>
            <Link to="/cart" className="text-gray-300 hover:text-white px-3">Panier 🛒</Link>
            <Link to="/orders" className="text-gray-300 hover:text-white px-3">Mes Commandes</Link>
            <Link to="/deliveries" className="text-gray-300 hover:text-white px-3">Suivi Livraison</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white px-3">Profil</Link>
        </>
    );

    const authLinks = (
        <div className="flex items-center">
            {role === 'admin' && adminLinks}
            {role === 'fournisseur' && fournisseurLinks}
            {role === 'client' && clientLinks}
            <button onClick={handleLogout} className="text-gray-300 hover:text-white px-3">Déconnexion</button>
        </div>
    );

    const guestLinks = (
        <div>
            <Link to="/products-public" className="text-gray-300 hover:text-white px-3">Produits</Link>
            <Link to="/register" className="text-gray-300 hover:text-white px-3">Inscription</Link>
            <Link to="/login" className="text-gray-300 hover:text-white px-3">Connexion</Link>
        </div>
    );

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">
                    <Link to={isAuthenticated ? "/" : "/products-public"}>Gestion App</Link>
                </h1>
                {isAuthenticated ? authLinks : guestLinks}
            </div>
        </nav>
    );
};

export default Navbar; 