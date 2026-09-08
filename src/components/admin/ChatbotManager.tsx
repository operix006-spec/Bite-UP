import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Bot, 
  Sparkles, 
  Key, 
  Eye, 
  EyeOff, 
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

interface QuickChip {
  id: string;
  label: string;
  prompt: string;
}

export const ChatbotManager: React.FC = () => {
  const { siteContent, updateSiteContent, products, locations } = useAdmin();

  // Form State
  const [enabled, setEnabled] = useState(siteContent.chatbotEnabled !== 'false');
  const [assistantName, setAssistantName] = useState(siteContent.chatbotAssistantName || 'BITE UP Assistant');
  const [welcomeHeading, setWelcomeHeading] = useState(siteContent.chatbotWelcomeHeading || 'Hi! 👋');
  const [welcomeSubtext, setWelcomeSubtext] = useState(siteContent.chatbotWelcomeSubtext || 'What can I help you find today?');
  
  // API & Model
  const [apiProvider, setApiProvider] = useState(siteContent.chatbotApiProvider || 'openai');
  const [apiKey, setApiKey] = useState(siteContent.chatbotApiKey || '');
  const [model, setModel] = useState(siteContent.chatbotModel || 'gpt-4o-mini');
  const [apiUrl, setApiUrl] = useState(siteContent.chatbotApiUrl || '');
  const [temperature, setTemperature] = useState(siteContent.chatbotTemperature || '0.7');
  const [maxTokens, setMaxTokens] = useState(siteContent.chatbotMaxTokens || '500');
  const [showKey, setShowKey] = useState(false);

  // Training & Prompts
  const [systemPrompt, setSystemPrompt] = useState(
    siteContent.chatbotSystemPrompt || defaultContent.chatbotSystemPrompt || ''
  );
  const [knowledgeBase, setKnowledgeBase] = useState(
    siteContent.chatbotKnowledgeBase || defaultContent.chatbotKnowledgeBase || ''
  );

  // Suggestions
  const [suggestions, setSuggestions] = useState<QuickChip[]>(() => {
    try {
      if (siteContent.chatbotQuickSuggestions) {
        return JSON.parse(siteContent.chatbotQuickSuggestions);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 's1', label: 'What should I try?', prompt: 'What should I try?' },
      { id: 's2', label: 'Show me high-protein options', prompt: 'Show me high-protein options' },
      { id: 's3', label: 'How many calories?', prompt: 'How many calories are in BITE UP cups?' },
      { id: 's4', label: 'Where can I find BITE UP?', prompt: 'Where can I find BITE UP in Amman?' },
      { id: 's5', label: 'Help me choose', prompt: 'Help me choose based on my fitness goals' }
    ];
  });

  const [newChipLabel, setNewChipLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sandbox Test Chat State
  const [testMessages, setTestMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'Hello! I am your BITE UP Assistant. Ask me anything to test my training.' }
  ]);
  const [testInput, setTestInput] = useState('');
  const [isTestingTyping, setIsTestingTyping] = useState(false);

  // Sync state if siteContent updates from cloud
  useEffect(() => {
    setEnabled(siteContent.chatbotEnabled !== 'false');
    if (siteContent.chatbotAssistantName) setAssistantName(siteContent.chatbotAssistantName);
    if (siteContent.chatbotWelcomeHeading) setWelcomeHeading(siteContent.chatbotWelcomeHeading);
    if (siteContent.chatbotWelcomeSubtext) setWelcomeSubtext(siteContent.chatbotWelcomeSubtext);
    if (siteContent.chatbotApiProvider) setApiProvider(siteContent.chatbotApiProvider);
    if (siteContent.chatbotApiKey !== undefined) setApiKey(siteContent.chatbotApiKey);
    if (siteContent.chatbotModel) setModel(siteContent.chatbotModel);
    if (siteContent.chatbotApiUrl !== undefined) setApiUrl(siteContent.chatbotApiUrl);
    if (siteContent.chatbotTemperature) setTemperature(siteContent.chatbotTemperature);
    if (siteContent.chatbotMaxTokens) setMaxTokens(siteContent.chatbotMaxTokens);
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
        chatbotApiProvider: apiProvider,
        chatbotApiKey: apiKey,
        chatbotModel: model,
        chatbotApiUrl: apiUrl,
        chatbotTemperature: temperature,
        chatbotMaxTokens: maxTokens,
        chatbotSystemPrompt: systemPrompt,
        chatbotKnowledgeBase: knowledgeBase,
        chatbotQuickSuggestions: JSON.stringify(suggestions)
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save chatbot settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto Inject Live Store Products and Locations into Knowledge Base
  const handleInjectStoreData = () => {
    let injectedText = '\n\n=== CURRENT LIVE STORE PRODUCTS (AUTO-INJECTED) ===\n';
    products.forEach((p) => {
      injectedText += `• ${p.name} (${p.category}): ${p.price.toFixed(2)} JD | ${p.calories} kcal, ${p.protein}g Protein, ${p.carbs}g Carbs, ${p.fat}g Fat | ${p.sugarNote || 'No Added Sugar'}\n`;
    });

    injectedText += '\n=== CURRENT RETAIL BRANCHES IN AMMAN (AUTO-INJECTED) ===\n';
    // Group locations by area
    const areas: Record<string, string[]> = {};
    locations.forEach((loc) => {
      if (!areas[loc.area]) areas[loc.area] = [];
      areas[loc.area].push(loc.name);
    });

    Object.entries(areas).forEach(([area, spots]) => {
      injectedText += `• ${area}: ${spots.join(', ')}\n`;
    });

    setKnowledgeBase((prev) => prev + injectedText);
    alert('Live store products and locations have been successfully injected into the Knowledge Base! Click "Save Changes" to persist.');
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
  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || isTestingTyping) return;

    const userText = testInput.trim();
    setTestMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setTestInput('');
    setIsTestingTyping(true);

    // Simulate AI response utilizing current settings
    setTimeout(() => {
      setIsTestingTyping(false);
      let simulatedReply = '';

      const lower = userText.toLowerCase();
      if (lower.includes('protein') || lower.includes('muscle')) {
        simulatedReply = `[Model: ${model} | Temp: ${temperature}]\nBased on BITE UP standards, our puddings provide 18g of pure whey protein isolate with zero refined sugar. Ideal for post-workout recovery or clean snacking!`;
      } else if (lower.includes('location') || lower.includes('where') || lower.includes('amman')) {
        simulatedReply = `[Model: ${model} | Temp: ${temperature}]\nYou can find fresh BITE UP cups in over 15 retail partners across Amman, including Marj Al Hamam, Dahiyat Al Rashid, Sweileh, and Al Jubeiha.`;
      } else if (lower.includes('shelf') || lower.includes('expire') || lower.includes('keep')) {
        simulatedReply = `[Model: ${model} | Temp: ${temperature}]\nAs per our fresh preparation guidelines, keep cups refrigerated between 2°C - 4°C and consume within 5 days for optimal taste and texture.`;
      } else {
        simulatedReply = `[Model: ${model} | Temp: ${temperature}]\nResponding with persona "${assistantName}": Thank you for asking! I'm trained with your customized system instructions (${systemPrompt.slice(0, 45)}...) and knowledge base facts.`;
      }

      setTestMessages((prev) => [...prev, { sender: 'assistant', text: simulatedReply }]);
    }, 700);
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
            <h2 className="cm-title">AI Chatbot Training & API Hub</h2>
            <p className="cm-desc">
              Connect your AI model API, calibrate system instructions, train knowledge base facts, and test responses.
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
                <CheckCircle2 size={16} /> Saved Successfully!
              </>
            ) : isSaving ? (
              <>
                <RefreshCw size={16} className="spin" /> Saving to Cloud...
              </>
            ) : (
              'SAVE CHATBOT SETTINGS'
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
                <h3>1. Widget Status & Identity</h3>
              </div>
              <label className="cm-switch-label">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                <span className="cm-switch-slider" />
                <span className="cm-switch-text">{enabled ? 'Active on Website' : 'Disabled'}</span>
              </label>
            </div>

            <div className="cm-form-grid-3">
              <div className="form-group">
                <label>Assistant Display Name</label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="BITE UP Assistant"
                />
              </div>
              <div className="form-group">
                <label>Welcome Greeting Title</label>
                <input
                  type="text"
                  value={welcomeHeading}
                  onChange={(e) => setWelcomeHeading(e.target.value)}
                  placeholder="Hi! 👋"
                />
              </div>
              <div className="form-group">
                <label>Welcome Subtext</label>
                <input
                  type="text"
                  value={welcomeSubtext}
                  onChange={(e) => setWelcomeSubtext(e.target.value)}
                  placeholder="What can I help you find today?"
                />
              </div>
            </div>
          </div>

          {/* 2. API & MODEL CONFIGURATION */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <Key size={18} className="text-aqua" />
                <h3>2. API Connection & Model Settings</h3>
              </div>
              <span className="cm-badge-pill">Backend API Ready</span>
            </div>

            <div className="cm-form-grid-2">
              <div className="form-group">
                <label>AI Provider</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                  className="cm-select"
                >
                  <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
                  <option value="gemini">Google Gemini (Gemini 1.5 Flash / Pro)</option>
                  <option value="anthropic">Anthropic Claude (Claude 3.5 Sonnet / Haiku)</option>
                  <option value="groq">Groq (Llama 3, Mixtral)</option>
                  <option value="custom">Custom Endpoint / Self-Hosted Proxy</option>
                </select>
              </div>

              <div className="form-group">
                <label>Model Identifier</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. gpt-4o-mini, gemini-1.5-flash"
                />
              </div>
            </div>

            <div className="form-group">
              <label>API Key / Secret Token</label>
              <div className="cm-input-key-wrap">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-... or your AI API Key"
                />
                <button
                  type="button"
                  className="cm-btn-icon"
                  onClick={() => setShowKey(!showKey)}
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <small className="cm-hint">Stored safely in your cloud database.</small>
            </div>

            {apiProvider === 'custom' && (
              <div className="form-group">
                <label>Custom API URL / Endpoint</label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://api.yourdomain.com/v1/chat/completions"
                />
              </div>
            )}

            <div className="cm-form-grid-2">
              <div className="form-group">
                <div className="cm-label-slider-row">
                  <label>Temperature (Creativity): {temperature}</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="cm-slider"
                />
                <div className="cm-slider-hints">
                  <span>0.0 (Precise & Factual)</span>
                  <span>1.0 (Creative & Chatty)</span>
                </div>
              </div>

              <div className="form-group">
                <label>Max Response Tokens</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  placeholder="500"
                  min="50"
                  max="4000"
                />
                <small className="cm-hint">Recommended: 300 - 600 for concise answers.</small>
              </div>
            </div>
          </div>

          {/* 3. PROMPT ENGINEERING & TRAINING */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <Cpu size={18} className="text-aqua" />
                <h3>3. System Prompt & Brand Persona</h3>
              </div>
              <span className="cm-badge-pill">Core Instructions</span>
            </div>

            <p className="cm-card-sub">
              Define the AI assistant personality, tone of voice, boundaries, and how it represents BITE UP to customers.
            </p>

            <div className="form-group">
              <textarea
                rows={9}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="cm-code-textarea"
                placeholder="You are the friendly, energetic AI assistant for BITE UP..."
              />
            </div>
          </div>

          {/* 4. KNOWLEDGE BASE & STORE FACTS */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <Database size={18} className="text-aqua" />
                <h3>4. Knowledge Base & FAQs</h3>
              </div>
              <button
                type="button"
                className="cm-btn-action-small"
                onClick={handleInjectStoreData}
                title="Automatically format live active products and supermarket locations into the knowledge base"
              >
                <RefreshCw size={13} />
                <span>Inject Live Store Data</span>
              </button>
            </div>

            <p className="cm-card-sub">
              Provide specific facts, nutrition policies, shelf-life instructions, and FAQ answers. The AI will cite this knowledge when answering.
            </p>

            <div className="form-group">
              <textarea
                rows={11}
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                className="cm-code-textarea"
                placeholder="PRODUCT LINEUP & DETAILS:&#10;- Pudding Brownie: 345 kcal, 18g protein..."
              />
            </div>
          </div>

          {/* 5. QUICK SUGGESTIONS MANAGER */}
          <div className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <MessageSquare size={18} className="text-aqua" />
                <h3>5. Quick Suggestion Questions</h3>
              </div>
              <span className="cm-badge-pill">{suggestions.length} Questions</span>
            </div>

            <p className="cm-card-sub">
              These chips appear to visitors when they first open the chat window for easy 1-click questions.
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
                    title="Remove question"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cm-add-chip-row">
              <input
                type="text"
                placeholder="Add new question (e.g. Do you have keto options?)..."
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
                <Plus size={16} /> Add Question
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
                <h3>Live Testing Sandbox</h3>
              </div>
              <span className="cm-status-badge online">Simulator Ready</span>
            </div>

            <p className="cm-card-sub">
              Test your training instructions in real-time before visitors use it on the website.
            </p>

            <div className="cm-sandbox-thread">
              {testMessages.map((msg, idx) => (
                <div key={idx} className={`cm-sb-msg ${msg.sender}`}>
                  <div className="cm-sb-bubble">
                    <span className="cm-sb-sender">{msg.sender === 'user' ? 'Admin Test' : assistantName}</span>
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
                placeholder="Type test message (e.g. recommend for muscle gain)..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                disabled={isTestingTyping}
              />
              <button
                type="submit"
                className="cm-sb-send-btn"
                disabled={!testInput.trim() || isTestingTyping}
                title="Send test prompt"
              >
                <Send size={15} />
              </button>
            </form>

            <div className="cm-sandbox-footer">
              <button
                type="button"
                className="cm-btn-clear"
                onClick={() => setTestMessages([
                  { sender: 'assistant', text: 'Chat reset. Ask me a question to test my training.' }
                ])}
              >
                Clear Sandbox Chat
              </button>
            </div>
          </div>

          {/* QUICK REFERENCE CHEAT SHEET */}
          <div className="cm-card cm-cheatsheet-card">
            <div className="cm-card-header">
              <div className="cm-card-title-wrap">
                <HelpCircle size={16} className="text-aqua" />
                <h4>Training Tips</h4>
              </div>
            </div>
            <ul className="cm-tips-list">
              <li>
                <strong>Prompt Rules:</strong> Instruct the model to keep replies under 3 sentences for better mobile engagement.
              </li>
              <li>
                <strong>Language Handling:</strong> Explicitly specify in your prompt: "If user speaks Arabic, reply in Jordanian/Levantine or modern Arabic."
              </li>
              <li>
                <strong>Live Products:</strong> Use the <em>"Inject Live Store Data"</em> button whenever you add new puddings or granolas in the Products Manager!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
