# AI Explainer Studio

> Daily AI concept explainer videos — powered by Claude (Anthropic) + Remotion.

The app automatically selects today's topic from a structured 55+ topic curriculum, generates a coherent multi-scene video script using Claude, and provides a live preview. Topics build on prerequisites so videos watched in sequence create a natural learning path.

---

## Features

- **Daily topic picker** — deterministic (same topic all day), contextual (prerequisite-aware)
- **No topic repeats** — completed topics are tracked in localStorage
- **Coherent scripts** — Claude builds a narrative arc across scenes with a connecting thread
- **Live preview** — see every scene rendered in the browser before rendering
- **Export Remotion code** — one click to copy the composition code
- **Remotion render** — export 1920×1080 MP4 videos

---

## Tech Stack

| Layer       | Technology |
|-------------|-----------|
| UI          | React 18 + TypeScript |
| Styling     | Tailwind CSS |
| State       | Zustand |
| AI (primary)| Anthropic Claude API (Haiku — cheapest, fastest for structured JSON) |
| AI (fallback)| claude.ai OAuth token via local Express proxy (no API credits needed) |
| Video       | Remotion 4 |
| Build       | Vite 5 |

---

## Quick Start

### Prerequisites

- Node.js **18+** (`node --version`)
- An [Anthropic API key](https://console.anthropic.com) (`sk-ant-...`)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd explainer-studio
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
```

Open `.env` and add your API key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

> **Security note:** The app also accepts the API key entered directly in the UI sidebar.
> When entered via the UI, it is stored in **sessionStorage only** (cleared on tab close).
> The `.env` key is embedded in the Vite build — use it for local dev only, never deploy with it.
> If `VITE_ANTHROPIC_API_KEY` is set, it is **auto-populated** into the sidebar field on load — no manual paste needed.

### 3. Run the web app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Use the app

1. **Paste your API key** in the sidebar (or it reads from `.env` automatically)
2. **Choose difficulty** — Beginner / Intermediate / Advanced / Research
3. **Click "Generate Script"** — Claude builds a coherent scene-by-scene script
4. **Preview scenes** using the tabs, scrubber, or ← → arrow keys
5. **Click "Export Code"** to copy Remotion composition code to clipboard
6. **Mark Done** when you've watched/used the video — this prevents the topic from being picked again

### 5. Fallback: OAuth proxy mode (no API credits needed)

If your Anthropic API credits run out (or the key is invalid), the app shows a **"Try with Claude Code CLI"** button below the error message. Instead of calling the Anthropic API with a pay-per-use key, it routes the request through a local proxy server that authenticates via your **claude.ai subscription OAuth token** — stored securely in the macOS Keychain by Claude Code CLI.

No API key, no credits, no secrets in code or environment variables.

**How it works:**

The proxy reads your OAuth Bearer token from the macOS Keychain (written there by `claude auth login`), then calls the Anthropic API with:
- `Authorization: Bearer <token>` — uses your claude.ai Pro/Max subscription
- `anthropic-beta: oauth-2025-04-20` — enables OAuth-based inference routing

The token never leaves your machine and is never written to disk by this project.

**How to enable it:**

```bash
# 1. Authenticate Claude Code CLI (one-time)
claude auth login

# 2. Start the proxy server in a separate terminal
npm run server      # starts Express proxy on http://localhost:3001
```

Then in the app, click **Generate Script** as normal. If it fails, click **"Try with Claude Code CLI"** and the proxy handles the rest.

**Requirements:**
- [Claude Code CLI](https://claude.ai/code) installed: `claude --version`
- Authenticated via OAuth: `claude auth login` (requires a claude.ai Pro or Max subscription)
- Proxy server running: `npm run server`
- macOS only (uses the macOS Keychain to read the OAuth token)

---

### 6. Render a video with Remotion

After generating a script in the UI, save it:

```bash
# The UI's "Export Code" copies the composition.
# To render with Remotion, first save the script:
npm run studio          # Opens Remotion Studio at localhost:3000
npm run render          # Renders to out/<topicId>.mp4
```

---

## Project Structure

```
ai-explainer-studio/
│
├── src/                          # React web app
│   ├── types/index.ts            # All TypeScript types (single source of truth)
│   ├── config/
│   │   ├── curriculum.ts         # 55+ topics with prerequisites and categories
│   │   └── constants.ts          # API URLs, model names, storage keys
│   ├── lib/
│   │   ├── scheduler.ts          # Topic picking logic (contextual, no repeats)
│   │   └── storage.ts            # localStorage / sessionStorage abstraction
│   ├── services/
│   │   ├── claude.ts             # Anthropic API calls + response validation
│   │   ├── claudeCode.ts         # Claude Code CLI fallback (calls local proxy)
│   │   └── codeExporter.ts       # Generates Remotion composition code
│   ├── hooks/
│   │   └── useAppStore.ts        # Zustand store — single source of truth
│   └── components/
│       ├── ui/                   # Button, Badge, Toast
│       ├── panels/               # Sidebar, Toolbar, ScenePanel, StatusBar
│       └── canvas/               # VideoPreview, SceneRenderer
│
├── remotion/                     # Remotion compositions
│   ├── index.ts                  # registerRoot entry
│   ├── Root.tsx                  # Composition registration
│   ├── compositions/
│   │   └── VideoComposition.tsx  # Main composition — drives Series
│   └── scenes/
│       ├── types.ts              # SceneProps interface
│       ├── shared.ts             # Reusable spring / fade hooks
│       ├── TitleScene.tsx
│       ├── HookScene.tsx
│       ├── StepScene.tsx         # Handles: analogy, explainer, diagram, gotcha
│       ├── SummaryScene.tsx
│       └── TeaserScene.tsx
│
├── server.ts                     # Local OAuth proxy — reads token from macOS Keychain (port 3001)
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env.example                  # Safe to commit
├── .env                          # NEVER commit — in .gitignore
└── package.json
```

---

## Curriculum

55+ topics across 9 categories, each with explicit prerequisites:

| Category | Topics |
|----------|--------|
| Foundations | What is AI?, ML, Datasets, Features, Train/Test |
| ML Core | Supervised/Unsupervised, Overfitting, Loss, Gradient Descent |
| Neural Networks | Perceptron, Activations, Backprop, Dropout, Batch Norm |
| Deep Learning | CNN, RNN, LSTM, Autoencoders, GANs, ResNets, Transfer Learning |
| Language & LLMs | Embeddings, Tokenization, Attention, Transformers, BERT, GPT, RLHF, RAG |
| Computer Vision | Classification, Detection, Segmentation, Diffusion, CLIP |
| Reinforcement Learning | MDP, Q-Learning, Policy Gradient, AlphaGo |
| AI Safety & Ethics | Alignment, Bias, Interpretability, Adversarial, Constitutional AI |
| Research Frontiers | MoE, Mamba, World Models, Agents, Scaling Laws |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Claude Haiku** | Cheapest model, fast, excellent at structured JSON output. Reduces token cost by ~10x vs Opus. |
| **OAuth proxy over CLI spawn** | Replaces `claude -p` subprocess (which uses API credits) with direct SDK calls authenticated via the claude.ai subscription OAuth token — reads from macOS Keychain, zero secrets in code or env. |
| **Zustand over Redux** | Minimal boilerplate, built-in devtools, no Provider wrapping needed |
| **sessionStorage for API key** | Security — key is cleared when tab closes, never in git |
| **Prerequisite graph** | Enables contextual ordering without a full graph traversal — simple scoring function |
| **JSON schema in prompt** | Forces Claude to return exact structure — validated and normalised on the client before use |
| **Remotion separate from React app** | Clean separation — UI app and video renderer have different dependency trees |

---

## Contributing

1. Fork the repo
2. `git checkout -b feature/your-feature`
3. `npm run typecheck && npm run lint` before committing
4. Open a PR

---

## License

MIT
