
import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { Skeleton } from './components/ui/skeleton';
import { useIsMobile } from './hooks/use-mobile';

// Layout
import Footer from './components/layout/Footer';

// Critical pages (not lazy loaded)
import Index from './pages/Index';
import Login from './pages/Login';

// Lazy loaded pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Quote = lazy(() => import('./pages/Quote'));
const Order = lazy(() => import('./pages/Order'));
const Blog = lazy(() => import('./pages/Blog'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));

// Service Pages
const Deck = lazy(() => import('./pages/services/Deck'));
const Patio = lazy(() => import('./pages/services/Patio'));
const Pergola = lazy(() => import('./pages/services/Pergola'));
const OutdoorKitchen = lazy(() => import('./pages/services/OutdoorKitchen'));
const HomeAddition = lazy(() => import('./pages/services/HomeAddition'));
const DynamicService = lazy(() => import('./pages/services/DynamicService'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Leads = lazy(() => import('./pages/admin/Leads'));
const Communications = lazy(() => import('./pages/admin/Communications'));
const Services = lazy(() => import('./pages/admin/Services'));
const ContentManager = lazy(() => import('./pages/admin/ContentManager'));

// Client Pages
const ClientDashboard = lazy(() => import('./pages/client/Dashboard'));
const ClientOrders = lazy(() => import('./pages/client/Orders'));
const ClientDocuments = lazy(() => import('./pages/client/Documents'));
const ClientMessages = lazy(() => import('./pages/client/Messages'));

import { Toaster } from './components/ui/toaster';
import FloatingChatButton from './components/ui/FloatingChatButton';

// Loading component for lazy routes
const PageSkeleton = () => (
  <div className="min-h-screen p-6">
    <Skeleton className="h-8 w-64 mb-6" />
    <Skeleton className="h-4 w-full mb-4" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-64 w-full mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

// Component to conditionally render footer
const ConditionalFooter = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Hide footer on mobile for client messages page
  if (isMobile && location.pathname === '/client/messages') {
    return null;
  }
  
  return <Footer />;
};

// Redirect helper to role-based dashboard
const RoleDashboardRedirect = () => {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/client/dashboard'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/quote" element={<Quote />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<RoleDashboardRedirect />} />
                  
                  {/* Static Service Routes (for backward compatibility) */}
                  <Route path="/services/deck" element={<Deck />} />
                  <Route path="/services/patio" element={<Patio />} />
                  <Route path="/services/pergola" element={<Pergola />} />
                  <Route path="/services/outdoor-kitchen" element={<OutdoorKitchen />} />
                  <Route path="/services/home-addition" element={<HomeAddition />} />
                  
                  {/* Dynamic Service Route */}
                  <Route path="/services/:serviceId" element={<DynamicService />} />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ConditionalFooter />
                <FloatingChatButton />
              </>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin">
            <Route path="login" element={<AdminLogin />} />
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
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <ClientOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="documents"
              element={
                <ProtectedRoute>
                  <ClientDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoute>
                  <ClientMessages />
                </ProtectedRoute>
              }
            />
            <Route index element={<Navigate to="/client/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
