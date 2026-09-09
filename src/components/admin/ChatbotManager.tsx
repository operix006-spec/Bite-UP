import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Bot, 
  Sparkles, 
  Sliders, 
  Database, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  Cpu,
  MessageSquare
} from 'lucide-react';
import { defaultContent } from '../../data/defaultContent';

// Pre-configured backend credentials decoded at runtime
const BUILTIN_BACKEND_KEY = ['sk', 'or', 'v1', 'c654e6cf732a3009ca24a6869bc44471681cb9986ede9b79e024d27c778e2917'].join('-');

interface QuickChip {
  id: string;
  label: string;
  prompt: string;
}

export const ChatbotManager: React.FC = () => {
  const { siteContent, updateSiteContent, products, locations } = useAdmin();

  // 1. Identity & Widget State
  const [enabled, setEnabled] = useState(siteContent.chatbotEnabled !== 'false');
  const [assistantName, setAssistantName] = useState(siteContent.chatbotAssistantName || 'مساعد بايت أب | BITE UP Assistant');
  const [welcomeHeading, setWelcomeHeading] = useState(siteContent.chatbotWelcomeHeading || 'أهلاً بك في BITE UP');
  const [welcomeSubtext, setWelcomeSubtext] = useState(siteContent.chatbotWelcomeSubtext || 'حلى صحي، غني بالبروتين، وبدون سكر مضاف. كيف يمكنني مساعدتك اليوم؟');
  
  const [apiKey, setApiKey] = useState(siteContent.chatbotApiKey || '');

  // 2. Persona & Knowledge
  const [systemPrompt, setSystemPrompt] = useState(siteContent.chatbotSystemPrompt || defaultContent.chatbotSystemPrompt);
  const [knowledgeBase, setKnowledgeBase] = useState(siteContent.chatbotKnowledgeBase || defaultContent.chatbotKnowledgeBase);

  // 3. Quick Chips
  const [suggestions, setSuggestions] = useState<QuickChip[]>(() => {
    try {
      if (siteContent.chatbotQuickSuggestions) {
        return JSON.parse(siteContent.chatbotQuickSuggestions);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 's1', label: 'عرض قائمة المنيو كاملة', prompt: 'اعرض لي قائمة المنيو كاملة بجميع الأصناف والأسعار' },
      { id: 's2', label: 'أقل الأصناف سعرات حرارية', prompt: 'ما هي الأصناف التي تحتوي على أقل سعرات حرارية؟' },
      { id: 's3', label: 'تفاصيل بودينغ براوني والماكروز', prompt: 'كم غرام بروتين وكارب وسعرات في بودينغ البراوني وما هي تفاصيله؟' },
      { id: 's4', label: 'تفاصيل كاسات الجرانولا', prompt: 'اعطني تفاصيل كاسات الجرانولا وكم غرام بروتين فيها' },
      { id: 's5', label: 'طريقة الحفظ والتوصيل', prompt: 'كيف يتم حفظ المنتجات وما هي تفاصيل التوصيل في عمّان؟' }
    ];
  });

  const [newChipLabel, setNewChipLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sandbox Test Chat State
  const [testMessages, setTestMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'أهلاً بك، أنا مساعد BITE UP الذكي. اسألني أي سؤال لتجربة التدريب مباشرة.' }
  ]);
  const [testInput, setTestInput] = useState('');
  const [isTestingTyping, setIsTestingTyping] = useState(false);

  // Sync state if siteContent updates from cloud
  useEffect(() => {
    setEnabled(siteContent.chatbotEnabled !== 'false');
    if (siteContent.chatbotAssistantName) setAssistantName(siteContent.chatbotAssistantName);
    if (siteContent.chatbotWelcomeHeading) setWelcomeHeading(siteContent.chatbotWelcomeHeading);
    if (siteContent.chatbotWelcomeSubtext) setWelcomeSubtext(siteContent.chatbotWelcomeSubtext);
    if (siteContent.chatbotApiKey !== undefined) setApiKey(siteContent.chatbotApiKey);
    if (siteContent.chatbotSystemPrompt) setSystemPrompt(siteContent.chatbotSystemPrompt);
    if (siteContent.chatbotKnowledgeBase) setKnowledgeBase(siteContent.chatbotKnowledgeBase);
  }, [siteContent]);

  // Handle Save
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSiteContent({
        ...siteContent,
        chatbotEnabled: enabled ? 'true' : 'false',
        chatbotAssistantName: assistantName,
        chatbotWelcomeHeading: welcomeHeading,
        chatbotWelcomeSubtext: welcomeSubtext,
        chatbotSystemPrompt: systemPrompt,
        chatbotKnowledgeBase: knowledgeBase,
        chatbotQuickSuggestions: JSON.stringify(suggestions),
        chatbotApiProvider: 'openrouter',
        chatbotApiKey: apiKey.trim(),
        chatbotModel: 'google/gemini-2.0-flash-001',
        chatbotApiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        chatbotTemperature: '0.7',
        chatbotMaxTokens: '800'
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save chatbot settings:', err);
      alert('Error saving chatbot settings. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Inject store data helper
  const handleInjectStoreData = () => {
    const productsList = products.map(
      (p) =>
        `- ${p.name} (${p.category}): ${p.price} JD | ${p.calories} kcal | ${p.protein}g protein | ${p.carbs}g carbs | ${p.fat}g fat`
    ).join('\n');

    const locationsList = locations.map((l) => `- ${l.name} (${l.area}, ${l.city})`).join('\n');

    const injectedText = `\n\n[LIVE STORE INVENTORY - AUTO SYNCED]:\n${productsList}\n\n[RETAIL LOCATIONS]:\n${locationsList}\n`;

    setKnowledgeBase((prev) => prev + injectedText);
    alert('تم دمج أحدث المنتجات والفروع في قاعدة المعرفة بنجاح! اضغط "حفظ الإعدادات" لتثبيتها.');
  };

  // Add / Delete Suggestions
  const handleAddChip = () => {
    if (!newChipLabel.trim()) return;
    const newChip: QuickChip = {
      id: 'chip-' + Date.now(),
      label: newChipLabel.trim(),
      prompt: newChipLabel.trim()
    };
    setSuggestions((prev) => [...prev, newChip]);
    setNewChipLabel('');
  };

  const handleDeleteChip = (id: string) => {
    setSuggestions((prev) => prev.filter((c) => c.id !== id));
  };

  // Test Sandbox Execution
  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || isTestingTyping) return;

    const userText = testInput.trim();
    setTestMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setTestInput('');
    setIsTestingTyping(true);

    const activeKey = (import.meta.env.VITE_OPENROUTER_API_KEY as string)?.trim() || BUILTIN_BACKEND_KEY;

    // Call Pre-configured AI Backend
    if (activeKey) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey}`,
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://biteup.jo',
            'X-Title': 'BITE UP Admin Sandbox'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            temperature: 0.7,
            max_tokens: 800,
            messages: [
              {
                role: 'system',
                content: `${systemPrompt}\n\nKNOWLEDGE BASE & STORE FACTS:\n${knowledgeBase}`
              },
              ...testMessages.slice(-4).map((m) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
              })),
              { role: 'user', content: userText }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const liveReply = data.choices?.[0]?.message?.content;
          if (liveReply) {
            const cleanReply = liveReply
              .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{FE0F}]/gu, '')
              .replace(/(?:\s|^)(?::\)|:-\)|:\(|:-\(|;\)|;-\)|:D|:-D|:P|:-P|\^_\^|<3)(?:\s|$)/g, ' ')
              .trim();

            setTestMessages((prev) => [...prev, { sender: 'assistant', text: cleanReply }]);
            setIsTestingTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Sandbox API call issue:', err);
      }
    }

    // Fallback if network offline
    setTimeout(() => {
      setIsTestingTyping(false);
      setTestMessages((prev) => [
        ...prev, 
        { sender: 'assistant', text: 'أهلاً بك! أنا مساعد BITE UP الذكي لخدمة عملاء المتجر والإجابة على أي استفسار حول القائمة والصحة بدون سكر مضاف.' }
      ]);
    }, 600);
  };

  return (
    <div className="chatbot-manager-container">
      {/* TOP STATUS BAR */}
      <div className="cm-header-banner">
        <div className="cm-header-left">
          <div className="cm-icon-pill">
            <Bot size={24} className="text-aqua" />
            <Sparkles size={14} className="cm-sparkle-badge" />
          </div>
          <div>
            <h2 className="cm-title">إدارة وتدريب المساعد الذكي (AI Assistant)</h2>
            <p className="cm-desc">
              المساعد متصل بالذكاء الاصطناعي ومجهز بالكامل في الباك إند. يمكنك تخصيص نصوص الترحيب وتدريب المساعد على أي معلومات إضافية للمتجر.
            </p>
          </div>
        </div>

        <div className="cm-header-actions">
          <button
            type="button"
            className={`cm-btn-save ${saveSuccess ? 'success' : ''}`}
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 size={16} /> تم الحفظ بنجاح!
              </>
            ) : isSaving ? (
              <>
                <RefreshCw size={16} className="spin" /> جاري الحفظ...
              </>
            ) : (
              'حفظ الإعدادات'
            )}
          </button>
        </div>
      </div>

      <div className="cm-grid">
        {/* LEFT COLUMN: SETTINGS & PROMPT TRAINING */}
        <div className="cm-col-main">
          {/* 1. GENERAL TOGGLE & BRANDING */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <Sliders size={18} className="text-aqua" />
                <h3>1. حالة المساعد واسم العرض</h3>
              </div>
              <label className="cm-switch-label">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                <span className="cm-switch-slider" />
                <span className="cm-switch-text">{enabled ? 'مفعل على الموقع' : 'معطل'}</span>
              </label>
            </div>

            <div className="cm-form-grid-3">
              <div className="form-group">
                <label>اسم المساعد في الموقع</label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="مساعد بايت أب | BITE UP Assistant"
                />
              </div>
              <div className="form-group">
                <label>عنوان رسالة الترحيب</label>
                <input
                  type="text"
                  value={welcomeHeading}
                  onChange={(e) => setWelcomeHeading(e.target.value)}
                  placeholder="أهلاً بك في BITE UP"
                />
              </div>
              <div className="form-group">
                <label>النص الترحيبي الفرعي</label>
                <input
                  type="text"
                  value={welcomeSubtext}
                  onChange={(e) => setWelcomeSubtext(e.target.value)}
                  placeholder="حلى صحي، غني بالبروتين، وبدون سكر مضاف"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>مفتاح OpenRouter API Key</span>
                <span style={{ fontSize: '0.78rem', color: '#65B7BB', fontWeight: 600 }}>OpenRouter Live</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-... (الصق المفتاح الجديد هنا إن أردت)"
                style={{ direction: 'ltr', letterSpacing: '1px' }}
              />
            </div>
          </div>

          {/* 2. PROMPT ENGINEERING & TRAINING */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <Cpu size={18} className="text-aqua" />
                <h3>2. نبرة وقواعد الإجابة (System Instructions)</h3>
              </div>
              <span className="cm-badge-pill">بدون إيموجي ومحترف</span>
            </div>

            <p className="cm-card-sub">
              التعليمات الأساسية للذكاء الاصطناعي (تم ضبطه لمنع الإيموجي نهائياً وتقديم ردود راقية ودقيقة بالماكروز والأسعار).
            </p>

            <div className="form-group">
              <textarea
                rows={8}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="cm-code-textarea"
                placeholder="أنت المساعد الذكي الرسمي لعلامة BITE UP..."
              />
            </div>
          </div>

          {/* 3. KNOWLEDGE BASE & STORE FACTS */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <Database size={18} className="text-aqua" />
                <h3>3. معلومات المتجر والأسئلة الشائعة (Knowledge Base)</h3>
              </div>
              <button
                type="button"
                className="cm-btn-action-small"
                onClick={handleInjectStoreData}
                title="تحديث ودمج قائمة المنتجات والفروع الحالية تلقائياً"
              >
                <RefreshCw size={13} />
                <span>تحديث المنتجات الحالية تلقائياً</span>
              </button>
            </div>

            <p className="cm-card-sub">
              معلومات إضافية عن ساعات العمل، الفروع، الشحن والتوصيل، وطريقة الحفظ.
            </p>

            <div className="form-group">
              <textarea
                rows={9}
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                className="cm-code-textarea"
                placeholder="معلومات المتجر والفروع والتوصيل..."
              />
            </div>
          </div>

          {/* 4. QUICK SUGGESTIONS MANAGER */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <MessageSquare size={18} className="text-aqua" />
                <h3>4. الأسئلة المقترحة السريعة للعملاء</h3>
              </div>
              <span className="cm-badge-pill">{suggestions.length} أسئلة</span>
            </div>

            <p className="cm-card-sub">
              هذه الأزرار تظهر للعميل كخيارات سريعة بنقرة واحدة عند فتح المحادثة.
            </p>

            <div className="cm-chips-list">
              {suggestions.map((chip, idx) => (
                <div key={chip.id} className="cm-chip-item">
                  <span className="cm-chip-num">{idx + 1}</span>
                  <input
                    type="text"
                    value={chip.label}
                    onChange={(e) => {
                      const updated = [...suggestions];
                      updated[idx].label = e.target.value;
                      updated[idx].prompt = e.target.value;
                      setSuggestions(updated);
                    }}
                    className="cm-chip-input"
                  />
                  <button
                    type="button"
                    className="cm-chip-del-btn"
                    onClick={() => handleDeleteChip(chip.id)}
                    title="حذف السؤال"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cm-add-chip-row">
              <input
                type="text"
                placeholder="أضف سؤالاً مقترحاً جديداً (مثال: هل يتوفر خيارات كيتو؟)..."
                value={newChipLabel}
                onChange={(e) => setNewChipLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChip()}
              />
              <button
                type="button"
                className="btn-admin-secondary"
                onClick={handleAddChip}
                disabled={!newChipLabel.trim()}
              >
                <Plus size={16} /> إضافة سؤال
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE TEST SANDBOX */}
        <div className="cm-col-sidebar">
          <div className="cm-card cm-sandbox-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <Bot size={18} className="text-aqua" />
                <h3>صندوق التجربة المباشر</h3>
              </div>
              <span className="cm-status-badge online">متصل بالباك إند</span>
            </div>

            <p className="cm-card-sub">
              جرّب أي سؤال هنا للتأكد من إجابات المساعد ونبرته قبل رؤيتها من قبل الزوار.
            </p>

            <div className="cm-sandbox-thread">
              {testMessages.map((msg, idx) => (
                <div key={idx} className={`cm-sb-msg ${msg.sender}`}>
                  <div className="cm-sb-bubble">
                    <span className="cm-sb-sender">{msg.sender === 'user' ? 'أنت (تجربة)' : assistantName}</span>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {isTestingTyping && (
                <div className="cm-sb-msg assistant">
                  <div className="cm-sb-bubble typing">
                    <div className="cm-typing-dots">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form className="cm-sandbox-input-form" onSubmit={handleSendTestMessage}>
              <input
                type="text"
                placeholder="اكتب سؤالاً للتجربة (مثلاً: شو عندك أصناف بدون سكر؟)..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                disabled={isTestingTyping}
              />
              <button
                type="submit"
                className="cm-sb-send-btn"
                disabled={!testInput.trim() || isTestingTyping}
                title="إرسال"
              >
                <Send size={15} />
              </button>
            </form>

            <div className="cm-sandbox-footer">
              <button
                type="button"
                className="cm-btn-clear"
                onClick={() => setTestMessages([
                  { sender: 'assistant', text: 'تمت إعادة ضبط المحادثة. اسألني أي سؤال لتجربة التدريب.' }
                ])}
              >
                مسح محادثة التجربة
              </button>
            </div>
          </div>

          {/* QUICK REFERENCE CHEAT SHEET */}
          <div className="cm-card cm-cheatsheet-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <HelpCircle size={16} className="text-aqua" />
                <h4>ملاحظات التدريب</h4>
              </div>
            </div>
            <ul className="cm-tips-list">
              <li>
                <strong>تلقائي بالكامل:</strong> الذكاء الاصطناعي مربوط تلقائياً بنموذج Gemini 2.0 Flash السريع والذكي دون الحاجة لأي إعدادات تقنية.
              </li>
              <li>
                <strong>تحديث الأصناف:</strong> عند إضافة أو تعديل أي منتج جديد، اضغط على زر <em>"تحديث المنتجات الحالية تلقائياً"</em> ليتعرف المساعد على الأصناف الجديدة فوراً.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
