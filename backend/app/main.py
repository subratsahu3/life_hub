from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import init_db, seed_db
from .routers import productivity, energy, health, finance, community, dashboard

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize SQLite DB and seed with initial sample data
    init_db()
    seed_db()
    print("Life-Hub SQLite DB initialized and seeded successfully.")
    yield

app = FastAPI(
    title="Life-Hub Unified API",
    description="All-in-one daily life platform uniting productivity, home automation, health, finances, and community.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server (and any local client)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(dashboard.router, prefix="/api")
app.include_router(productivity.router, prefix="/api")
app.include_router(energy.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(finance.router, prefix="/api")
app.include_router(community.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Life-Hub Core Engine",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
