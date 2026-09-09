import React, { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ChatLauncherProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatLauncher: React.FC<ChatLauncherProps> = ({ isOpen, onClick }) => {
  const { itemCount } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // If chat is open on mobile or desktop, hide the floating button so it doesn't obstruct
  if (isOpen) return null;

  // If cart has items on mobile, the mobile sticky cart bar sits at bottom: 24px (height ~56px).
  // In that case, add the class 'with-mobile-cart' so it stays safely above it (~96px from bottom).
  const hasCartBar = itemCount > 0;

  return (
    <div 
      className={`chat-launcher-container ${hasCartBar ? 'with-mobile-cart' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* DESKTOP TOOLTIP */}
      <div className={`chat-launcher-tooltip ${isHovered ? 'visible' : ''}`} role="tooltip">
        <span>مساعد بايت أب الذكي</span>
        <span className="tooltip-arrow" />
      </div>

      {/* FLOATING LAUNCHER BUTTON */}
      <button
        type="button"
        className="chat-launcher-btn"
        onClick={onClick}
        aria-label="Open BITE UP AI Assistant"
      >
        <div className="chat-launcher-icon-wrap">
          <MessageSquare size={22} className="icon-chat" />
          <Sparkles size={14} className="icon-sparkle" />
        </div>
        <span className="chat-launcher-label">اسأل بايت أب</span>
        <span className="chat-launcher-pulse" />
      </button>
    </div>
  );
};
