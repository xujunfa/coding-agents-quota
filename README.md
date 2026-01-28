# coding-agents-quota

Query AI coding agent quotas across multiple providers.

## Supported Providers

- ✅ Minimax (MiniMax M2.1)
- 🔜 Zhipu (GLM-4)
- 🔜 QWen (Qwen Code)

## Installation

```bash
npm install
```

## Usage

### Login

First, login to save your session cookies:

```bash
# Login to Minimax
npm run login minimax

# Or run interactive login
npm run login
```

### Check Quota

```bash
# Check Minimax quota
npm run status minimax
```

## Project Structure

```
coding-agents-quota/
├── src/
│   ├── commands/
│   │   ├── login.ts     # Login command
│   │   └── status.ts    # Status command
│   ├── providers/
│   │   ├── base.ts      # Provider interface
│   │   └── minimax.ts   # Minimax implementation
│   └── index.ts         # CLI entry point
├── cookies/              # Saved session cookies (not tracked by git)
└── package.json
```

## How It Works

1. **Login**: Opens a browser window for you to log in to the provider's website. Session cookies are saved for future use.

2. **Status**: Loads saved cookies, opens the browser, navigates to the quota page, and extracts your current usage.

## Development

```bash
# Run in development mode
npm run dev status minimax

# Build for production
npm run build
```
