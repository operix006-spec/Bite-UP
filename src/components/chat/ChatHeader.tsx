import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Logo } from '../common/Logo';

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <header className="chat-header">
      <div className="chat-header-brand">
        <div className="chat-header-avatar">
          <Logo size={20} className="chat-header-logo" />
          <span className="chat-header-status-indicator" title="Online" />
        </div>
        <div className="chat-header-info">
          <div className="chat-header-title-row">
            <h3 className="chat-header-title">BITE UP Assistant</h3>
            <span className="chat-header-badge">
              <Sparkles size={11} className="chat-badge-icon" />
              <span>AI</span>
            </span>
          </div>
          <p className="chat-header-subtext">Here to help you choose your next bite.</p>
        </div>
      </div>

      <button 
        type="button" 
        className="chat-header-close-btn"
        onClick={onClose}
        aria-label="Close BITE UP Assistant"
      >
        <X size={18} />
      </button>
    </header>
  );
};
