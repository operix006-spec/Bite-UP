import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { SiteContent } from '../../data/defaultContent';
import type { Location } from '../../data/locations';
import { ImageUpload } from './ImageUpload';

export const AboutManager: React.FC = () => {
  const {
    siteContent,
    updateSiteContent,
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    areas,
    addArea,
    updateArea,
    deleteArea,
  } = useAdmin();
  
  // Content State
  const [formData, setFormData] = useState<SiteContent>(siteContent);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Areas State
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [areaFormName, setAreaFormName] = useState('');
  const [areaErrorMessage, setAreaErrorMessage] = useState('');

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

  // --- AREA HANDLERS ---
  const handleOpenAreaModal = (area?: string) => {
    setAreaErrorMessage('');
    if (area) {
      setEditingArea(area);
      setAreaFormName(area);
    } else {
      setEditingArea(null);
      setAreaFormName('');
    }
    setIsAreaModalOpen(true);
  };

  const handleCloseAreaModal = () => {
    setIsAreaModalOpen(false);
    setEditingArea(null);
    setAreaFormName('');
    setAreaErrorMessage('');
  };

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    setAreaErrorMessage('');
    const clean = areaFormName.trim();
    if (!clean) {
      setAreaErrorMessage('Please enter an area name.');
      return;
    }

    const isDuplicate = areas.some(
      (a) => a.toLowerCase() === clean.toLowerCase() && (!editingArea || a.toLowerCase() !== editingArea.toLowerCase())
    );
    if (isDuplicate) {
      setAreaErrorMessage(`An area named "${clean}" already exists.`);
      return;
    }

    if (editingArea) {
      await updateArea(editingArea, clean);
    } else {
      await addArea(clean);
    }
    handleCloseAreaModal();
  };

  const handleDeleteArea = async (areaName: string) => {
    const assignedCount = locations.filter((l) => l.area === areaName).length;
    let confirmMsg = `Are you sure you want to delete the area "${areaName}"?`;
    if (assignedCount > 0) {
      confirmMsg += `\n\n⚠️ NOTE: There are ${assignedCount} location(s) currently assigned to this area. Deleting the area will not delete the locations, but they may no longer appear in a grouped accordion tab.`;
    }

    if (window.confirm(confirmMsg)) {
      await deleteArea(areaName);
    }
  };

  // --- LOCATION HANDLERS ---
  const handleOpenLocModal = (loc?: Location) => {
    if (loc) {
      setEditingLoc(loc);
      setLocForm(loc);
    } else {
      setEditingLoc(null);
      setLocForm({
        ...initialLocState,
        area: areas[0] || '',
        id: `l-${Date.now()}`
      });
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

      {/* --- RETAIL AREAS MANAGER (ABOVE LOCATIONS) --- */}
      <div style={{ background: 'var(--c-off-white)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--c-gray-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Retail Areas ({areas.length})</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--c-gray)', fontSize: '0.85rem' }}>
              Manage geographic areas used to group retail locations in the Find Us section.
            </p>
          </div>
          <button type="button" className="btn-add-product" style={{ margin: 0 }} onClick={() => handleOpenAreaModal()}>
            + ADD AREA
          </button>
        </div>

        <div className="products-table-wrapper" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          <table className="products-table">
            <thead>
              <tr>
                <th>Area Name</th>
                <th>Assigned Locations</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => {
                const count = locations.filter((l) => l.area === a).length;
                return (
                  <tr key={a}>
                    <td><strong>{a}</strong></td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: count > 0 ? 'rgba(101, 183, 187, 0.15)' : 'rgba(17, 20, 20, 0.05)',
                        color: count > 0 ? 'var(--c-aqua-dark)' : 'var(--c-gray)'
                      }}>
                        {count} {count === 1 ? 'Location' : 'Locations'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button type="button" className="btn-edit" onClick={() => handleOpenAreaModal(a)}>EDIT</button>
                        <button type="button" className="btn-del" onClick={() => handleDeleteArea(a)}>DELETE</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- RETAIL LOCATIONS MANAGER --- */}
      <div style={{ background: 'var(--c-off-white)', padding: '1.5rem', borderRadius: '8px', marginBottom: '3rem', border: '1px solid var(--c-gray-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
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
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(17,20,20,0.06)',
                      fontSize: '0.85rem'
                    }}>
                      {loc.area}
                    </span>
                  </td>
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
                <select
                  name="area"
                  className="form-control"
                  value={locForm.area}
                  onChange={handleLocChange}
                  required
                >
                  {areas.length === 0 && <option value="">-- No areas defined --</option>}
                  {locForm.area && !areas.includes(locForm.area) && (
                    <option value={locForm.area}>{locForm.area} (Custom)</option>
                  )}
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <small style={{ color: 'var(--c-gray)', display: 'block', marginTop: '4px' }}>
                  Select from your managed areas list above.
                </small>
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

      {/* --- AREA MODAL --- */}
      {isAreaModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '460px' }}>
            <div className="admin-modal-header">
              <h3>{editingArea ? 'Edit Retail Area' : 'Add New Retail Area'}</h3>
              <button type="button" className="close-btn" onClick={handleCloseAreaModal}>&times;</button>
            </div>

            {areaErrorMessage && (
              <div style={{
                backgroundColor: '#fed7d7',
                color: '#c53030',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {areaErrorMessage}
              </div>
            )}

            <form onSubmit={handleSaveArea}>
              <div className="form-group">
                <label>Area Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={areaFormName}
                  onChange={(e) => setAreaFormName(e.target.value)}
                  placeholder="e.g. Marj Al Hamam, Abdoun, Khalda..."
                  required
                  autoFocus
                />
                {editingArea && (
                  <small style={{ color: 'var(--c-gray)', display: 'block', marginTop: '6px' }}>
                    💡 Renaming this area will automatically update all locations currently assigned to "{editingArea}".
                  </small>
                )}
              </div>
              <button type="submit" className="btn-save" style={{ marginTop: '1.5rem', width: '100%' }}>
                {editingArea ? 'UPDATE AREA' : 'CREATE AREA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
