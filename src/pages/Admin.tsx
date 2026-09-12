import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductsManager } from '../components/admin/ProductsManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { HomeManager } from '../components/admin/HomeManager';
import { AboutManager } from '../components/admin/AboutManager';
import { ChatbotManager } from '../components/admin/ChatbotManager';
import { AdminLogin } from '../components/admin/AdminLogin';
import { LogOut } from 'lucide-react';
import './Admin.css';

type Tab = 'products' | 'categories' | 'home' | 'about' | 'chatbot';

export const Admin: React.FC = () => {
  const { isAuthenticated, logout, isLoadedFromCloud } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('products');

  // If user is not authenticated, render the dedicated login screen
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Ensure live cloud data is synced before rendering dashboard forms to prevent stale flash
  if (!isLoadedFromCloud) {
    return (
      <div className="admin-page" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            border: '3px solid rgba(101, 183, 187, 0.2)',
            borderTop: '3px solid var(--c-aqua-dark, #357F83)',
            borderRadius: '50%',
            animation: 'adminSyncSpin 0.7s linear infinite'
          }} />
          <p style={{ color: 'var(--c-dark, #111414)', fontWeight: 700, fontSize: '0.9rem' }}>
            جاري مزامنة لوحة التحكم بأحدث البيانات...
          </p>
          <style>{`@keyframes adminSyncSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container admin-container">
        <header className="admin-header">
          <div>
            <h1>Control Panel</h1>
            <p className="admin-subtitle">Manage Menu Products, Website Copy, and AI Assistant Training</p>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              className="btn-admin-header-action btn-logout"
              onClick={logout}
              title="Sign out of Admin Dashboard"
            >
              <LogOut size={16} />
              <span>LOGOUT</span>
            </button>
          </div>
        </header>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products Manager
          </button>
          <button 
            className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Menu Categories
          </button>
          <button 
            className={`admin-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home Page Manager
          </button>
          <button 
            className={`admin-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About Us Page Manager
          </button>
          <button 
            className={`admin-tab ${activeTab === 'chatbot' ? 'active' : ''}`}
            onClick={() => setActiveTab('chatbot')}
          >
            ✨ AI Assistant & Training
          </button>
        </div>

        <div className="admin-content-area">
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'home' && <HomeManager />}
          {activeTab === 'about' && <AboutManager />}
          {activeTab === 'chatbot' && <ChatbotManager />}
        </div>
      </div>
    </div>
  );
};

