import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { Product } from '../../data/products';
import { ImageUpload } from './ImageUpload';

export const ProductsManager: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, reorderProducts } = useAdmin();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormState: Product = {
    id: '',
    name: '',
    category: categories[0]?.id || 'pudding',
    price: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugarNote: '',
    image: '',
    featured: false,
    nutritionFeatured: false,
    nutritionTabName: '',
  };

  const [formData, setFormData] = useState<Product>(initialFormState);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        ...initialFormState,
        category: categories[0]?.id || 'pudding',
        id: `p-${Date.now()}` // Generate temporary unique ID
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = parseFloat(value);
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.nutritionFeatured) {
      const currentFeaturedCount = products.filter(
        (p) => p.nutritionFeatured && p.id !== formData.id
      ).length;
      if (currentFeaturedCount >= 6) {
        alert('You can only feature a maximum of 6 items in the Nutrition section.');
        return;
      }
      if (!formData.nutritionTabName || formData.nutritionTabName.trim() === '') {
        alert('Please provide a Tab Name for the Nutrition section.');
        return;
      }
    }

    if (editingProduct) {
      updateProduct(formData);
    } else {
      addProduct(formData);
    }
    handleCloseModal();
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newProducts = [...products];
    const temp = newProducts[index - 1];
    newProducts[index - 1] = newProducts[index];
    newProducts[index] = temp;
    reorderProducts(newProducts);
  };

  const handleMoveDown = (index: number) => {
    if (index === products.length - 1) return;
    const newProducts = [...products];
    const temp = newProducts[index + 1];
    newProducts[index + 1] = newProducts[index];
    newProducts[index] = temp;
    reorderProducts(newProducts);
  };

  return (
    <div className="manager-section">
      <h2>Products Management</h2>
      <button className="btn-add-product" onClick={() => handleOpenModal()}>
        + ADD NEW PRODUCT
      </button>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>
                  <button onClick={() => handleMoveUp(index)} disabled={index === 0}>↑</button>
                  <button onClick={() => handleMoveDown(index)} disabled={index === products.length - 1}>↓</button>
                </td>
                <td>
                  <img src={product.image} alt={product.name} className="product-img-preview" />
                </td>
                <td><strong>{product.name}</strong></td>
                <td>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: 'rgba(101, 183, 187, 0.12)',
                    color: 'var(--c-aqua-dark)'
                  }}>
                    {categories.find(c => c.id === product.category)?.name || product.category}
                  </span>
                </td>
                <td>{product.price.toFixed(2)} JD</td>
                <td>{product.featured ? 'Yes' : 'No'}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleOpenModal(product)}>EDIT</button>
                    <button className="btn-del" onClick={() => {
                      if (window.confirm(`Delete ${product.name}?`)) {
                        deleteProduct(product.id);
                      }
                    }}>DELETE</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid-2-cols">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                  <label>ID / Slug</label>
                  <input type="text" name="id" className="form-control" value={formData.id} onChange={handleChange} required disabled={!!editingProduct} />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    {formData.category && !categories.some((c) => c.id === formData.category) && (
                      <option value={formData.category}>
                        {formData.category} (Custom)
                      </option>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (JD)</label>
                  <input type="number" step="0.01" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Calories</label>
                  <input type="number" name="calories" className="form-control" value={formData.calories} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Protein (g)</label>
                  <input type="number" name="protein" className="form-control" value={formData.protein} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input type="number" name="carbs" className="form-control" value={formData.carbs} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Fat (g)</label>
                  <input type="number" name="fat" className="form-control" value={formData.fat} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Sugar Note</label>
                <input type="text" name="sugarNote" className="form-control" value={formData.sugarNote || ''} onChange={handleChange} placeholder="e.g. No Added Sugar" />
              </div>

              <ImageUpload
                label="Product Image"
                value={formData.image || ''}
                onChange={(val) => setFormData(prev => ({ ...prev, image: val }))}
              />

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="featured" name="featured" checked={formData.featured || false} onChange={handleChange} />
                <label htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>Show on Home Page (Featured Menu)</label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input type="checkbox" id="nutritionFeatured" name="nutritionFeatured" checked={formData.nutritionFeatured || false} onChange={handleChange} />
                <label htmlFor="nutritionFeatured" style={{ margin: 0, cursor: 'pointer', color: 'var(--c-aqua-dark)' }}>Show in "Nutrition Spotlight" Section</label>
              </div>

              {formData.nutritionFeatured && (
                <div className="form-group" style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', borderLeft: '2px solid var(--c-aqua-dark)' }}>
                  <label>Nutrition Tab Name (e.g. Brownie)</label>
                  <input type="text" name="nutritionTabName" className="form-control" value={formData.nutritionTabName || ''} onChange={handleChange} required={formData.nutritionFeatured} />
                  <small style={{ color: 'var(--c-gray)', display: 'block', marginTop: '0.2rem' }}>This name will appear on the button in the home page.</small>
                </div>
              )}

              <button type="submit" className="btn-save" style={{ marginTop: '2rem' }}>
                {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
