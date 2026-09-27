# 🎙️ GramVoice AI — Backend API Service

Production-ready Node.js & Express.js backend for **GramVoice AI**, providing low-latency AI responses with Google Gemini Flash models, persistent conversations, mentorship scheduling, and analytics backed by Supabase PostgreSQL.

---

## 🏗️ Architecture & Features

- **Modular MVC Design:** Clean separation of concerns with `config`, `controllers`, `routes`, and `middleware`.
- **Google Gemini Ultra-Fast AI Pipeline:** Multi-model fallback mechanism (`gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-3.8-flash`) with voice-first Hindi/English system prompts.
- **Supabase PostgreSQL Integration:** Automatic logging of voice interactions, mentorship appointments, and user bookmarks.
- **Production Resilience:** Configured CORS policies, automated keep-alive pings for free cloud tiers (Render), and graceful error handling.

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase Client & PostgreSQL connection
│   ├── controllers/
│   │   ├── aiController.js      # Gemini generation & chat history
│   │   ├── mentorController.js  # Consultation session bookings
│   │   └── statsController.js   # Analytics & dashboard metrics
│   ├── middleware/
│   │   └── cors.js              # Production CORS policy
│   ├── routes/
│   │   ├── aiRoutes.js          # /api/chat, /api/history
│   │   ├── mentorRoutes.js      # /api/bookings
│   │   ├── statsRoutes.js       # /api/stats
│   │   └── healthRoutes.js      # /api/health
│   └── app.js                   # Express application setup
├── server.js                    # Server bootstrap entrypoint
├── package.json
└── .env.example
```

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and add your credentials:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=http://localhost:5173,https://gram-voice-ai.vercel.app
```

### 3. Start Server
```bash
# Development (with file watch)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & connection diagnostics |
| `POST` | `/api/chat` | Send prompt to Gemini AI & persist conversation |
| `GET` | `/api/history` | Retrieve recent voice chat logs |
| `POST` | `/api/bookings` | Book 1-on-1 mentorship consultation |
| `GET` | `/api/bookings` | Fetch scheduled mentor bookings |
| `GET` | `/api/stats` | Aggregated dashboard business metrics |

---

## 📄 License
MIT © GramVoice AI
