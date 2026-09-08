import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductsManager } from '../components/admin/ProductsManager';
import { HomeManager } from '../components/admin/HomeManager';
import { AboutManager } from '../components/admin/AboutManager';
import { ChatbotManager } from '../components/admin/ChatbotManager';
import './Admin.css';

type Tab = 'products' | 'home' | 'about' | 'chatbot';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const { resetToDefaults } = useAdmin();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data back to the default code? This will delete all your local changes.')) {
      resetToDefaults();
      alert('Data reset to defaults.');
    }
  };

  return (
    <div className="admin-page">
      <div className="container admin-container">
        <header className="admin-header">
          <div>
            <h1>Control Panel</h1>
            <p className="admin-subtitle">Manage Menu Products, Website Copy, and AI Assistant Training</p>
          </div>
          <div className="admin-actions-top">
            <button className="btn-danger" onClick={handleReset}>
              RESET TO DEFAULTS
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
          {activeTab === 'home' && <HomeManager />}
          {activeTab === 'about' && <AboutManager />}
          {activeTab === 'chatbot' && <ChatbotManager />}
        </div>
      </div>
    </div>
  );
};
