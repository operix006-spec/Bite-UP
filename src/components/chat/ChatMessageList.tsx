import React, { useEffect, useRef } from 'react';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import type { ChatMessage, QuickSuggestion } from './types';
import { ChatProductCard } from './ChatProductCard';
import type { Product } from '../../data/products';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  suggestions: QuickSuggestion[];
  onSelectSuggestion: (suggestion: QuickSuggestion) => void;
  onRetry: () => void;
  onViewProduct?: (product: Product) => void;
  welcomeHeading?: string;
  welcomeSubtext?: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping,
  suggestions,
  onSelectSuggestion,
  onRetry,
  onViewProduct,
  welcomeHeading = 'Welcome to BITE UP 👋',
  welcomeSubtext = 'High-protein, guilt-free treats crafted fresh in Amman with zero added sugar. How can I help you crave better today?'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-messages-container" ref={scrollRef}>
      {/* WELCOME / EMPTY STATE */}
      <div className="chat-welcome-block">
        <div className="chat-welcome-avatar">
          <Sparkles size={20} />
        </div>
        <h4 className="chat-welcome-heading">{welcomeHeading}</h4>
        <p className="chat-welcome-sub">{welcomeSubtext}</p>

        {/* QUICK SUGGESTIONS */}
        <div className="chat-suggestions-wrap">
          <span className="chat-suggestions-label">SUGGESTED QUESTIONS</span>
          <div className="chat-suggestions-grid">
            {suggestions.map((sug) => (
              <button
                key={sug.id}
                type="button"
                className="chat-suggestion-chip"
                onClick={() => onSelectSuggestion(sug)}
              >
                <span>{sug.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONVERSATION THREAD */}
      {hasMessages && (
        <div className="chat-thread">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            if (msg.isError) {
              return (
                <div key={msg.id} className="chat-message-row assistant error-state">
                  <div className="chat-message-bubble error-bubble">
                    <div className="chat-error-content">
                      <AlertCircle size={18} className="chat-error-icon" />
                      <span>{msg.text || 'Something went wrong. Please try again.'}</span>
                    </div>
                    <button type="button" className="chat-error-retry-btn" onClick={onRetry}>
                      <RotateCcw size={13} />
                      <span>Try again</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={`chat-message-row ${isUser ? 'user' : 'assistant'}`}
              >
                {!isUser && (
                  <div className="chat-assistant-mini-badge" title="BITE UP Assistant">
                    <span>UP</span>
                  </div>
                )}

                <div className="chat-message-content-wrap">
                  {msg.text && (
                    <div className={`chat-message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
                      <p>{msg.text}</p>
                    </div>
                  )}

                  {/* SINGLE PRODUCT CARD */}
                  {msg.product && (
                    <ChatProductCard product={msg.product} onViewProduct={onViewProduct} />
                  )}

                  {/* MULTIPLE PRODUCTS CAROUSEL / LIST */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="chat-products-list">
                      {msg.products.map((p) => (
                        <ChatProductCard key={p.id} product={p} onViewProduct={onViewProduct} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* TYPING INDICATOR */}
          {isTyping && (
            <div className="chat-message-row assistant typing-row">
              <div className="chat-assistant-mini-badge">
                <span>UP</span>
              </div>
              <div className="chat-message-bubble assistant-bubble typing-bubble">
                <div className="chat-typing-dots">
                  <span className="dot dot-1" />
                  <span className="dot dot-2" />
                  <span className="dot dot-3" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
