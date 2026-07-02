import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import Header from './components/Header';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const SpeakingPage = lazy(() => import('./pages/SpeakingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function Loading() {
  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-primary-900 font-poppins">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/work" element={<PublicLayout><WorkPage /></PublicLayout>} />
              <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
              <Route path="/projects/:id" element={<PublicLayout><ProjectDetailPage /></PublicLayout>} />
              <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
              <Route path="/speaking" element={<PublicLayout><SpeakingPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/resume" element={<PublicLayout><ResumePage /></PublicLayout>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}
