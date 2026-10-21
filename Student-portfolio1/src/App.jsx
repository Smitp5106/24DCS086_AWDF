import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// Helper for minimum delay (300ms) to avoid flickering
const lazyWithDelay = (importFunc, delay = 300) => {
  return lazy(() => 
    Promise.all([
      importFunc(),
      new Promise((resolve) => setTimeout(resolve, delay))
    ]).then(([moduleExports]) => moduleExports)
  );
};

// Lazy load route components
const Home = lazyWithDelay(() => import('../components/Home'));
const Projects = lazyWithDelay(() => import('../components/Projects'));
const Contact = lazyWithDelay(() => import('../components/Contact'));
const TaskManager = lazyWithDelay(() => import('../components/task-manager/TaskManager'));
const Auth = lazyWithDelay(() => import('../components/Auth'));

const FallbackUI = () => (
  <div className="spinner-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner"></div>
    <p className="spinner-text" style={{ marginTop: '1rem', color: 'var(--neutral)', fontFamily: 'var(--font-mono)' }}>Loading page...</p>
  </div>
);

function App() {
  const [token, setToken] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        if (res.ok) {
          setToken(true);
        } else {
          setToken(false);
        }
      } catch (err) {
        setToken(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();

    const handleUnauthorized = () => {
      setToken(false);
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error', err);
    }
    setToken(false);
  };

  if (authLoading) {
    return <FallbackUI />;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar onLogout={handleLogout} isAuthenticated={!!token} />

        <main className="main-content">
          <Suspense fallback={<FallbackUI />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/tasks" 
                element={token ? <TaskManager /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/auth" 
                element={!token ? <Auth setToken={setToken} /> : <Navigate to="/tasks" />} 
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
