# 🌟 Life-Hub — Unified Daily Operating System

> **A holistic, cross-domain platform uniting Personal Productivity, Home Automation & Energy Saving, Health & Nutrition, Personal Finance, and Neighborhood Mutual Aid under a single unified intelligence engine.**

[![Deploy to GitHub Pages](https://github.com/subratsahu3/life_hub/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/subratsahu3/life_hub/actions/workflows/deploy-pages.yml)
[![Build Android APK Release](https://github.com/subratsahu3/life_hub/actions/workflows/build-apk.yml/badge.svg)](https://github.com/subratsahu3/life_hub/actions/workflows/build-apk.yml)

---

## 🌐 Live Public Access & Downloads

- 🔗 **Live Web Application (Accessible Anywhere):**  
  👉 **[https://subratsahu3.github.io/life_hub/](https://subratsahu3.github.io/life_hub/)**  
  *(Works smoothly on any smartphone, iPhone, Android, tablet, or PC browser with offline persistence!)*

- 📱 **Download Android Release APK:**  
  👉 **[Download Latest APK from Releases](https://github.com/subratsahu3/life_hub/releases/latest)**  
  *(Direct `.apk` file for Android phones and tablets, optimized for all display sizes).*

- 📂 **Source Code Repository:**  
  👉 **[https://github.com/subratsahu3/life_hub](https://github.com/subratsahu3/life_hub)**

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

## 📱 Mobile Phone & All-Display-Size Adaptation

- 📱 **Native Mobile Bottom Navigation Bar**: Easy thumb navigation across all 6 core sections on phone screens.
- 🛡️ **Notch & Safe Area Inset Support**: Camera cutouts, punch-holes, and dynamic islands are protected using `viewport-fit=cover`.
- ⚡ **Universal Responsiveness**: Fluid layout seamlessly scaling from 320px compact phones up to 4K desktop screens.
- 📲 **PWA Installation**: Open the website on Chrome/Safari and tap **"Install App"** to add Life-Hub to your home screen as a standalone app!

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.14, FastAPI, SQLite with zero-friction schema migrations, Pydantic v2, Uvicorn |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons |
| **Mobile & PWA** | Web App Manifest, Service Worker offline caching, Edge-to-Edge display |
| **Android Native** | Android SDK 34, Hardware-accelerated WebView wrapper, Gradle build scripts |
| **CI/CD** | GitHub Actions automatic APK compilation & GitHub Pages deployment |

---

## 🏁 Running Locally

### Option A: 1-Click Launch (Windows)
Double-click `run_life_hub.bat` in `D:\Subrat\life_hub`.
It starts both the FastAPI backend and Vite frontend, then opens your browser at **http://localhost:3000**.

### Option B: Manual Terminal Execution

#### 1. Start the Backend API
```powershell
cd "D:\Subrat\life_hub\backend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs & Swagger UI: **http://127.0.0.1:8000/docs**

#### 2. Start the Frontend
In a new terminal window:
```powershell
cd "D:\Subrat\life_hub\web"
npm run dev
```
- Web Application: **http://localhost:3000**
