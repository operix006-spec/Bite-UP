import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { SiteContent } from '../../data/defaultContent';
import type { Location } from '../../data/locations';
import { ImageUpload } from './ImageUpload';

export const AboutManager: React.FC = () => {
  const { siteContent, updateSiteContent, locations, addLocation, updateLocation, deleteLocation } = useAdmin();
  
  // Content State
  const [formData, setFormData] = useState<SiteContent>(siteContent);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Locations State
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);
  const initialLocState: Location = { id: '', name: '', area: '', city: 'Amman, Jordan', category: 'supermarket', mapUrl: '' };
  const [locForm, setLocForm] = useState<Location>(initialLocState);

  // --- CONTENT HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(formData);
    setSaveStatus('About Page Content saved to Local Storage!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // --- LOCATION HANDLERS ---
  const handleOpenLocModal = (loc?: Location) => {
    if (loc) {
      setEditingLoc(loc);
      setLocForm(loc);
    } else {
      setEditingLoc(null);
      setLocForm({ ...initialLocState, id: `l-${Date.now()}` });
    }
    setIsLocModalOpen(true);
  };

  const handleCloseLocModal = () => {
    setIsLocModalOpen(false);
    setEditingLoc(null);
  };

  const handleLocChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLoc) {
      updateLocation(locForm);
    } else {
      addLocation(locForm);
    }
    handleCloseLocModal();
  };

  // --- RENDER HELPERS ---
  const renderTextarea = (label: string, name: keyof SiteContent, rows = 3) => (
    <div className="form-group">
      <label>{label}</label>
      <textarea name={name} className="form-control" rows={rows} value={formData[name]} onChange={handleChange} />
    </div>
  );

  const renderInput = (label: string, name: keyof SiteContent) => (
    <div className="form-group">
      <label>{label}</label>
      <input type="text" name={name} className="form-control" value={formData[name]} onChange={handleChange} />
    </div>
  );

  return (
    <div className="manager-section">
      <h2>About Us Page Management</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--c-gray)' }}>
        Edit text content and manage the retail locations shown in the Find Us accordion.
      </p>

      {/* --- RETAIL LOCATIONS MANAGER --- */}
      <div style={{ background: 'var(--c-off-white)', padding: '1.5rem', borderRadius: '8px', marginBottom: '3rem', border: '1px solid var(--c-gray-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Retail Locations ({locations.length})</h3>
          <button type="button" className="btn-add-product" style={{ margin: 0 }} onClick={() => handleOpenLocModal()}>
            + ADD LOCATION
          </button>
        </div>
        
        <div className="products-table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Area</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id}>
                  <td><strong>{loc.name}</strong></td>
                  <td>{loc.area}</td>
                  <td><span style={{ padding: '0.2rem 0.5rem', background: loc.category === 'coffee-spot' ? 'var(--c-aqua)' : '#e2e8f0', borderRadius: '4px', fontSize: '0.8rem' }}>{loc.category}</span></td>
                  <td>
                    <div className="action-btns">
                      <button type="button" className="btn-edit" onClick={() => handleOpenLocModal(loc)}>EDIT</button>
                      <button type="button" className="btn-del" onClick={() => {
                        if (window.confirm(`Delete location: ${loc.name}?`)) deleteLocation(loc.id);
                      }}>DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CONTENT FORM --- */}
      <form onSubmit={handleSaveContent}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>1. Hero Section</h3>
        <ImageUpload label="Hero Image" value={formData.aboutHeroImg} onChange={(val) => setFormData(prev => ({...prev, aboutHeroImg: val}))} />
        {renderInput('Eyebrow', 'aboutHeroEyebrow')}
        {renderTextarea('Hero Headline (use Enter for new line)', 'aboutHeroHeadline', 2)}
        {renderTextarea('Hero Subtext', 'aboutHeroSubtext')}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>2. Our Mission</h3>
        <ImageUpload label="Section Image" value={formData.aboutMissionImg} onChange={(val) => setFormData(prev => ({...prev, aboutMissionImg: val}))} />
        {renderInput('Section Eyebrow', 'aboutMissionEyebrow')}
        {renderInput('Section Title', 'aboutMissionTitle')}
        {renderTextarea('Lead Paragraph', 'aboutMissionLeadP', 3)}
        {renderTextarea('Second Paragraph', 'aboutMissionSecondP', 4)}
        {renderInput('Image Caption', 'aboutMissionImageCaption')}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>3. Philosophy Pillars</h3>
        <div className="grid-2-cols">
          <div>
            <h4>Pillar 1</h4>
            {renderInput('Title', 'aboutPhilPillar1Title')}
            {renderTextarea('Description', 'aboutPhilPillar1Desc', 2)}
          </div>
          <div>
            <h4>Pillar 2</h4>
            {renderInput('Title', 'aboutPhilPillar2Title')}
            {renderTextarea('Description', 'aboutPhilPillar2Desc', 2)}
          </div>
          <div>
            <h4>Pillar 3</h4>
            {renderInput('Title', 'aboutPhilPillar3Title')}
            {renderTextarea('Description', 'aboutPhilPillar3Desc', 2)}
          </div>
          <div>
            <h4>Pillar 4</h4>
            {renderInput('Title', 'aboutPhilPillar4Title')}
            {renderTextarea('Description', 'aboutPhilPillar4Desc', 2)}
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>4. Retail Section Titles</h3>
        {renderInput('Section Eyebrow', 'aboutRetailEyebrow')}
        {renderInput('Section Headline', 'aboutRetailHeadline')}
        {renderTextarea('Section Subtitle', 'aboutRetailSubtitle')}

        <button type="submit" className="btn-save" style={{ marginTop: '2rem' }}>
          {saveStatus || 'SAVE ABOUT PAGE CONTENT'}
        </button>
      </form>

      {/* --- LOCATION MODAL --- */}
      {isLocModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header">
              <h3>{editingLoc ? 'Edit Location' : 'Add New Location'}</h3>
              <button type="button" className="close-btn" onClick={handleCloseLocModal}>&times;</button>
            </div>
            <form onSubmit={handleSaveLocation}>
              <div className="form-group">
                <label>Location Name</label>
                <input type="text" name="name" className="form-control" value={locForm.name} onChange={handleLocChange} required />
              </div>
              <div className="form-group">
                <label>Area (Used for grouping)</label>
                <input type="text" name="area" className="form-control" value={locForm.area} onChange={handleLocChange} placeholder="e.g. Marj Al Hamam" required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" className="form-control" value={locForm.city} onChange={handleLocChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" className="form-control" value={locForm.category} onChange={handleLocChange}>
                  <option value="supermarket">Supermarket</option>
                  <option value="coffee-spot">Coffee Spot</option>
                </select>
              </div>
              <div className="form-group">
                <label>Google Maps URL (Optional)</label>
                <input type="url" name="mapUrl" className="form-control" value={locForm.mapUrl || ''} onChange={handleLocChange} placeholder="https://maps.google.com/..." />
              </div>
              <button type="submit" className="btn-save">
                {editingLoc ? 'UPDATE LOCATION' : 'CREATE LOCATION'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
