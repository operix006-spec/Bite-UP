declare const process: any;

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'local-api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
              res.statusCode = 204
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let bodyStr = ''
            req.on('data', (chunk) => { bodyStr += chunk })
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}')
                const apiKey = (env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '').trim()

                if (!apiKey) {
                  res.statusCode = 503
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY is not set in local .env' }))
                  return
                }

                const userText = String(body.message || '').slice(0, 1000).trim()
                const candidateModels = [
                  'google/gemini-2.0-flash-001',
                  'google/gemini-flash-1.5',
                  'openai/gpt-4o-mini',
                  'meta-llama/llama-3.3-70b-instruct:free',
                  'google/gemini-2.0-flash-lite-preview-02-05:free'
                ]

                const hasArabic = /[\u0600-\u06FF]/.test(userText)
                const languageDirective = hasArabic
                  ? `CRITICAL LANGUAGE DIRECTIVE: The user asked in ARABIC ("${userText}"). You MUST respond entirely in polite, natural Jordanian Arabic. Never use emojis or smilies.`
                  : `CRITICAL LANGUAGE DIRECTIVE: The user asked in ENGLISH ("${userText}"). You MUST respond 100% in pure ENGLISH. Do NOT use any Arabic words or Arabic script. Provide clear, accurate macros, nutrition advice, and product recommendations in fluent English. Never use emojis or smilies.`

                const safeHistory = Array.isArray(body.history)
                  ? body.history.slice(-6).map((m: any) => ({
                      role: m.sender === 'user' ? 'user' : 'assistant',
                      content: String(m.text || '').slice(0, 1000)
                    }))
                  : []

                let replyText = ''

                for (const modelName of candidateModels) {
                  try {
                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': 'http://localhost:5173',
                        'X-Title': 'BITE UP Protein Desserts (Dev)'
                      },
                      body: JSON.stringify({
                        model: modelName,
                        temperature: 0.7,
                        max_tokens: 800,
                        messages: [
                          {
                            role: 'system',
                            content: `${languageDirective}\n\n${body.systemPrompt || ''}\n\n=== LIVE STORE KNOWLEDGE BASE ===\n${body.knowledgeBase || ''}\n\nFINAL REMINDER: You must formulate your entire response in ${hasArabic ? 'Arabic' : 'English'}. Never use any emojis or smilies.`
                          },
                          ...safeHistory,
                          { role: 'user', content: userText }
                        ]
                      })
                    })

                    if (response.ok) {
                      const data = await response.json()
                      const content = data.choices?.[0]?.message?.content
                      if (content && content.trim()) {
                        replyText = content.trim()
                        break
                      }
                    }
                  } catch (e) {
                    // Try next model
                  }
                }

                if (replyText) {
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ reply: replyText }))
                } else {
                  res.statusCode = 502
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'Failed to generate AI response' }))
                }
              } catch (err: any) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err?.message || 'Server error' }))
              }
            })
          })
        }
      }
    ],
    server: {
      host: true,
      allowedHosts: true,
      watch: {
        ignored: ['**/*.exe', '**/.git/**']
      }
    }
  }
})
