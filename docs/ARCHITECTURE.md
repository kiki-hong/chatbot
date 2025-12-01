# Project Architecture & Consistency Rules

This document outlines the architectural rules for the Multi-Bot Chatbot project. These rules are enforced to ensure long-term maintainability and consistency.

## Directory Structure

### `data/` Directory
The `data/` directory is the single source of truth for chatbot knowledge bases.

- **Rule 1**: Each subdirectory in `data/` corresponds to a unique `botId` defined in `lib/bots.ts`.
- **Rule 2**: Inside each `data/{botId}/` directory:
    - **MUST** contain a `knowledge_index.json` file.
    - **MUST** contain `.md` files representing the knowledge base.
    - **SHOULD NOT** contain nested directories (unless explicitly handled by scripts).
    - **MUST** contain the "Core Files" defined in `lib/bots.ts` for that bot.

### `lib/bots.ts`
This file defines the configuration for all chatbots.

- **Rule 3**: Every bot defined in `bots` object **MUST** have a corresponding directory in `data/`.
- **Rule 4**: The `rag.coreFiles` array for each bot **MUST** list files that actually exist in the corresponding `data/{botId}/` directory.

## Validation

A validation script (`scripts/validate-bots.js`) runs before every build (`npm run build`).
- It checks if `data/{botId}` exists for every bot.
- It checks if `knowledge_index.json` exists.
- It verifies that all files listed in `rag.coreFiles` exist.

**If this validation fails, the build will fail.** This ensures that no broken configuration is ever deployed.

## Adding a New Bot

1.  Add the bot configuration to `lib/bots.ts`.
2.  Create a directory `data/{newBotId}`.
3.  Add your `.md` files to `data/{newBotId}`.
4.  Run `node scripts/update-knowledge-index.js` to generate the index.
5.  Run `node scripts/validate-bots.js` to verify everything is correct.
