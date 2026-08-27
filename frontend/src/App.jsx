import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LocationBanner from './components/LocationBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useGeolocation } from './hooks/useGeolocation';

// Customer Pages
import Home from './pages/customer/Home';
import Explore from './pages/customer/Explore';
import ProductDetail from './pages/customer/ProductDetail';
import Customization from './pages/customer/Customization';
import Checkout from './pages/customer/Checkout';
import OrderTracking from './pages/customer/OrderTracking';
import Profile from './pages/customer/Profile';
import CustomerCare from './pages/customer/CustomerCare';

// Business Pages
import BusinessRegistration from './pages/business/BusinessRegistration';
import SellerDashboard from './pages/business/SellerDashboard';
import BulkBuyerDashboard from './pages/business/BulkBuyerDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  const { city, detectLocation } = useGeolocation();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <LocationBanner city={city} artisanCount={12} onDetect={detectLocation} />
          <Navbar />
          
          <div className="flex-1">
            <Routes>
              {/* Public & Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/customize" element={<Customization />} />
              <Route path="/customize/:productId" element={<Customization />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderTracking />} />
              <Route path="/orders/:orderId" element={<OrderTracking />} />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/support" element={<CustomerCare />} />

              {/* Business Routes */}
              <Route path="/business/register" element={<BusinessRegistration />} />
              <Route path="/business/dashboard" element={
                <ProtectedRoute allowedRoles={['business', 'admin']}>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/business/bulk" element={<BulkBuyerDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
