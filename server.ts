/**
 * Local Claude proxy server — uses claude.ai OAuth token (no API credits needed)
 *
 * POST /generate  { prompt: string }
 *   → calls Anthropic SDK with OAuth Bearer token and returns { text: string }
 *
 * Run with: npx tsx server.ts
 */

import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import Anthropic from '@anthropic-ai/sdk';

const app  = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

function getOAuthToken(): string {
  const raw = execSync('security find-generic-password -s "Claude Code-credentials" -w', {
    encoding: 'utf8',
  }).trim();
  const creds = JSON.parse(raw) as { claudeAiOauth?: { accessToken?: string } };
  const token = creds?.claudeAiOauth?.accessToken;
  if (!token) throw new Error('Claude OAuth token not found in keychain. Run: claude auth login');
  return token;
}

let client: Anthropic;
try {
  const authToken = getOAuthToken();
  client = new Anthropic({
    authToken,
    apiKey: null as unknown as string, // prevent SDK from using ANTHROPIC_API_KEY env var
    defaultHeaders: { 'anthropic-beta': 'oauth-2025-04-20' },
  });
  console.log('[server] OAuth token loaded from keychain');
} catch (err) {
  console.error('[server] Failed to load OAuth token:', err instanceof Error ? err.message : err);
  process.exit(1);
}

app.post('/generate', async (req, res) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Missing prompt' });
    return;
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    const text = textBlock && textBlock.type === 'text' ? textBlock.text : '';
    res.json({ text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[server] API error:', msg);
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Claude proxy listening on http://localhost:${PORT}`);
});
