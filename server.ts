/**
 * Local Claude Code proxy server
 *
 * POST /generate  { prompt: string }
 *   → runs `claude -p "<prompt>"` and returns { text: string }
 *
 * Run with: npx tsx server.ts
 */

import express from 'express';
import cors from 'cors';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const app  = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Missing prompt' });
    return;
  }

  try {
    const { stdout, stderr } = await execFileAsync('claude', ['-p', prompt], {
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    });

    if (stderr) console.warn('[server] claude stderr:', stderr);

    res.json({ text: stdout.trim() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[server] claude failed:', msg);
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Claude Code proxy listening on http://localhost:${PORT}`);
});
