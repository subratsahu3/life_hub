# Life‑Hub Project

This is the starter repository for the **Life‑Hub** application that combines personal productivity, home automation, health & wellness, finance tracking, and community services into a single web platform.

## Directory layout (suggested)
```
life_hub/
├─ backend/          # FastAPI server (Python)
│   ├─ app/
│   │   ├─ models/      # SQLModel / Pydantic models
│   │   ├─ routers/     # API routes per feature
│   │   └─ main.py
│   └─ requirements.txt
├─ web/               # React‑TS frontend (Vite)
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   └─ App.tsx
│   └─ package.json
├─ docker-compose.yml # optional Docker setup
└─ .gitignore
```

## Getting started
```bash
# From the project root
cd life_hub
# Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend/app/main:app --reload

# Frontend (in a separate terminal)
cd web
npm install
npm run dev
```

Feel free to adjust the structure as you see fit. The full design spec is in the **ProjectProposal.md** artifact.
