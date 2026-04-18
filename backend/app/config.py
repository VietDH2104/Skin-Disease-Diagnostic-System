"""
Application configuration — paths, model settings, class names.
"""

import os
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent          # backend/
MODEL_PATH = BASE_DIR / "model" / "skinnet_v3_phase3_best.keras"
UPLOADS_DIR = BASE_DIR / "uploads"
DATABASE_URL = f"sqlite:///{BASE_DIR / 'dermscan.db'}"

# ── Model settings ─────────────────────────────────────────────────────────────
IMG_SIZE = 300        # EfficientNetB3 input: 300×300
TOP_K = 5             # Number of predictions to return per image

# ── The 23 diagnostic classes (alphabetical order, indices 0–22) ───────────────
CLASS_NAMES = [
    "Acne_Rosacea",
    "Allergic_Contact_Dermatitis",
    "Athletes_Foot",
    "Atopic_Dermatitis_and_Keratosis",
    "Bacterial_Skin_Infection",
    "Benign_Skin_Lesion",
    "Bullous_Disease",
    "Cutaneous_Larva_Migrans",
    "Eczema_Others",
    "HSV_HPV_STD_STI",
    "Leprosy",
    "Lichenoid_Dermatoses",
    "Lupus_and_Connective_Tissue_Diseases",
    "Malignant_Skin_Lesion",
    "Nail_Fungus",
    "Psoriasis_and_Seborrheic Dermatitis",
    "Scabies_and_Infestation",
    "Seborrheic_Keratoses",
    "Tinea_Fungal_Infection",
    "Urticaria_Hives",
    "VZV_Viral_Infection",
    "Vascular_Tumors",
    "Warts",
]

# ── CORS ───────────────────────────────────────────────────────────────────────
# Set via env variable for deployment, e.g.:
#   set CORS_ORIGINS=https://dermscan.example.com,https://www.dermscan.example.com
# Falls back to localhost defaults for local development.
_DEFAULT_ORIGINS = "http://localhost:8080,https://localhost:8080,http://localhost:5173,https://localhost:5173"

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _DEFAULT_ORIGINS).split(",")
    if origin.strip()
]
