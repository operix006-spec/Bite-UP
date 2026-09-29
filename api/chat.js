export const config = {
  runtime: 'edge',
};

// In-Memory Rate Limiting for Edge instances
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 20; // Max 20 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipRateMap.get(ip);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    ipRateMap.set(ip, { count: 1, startTime: now });
    return false;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  record.count += 1;
  return false;
}

export default async function handler(req) {
  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Rate Limiting Protection against bots and scrapers
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'client-ip';

  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ 
      error: 'Too many requests. Please wait a moment before sending another message.' 
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Parse & Validate Payload
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message, history = [], systemPrompt = '', knowledgeBase = '' } = body;
  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'Valid message string is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Prevent giant token abuse attacks
  const userText = message.slice(0, 1000).trim();
  if (!userText) {
    return new Response(JSON.stringify({ error: 'Empty message' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. Get API Key exclusively from server-side environment variables
  const apiKey = (process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY || '').trim();
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      error: 'Backend API key is not configured. Please set OPENROUTER_API_KEY in Vercel Environment Variables.' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 6. Multi-model candidate list for high availability
  const candidateModels = [
    'google/gemini-2.0-flash-001',
    'google/gemini-flash-1.5',
    'openai/gpt-4o-mini',
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemini-2.0-flash-lite-preview-02-05:free'
  ];

  const hasArabic = /[\u0600-\u06FF]/.test(userText);
  const languageDirective = hasArabic
    ? `CRITICAL LANGUAGE DIRECTIVE: The user asked in ARABIC ("${userText}"). You MUST respond entirely in polite, natural Jordanian Arabic. Never use emojis or smilies.`
    : `CRITICAL LANGUAGE DIRECTIVE: The user asked in ENGLISH ("${userText}"). You MUST respond 100% in pure ENGLISH. Do NOT use any Arabic words or Arabic script. Provide clear, accurate macros, nutrition advice, and product recommendations in fluent English. Never use emojis or smilies.`;

  const safeHistory = Array.isArray(history)
    ? history.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: String(m.text || '').slice(0, 1000)
      }))
    : [];

  let replyText = '';
  let lastStatus = 500;

  for (const modelName of candidateModels) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://biteup.jo',
          'X-Title': 'BITE UP Protein Desserts'
        },
        body: JSON.stringify({
          model: modelName,
          temperature: 0.7,
          max_tokens: 800,
          messages: [
            {
              role: 'system',
              content: `${languageDirective}\n\n${systemPrompt}\n\n=== LIVE STORE KNOWLEDGE BASE ===\n${knowledgeBase}\n\nFINAL REMINDER: You must formulate your entire response in ${hasArabic ? 'Arabic' : 'English'}. Never use any emojis or smilies.`
            },
            ...safeHistory,
            { role: 'user', content: userText }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim()) {
          replyText = content.trim();
          break;
        }
      } else {
        lastStatus = response.status;
      }
    } catch (err) {
      // Continue to next candidate model
    }
  }

  if (replyText) {
    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
    });
  }

  return new Response(JSON.stringify({ 
    error: 'Failed to generate response from all candidate models',
    status: lastStatus 
  }), {
    status: 502,
    headers: { 'Content-Type': 'application/json' },
  });
}
