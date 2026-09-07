import React, { useRef } from 'react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader and Canvas to compress the image before saving to LocalStorage
    // LocalStorage has a ~5MB limit, so storing raw images will break it quickly.
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality to keep base64 string small
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onChange(dataUrl);
        
        // Reset file input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image URL or click Upload"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            whiteSpace: 'nowrap', 
            padding: '0.8rem 1rem', 
            background: 'var(--c-dark)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          UPLOAD FROM DEVICE
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      {value && value.startsWith('data:image') && (
        <div style={{ marginTop: '10px' }}>
          <img src={value} alt="Preview" style={{ maxHeight: '100px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
      )}
    </div>
  );
};
