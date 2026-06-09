# World-Class Typing Training Platform Architecture

## 1. Complete Product Architecture
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion for interactive feedback, Recharts for analytics, Zustand for global state management (user settings, auth state, current layout).
- **Backend**: Node.js & Express.js. Handles REST endpoints for storing user data, aggregating stats, generating adaptive exercises.
- **Real-Time**: Socket.io for multiplayer racing and live leaderboards.
- **Database**: MongoDB (using Mongoose for schema modeling). Scalable document store perfect for flexible JSON-like typing statistics and historical logs.
- **Authentication**: JWT & Google OAuth 2.0.
- **Deployment**: Next generation Vercel (Frontend) and Render/Fly.io (Backend & Socket).

## 2. Folder Structure
```text
/src
  /assets        # Images, fonts, sound packs
  /components
    /ui          # Reusable dumb components (Button, Input, Modal)
    /typing      # Core typing engine components (Caret, Word, Character)
    /charts      # Recharts wrapper components
    /layout      # Navbar, Sidebar, Footer, Layout wrappers
  /pages         # Route-level components (Arena, Dashboard, Profile, Settings)
  /services      # API clients, Gemini AI integrations, Socket connections
  /store         # Zustand stores (useGameStore, useUserStore, useThemeStore)
  /hooks         # Custom React hooks (useTypingEngine, useAnalytics)
  /utils         # Helpers (WPM calc, layout maps, formatting)
  /types         # Shared TypeScript interfaces
/server          # Express backend (Controllers, Models, Routes, Sockets)
```

## 3. Database Schema (MongoDB / Mongoose)
- **User**: `_id`, `email`, `username`, `passwordHash`, `googleId`, `xp`, `level`, `createdAt`
- **Result**: `_id`, `userId`, `wpm`, `rawWpm`, `accuracy`, `mode`, `difficulty`, `time`, `errors` (Map of char -> count), `createdAt`
- **Analytics**: `userId`, `weakFingers` (Array), `strongFingers` (Array), `dailyStreak`, `practiceTimeTotal`
- **Achievement**: `_id`, `name`, `description`, `icon`, `criteria`
- **MultiplayerMatch**: `_id`, `players` (Array of userIds), `winnerId`, `textId`, `createdAt`

## 4. API Design (REST)
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/google`
- `GET /api/users/:id/profile`, `PUT /api/users/:id/settings`
- `POST /api/results` (Submit new typing test result)
- `GET /api/users/:id/analytics` (Returns aggregated WPM, accuracy, heatmaps)
- `GET /api/challenges/daily` (Retrieve generated daily tasks)
- `GET /api/leaderboard` (Query parameters: `timeframe`, `mode`)

## 5. UI Design System
- **Spacing & Layout**: Standard 8px grid. Use Flexbox and CSS Grid for structured bento-box dashboards.
- **Typography**: Primary: "Inter" or "Space Grotesk" for UI elements. Monospace: "JetBrains Mono" or "Fira Code" for typing text and code blocks.
- **Colors**: Deep dark mode (`#0f172a`), contrasting text (`#f1f5f9`), vibrant accents (Cyan/Blue for success, Red for errors).
- **Feedback**: Framer Motion spring animations for the caret. Shake animations for incorrect inputs. Soft glowing shadows for active states.

## 6. Component Hierarchy
- `AppRouter`
  - `MainLayout`
    - `Navbar` / `Sidebar`
    - `PageContent`
      - `TypingArena`
        - `ConfigToolbar` (Language, Mode, Time)
        - `TextDisplay` (Words -> Characters)
        - `HiddenInput` / `Caret`
        - `LiveStats` (WPM, Progress)
      - `AnalyticsDashboard`
        - `StatCards`
        - `TimeChart` (Recharts)
        - `FingerHeatmap`

## 7. State Management Plan (Zustand)
- `useTypingStore`: Ephemeral state (current input, cursor position, current word, phase, active errors).
- `useSettingsStore`: Persisted state (theme, sound pack, font, cursor style, language).
- `useAuthStore`: Global user data and JWT token.
- `useMultiplayerStore`: Current room status, opponent progress, socket instance.

## 8. Feature Roadmap
1. **Phase 1 (Core)**: Refactor to robust component-based typing engine, setup Zustand, implement routing.
2. **Phase 2 (Analytics)**: Build backend data aggregation, mistake tracking, basic Recharts dashboard.
3. **Phase 3 (Learning & Code)**: Introduce Code Mode (syntax rendering), Finger placement maps, targeted practices.
4. **Phase 4 (Social & Gamification)**: Multiplayer racing via Sockets, XP/Leveling system, Leaderboards.
5. **Phase 5 (AI Integration)**: Gemini-powered post-session coaching and dynamic personalized generation.

## 9. MVP Version
A single-player, multi-mode (Time/Words/Quote) typing engine with robust frontend metrics (WPM, Raw, Accuracy, Error counting) and local persistence for settings and simple history.

## 10. Advanced Version
Includes user accounts, MongoDB persistence, global leaderboards, detailed finger/key mistake analytics, and coding mode.

## 11. Enterprise Version
Adds intelligent AI coaching, advanced adaptive test generation (targeting weak characters), real-time multiplayer arenas, and social friend systems.

## 12. Step-by-Step Development Plan
- **Step 1**: Establish frontend routing (`react-router-dom`) and global state (`zustand`), separate current App into `pages/Arena`.
- **Step 2**: Polish the Typing Engine. Ensure 100% accurate char-by-char validation, robust backspace handling, and smooth Framer Motion caret.
- **Step 3**: Develop backend schema and API endpoints for auth and result storage.
- **Step 4**: Build the Dashboard page using Recharts to visualize historical WPM/Accuracy.
- **Step 5**: Introduce Code Mode with a custom parser to render syntax-highlighted code blocks for typing.
- **Step 6**: Implement Mistake Analytics (recording specific missed characters and generating targeted practice text).
- **Step 7**: Expand Socket.io implementation to support full public/private racing modes.
