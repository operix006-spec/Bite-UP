import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { Chatbot } from './components/chat/Chatbot';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import './App.css';

function AppRoutes() {
  const { loading } = useAdmin();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FBFA',
        gap: '16px'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          backgroundColor: '#111414',
          border: '2px solid #65B7BB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(101, 183, 187, 0.25)'
        }}>
          <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>UP</span>
        </div>
        <div style={{
          width: '28px',
          height: '28px',
          border: '3px solid rgba(101, 183, 187, 0.2)',
          borderTop: '3px solid var(--c-aqua-dark, #357F83)',
          borderRadius: '50%',
          animation: 'biteupSpin 0.8s linear infinite'
        }}></div>
        <style>{`@keyframes biteupSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Header />
        <CartDrawer />
        <Chatbot />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
