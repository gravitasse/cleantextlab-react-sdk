# CleanTextLab POC (React Starter Kit)

This repository contains an official **Reference Implementation** for the [CleanTextLab API](https://cleantextlab.com).

It is a complete, production-ready React application that demonstrates how to build custom tools using the CleanTextLab engine.

## 🎯 What is CleanTextLab?

CleanTextLab is a deterministic text processing engine API. It handles messy formatting tasks (e.g., "Remove line breaks", "Convert CSV to JSON", "Extract Emails") so your main application (or AI agent) doesn't have to.

## ✨ What's Included

- **Full React + Vite Setup**: A modern, lightweight frontend stack.
- **30+ Pre-configured Tools**: Fully functional UI for:
  - **Text Cleaning**: Line Break Remover, Sort & Dedupe, Accent Remover, Title Case...
  - **Developer Tools**: JSON Formatter, Base64, URL Encode, SQL/Cron/Regex tools, ASCII Tree Generator...
  - **Numbers**: Phone Formatter, Number-to-Words, Roman Numerals...
- **API Integration**: Ready-to-use `cleanTextLabApi.ts` service.
- **Type Safety**: TypeScript definitions for all requests/responses.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An API Key from [CleanTextLab.com](https://cleantextlab.com/settings) (Free or Pro)

### Step 1: Fork or Clone This Repository

```bash
git clone https://github.com/auguststurm/CleanTextLab-POC.git
cd CleanTextLab-POC
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

1. Copy the template:

   ```bash
   cp .env.local.template .env.local
   ```

2. Open `.env.local` and add your **CleanTextLab API Key**:

   ```env
   VITE_CLEANTEXTLAB_API_KEY=ctl_live_xxxxxxxxxxxxx
   ```

### ⚠️ Important: CORS & Localhost

To make requests from `http://localhost:5173` (the default Vite port), you **MUST** whitelist this origin in your CleanTextLab settings.

1. Go to [CleanTextLab Settings](https://cleantextlab.com/settings).
2. Find the **CORS Allowed Origins** section.
3. Add `http://localhost:5173`.
4. Click **Save**.

*If you skip this, requests will fail with a Network Error / CORS error.*

### Step 4: Run It

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the app.

## 🧠 Smart Content Detection

The starter kit includes **Magic Input** - intelligent content detection that automatically suggests relevant tools based on what you paste:

- **JSON Detection** - Identifies malformed JSON and suggests JSON Formatter
- **CSV/List Detection** - Recognizes tabular data and suggests Sort & Dedupe or CSV-JSON Converter
- **Email Lists** - Detects email patterns and suggests Email Extractor
- **Phone Numbers** - Identifies phone number patterns and suggests Phone Formatter
- **URL Encoding** - Detects encoded characters (%) and suggests URL Decoder
- **Base64** - Identifies Base64-encoded strings and suggests Base64 Decoder
- **Accents/Diacritics** - Detects non-ASCII characters and suggests Accent Remover
- **URLs** - Detects links and suggests URL Sanitizer

The detection logic ranks suggestions by confidence (0.0-1.0) and shows the top 3 matches.

**Implementation:** See `src/utils/detectContent.ts` for the pattern matching logic.

## 🛠️ Modifying the App

- **Add a Tool**: Edit `src/config/tools.ts`. This file drives the entire UI.
- **Change the API Logic**: Check `src/services/cleanTextLabApi.ts`.
- **Add Detection Patterns**: Modify `src/utils/detectContent.ts` to recognize new content types.
- **Styling**: Uses Tailwind CSS (`src/App.tsx`).

## 📄 License

MIT License. You are free to commit this code to your own private repos or use it as a base for commercial internal tools.
