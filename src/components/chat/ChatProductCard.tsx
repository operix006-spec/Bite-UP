import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../data/products';
import { useNavigate } from 'react-router-dom';

interface ChatProductCardProps {
  product: Product;
  onViewProduct?: (product: Product) => void;
}

export const ChatProductCard: React.FC<ChatProductCardProps> = ({ product, onViewProduct }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewProduct) {
      onViewProduct(product);
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="chat-product-card">
      <div className="chat-product-image-wrap">
        <img 
          src={product.image} 
          alt={product.name} 
          className="chat-product-img" 
          loading="lazy"
        />
        {product.sugarNote && (
          <span className="chat-product-badge">{product.sugarNote}</span>
        )}
      </div>

      <div className="chat-product-body">
        <div className="chat-product-header-row">
          <h4 className="chat-product-title">{product.name}</h4>
          <span className="chat-product-price">{product.price.toFixed(2)} JD</span>
        </div>

        <div className="chat-product-macros">
          <span className="macro-chip">{product.calories} kcal</span>
          <span className="macro-chip-sep">·</span>
          <span className="macro-chip">{product.protein}g Protein</span>
          {product.carbs !== undefined && (
            <>
              <span className="macro-chip-sep">·</span>
              <span className="macro-chip">{product.carbs}g Carbs</span>
            </>
          )}
        </div>

        <div className="chat-product-actions">
          <button 
            type="button" 
            className="chat-btn-view"
            onClick={handleView}
          >
            VIEW PRODUCT
          </button>
          <button 
            type="button" 
            className={`chat-btn-add ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {isAdded ? 'ADDED ✓' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
};
