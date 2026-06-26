# DermScan - Skin Disease Classification System

DermScan classifies skin conditions from a photo. You upload an image or take one with your camera, and the system returns the five most likely diagnoses out of 23 possible conditions, each with a confidence score and supporting medical information.

It was built as a thesis project. The model is an EfficientNetB3 network trained on public dermatological images. The frontend runs on React, the backend on FastAPI, and the two are deployed on Vercel and Hugging Face Spaces with a Supabase database behind them.

A note before anything else: this is a research and educational tool, not a medical device. It does not replace a dermatologist. The predictions are a starting point for discussion with a qualified doctor, nothing more.

---

## What it does

The model returns the top five predictions rather than a single answer. This is deliberate. Many skin diseases look alike in a photograph, and even a trained clinician often cannot separate them by sight alone. A ranked shortlist is more honest about that uncertainty than a single confident guess, and it matches how the system is meant to be used: as a triage aid, not a verdict.

Each prediction comes with a confidence percentage, a severity level, and a short description of the condition including common symptoms and when to see a doctor. The disease library page lets you browse all 23 conditions directly without uploading anything.

---

## Architecture

```
Frontend (React + Vite)  -->  Backend (FastAPI + TensorFlow)  -->  Database (PostgreSQL)
       Vercel                      Hugging Face Spaces                  Supabase
```

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS | Vercel |
| Backend | FastAPI, TensorFlow/Keras, SQLAlchemy | Hugging Face Spaces (Docker) |
| Database | PostgreSQL in production, SQLite for local dev | Supabase |
| Model | EfficientNetB3, 300x300 input | Bundled in the backend container |

The frontend sends an image to the backend. The backend validates it, runs the model, saves the image and its predictions to the database, and returns the ranked results.

---

## Project structure

```
Docker/dermscan-api/         Backend (FastAPI)
  app/
    main.py                  App setup, startup events, middleware
    config.py                Model path, class names, CORS settings
    inference.py             Model loading and prediction
    database.py              Database connection and sessions
    models.py                Database tables for images and predictions
    schemas.py               Request and response formats
    routes/predict.py        The /predict endpoint
  requirements.txt           Python dependencies
  Dockerfile                 Container build for Hugging Face Spaces
  run.py                     Server entry point

Skin-Disease-Diagnostic-System-deployment/   Frontend (React)
  src/
    components/              Interface components and shadcn/ui primitives
    pages/                   Home, Disease Library, About, 404
    lib/                     API client, disease data, utilities
  vite.config.ts            Build config and local dev proxy
  package.json              Frontend dependencies
```

---

## Running it locally

You need Node.js 18 or higher, Python 3.10 or higher, and the trained model file (`skinnet_v3_phase3_best.keras`). A full step-by-step version of this is in `INSTALLATION_GUIDE.txt`.

Backend:

```bash
cd Docker/dermscan-api
# place the model at: model/skinnet_v3_phase3_best.keras
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

The backend starts at `http://localhost:8000`. Without a `DATABASE_URL` set, it falls back to a local SQLite file, so there is nothing else to configure for testing.

Frontend, in a second terminal:

```bash
cd Skin-Disease-Diagnostic-System-deployment
npm install
npm run dev
```

The frontend starts at `http://localhost:8080` and proxies prediction requests to the backend automatically. Open that address in a browser to use the app.

---

## Deployment

The frontend deploys to Vercel from the production branch. Set `VITE_API_URL` to the backend URL in the Vercel environment settings.

The backend deploys to Hugging Face Spaces as a Docker space. Upload the contents of `Docker/dermscan-api/` along with the model file, then set two secrets in the space settings:

```
DATABASE_URL=postgresql://user:pass@host:port/dbname
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

The database is a Supabase PostgreSQL project. Copy its connection string into `DATABASE_URL`. Free Supabase projects pause after a week of inactivity, so if the app stops saving predictions, check whether the database needs restarting from the Supabase dashboard.

---

## Environment variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_API_URL` | Frontend (Vercel) | Backend URL; leave empty for local dev |
| `DATABASE_URL` | Backend (HF Spaces) | PostgreSQL connection string |
| `CORS_ORIGINS` | Backend (HF Spaces) | Allowed frontend origins |

---

## The 23 conditions

Acne & Rosacea, Allergic Contact Dermatitis, Athlete's Foot, Atopic Dermatitis & Keratosis, Bacterial Skin Infection, Benign Skin Lesion, Bullous Disease, Cutaneous Larva Migrans, Eczema (other types), HSV/HPV/STD-related, Leprosy, Lichenoid Dermatoses, Lupus & Connective Tissue Diseases, Malignant Skin Lesion, Nail Fungus, Psoriasis & Seborrheic Dermatitis, Scabies & Infestation, Seborrheic Keratoses, Tinea (ringworm), Urticaria (hives), VZV Viral Infection, Vascular Tumors, and Warts.

---

## Development commands

```bash
npm run lint      # lint the frontend
npm run test      # run frontend tests
npm run build     # production build
npm run preview   # preview the production build
```

---

## Disclaimer

DermScan is an educational tool from an academic thesis. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified dermatologist for any skin concern. Treat the model's output as a preliminary reference and nothing more.
