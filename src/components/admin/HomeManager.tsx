import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { SiteContent } from '../../data/defaultContent';
import { ImageUpload } from './ImageUpload';

export const HomeManager: React.FC = () => {
  const { siteContent, updateSiteContent } = useAdmin();
  const [formData, setFormData] = useState<SiteContent>(siteContent);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(formData);
    setSaveStatus('Home Page Changes saved to Local Storage!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const renderTextarea = (label: string, name: keyof SiteContent, rows = 3) => (
    <div className="form-group">
      <label>{label}</label>
      <textarea
        name={name}
        className="form-control"
        rows={rows}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  );

  const renderInput = (label: string, name: keyof SiteContent) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        name={name}
        className="form-control"
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="manager-section">
      <h2>Home Page Management</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--c-gray)' }}>
        Edit all text fields shown on the Home Page.
      </p>

      <form onSubmit={handleSave}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>1. Hero Section</h3>
        <ImageUpload label="Hero Background Image" value={formData.homeHeroImg} onChange={(val) => setFormData(prev => ({...prev, homeHeroImg: val}))} />
        {renderTextarea('Hero Headline (use Enter for new line)', 'homeHeroHeadline', 2)}
        {renderTextarea('Hero Subtext', 'homeHeroSubtext')}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>2. Featured Menu</h3>
        {renderInput('Section Eyebrow', 'homeFeaturedEyebrow')}
        {renderInput('Section Headline', 'homeFeaturedHeadline')}
        {renderTextarea('Section Subline', 'homeFeaturedSubline', 2)}
        {renderInput('Bottom Hint Text', 'homeFeaturedBottomHint')}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>3. Find Us Preview</h3>
        {renderInput('Section Eyebrow', 'homeFindEyebrow')}
        {renderInput('Section Headline', 'homeFindHeadline')}
        {renderTextarea('Section Subline', 'homeFindSubline', 2)}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>4. Why Bite Up</h3>
        {renderInput('Section Eyebrow', 'homeWhyEyebrow')}
        {renderTextarea('Section Headline', 'homeWhyHeadline', 2)}
        {renderTextarea('Section Subtitle', 'homeWhySubtitle')}
        <div className="grid-2-cols">
          <div>
            <h4>Pillar 1</h4>
            {renderInput('Title', 'homeWhyPillar1Title')}
            {renderInput('Description', 'homeWhyPillar1Desc')}
          </div>
          <div>
            <h4>Pillar 2</h4>
            {renderInput('Title', 'homeWhyPillar2Title')}
            {renderInput('Description', 'homeWhyPillar2Desc')}
          </div>
          <div>
            <h4>Pillar 3</h4>
            {renderInput('Title', 'homeWhyPillar3Title')}
            {renderInput('Description', 'homeWhyPillar3Desc')}
          </div>
          <div>
            <h4>Pillar 4</h4>
            {renderInput('Title', 'homeWhyPillar4Title')}
            {renderInput('Description', 'homeWhyPillar4Desc')}
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>5. Nutrition</h3>
        {renderInput('Section Eyebrow', 'homeNutritionEyebrow')}
        {renderInput('Section Headline', 'homeNutritionHeadline')}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>6. Our Story</h3>
        <ImageUpload label="Section Image" value={formData.homeStoryImg} onChange={(val) => setFormData(prev => ({...prev, homeStoryImg: val}))} />
        {renderInput('Section Eyebrow', 'homeStoryEyebrow')}
        {renderTextarea('Section Headline', 'homeStoryHeadline', 2)}
        {renderTextarea('Story Body Text', 'homeStoryBody', 5)}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>7. Instagram Community</h3>
        {renderInput('Section Eyebrow (e.g. FOLLOW @BIT.EUP)', 'homeIgEyebrow')}
        {renderInput('Profile Link (URL)', 'homeIgLinkUrl')}
        {renderInput('Section Headline', 'homeIgHeadline')}
        {renderTextarea('Section Subtitle', 'homeIgSubtitle')}
        {renderInput('Featured Post / Reel URL', 'homeIgPostUrl')}

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>8. Final CTA</h3>
        {renderInput('Headline', 'homeCtaHeadline')}
        {renderInput('Subtext', 'homeCtaSubtext')}

        <button type="submit" className="btn-save" style={{ marginTop: '2rem' }}>
          {saveStatus || 'SAVE HOME PAGE CHANGES'}
        </button>
      </form>
    </div>
  );
};
