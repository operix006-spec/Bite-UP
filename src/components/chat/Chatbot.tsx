import React, { useState, useEffect } from 'react';
import { ChatLauncher } from './ChatLauncher';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import type { ChatMessage, QuickSuggestion } from './types';
import { useAdmin } from '../../context/AdminContext';
import { products as fallbackProducts } from '../../data/products';
import { defaultContent } from '../../data/defaultContent';
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

  const assistantName = siteContent.chatbotAssistantName && !siteContent.chatbotAssistantName.includes('مساعد بايت أب')
    ? siteContent.chatbotAssistantName
    : 'BITE UP Assistant';
  const welcomeHeading = siteContent.chatbotWelcomeHeading && !siteContent.chatbotWelcomeHeading.includes('أهلاً بك')
    ? siteContent.chatbotWelcomeHeading
    : 'Welcome to BITE UP 👋';
  const welcomeSubtext = siteContent.chatbotWelcomeSubtext && !siteContent.chatbotWelcomeSubtext.includes('حلى صحي')
    ? siteContent.chatbotWelcomeSubtext
    : 'High-protein, guilt-free treats crafted fresh in Amman with zero added sugar. How can I help you crave better today?';

  // Dynamic quick suggestions configured in admin
  const suggestions: QuickSuggestion[] = React.useMemo(() => {
    try {
      if (siteContent.chatbotQuickSuggestions) {
        const parsed = JSON.parse(siteContent.chatbotQuickSuggestions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0]?.label?.includes('المنيو') || parsed[0]?.label?.includes('أقل')) {
            return DEFAULT_SUGGESTIONS;
          }
          return parsed;
        }
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

  // Product matching helper for Arabic and English
  const findProductMatch = (text: string) => {
    const lower = text.toLowerCase();
    const keywordsMap: Record<string, string[]> = {
      'p-brownie': ['brownie', 'براوني', 'شوكولاتة بلجيكية', 'شوكولا', 'كيك', 'كعك', 'كيكة', 'حلو', 'شوكولاته'],
      'p-cookies': ['cookies', 'كوكيز', 'فانيليا', 'بسكوت', 'بسكويت'],
      'p-bounty': ['bounty', 'باونتي', 'جوز هند', 'جوز الهند'],
      'p-lotus': ['lotus', 'لوتس'],
      'p-oreo': ['oreo', 'اوريو', 'أوريو'],
      'p-ferrero': ['ferrero', 'فيريرو', 'بندق'],
      'p-snickers': ['snickers', 'سنيكرز'],
      'p-tiramisu': ['tiramisu', 'تيراميسو', 'قهوة'],
      'p-pistachio': ['pistachio', 'بستاشيو', 'فستق', 'بيستاشيو'],
      'p-kinder': ['kinder', 'كيندر'],
      'g-nuts': ['granola nuts', 'جرانولا مكسرات', 'جرانولا المكسرات'],
      'g-pineapple': ['granola pineapple', 'جرانولا اناناس', 'جرانولا أناناس'],
      'g-strawberry': ['granola strawberry', 'جرانولا فراولة', 'جرانولا الفراولة']
    };

    for (const p of availableProducts) {
      if (lower.includes(p.name.toLowerCase())) return p;
      const kws = keywordsMap[p.id];
      if (kws && kws.some((kw) => lower.includes(kw))) return p;
    }
    return undefined;
  };

  // Helper to ensure NO emojis or smilies appear in any response
  const cleanNoEmoji = (str: string): string => {
    return str
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{FE0F}]/gu, '')
      .replace(/(?:\s|^)(?::\)|:-\)|:\(|:-\(|;\)|;-\)|:D|:-D|:P|:-P|\^_\^|<3)(?:\s|$)/g, ' ')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  };

  // Helper to generate assistant response (Secured via Serverless Backend /api/chat)
  const generateReply = async (userText: string) => {
    setIsTyping(true);

    let replyText = '';
    let lastError = '';

    const hasArabic = /[\u0600-\u06FF]/.test(userText);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text || ''
          })),
          systemPrompt: siteContent.chatbotSystemPrompt || defaultContent.chatbotSystemPrompt,
          knowledgeBase: siteContent.chatbotKnowledgeBase || defaultContent.chatbotKnowledgeBase,
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply && data.reply.trim()) {
          replyText = data.reply.trim();
        }
      } else {
        const errStatus = response.status;
        const errText = await response.text();
        lastError = `${errStatus}: ${errText}`;
        console.warn(`Chatbot API returned status ${errStatus}:`, errText);
      }
    } catch (err: any) {
      lastError = err?.message || 'Network error';
      console.warn('Network call failed for /api/chat:', err);
    }

    setIsTyping(false);

    if (replyText) {
      const cleanReply = cleanNoEmoji(replyText);
      const matchedProduct = findProductMatch(cleanReply);

      setMessages((prev) => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          sender: 'assistant',
          text: cleanReply,
          timestamp: new Date(),
          product: matchedProduct
        }
      ]);
    } else {
      let userErrMsg = hasArabic
        ? 'عذراً، تعذر الاتصال بسيرفر المساعد الذكي حالياً.'
        : 'Sorry, unable to connect to the AI assistant right now. Please try again.';
      if (lastError.includes('429')) {
        userErrMsg = hasArabic
          ? 'تم إرسال عدد كبير من الرسائل، يرجى الانتظار قليلاً.'
          : 'Too many requests. Please wait a moment before sending another message.';
      } else if (lastError.includes('503') || lastError.includes('401')) {
        userErrMsg = hasArabic
          ? 'سيرفر المساعد الذكي قيد التجهيز أو يحتاج إلى ضبط المفتاح على Vercel.'
          : 'AI service backend key is being configured on Vercel.';
      } else if (lastError.includes('402')) {
        userErrMsg = hasArabic
          ? 'رصيد حساب المساعد غير كافٍ حالياً.'
          : 'AI service credit quota reached.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: userErrMsg,
          timestamp: new Date(),
          isError: true
        }
      ]);
    }
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
