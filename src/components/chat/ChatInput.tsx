import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isOpen: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false, isOpen }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus on desktop only, avoid forcing keyboard up on mobile immediately
      const isDesktop = window.innerWidth > 768;
      if (isDesktop) {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="chat-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="chat-text-input"
          placeholder="اسأل عن أي صنف، السعرات، أو التوصيل... | Ask anything..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Ask BITE UP Assistant"
        />
        <button
          type="submit"
          className={`chat-send-btn ${text.trim() ? 'active' : ''}`}
          disabled={!text.trim() || disabled}
          aria-label="Send message"
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="chat-input-footer-hint">
        <span>اضغط <strong>Enter</strong> للإرسال</span>
      </div>
    </form>
  );
};
