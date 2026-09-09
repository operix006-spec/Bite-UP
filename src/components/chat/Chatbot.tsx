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

  const assistantName = siteContent.chatbotAssistantName || 'مساعد بايت أب | BITE UP Assistant';
  const welcomeHeading = siteContent.chatbotWelcomeHeading || 'أهلاً بك في BITE UP';
  const welcomeSubtext = siteContent.chatbotWelcomeSubtext || 'حلى صحي، غني بالبروتين، وبدون سكر مضاف. كيف يمكنني مساعدتك اليوم؟';

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

  // Product matching helper for Arabic and English
  const findProductMatch = (text: string) => {
    const lower = text.toLowerCase();
    const keywordsMap: Record<string, string[]> = {
      'p-brownie': ['brownie', 'براوني', 'شوكولاتة بلجيكية', 'شوكولا'],
      'p-cookies': ['cookies', 'كوكيز', 'فانيليا'],
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

  // Helper to generate assistant response (OpenRouter / Real API with fallback)
  const generateReply = async (userText: string) => {
    setIsTyping(true);

    const apiKey = siteContent.chatbotApiKey?.trim() || '';
    const isOpenRouter = apiKey.startsWith('sk-or-') || siteContent.chatbotApiProvider === 'openrouter';

    // 1. Try real API if an API key is configured
    if (apiKey && apiKey.length > 10) {
      try {
        let endpoint = siteContent.chatbotApiUrl?.trim();
        if (!endpoint) {
          endpoint = isOpenRouter 
            ? 'https://openrouter.ai/api/v1/chat/completions' 
            : 'https://api.openai.com/v1/chat/completions';
        }

        const model = siteContent.chatbotModel?.trim() || (isOpenRouter ? 'google/gemini-2.0-flash-001' : 'gpt-4o-mini');

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };

        if (isOpenRouter || endpoint.includes('openrouter')) {
          headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'https://biteup.jo';
          headers['X-Title'] = 'BITE UP Protein Desserts';
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            temperature: parseFloat(siteContent.chatbotTemperature || '0.7'),
            max_tokens: parseInt(siteContent.chatbotMaxTokens || '800'),
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
          const rawReply = data.choices?.[0]?.message?.content;
          if (rawReply) {
            const cleanReply = cleanNoEmoji(rawReply);
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
            setIsTyping(false);
            return;
          }
        } else {
          const errText = await response.text();
          console.warn('OpenRouter/AI API returned error status:', response.status, errText);
        }
      } catch (err) {
        console.warn('Real AI API call encountered an issue, running local training engine fallback:', err);
      }
    }

    // 2. Intelligent local engine utilizing trained menu & active products
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
            text: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.',
            timestamp: new Date(),
            isError: true
          }
        ]);
        return;
      }

      let replyText = '';
      let recommendedProduct = findProductMatch(lower);

      // FULL MENU QUERY: list all 13 items completely
      if (lower.includes('منيو') || lower.includes('menu') || lower.includes('قائمة') || lower.includes('شو عندكم') || lower.includes('شو الاصناف') || lower.includes('شو الأصناف') || lower.includes('كل الاصناف') || lower.includes('جميع الاصناف')) {
        replyText = `قائمة منتجات BITE UP كاملة:

أولاً: بودينغ البروتين (سعر العلبة 1.75 دينار | 18 غرام بروتين صافي | بدون سكر مضاف):
1. بودينغ براوني (Pudding Brownie): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
2. بودينغ كوكيز (Pudding Cookies): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
3. بودينغ باونتي (Pudding Bounty): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
4. بودينغ لوتس (Pudding Lotus): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
5. بودينغ أوريو (Pudding Oreo): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
6. بودينغ فيريرو (Pudding Ferrero): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
7. بودينغ سنيكرز (Pudding Snickers): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
8. بودينغ تيراميسو (Pudding Tiramisu): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
9. بودينغ بستاشيو (Pudding Pistachio): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون
10. بودينغ كيندر (Pudding Kinder): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون

ثانياً: كاسات الجرانولا المقرمشة (سعر العلبة 2.00 دينار | 16 غرام بروتين | سناك صحي):
1. جرانولا مكسرات (Granola Nuts): 205 سعرة حرارية | 16 غرام بروتين | 27 غرام كارب | 7 غرام دهون صحية | بدون سكر مضاف
2. جرانولا أناناس (Granola Pineapple): 205 سعرة حرارية | 16 غرام بروتين | 27 غرام كارب | 7 غرام دهون صحية | بدون سكر مضاف
3. جرانولا فراولة (Granola Strawberry): 205 سعرة حرارية | 16 غرام بروتين | 27 غرام كارب | 7 غرام دهون صحية | سكر طبيعي من الفواكه فقط

يمكنك طلب أي صنف مباشرة من الموقع والتوصيل متوفر في كافة مناطق عمّان.`;
      } else if (recommendedProduct && (lower.includes('غرام') || lower.includes('جرام') || lower.includes('تفاصيل') || lower.includes('ماكروز') || lower.includes('كم') || lower.includes('سعرات'))) {
        // DETAILED GRAMS FOR SPECIFIC ITEM
        replyText = `تفاصيل ${recommendedProduct.name} بدقة الغرامات والماكروز:
• السعر: ${recommendedProduct.price.toFixed(2)} دينار أردني (JD)
• السعرات الحرارية: ${recommendedProduct.calories} سعرة حرارية
• البروتين: ${recommendedProduct.protein} غرام صافي (واي بروتين معزول Whey Isolate)
• الكاربوهيدرات: ${recommendedProduct.carbs} غرام
• الدهون: ${recommendedProduct.fat} غرام
• السكر: ${recommendedProduct.sugarNote || 'بدون سكر مضاف نهائياً'}
• طريقة الحفظ: يحفظ مبرداً في الثلاجة بدرجة حرارة بين 2 إلى 4 مئوية، ومدة الصلاحية 5 أيام من الإنتاج.`;
      } else if (lower.includes('سعر') || lower.includes('اسعار') || lower.includes('أسعار') || lower.includes('price')) {
        replyText = `قائمة أسعار BITE UP المعتمدة:
• جميع علب بودينغ البروتين (10 نكهات): 1.75 دينار أردني (JD) مع 18 غرام بروتين صافي وبدون سكر مضاف.
• جميع كاسات الجرانولا المقرمشة: 2.00 دينار أردني (JD) مع 16 غرام بروتين.
هل ترغب بمعرفة تفاصيل الماكروز والغرامات لأي صنف معين؟`;
      } else if (lower.includes('سعرات') || lower.includes('كالوري') || lower.includes('دايت') || lower.includes('calorie') || lower.includes('تنشيف')) {
        replyText = `إذا كنت تبحث عن أقل سعرات حرارية، خياراتنا من بودينغ (باونتي، لوتس، فيريرو، سنيكرز، تيراميسو، أو بستاشيو) تحتوي على 245 سعرة حرارية فقط مع 18 غرام بروتين نقي وبدون سكر مضاف.`;
        recommendedProduct = availableProducts.find((p) => p.id === 'p-bounty') || availableProducts[0];
      } else if (lower.includes('بروتين') || lower.includes('protein') || lower.includes('عضل') || lower.includes('تضخيم')) {
        replyText = `جميع علب بودينغ البروتين تحتوي على 18 غرام واي بروتين صافي (Whey Protein Isolate) عالي النقاء وخفيف على الهضم، وبدون سكر مضاف نهائياً. نرشح لك بودينغ البراوني الفاخر أو بودينغ الكوكيز.`;
        recommendedProduct = availableProducts.find((p) => p.id === 'p-brownie') || availableProducts[0];
      } else if (lower.includes('حفظ') || lower.includes('صلاحية') || lower.includes('ثلاجة') || lower.includes('تخزين')) {
        replyText = `تحفظ جميع منتجات بايت أب مبردة في الثلاجة بين 2 إلى 4 درجات مئوية، ويفضل استهلاكها طازجة خلال 5 أيام من تاريخ الإنتاج للاستمتاع بأعلى جودة وطراوة.`;
      } else if (lower.includes('توصيل') || lower.includes('طلب') || lower.includes('وين') || lower.includes('مكان') || lower.includes('amman') || lower.includes('عمّان')) {
        replyText = `التوصيل متاح لكافة مناطق عمّان. يمكنك إضافة أي صنف إلى السلة في الموقع وإتمام الطلب عبر الواتساب. تتوفر منتجاتنا أيضاً في أكثر من 15 سوبرماركت شريك في مرج الحمام، داحية الرشيد، الجبيهة، صويلح، وخلدا.`;
      } else if (lower.includes('سكر') || lower.includes('sugar')) {
        replyText = `جميع منتجات BITE UP خالية تماماً من أي سكر مضاف أو مكرر. نعتمد على المحليات الطبيعية، وسكر الفواكه الطبيعي في جرانولا الفراولة فقط.`;
      } else {
        replyText = `أهلاً بك في BITE UP. يسعدنا تقديم حلى صحي، غني بالبروتين وبدون سكر مضاف. يمكنك السؤال عن المنيو كاملة أو السؤال عن تفاصيل الماكروز والغرامات لأي صنف.`;
        recommendedProduct = recommendedProduct || availableProducts[0];
      }

      const finalText = cleanNoEmoji(replyText);

      setMessages((prev) => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          sender: 'assistant',
          text: finalText,
          timestamp: new Date(),
          product: recommendedProduct
        }
      ]);
    }, 500);
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
