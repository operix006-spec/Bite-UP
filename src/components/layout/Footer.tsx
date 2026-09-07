import React from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../data/config';
import { Logo } from '../common/Logo';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-dark">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <Logo size={36} className="footer-logo-svg" />
            <span className="footer-brand-text">BITE UP</span>
          </div>
          <p className="footer-tagline">{config.brandTagline}</p>
        </div>
        
        <div className="footer-nav-block">
          <nav className="footer-inline-links" aria-label="Footer Page Links">
            <Link to="/">Home</Link>
            <span className="footer-separator">·</span>
            <Link to="/menu">Menu</Link>
            <span className="footer-separator">·</span>
            <Link to="/about">About</Link>
          </nav>
          
          <div className="footer-inline-links footer-social-links" aria-label="Footer Social Links">
            <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
            <span className="footer-separator">·</span>
            <a href={`https://wa.me/${config.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>{config.deliveryNote}</p>
          <p>&copy; {new Date().getFullYear()} BITE UP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
