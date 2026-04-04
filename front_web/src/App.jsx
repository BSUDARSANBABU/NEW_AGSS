import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Projects from './components/Projects';
import Developers from './components/Developers';
import Resources from './components/Resources';
import ResourceDetail from './components/ResourceDetail';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import Login from './admin/AdminLogin';
import BookDemo from './components/BookDemo';
import AdminDashboard from './admin/AdminDashboard';
import AdminProjects from './admin/AdminProjects';
import AdminDevelopers from './admin/AdminDevelopers';
import AdminResources from './admin/AdminResources';
import AdminHiring from './admin/AdminHiring';
import AdminDocumentation from './admin/AdminDocumentation';
import AdminReviews from './admin/AdminReviews';
import AdminDemos from './admin/AdminDemos';
import AdminSettings from './admin/AdminSettings';
import ManageReviews from './admin/ManageReviews';
import AdminFooter from './admin/AdminFooter';
import { SidebarProvider } from './admin/SidebarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { KonamiTransition } from './components/KonamiTransition';
import { useKonamiCode } from './hooks/useKonamiCode';
import JobPostingPage from './components/JobPostingPage';
import HireArchitectApp from './components/HireArchitectApp';

// Global Konami Handler Component
const GlobalKonamiHandler = () => {
  const { isAuthenticated } = useAuth();
  const [showKonami, setShowKonami] = React.useState(false);
  const navigate = useNavigate();

  const handleKonamiSuccess = () => {
    setShowKonami(false);
    navigate('/login', { replace: true });
  };

  // Initialize Konami code listener
  useKonamiCode(() => {
    if (!isAuthenticated) {
      setShowKonami(true);
    }
  });

  return showKonami ? <KonamiTransition onComplete={handleKonamiSuccess} /> : null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e2e2e2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#adc6ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#adc6ff] text-sm uppercase tracking-widest">Validating Session</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => window.location.href = '/admin'} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login onLogin={() => window.location.href = '/admin'} />} />
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/jobs" element={<JobPostingPage />} />
            <Route path="/hiring" element={<HireArchitectApp />} />

            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminDashboard />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminDashboard />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminProjects />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/developers" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminDevelopers />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/resources" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminResources />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/hiring" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminHiring />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/documentation" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminDocumentation />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/reviews" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminReviews />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/demos" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminDemos />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminSettings />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-reviews" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <ManageReviews />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin/footer" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AdminFooter />
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>

          {/* Global Konami Handler */}
          <GlobalKonamiHandler />
        </Router>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}

export default App;
