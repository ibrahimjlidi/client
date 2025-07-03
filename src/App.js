import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layouts/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import SupplierList from './components/suppliers/SupplierList';
import ProductList from './components/products/ProductList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import PublicProductList from './components/public/PublicProductList';
// Placeholder imports
import CategoryList from './components/categories/CategoryList';
import OrderList from './components/orders/OrderList';
import DeliveryList from './components/deliveries/DeliveryList';
import Profile from './components/profile/Profile';
import Stats from './components/stats/Stats';
import UserList from './components/users/UserList';
import Reports from './components/reports/Reports';
import CartPage from './components/cart/CartPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products-public" element={<PublicProductList />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/suppliers" element={<PrivateRoute><SupplierList /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
              <Route path="/categories" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
              <Route path="/deliveries" element={<PrivateRoute><DeliveryList /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
