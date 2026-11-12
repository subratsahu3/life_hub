# 🌟 Life-Hub — Unified Daily Operating System

> **A holistic, cross-domain platform uniting Personal Productivity, Home Automation & Energy Saving, Health & Nutrition, Personal Finance, and Neighborhood Mutual Aid under a single unified intelligence engine.**

---

## 🎯 The Core Innovation: Why Life-Hub?

Modern daily life is fractured across a dozen isolated apps:
- Task apps don't know when your home energy tariff spikes.
- Calorie apps don't sync with your workout schedule or monthly grocery budget.
- Home automation hubs don't coordinate with your daily focus routines.
- Neighborhood groups are isolated on chat channels where borrowing a tool or finding volunteers is messy.

**Life-Hub solves this by creating a unified daily command center.** It correlates signals across all five vital life areas, generates a **Daily Life Rhythm Score (0–100%)**, and produces an **Automated Daily Intelligence Briefing** with actionable recommendations.

---

## 🚀 Key Modules & Capabilities

### 1. ⏱️ Personal Productivity & Time-Boxing
- **Pomodoro & Deep Work Engine**: 25m Focus, 50m Deep Work, and 5m Rest modes with interactive circular progress, synthesizer chime notifications, and automatic session duration logging.
- **Time-Boxed Task Planner**: Assign tasks to priority tiers (*Urgent, High, Medium, Low*), specify daily time slots (e.g. `10:30 - 12:00`), filter by status, and mark tasks done with one click.
- **Habit Streaks Tracker**: Daily non-negotiable habits with interactive fire streak tracking (`🔥 19d`), best streak records, and one-click daily check-in.

### 2. ⚡ Smart Living & Eco-Energy
- **Live Energy Telemetry**: Real-time monitoring of active load draw (Watts), renewable solar generation, net grid pull, and daily projected kWh.
- **Smart Appliance Control Grid**: Interactive master switches for AC, Lighting, Smart Sockets, Heaters, and Entertainment devices.
- **Contextual Sliders**: Direct temperature thermostat controls (`18°C - 30°C`) for climate units and brightness sliders for lighting arrays.
- **Eco-Saver Automation Rules**: Automated rule engine that dynamically shifts heavy power draws away from peak tariff windows.

### 3. 🥗 Health, Nutrition & Fitness
- **Macronutrient & Calorie Tracker**: Visual progress bar tracking daily caloric intake against your personal target with split bars for Protein, Carbohydrates, and Healthy Fats.
- **Interactive Hydration Station**: 8-glass visual water tracker with click-to-drink logging and streak notifications.
- **Meals Journal**: Log custom meals by type (*Breakfast, Lunch, Dinner, Snack*) or use built-in 1-click nutritional presets.
- **Guided Exercise Routines**: Guided step-by-step routines for Mobility, Cardio, and HIIT workouts with automatic active calorie burn calculation.

### 4. 💰 Finances & Proactive Budgeting
- **Monthly Cashflow Overview**: Real-time audit of monthly income inflow, total expenditures, net savings, and savings rate percentage.
- **Category Spending vs. Monthly Caps**: Automatic tracking across *Housing, Groceries, Utilities, Health, Dining, Transport, Leisure*. Visual alerts when spending crosses 85% warning thresholds or exceeds monthly caps.
- **Transaction Ledger**: Complete line-item audit trail with category icons and quick deletion.

### 5. 🤝 Neighborhood & Community Hub
- **Local Mutual Aid Bulletin**: Board for lending and borrowing heavy tools (e.g. cordless impact drills, ladders, lawn mowers), organizing volunteer initiatives, and exchanging skills.
- **Interactive Claim & Resolve**: Neighbors can request to borrow items, sign up to volunteer, and mark items returned or resolved.
- **Community Karma System**: Earn goodwill and karma points for active community participation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.14, FastAPI, SQLite with zero-friction schema migrations, Pydantic v2, Uvicorn |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons |
| **Audio & UX** | Web Audio API synthesizer for focus chimes, responsive glassmorphism dark mode |
| **Data Engine** | Auto-seeded relational SQLite database with realistic seed data out-of-the-box |

---

## 🏁 Quick Start Guide

### Option A: One-Click Launch (Windows)
Double-click `run_life_hub.bat` in `D:\Subrat\life_hub`.
It starts both the FastAPI backend and Vite frontend, then automatically opens your browser at **http://localhost:3000**.

### Option B: Manual Terminal Execution

#### 1. Start the Backend API
```powershell
cd "D:\Subrat\life_hub\backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs & Swagger UI: **http://127.0.0.1:8000/docs**
- Health Check: **http://127.0.0.1:8000/api/health**

#### 2. Start the Frontend
In a new terminal window:
```powershell
cd "D:\Subrat\life_hub\web"
npm run dev
```
- Access the web application: **http://localhost:3000**

---

## 📂 Project Architecture

```
D:\Subrat\life_hub\
├── backend\
│   ├── app\
│   │   ├── database.py       # SQLite connection, tables & realistic initial seeds
│   │   ├── schemas.py        # Pydantic v2 schemas for all 5 domains
│   │   ├── main.py           # FastAPI entrypoint, CORS & router registrations
│   │   └── routers\
│   │       ├── dashboard.py    # Harmony score & Smart Daily Briefing
│   │       ├── productivity.py # Tasks, habits, streaks & focus sessions
│   │       ├── energy.py       # Devices, power telemetry & automation rules
│   │       ├── health.py       # Meals, macros, water & workout guides
│   │       ├── finance.py      # Ledger, category budgets & cashflow
│   │       └── community.py    # Mutual aid board, claims & karma points
│   ├── life_hub.db           # SQLite database file
│   └── requirements.txt
├── web\
│   ├── src\
│   │   ├── api.ts            # Typed client API with automatic direct fallback
│   │   ├── types.ts          # Complete TypeScript interfaces
│   │   ├── App.tsx           # State orchestration, notifications & layouts
│   │   ├── main.tsx          # React 18 bootstrap
│   │   ├── index.css         # Animations & custom dark-theme scrollbars
│   │   ├── components\
│   │   │   └── Navbar.tsx      # Glassmorphic top navigation & status indicator
│   │   └── views\
│   │       ├── DashboardView.tsx     # Life Command Center
│   │       ├── ProductivityView.tsx  # Time-boxing, tasks, habits & Pomodoro
│   │       ├── EnergyView.tsx        # Smart appliances & power telemetry
│   │       ├── HealthView.tsx        # Nutrition, hydration & workouts
│   │       ├── FinanceView.tsx       # Ledger, budgets & savings rates
│   │       └── CommunityView.tsx     # Neighborhood sharing & mutual aid
│   ├── index.html            # Tailwind config & typography
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts        # Vite configuration with proxy to FastAPI
├── run_life_hub.bat          # 1-Click double-clickable launcher
├── run_life_hub.ps1          # PowerShell launcher
└── README.md
```
