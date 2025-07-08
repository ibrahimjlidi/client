import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const PublicProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [quantities, setQuantities] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch products
                const productsResponse = await fetch('/api/products');
                if (!productsResponse.ok) {
                    throw new Error('Failed to fetch products');
                }
                const productsData = await productsResponse.json();
                setProducts(Array.isArray(productsData) ? productsData : []);
                
                // Fetch categories
                const categoriesResponse = await fetch('/api/categories');
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
                setProducts([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (product) => {
        const qty = quantities[product._id] ? parseInt(quantities[product._id], 10) : 1;
        addToCart(product, qty);
    };

    const handleQuantityChange = (productId, value) => {
        setQuantities(q => ({ ...q, [productId]: value }));
    };

    // Filtering and sorting
    let filteredProducts = products;
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }
    if (sortBy === 'price-asc') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
    }

    // Get featured products (first 6 products)
    const featuredProducts = products.slice(0, 6);

    // Promotional slides
    const promotionalSlides = [
        {
            id: 1,
            title: "Nouveautés",
            subtitle: "Découvrez nos derniers produits",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            cta: "Voir les nouveautés"
        },
        {
            id: 2,
            title: "Promotions",
            subtitle: "Offres spéciales à ne pas manquer",
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            cta: "Voir les promos"
        },
        {
            id: 3,
            title: "Livraison Gratuite",
            subtitle: "Pour toute commande supérieure à 50€",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            cta: "Commander maintenant"
        }
    ];



    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-xl text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Découvrez Nos Produits
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                        Une sélection exceptionnelle de produits de qualité pour tous vos besoins
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        Commencer à Magasiner
                    </button>
                </div>
            </div>

            {/* Promotional Slider */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Offres Spéciales
                    </h2>
                    <div className="keen-slider">
                        {promotionalSlides.map((slide) => (
                            <div key={slide.id} className="keen-slider__slide">
                                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
                                    <img 
                                        src={slide.image} 
                                        alt={slide.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                                        <p className="text-lg mb-4">{slide.subtitle}</p>
                                        <button className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                            {slide.cta}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <div className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                            Produits Vedettes
                        </h2>
                        <div className="keen-slider">
                            {featuredProducts.map((product) => (
                                <div key={product._id} className="keen-slider__slide">
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                        {product.image && (
                                            <div className="relative">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="w-full h-48 object-cover"
                                                />
                                                {product.quantity === 0 && (
                                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        Rupture
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold mb-2 text-gray-900">{product.name}</h3>
                                            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-xl font-bold text-blue-600">{product.price} €</span>
                                                <span className="text-xs text-gray-500">Stock: {product.quantity}</span>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition disabled:opacity-50"
                                                disabled={product.quantity === 0}
                                            >
                                                Ajouter au Panier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* All Products Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Tous Nos Produits
                    </h2>
                    
                    {/* Filter and sort bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex gap-2 items-center w-full md:w-auto">
                            <label className="font-semibold text-gray-700">Catégorie:</label>
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="p-2 border rounded w-full md:w-auto"
                            >
                                <option value="">Toutes</option>
                                {Array.isArray(categories) && categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2 items-center w-full md:w-auto">
                            <label className="font-semibold text-gray-700">Trier par:</label>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="p-2 border rounded w-full md:w-auto"
                            >
                                <option value="">Par défaut</option>
                                <option value="price-asc">Prix croissant</option>
                                <option value="price-desc">Prix décroissant</option>
                                <option value="name-asc">Nom A-Z</option>
                                <option value="name-desc">Nom Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative group"
                            >
                                {product.image && (
                                    <div className="relative">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.quantity === 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Rupture
                                            </span>
                                        )}
                                        {product.isNew && (
                                            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Nouveau
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="p-6 flex flex-col h-full">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 truncate">{product.name}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{product.description}</p>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-2xl font-extrabold text-blue-600">{product.price} €</span>
                                        <span className="text-xs font-semibold text-gray-500">Stock: {product.quantity}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mb-2">Fournisseur: {product.supplier?.name}</div>
                                    <div className="mt-auto flex gap-2 items-center">
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.quantity}
                                            value={quantities[product._id] || 1}
                                            onChange={e => handleQuantityChange(product._id, e.target.value)}
                                            className="w-16 p-1 border rounded"
                                            disabled={product.quantity === 0}
                                        />
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition disabled:opacity-50"
                                            disabled={product.quantity === 0}
                                        >
                                            Ajouter au Panier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {filteredProducts.length === 0 && (
                        <div className="text-center text-gray-500 mt-16 text-lg">
                            Aucun produit trouvé.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProductList; 