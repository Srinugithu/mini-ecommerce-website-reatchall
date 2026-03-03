import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import UploadProduct from './pages/UploadProduct';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="app">
              {/* Pass userInfo to Navbar via App or use Context in Navbar */}
              <Navbar onSearch={setSearchTerm} />
              <main>
                <Routes>
                  <Route path="/" element={<Home searchTerm={searchTerm} />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/upload"
                    element={
                      <ProtectedAdminRoute>
                        <UploadProduct />
                      </ProtectedAdminRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

// Simple Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { userInfo } = useAuth();
  if (!userInfo) return <Navigate to="/login" />;
  if (!userInfo.isAdmin) return <Navigate to="/" />;
  return children;
};

export default App;
