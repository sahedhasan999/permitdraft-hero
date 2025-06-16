
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import FloatingChatButton from '@/components/client/messaging/FloatingChatButton';
import Index from './pages/Index';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import AdminDashboard from './pages/admin/Dashboard';
import Communications from './pages/admin/Communications';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFound from './pages/NotFound';

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
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="*" element={<NotFound />} />

                  {/* Protected Routes */}
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/communications" element={<ProtectedRoute><Communications /></ProtectedRoute>} />
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
