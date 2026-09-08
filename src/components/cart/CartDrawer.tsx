import React, { useState } from 'react';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { generateWhatsAppOrderUrl } from '../../utils/WhatsAppHelper';
import { Link } from 'react-router-dom';
import './CartDrawer.css';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, cartTotal } = useCart();
  const [notes, setNotes] = useState('');

  const handleOrder = () => {
    const url = generateWhatsAppOrderUrl(items, cartTotal, notes);
    window.open(url, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>YOUR BITE</h2>
          <button className="close-btn" onClick={closeCart} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>YOUR BITE IS EMPTY.</p>
              <p className="cart-empty-sub">Let's fix that.</p>
              <Link to="/menu" className="btn btn-primary" onClick={closeCart}>
                EXPLORE MENU
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h4>{item.product.name}</h4>
                        <button className="remove-btn" onClick={() => removeItem(item.product.id)}>
                          <X size={16} />
                        </button>
                      </div>
                      <div className="cart-item-price">{(Number(item.product.price) || 0).toFixed(2)} JD</div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-notes">
                  <label htmlFor="order-notes">ORDER NOTES</label>
                  <textarea 
                    id="order-notes" 
                    placeholder="Anything you'd like us to know?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <div className="cart-total-row">
                  <span>TOTAL</span>
                  <span>{(Number(cartTotal) || 0).toFixed(2)} JD</span>
                </div>

                <button className="btn btn-primary w-full order-btn" onClick={handleOrder}>
                  ORDER VIA WHATSAPP <ArrowRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
