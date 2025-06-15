import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import FloatingChatButton from '@/components/client/messaging/FloatingChatButton';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Communications from './pages/admin/Communications';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ServicesPage from './pages/ServicesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import EditBlogPost from './pages/admin/EditBlogPost';
import NewBlogPost from './pages/admin/NewBlogPost';
import SettingsPage from './pages/SettingsPage';
import NewProjectPage from './pages/admin/NewProjectPage';
import EditProjectPage from './pages/admin/EditProjectPage';
import NewServicePage from './pages/admin/NewServicePage';
import EditServicePage from './pages/admin/EditServicePage';
import NewPricingPlanPage from './pages/admin/NewPricingPlanPage';
import EditPricingPlanPage from './pages/admin/EditPricingPlanPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import PublicServicesPage from './pages/PublicServicesPage';
import PublicPricingPage from './pages/PublicPricingPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <ContentProvider>
          <PortfolioProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogPostPage />} />
                  <Route path="/public/portfolio/:uid" element={<PublicPortfolioPage />} />
                  <Route path="/public/services/:uid" element={<PublicServicesPage />} />
                  <Route path="/public/pricing/:uid" element={<PublicPricingPage />} />
                  <Route path="*" element={<NotFoundPage />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/communications" element={<AdminRoute><Communications /></AdminRoute>} />
                  <Route path="/admin/blog/new" element={<AdminRoute><NewBlogPost /></AdminRoute>} />
                  <Route path="/admin/blog/edit/:id" element={<AdminRoute><EditBlogPost /></AdminRoute>} />
                  <Route path="/admin/portfolio/new" element={<AdminRoute><NewProjectPage /></AdminRoute>} />
                  <Route path="/admin/portfolio/edit/:id" element={<AdminRoute><EditProjectPage /></AdminRoute>} />
                  <Route path="/admin/services/new" element={<AdminRoute><NewServicePage /></AdminRoute>} />
                  <Route path="/admin/services/edit/:id" element={<AdminRoute><EditServicePage /></AdminRoute>} />
                  <Route path="/admin/pricing/new" element={<AdminRoute><NewPricingPlanPage /></AdminRoute>} />
                  <Route path="/admin/pricing/edit/:id" element={<AdminRoute><EditPricingPlanPage /></AdminRoute>} />
                </Routes>
                <FloatingChatButton />
                <Toaster />
              </div>
            </Router>
          </PortfolioProvider>
        </ContentProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

export default App;
