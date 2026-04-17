"""
FastAPI application — entry point with CORS, lifespan, and routing.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS, UPLOADS_DIR
from .database import create_tables
from .inference import load_model
from .routes.predict import router as predict_router

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-8s │ %(name)s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs once on startup: load model, init DB, ensure dirs exist."""
    logger.info("Starting DermScan backend …")

    # Create uploads directory
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    # Create database tables (idempotent)
    create_tables()
    logger.info("Database ready ✓")

    # Load the TensorFlow model
    load_model()

    logger.info("DermScan backend is ready!")
    yield
    logger.info("Shutting down DermScan backend.")


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="DermScan API",
    description="AI-powered skin disease analysis",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(predict_router)


@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok"}
