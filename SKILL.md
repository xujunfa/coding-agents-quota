---
name: coding-agents-quota
description: "Query AI coding agent quotas (Minimax, Zhipu, QWen). Login once, then check usage via API or CLI."
metadata: {"clawdbot":{"emoji":"💰","requires":{"bins":["node","npm"]}}}
---

# Coding Agents Quota

Query usage quotas for AI coding agents.

## Supported Providers

- ✅ Minimax (MiniMax M2/M2.1)
- 🔜 Zhipu (GLM-4)
- 🔜 QWen (Qwen Code)

## Usage

### First Time Setup

Login to save authentication cookies:
```bash
cd ~/.clawdbot/skills/coding-agents-quota
npm run login minimax
```

### Check Quota

```bash
npm run status minimax
```

### Output Example

```
📊 Minimax Quota Status
==================================================
🤖 Model: MiniMax-M2
💰 Prompts: 1260 / 1500
📈 Used: 84.0%
📅 Period: 1/29/2026, 12:00:00 AM - 1/29/2026, 5:00:00 AM
==================================================
🕐 Last Updated: 1/29/2026, 1:20:27 AM
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Login
npm run login minimax

# Check status
npm run status minimax
```

## API

The skill uses the provider's APIs:
- Minimax: `https://www.minimaxi.com/v1/api/openplatform/coding_plan/remains`

Authentication is stored in `auth/minimax_cookies.json` (gitignored).
