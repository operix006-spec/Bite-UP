import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Logo } from '../common/Logo';
import './Header.css';

export const Header: React.FC = () => {
  const { itemCount, openCart } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartBumped, setIsCartBumped] = useState(false);

  useEffect(() => {
    if (itemCount === 0) return;
    setIsCartBumped(true);
    const timer = setTimeout(() => setIsCartBumped(false), 400);
    return () => clearTimeout(timer);
  }, [itemCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`brand-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        {/* LOGO */}
        <Link to="/" className="brand-logo-link" aria-label="BITE UP Home">
          <Logo size={34} className="brand-logo-icon" />
          <span className="brand-name">BITE UP</span>
        </Link>

        {/* EDITORIAL NAV LINKS */}
        <nav className="brand-nav" aria-label="Main Navigation">
          <Link 
            to="/" 
            className={`brand-nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span>Home</span>
          </Link>
          <Link 
            to="/menu" 
            className={`brand-nav-link ${location.pathname === '/menu' ? 'active' : ''}`}
          >
            <span>Menu</span>
          </Link>
          <Link 
            to="/about" 
            className={`brand-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            <span>About</span>
          </Link>
        </nav>

        {/* CART TRIGGER */}
        <button 
          className={`brand-cart-btn ${isCartBumped ? 'bump' : ''}`} 
          onClick={openCart} 
          aria-label="Shopping Cart"
        >
          <ShoppingBag size={21} />
          <span className="cart-title">Cart</span>
          {itemCount > 0 && <span className="cart-counter">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
};
