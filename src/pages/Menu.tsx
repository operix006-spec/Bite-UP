import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Product } from '../data/products';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import './Menu.css';

type Category = 'all' | 'pudding' | 'granola';

export const Menu: React.FC = () => {
  const { addItem, isCartOpen, itemCount, cartTotal, openCart } = useCart();
  const { products } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = products.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const [addedId, setAddedId] = useState<string | null>(null);
  const [modalAdded, setModalAdded] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleAddToCartModal = () => {
    if (selectedProduct) {
      addItem(selectedProduct, modalQuantity);
      setModalAdded(true);
      setTimeout(() => {
        setModalAdded(false);
        setSelectedProduct(null);
      }, 700);
    }
  };

  return (
    <div className="menu-page">
      {/* MENU HEADER HERO */}
      <section className="menu-banner bg-aqua">
        <div className="container">
          <div className="menu-header-inner">
            <span className="section-eyebrow">AMMAN FRESH DAILY</span>
            <h1 className="menu-headline">THE BITE UP MENU</h1>
            <p className="menu-subline">
              High-protein, no added sugar desserts crafted to satisfy honest cravings while respecting your momentum.
            </p>
          </div>
        </div>
      </section>

      <div className="container menu-body-container">
        {/* EDITORIAL CATEGORY NAVIGATION */}
        <div className="menu-filter-bar">
          <button 
            className={`menu-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            ALL ITEMS ({products.length})
          </button>
          <button 
            className={`menu-tab-btn ${activeCategory === 'pudding' ? 'active' : ''}`}
            onClick={() => setActiveCategory('pudding')}
          >
            PROTEIN PUDDINGS ({products.filter(p => p.category === 'pudding').length})
          </button>
          <button 
            className={`menu-tab-btn ${activeCategory === 'granola' ? 'active' : ''}`}
            onClick={() => setActiveCategory('granola')}
          >
            CRUNCHY GRANOLAS ({products.filter(p => p.category === 'granola').length})
          </button>
        </div>

        {/* REFINED PRODUCT GRID */}
        <div className="editorial-menu-grid">
          {filteredProducts.map((product) => (
            <div 
              className="editorial-product-card" 
              key={product.id} 
              onClick={() => handleProductClick(product)}
            >
              <div className="product-visual-frame">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-card-body">
                <h3 className="product-title">{product.name}</h3>

                <div className="product-nutrition-line">
                  <span>{product.calories} kcal · {product.protein}g P</span>
                </div>

                <div className="product-card-footer">
                  <span className="product-price">{product.price.toFixed(2)} JD</span>
                  <button 
                    className={`btn-quick-add ${addedId === product.id ? 'added' : ''}`}
                    onClick={(e) => handleQuickAdd(e, product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {addedId === product.id ? 'ADDED ✓' : '+ ADD'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STICKY BOTTOM CART BAR (Mobile only) */}
      {isMobile && itemCount > 0 && !isCartOpen && (
        <div className="mobile-cart-bar" onClick={openCart}>
          <span>{itemCount} items • {cartTotal.toFixed(2)} JD</span>
          <span className="view-cart-text">VIEW CART →</span>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL / SHEET */}
      {selectedProduct && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)} />
          <div className={`product-modal ${isMobile ? 'sheet' : 'modal'}`}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close modal">
              <X size={22} />
            </button>
            <div className="modal-content-scroll">
              <div className="modal-image-container">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-details">
                <span className="modal-eyebrow">{selectedProduct.category.toUpperCase()}</span>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="modal-price">{selectedProduct.price.toFixed(2)} JD</div>
                
                <div className="modal-nutrition-grid">
                  <div className="mn-box">
                    <span className="mn-val">{selectedProduct.calories}</span>
                    <span className="mn-lbl">CALORIES</span>
                  </div>
                  <div className="mn-box">
                    <span className="mn-val">{selectedProduct.protein}g</span>
                    <span className="mn-lbl">PROTEIN</span>
                  </div>
                  <div className="mn-box">
                    <span className="mn-val">{selectedProduct.carbs}g</span>
                    <span className="mn-lbl">CARBS</span>
                  </div>
                  <div className="mn-box">
                    <span className="mn-val">{selectedProduct.fat}g</span>
                    <span className="mn-lbl">FAT</span>
                  </div>
                </div>

                <div className="modal-sugar-note">
                  ✓ {selectedProduct.sugarNote || 'NO ADDED SUGAR'}
                </div>

                <p className="modal-desc-note">
                  Freshly prepared with pure whey isolate, creamy textures, and honest ingredients. 
                  Keep chilled and consume within 5 days.
                </p>
                
                <div className="modal-actions">
                  <div className="qty-selector">
                    <button 
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span>{modalQuantity}</span>
                    <button 
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button className={`btn btn-primary add-modal-btn ${modalAdded ? 'added' : ''}`} onClick={handleAddToCartModal}>
                    {modalAdded ? 'ADDED ✓' : `ADD TO CART • ${(selectedProduct.price * modalQuantity).toFixed(2)} JD`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
