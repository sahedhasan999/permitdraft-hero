
import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Portfolio from './pages/Portfolio';
import Quote from './pages/Quote';
import NotFound from './pages/NotFound';

// Service Pages
import Deck from './pages/services/Deck';
import Patio from './pages/services/Patio';
import Pergola from './pages/services/Pergola';
import OutdoorKitchen from './pages/services/OutdoorKitchen';
import HomeAddition from './pages/services/HomeAddition';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Leads from './pages/admin/Leads';
import Communications from './pages/admin/Communications';
import Services from './pages/admin/Services';
import ContentManager from './pages/admin/ContentManager';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { FirebaseProvider } from './contexts/FirebaseContext';

function App() {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/testimonials" element={<Testimonials />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/quote" element={<Quote />} />
                      
                      {/* Service Routes */}
                      <Route path="/services/deck" element={<Deck />} />
                      <Route path="/services/patio" element={<Patio />} />
                      <Route path="/services/pergola" element={<Pergola />} />
                      <Route path="/services/outdoor-kitchen" element={<OutdoorKitchen />} />
                      <Route path="/services/home-addition" element={<HomeAddition />} />
                      
                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                  </>
                }
              />
              
              {/* Admin Routes */}
              <Route path="/admin">
                <Route path="login" element={<Login />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="leads"
                  element={
                    <ProtectedRoute>
                      <Leads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="communications"
                  element={
                    <ProtectedRoute>
                      <Communications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="services"
                  element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="content"
                  element={
                    <ProtectedRoute>
                      <ContentManager />
                    </ProtectedRoute>
                  }
                />
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
              
              {/* Client Routes */}
              <Route path="/client">
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route index element={<Navigate to="/client/dashboard" replace />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </FirebaseProvider>
    </BrowserRouter>
  );
}

export default App;
