/**
 * Vercel serverless function: /api/chat
 * Streams OpenAI Chat Completions to the client as-is (SSE style).
 * Set OPENAI_API_KEY in your environment.
 */
export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    res.status(500).end('Missing OPENAI_API_KEY');
    return;
  }

  const { prompt = '', model = 'gpt-4o-mini' } = req.body || {};

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You are Farid’s portfolio assistant. Be concise, helpful, and practical.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!upstream.ok || !upstream.body) {
      res.status(upstream.status || 500).end('Upstream error');
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      // forward raw bytes (SSE lines "data: ...")
      res.write(Buffer.from(value));
    }

    res.end();
  } catch (err) {
    res.status(500).end('Proxy error');
  }
}