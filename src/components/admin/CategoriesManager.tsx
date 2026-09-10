import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { MenuCategory } from '../../data/defaultContent';

export const CategoriesManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, reorderCategories } = useAdmin();
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenModal = (cat?: MenuCategory) => {
    setErrorMessage('');
    if (cat) {
      setEditingCategory(cat);
      setFormName(cat.name);
      setFormId(cat.id);
    } else {
      setEditingCategory(null);
      setFormName('');
      setFormId('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormName('');
    setFormId('');
    setErrorMessage('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormName(val);
    // If adding new category and ID hasn't been manually detached, auto-generate slug
    if (!editingCategory) {
      const slug = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormId(slug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = formName.trim();
    const cleanId = formId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    if (!cleanName) {
      setErrorMessage('Please provide a category name.');
      return;
    }
    if (!cleanId) {
      setErrorMessage('Please provide a category ID / slug (English lowercase).');
      return;
    }

    // Check duplicate ID
    const isDuplicate = categories.some(
      (c) => c.id === cleanId && (!editingCategory || c.id !== editingCategory.id)
    );
    if (isDuplicate) {
      setErrorMessage(`A category with ID "${cleanId}" already exists. Please choose a different ID.`);
      return;
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        id: cleanId,
        name: cleanName
      });
    } else {
      await addCategory({
        id: cleanId,
        name: cleanName
      });
    }

    handleCloseModal();
  };

  const handleDelete = async (cat: MenuCategory) => {
    const matchingProducts = products.filter((p) => p.category === cat.id);
    let confirmMsg = `Are you sure you want to delete the category "${cat.name}"?`;
    if (matchingProducts.length > 0) {
      confirmMsg += `\n\n⚠️ NOTE: There are ${matchingProducts.length} product(s) currently in this category. They will remain in the database, but will not have a dedicated tab on the menu.`;
    }

    if (window.confirm(confirmMsg)) {
      await deleteCategory(cat.id);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...categories];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    await reorderCategories(newOrder);
  };

  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1) return;
    const newOrder = [...categories];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    await reorderCategories(newOrder);
  };

  return (
    <div className="manager-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Menu Categories Management</h2>
          <p style={{ color: 'var(--c-gray)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Control the category navigation tabs shown on the public Menu page and organize your products.
          </p>
        </div>
        <button className="btn-add-product" onClick={() => handleOpenModal()}>
          + ADD NEW CATEGORY
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Order</th>
              <th>Display Name (Menu Tab)</th>
              <th>Slug / Identifier</th>
              <th>Assigned Products</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <tr key={cat.id}>
                  <td>
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0} title="Move tab earlier">↑</button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === categories.length - 1} title="Move tab later">↓</button>
                  </td>
                  <td>
                    <strong style={{ fontSize: '1rem', letterSpacing: '0.02em' }}>{cat.name}</strong>
                  </td>
                  <td>
                    <code style={{ background: 'rgba(17,20,20,0.06)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {cat.id}
                    </code>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      backgroundColor: count > 0 ? 'rgba(101, 183, 187, 0.15)' : 'rgba(17, 20, 20, 0.05)',
                      color: count > 0 ? 'var(--c-aqua-dark)' : 'var(--c-gray)'
                    }}>
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleOpenModal(cat)}>EDIT</button>
                      <button className="btn-del" onClick={() => handleDelete(cat)}>DELETE</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            {errorMessage && (
              <div style={{
                backgroundColor: '#fed7d7',
                color: '#c53030',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Display Name (Shown on Menu Button)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formName}
                  onChange={handleNameChange}
                  placeholder="e.g. PROTEIN BARS or ENERGY BITES"
                  required
                />
                <small style={{ color: 'var(--c-gray)', display: 'block', marginTop: '4px' }}>
                  This is the exact label customers will see on the Menu page tab.
                </small>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Category ID / Slug</label>
                <input
                  type="text"
                  className="form-control"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="e.g. bars or protein-bars"
                  required
                />
                <small style={{ color: 'var(--c-gray)', display: 'block', marginTop: '4px' }}>
                  Unique identifier stored with products (English letters, numbers, hyphens).
                </small>
              </div>

              <button type="submit" className="btn-save" style={{ marginTop: '1.5rem', width: '100%' }}>
                {editingCategory ? 'SAVE CATEGORY CHANGES' : 'CREATE CATEGORY'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
