import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Plus, Minus, ExternalLink } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { InstagramEmbed } from '../components/common/InstagramEmbed';
import './Home.css';

export const Home: React.FC = () => {
  const { addItem } = useCart();
  const { products, siteContent, locations, categories } = useAdmin();

  // 02. Featured Products: exactly 4 items
  const featuredIds = ['p-brownie', 'p-cookies', 'p-bounty', 'p-lotus'];
  const matchedFeatured = products.filter(p => featuredIds.includes(p.id));
  const featuredProducts = matchedFeatured.length > 0 ? matchedFeatured : products.slice(0, 4);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewAdded, setQuickViewAdded] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // 03. Find BITE UP Preview: First 4 locations dynamically
  const previewLocations = locations.slice(0, 4);

  // 05. Nutrition Spotlight State
  const nutritionProducts = products.filter(p => p.nutritionFeatured).slice(0, 6);
  const defaultSelectedId = nutritionProducts.length > 0 ? nutritionProducts[0]?.id : (products[0]?.id || '');
  const [selectedNutritionId, setSelectedNutritionId] = useState(defaultSelectedId);
  const selectedProduct = nutritionProducts.find(p => p.id === selectedNutritionId) || nutritionProducts[0] || products[0];

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewQty(1);
  };

  const handleCardAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleQuickViewAddToCart = () => {
    if (quickViewProduct) {
      addItem(quickViewProduct, quickViewQty);
      setQuickViewAdded(true);
      setTimeout(() => {
        setQuickViewAdded(false);
        setQuickViewProduct(null);
      }, 700);
    }
  };

  return (
    <div className="home-page">
      {/* ===================================================
         01 — HERO: Signature Aqua / Product-Led Campaign
         =================================================== */}
      <section className="hero-section bg-aqua">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-headline">
              {(siteContent?.homeHeroHeadline || '').split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? <span className="hero-accent">{line}</span> : line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="hero-subtext">
              {siteContent?.homeHeroSubtext || ''}
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary">
                EXPLORE MENU <ArrowRight size={18} />
              </Link>
              <Link to="/about#locations" className="btn btn-secondary">
                FIND BITE UP
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-frame">
              <img
                src={siteContent.homeHeroImg}
                alt="BITE UP Protein Pudding & Granola"
                className="hero-product-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
         02 — FEATURED MENU: Clean 4-Product Grid + Quick View
         =================================================== */}
      <section className="featured-section bg-white" id="featured-menu">
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-eyebrow">{siteContent.homeFeaturedEyebrow}</span>
              <h2 className="section-headline">{siteContent.homeFeaturedHeadline}</h2>
              <p className="featured-subline">{siteContent.homeFeaturedSubline}</p>
            </div>
            <Link to="/menu" className="title-action-link">
              EXPLORE FULL MENU <ArrowRight size={16} />
            </Link>
          </div>

          <div className="featured-product-grid">
            {featuredProducts.map((product) => (
              <div 
                className="featured-card" 
                key={product.id}
                onClick={() => handleOpenQuickView(product)}
              >
                <div className="card-image-link">
                  <div className="card-image-frame">
                    <img src={product.image} alt={product.name} />
                  </div>
                </div>

                <div className="card-details">
                  <div className="card-title-link">
                    <h3>{product.name}</h3>
                  </div>

                  <div className="card-nutrition-summary">
                    <span>{product.calories} kcal · {product.protein}g P</span>
                  </div>

                  <div className="card-footer-action">
                    <span className="card-price">{(Number(product?.price) || 0).toFixed(2)} JD</span>
                    <button
                      className={`card-quick-add ${addedId === product.id ? 'added' : ''}`}
                      onClick={(e) => handleCardAdd(e, product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {addedId === product.id ? 'ADDED ✓' : '+ ADD'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="featured-bottom-cta">
            <p className="featured-bottom-hint">{siteContent.homeFeaturedBottomHint}</p>
            <Link to="/menu" className="btn btn-primary featured-view-all-btn">
              VIEW FULL MENU <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
         03 — FIND BITE UP: Location Previews across Amman
         =================================================== */}
      <section className="locations-preview-section bg-aqua" id="find-bite-up">
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-eyebrow">{siteContent.homeFindEyebrow}</span>
              <h2 className="section-headline">{siteContent.homeFindHeadline}</h2>
              <p className="featured-subline">{siteContent.homeFindSubline}</p>
            </div>
            <Link to="/about#locations" className="title-action-link">
              VIEW ALL LOCATIONS <ArrowRight size={16} />
            </Link>
          </div>

          <div className="location-cards-grid">
            {previewLocations.map((loc) => (
              <div className="home-loc-card" key={loc.id}>
                <div className="home-loc-top">
                  <span className="home-loc-area">{(loc.area || '').toUpperCase()}</span>
                  <span className="home-loc-badge">
                    {loc.category === 'coffee-spot' ? 'Coffee' : 'Supermarket'}
                  </span>
                </div>
                <h3 className="home-loc-name">{loc.name}</h3>
                <a
                  href={loc.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.area + ' Amman')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-loc-action"
                  title={`View ${loc.name} on Google Maps`}
                >
                  <span>VIEW DIRECTIONS</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>

          <div className="locations-bottom-cta">
            <Link to="/about#locations" className="btn btn-primary">
              VIEW ALL LOCATIONS <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
         04 — WHY BITE UP: Honest Nutrition Values
         =================================================== */}
      <section className="values-section bg-off-white">
        <div className="container">
          <div className="values-header">
            <span className="section-eyebrow">{siteContent.homeWhyEyebrow}</span>
            <h2 className="manifesto-title">
              {(siteContent?.homeWhyHeadline || '').split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p className="manifesto-subtitle">
              {siteContent.homeWhySubtitle}
            </p>
          </div>

          <div className="values-editorial-grid">
            <div className="value-pillar">
              <span className="pillar-num">01</span>
              <h3>{siteContent.homeWhyPillar1Title}</h3>
              <p>{siteContent.homeWhyPillar1Desc}</p>
            </div>

            <div className="value-pillar">
              <span className="pillar-num">02</span>
              <h3>{siteContent.homeWhyPillar2Title}</h3>
              <p>{siteContent.homeWhyPillar2Desc}</p>
            </div>

            <div className="value-pillar">
              <span className="pillar-num">03</span>
              <h3>{siteContent.homeWhyPillar3Title}</h3>
              <p>{siteContent.homeWhyPillar3Desc}</p>
            </div>

            <div className="value-pillar">
              <span className="pillar-num">04</span>
              <h3>{siteContent.homeWhyPillar4Title}</h3>
              <p>{siteContent.homeWhyPillar4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
         05 — NUTRITION: Compact "WHAT'S IN YOUR BITE?"
         =================================================== */}
      <section className="spotlight-section bg-aqua">
        <div className="container">
          <div className="spotlight-header">
            <span className="spotlight-eyebrow">{siteContent.homeNutritionEyebrow}</span>
            <h2 className="spotlight-headline">{siteContent.homeNutritionHeadline}</h2>

            {/* Discrete Custom Tabs */}
            <div className="spotlight-nav-strip">
              {nutritionProducts.map((p) => {
                const label = p.nutritionTabName || p.name.replace('Pudding ', '').replace('Granola ', '');
                return (
                  <button
                    key={p.id}
                    className={`spotlight-tab ${selectedNutritionId === p.id ? 'active' : ''}`}
                    onClick={() => setSelectedNutritionId(p.id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="spotlight-editorial-display">
            {/* PRODUCT PHOTO SIDE */}
            <div className="spotlight-photo-column">
              <div className="spotlight-photo-frame">
                <img src={selectedProduct?.image || '/images/products/pudding-brownie.png'} alt={selectedProduct?.name || 'Protein Pudding'} />
              </div>
              <div className="spotlight-product-caption">
                <h4>{selectedProduct?.name || 'Protein Pudding'}</h4>
                <span className="caption-price">{(Number(selectedProduct?.price) || 0).toFixed(2)} JD</span>
              </div>
            </div>

            {/* LARGE NUTRITION NUMBERS SIDE */}
            <div className="spotlight-numbers-column">
              <div className="numbers-stat-grid">
                <div className="big-stat-tile">
                  <span className="stat-number">{selectedProduct.calories}</span>
                  <span className="stat-label">CALORIES</span>
                </div>

                <div className="big-stat-tile">
                  <span className="stat-number">{selectedProduct.protein}g</span>
                  <span className="stat-label">PROTEIN</span>
                </div>

                <div className="big-stat-tile">
                  <span className="stat-number">{selectedProduct.carbs}g</span>
                  <span className="stat-label">CARBS</span>
                </div>

                <div className="big-stat-tile">
                  <span className="stat-number">{selectedProduct.fat}g</span>
                  <span className="stat-label">FAT</span>
                </div>
              </div>

              <div className="spotlight-sugar-callout">
                <span className="sugar-check">✓</span>
                <span className="sugar-text">{selectedProduct.sugarNote || 'NO ADDED SUGAR'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
         06 — OUR STORY: Editorial Split
         =================================================== */}
      <section className="story-section bg-dark">
        <div className="container story-split-container">
          <div className="story-editorial-copy">
            <span className="story-eyebrow">{siteContent.homeStoryEyebrow}</span>
            <h2 className="story-headline" style={{ whiteSpace: 'pre-wrap' }}>
              {siteContent.homeStoryHeadline}
            </h2>
            <p className="story-body" style={{ whiteSpace: 'pre-wrap' }}>
              {siteContent.homeStoryBody}
            </p>
            <div className="story-cta-row">
              <Link to="/about" className="btn btn-secondary-white">
                OUR STORY <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="story-photo-wrapper">
            <img
              src={siteContent.homeStoryImg}
              alt="BITE UP Brand Campaign in Amman"
              className="story-campaign-img"
            />
          </div>
        </div>
      </section>

      {/* ===================================================
         07 — INSTAGRAM: Social Proof & Lifestyle
         =================================================== */}
      <section className="instagram-section bg-off-white">
        <div className="container">
          <div className="section-title-center">
            <a
              href={siteContent.homeIgLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="section-eyebrow ig-eyebrow-link"
              title="Visit @bit.eup on Instagram"
            >
              {siteContent.homeIgEyebrow}
            </a>
            <h2 className="section-headline">{siteContent.homeIgHeadline}</h2>
            <p className="instagram-subtitle">{siteContent.homeIgSubtitle}</p>
          </div>

          {/* Automatic Official Instagram Post Embed */}
          <div className="instagram-card-wrapper">
            <InstagramEmbed postUrl={siteContent.homeIgPostUrl} maxWidth={480} />
          </div>

          <div className="instagram-card-action">
            <a
              href={siteContent.homeIgPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-view-post-btn"
              title="View this post on Instagram"
            >
              <span>VIEW POST</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ===================================================
         08 — FINAL CTA: Closing Action
         =================================================== */}
      <section className="final-cta-section bg-aqua">
        <div className="container cta-inner-wrap">
          <h2 className="cta-headline">{siteContent.homeCtaHeadline}</h2>
          <p className="cta-subtext">
            {siteContent.homeCtaSubtext}
          </p>
          <div className="cta-action-row">
            <Link to="/menu" className="btn btn-primary">
              EXPLORE MENU <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
         PRODUCT QUICK VIEW MODAL
         =================================================== */}
      {quickViewProduct && (
        <>
          <div className="modal-overlay" onClick={() => setQuickViewProduct(null)} />
          <div className="quick-view-dialog">
            <button
              className="modal-close"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="quick-view-content">
              <div className="quick-view-image-box">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} />
              </div>

              <div className="quick-view-details">
                <span className="quick-view-category">
                  {(categories?.find(c => c.id === quickViewProduct.category)?.name || quickViewProduct.category || '').toUpperCase()}
                </span>
                <h2 className="quick-view-title">{quickViewProduct.name}</h2>
                <div className="quick-view-price">{(Number(quickViewProduct.price) || 0).toFixed(2)} JD</div>

                <div className="quick-view-macro-grid">
                  <div className="qv-stat-tile">
                    <span className="qv-val">{quickViewProduct.calories}</span>
                    <span className="qv-lbl">CALORIES</span>
                  </div>
                  <div className="qv-stat-tile">
                    <span className="qv-val">{quickViewProduct.protein}g</span>
                    <span className="qv-lbl">PROTEIN</span>
                  </div>
                  <div className="qv-stat-tile">
                    <span className="qv-val">{quickViewProduct.carbs}g</span>
                    <span className="qv-lbl">CARBS</span>
                  </div>
                  <div className="qv-stat-tile">
                    <span className="qv-val">{quickViewProduct.fat}g</span>
                    <span className="qv-lbl">FAT</span>
                  </div>
                </div>

                <div className="quick-view-sugar">
                  ✓ {quickViewProduct.sugarNote || 'NO ADDED SUGAR'}
                </div>

                <div className="quick-view-actions">
                  <div className="qty-selector">
                    <button
                      onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{quickViewQty}</span>
                    <button
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    className={`btn btn-primary qv-add-btn ${quickViewAdded ? 'added' : ''}`}
                    onClick={handleQuickViewAddToCart}
                  >
                    {quickViewAdded ? 'ADDED ✓' : `ADD TO CART • ${((Number(quickViewProduct.price) || 0) * quickViewQty).toFixed(2)} JD`}
                  </button>
                </div>

                <div className="quick-view-footer-nav">
                  <Link
                    to="/menu"
                    className="quick-view-menu-link"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    VIEW FULL MENU →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
