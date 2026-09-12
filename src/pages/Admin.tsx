import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductsManager } from '../components/admin/ProductsManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { HomeManager } from '../components/admin/HomeManager';
import { AboutManager } from '../components/admin/AboutManager';
import { ChatbotManager } from '../components/admin/ChatbotManager';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminSecurityModal } from '../components/admin/AdminSecurityModal';
import { ShieldCheck, LogOut } from 'lucide-react';
import './Admin.css';

type Tab = 'products' | 'categories' | 'home' | 'about' | 'chatbot';

export const Admin: React.FC = () => {
  const { isAuthenticated, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // If user is not authenticated, render the dedicated login screen
  if (!isAuthenticated) {
    return <AdminLogin />;
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
              className="btn-admin-header-action"
              onClick={() => setIsSecurityModalOpen(true)}
              title="Change Admin Password and Username"
            >
              <ShieldCheck size={16} />
              <span>SECURITY & PASSWORD</span>
            </button>
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

      <AdminSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

