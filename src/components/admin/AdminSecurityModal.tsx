import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShieldCheck, Lock, User, Check, AlertCircle } from 'lucide-react';

interface AdminSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({ isOpen, onClose }) => {
  const { siteContent, updateCredentials } = useAdmin();
  const currentUsername = siteContent.adminUsername || 'admin';
  const currentPassword = siteContent.adminPassword || 'biteup2026';

  const [currentPwInput, setCurrentPwInput] = useState('');
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Verification
    if (currentPwInput.trim() !== currentPassword.trim()) {
      setErrorMsg('كلمة المرور الحالية غير صحيحة (Current password incorrect)');
      return;
    }

    if (!newUsername.trim()) {
      setErrorMsg('يرجى إدخال اسم مستخدم صحيح');
      return;
    }

    if (!newPassword) {
      setErrorMsg('يرجى إدخال كلمة المرور الجديدة');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg('كلمة المرور يجب أن تكون 4 خانات على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور');
      return;
    }

    try {
      setIsSaving(true);
      await updateCredentials(newUsername.trim(), newPassword.trim());
      setSuccessMsg('تم تحديث بيانات الدخول بنجاح! تم الحفظ سحابياً.');
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content" style={{ maxWidth: '480px' }}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--c-aqua-dark, #357F83)" />
            <h3 style={{ margin: 0 }}>Admin Security Settings</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--c-gray)', marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
          Change your Control Panel username and password. Changes sync automatically across all devices.
        </p>

        {errorMsg && (
          <div className="admin-modal-alert error" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fed7d7',
            color: '#c53030',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="admin-modal-alert success" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#c6f6d5',
            color: '#22543d',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            <Check size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={15} /> Current Password (للتأكيد)
            </label>
            <input
              type="password"
              className="form-control"
              value={currentPwInput}
              onChange={(e) => setCurrentPwInput(e.target.value)}
              placeholder="Enter current password"
              required
              autoFocus
            />
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', margin: '1.25rem 0' }}></div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={15} /> New Username
            </label>
            <input
              type="text"
              className="form-control"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g. admin"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={15} /> New Password
            </label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={15} /> Confirm New Password
            </label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-admin-cancel"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isSaving}
              style={{ flex: 2, margin: 0 }}
            >
              {isSaving ? 'Saving...' : 'UPDATE CREDENTIALS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
