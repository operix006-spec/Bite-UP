import React, { useState, useEffect } from 'react';
import { ChatLauncher } from './ChatLauncher';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import type { ChatMessage, QuickSuggestion } from './types';
import { useAdmin } from '../../context/AdminContext';
import { products as fallbackProducts } from '../../data/products';
import './Chatbot.css';

const DEFAULT_SUGGESTIONS: QuickSuggestion[] = [
  { id: 's1', label: 'What should I try?', prompt: 'What should I try?' },
  { id: 's2', label: 'Show me high-protein options', prompt: 'Show me high-protein options' },
  { id: 's3', label: 'How many calories?', prompt: 'How many calories are in BITE UP cups?' },
  { id: 's4', label: 'Where can I find BITE UP?', prompt: 'Where can I find BITE UP in Amman?' },
  { id: 's5', label: 'Help me choose', prompt: 'Help me choose based on my fitness goals' }
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { siteContent, products } = useAdmin();

  // If chatbot is disabled by admin, don't render on live site
  if (siteContent.chatbotEnabled === 'false') {
    return null;
  }

  const availableProducts = products && products.length > 0 ? products : fallbackProducts;

  const assistantName = siteContent.chatbotAssistantName || 'BITE UP Assistant';
  const welcomeHeading = siteContent.chatbotWelcomeHeading || 'Hi! 👋';
  const welcomeSubtext = siteContent.chatbotWelcomeSubtext || 'What can I help you find today?';

  // Dynamic quick suggestions configured in admin
  const suggestions: QuickSuggestion[] = React.useMemo(() => {
    try {
      if (siteContent.chatbotQuickSuggestions) {
        return JSON.parse(siteContent.chatbotQuickSuggestions);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SUGGESTIONS;
  }, [siteContent.chatbotQuickSuggestions]);

  // Prevent background scroll on mobile when chat is open
  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Helper to generate assistant response (Real API with fallback to intelligent local engine)
  const generateReply = async (userText: string) => {
    setIsTyping(true);

    // 1. Try real API if an API key is configured
    if (siteContent.chatbotApiKey && siteContent.chatbotApiKey.trim().length > 10) {
      try {
        const endpoint = siteContent.chatbotApiUrl || 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${siteContent.chatbotApiKey.trim()}`
          },
          body: JSON.stringify({
            model: siteContent.chatbotModel || 'gpt-4o-mini',
            temperature: parseFloat(siteContent.chatbotTemperature || '0.7'),
            max_tokens: parseInt(siteContent.chatbotMaxTokens || '500'),
            messages: [
              {
                role: 'system',
                content: `${siteContent.chatbotSystemPrompt || ''}\n\nKNOWLEDGE BASE & STORE FACTS:\n${siteContent.chatbotKnowledgeBase || ''}`
              },
              ...messages.slice(-6).map((m) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text || ''
              })),
              { role: 'user', content: userText }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const replyContent = data.choices?.[0]?.message?.content;
          if (replyContent) {
            // Find if response specifically mentions a product to attach its interactive card
            const matchedProduct = availableProducts.find((p) =>
              replyContent.toLowerCase().includes(p.name.toLowerCase())
            );

            setMessages((prev) => [
              ...prev,
              {
                id: 'asst-' + Date.now(),
                sender: 'assistant',
                text: replyContent,
                timestamp: new Date(),
                product: matchedProduct
              }
            ]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Real AI API call encountered an issue, running local training engine fallback:', err);
      }
    }

    // 2. Intelligent local engine utilizing training prompts and active products
    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();

      // Demo error state if user explicitly tests error
      if (lower.includes('error') || lower.includes('fail')) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'err-' + Date.now(),
            sender: 'assistant',
            text: 'Something went wrong. Please try again.',
            timestamp: new Date(),
            isError: true
          }
        ]);
        return;
      }

      let replyText = '';
      let recommendedProduct = undefined;
      let recommendedProducts = undefined;

      if (lower.includes('high-protein') || lower.includes('protein')) {
        replyText = 'All our puddings pack 18g of pure whey protein with zero added sugar! Here is one of our top protein-rich favorites:';
        recommendedProduct = availableProducts.find((p) => p.protein >= 18) || availableProducts[0];
      } else if (lower.includes('calorie') || lower.includes('calories') || lower.includes('macro')) {
        replyText = 'Our pudding cups range from 245 to 345 kcal per cup, crafted with balanced healthy fats and zero refined sugars. Check out the macros on this cup:';
        recommendedProduct = availableProducts.find((p) => p.calories <= 300) || availableProducts[0];
      } else if (lower.includes('where') || lower.includes('find') || lower.includes('location')) {
        replyText = 'You can find BITE UP fresh cups across 15+ premium supermarkets in Amman, including Marj Al Hamam, Dahiyat Al Rashid, Al Jubeiha, Sweileh, and Khalda! Check our "Find Bite Up" section for directions.';
      } else if (lower.includes('what should i try') || lower.includes('help me choose') || lower.includes('recommend')) {
        replyText = 'If it is your first time, you cannot go wrong with our crowd-favorite Pudding Brownie, rich in Belgian chocolate flavor and 18g protein!';
        recommendedProduct = availableProducts[0];
      } else {
        replyText = `Thanks for asking! I recommend checking out our freshly prepared ${availableProducts[0]?.name || 'cups'}, crafted with clean ingredients and honest nutrition:`;
        recommendedProduct = availableProducts[0];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          sender: 'assistant',
          text: replyText,
          timestamp: new Date(),
          product: recommendedProduct,
          products: recommendedProducts
        }
      ]);
    }, 850);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    generateReply(text);
  };

  const handleSelectSuggestion = (sug: QuickSuggestion) => {
    handleSendMessage(sug.prompt);
  };

  const handleRetry = () => {
    setMessages((prev) => prev.filter((m) => !m.isError));
    generateReply('help me choose');
  };

  return (
    <>
      {/* FLOATING LAUNCHER */}
      <ChatLauncher isOpen={isOpen} onClick={handleOpen} />

      {/* MOBILE BACKDROP / OVERLAY */}
      {isOpen && (
        <div 
          className="chat-mobile-backdrop" 
          onClick={handleClose} 
          aria-hidden="true" 
        />
      )}

      {/* CHAT WINDOW */}
      <div 
        className={`chat-window ${isOpen ? 'open' : 'closed'}`}
        role="dialog"
        aria-modal="true"
        aria-label="BITE UP Assistant Chat"
      >
        <ChatHeader onClose={handleClose} title={assistantName} />
        
        <ChatMessageList
          messages={messages}
          isTyping={isTyping}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
          onRetry={handleRetry}
          welcomeHeading={welcomeHeading}
          welcomeSubtext={welcomeSubtext}
        />

        <ChatInput 
          isOpen={isOpen}
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      </div>
    </>
  );
};
