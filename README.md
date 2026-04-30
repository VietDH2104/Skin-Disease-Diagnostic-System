# DermScan — AI Skin Disease Diagnostic System

DermScan is a full-stack, AI-powered web application that classifies skin conditions from images using deep learning. Users can upload a photo or capture one with their device's camera to receive instant analysis — including confidence scores, severity assessments, and detailed medical context for **23 skin diseases**.

Built as a thesis project, DermScan combines a trained **EfficientNetB3** model with a modern React frontend and FastAPI backend, deployed across **Vercel**, **Hugging Face Spaces**, and **Supabase**.

---

## ✨ Features

### 🔬 AI-Powered Analysis
- **23 skin condition** classification using a fine-tuned EfficientNetB3 model
- **Top-5 predictions** with confidence percentages for each analysis
- **Animated confidence scores** that count up with smooth easing
- **Confidence labels** — Strong Match, Likely, Possible, Unlikely

### 📚 Disease Knowledge Base
- Comprehensive medical information for all 23 conditions
- **Symptoms, causes, severity levels**, and common body locations
- **"When to See a Doctor"** guidance for each condition
- **Severity badges** — Low, Moderate, High, Critical with color-coded indicators

### 🗂️ Multi-Page Application
- **Home** — Image upload/capture with instant AI analysis
- **Disease Library** — Searchable, filterable grid of all 23 conditions with detail modals
- **About** — How it works, technology stack, system architecture

### 🎨 Modern UI/UX
- **Glassmorphism** design with animated gradient backgrounds
- **Dark/Light mode** with system preference detection
- **Drag & drop** image upload with visual feedback
- **Expandable result cards** — tap any prediction to reveal full disease details
- **Multi-step loading** indicator (Uploading → Preprocessing → Analyzing → Generating)
- **Copy results** button to share analysis as formatted text
- **Responsive** design for mobile, tablet, and desktop
- **Mobile hamburger menu** with smooth animations

---

## 🏗️ System Architecture

```
┌─────────────────┐     HTTPS     ┌──────────────────────┐     SQL     ┌─────────────┐
│    Frontend      │ ──────────── │      Backend          │ ────────── │  Database    │
│  React + Vite    │              │  FastAPI + TensorFlow │            │ PostgreSQL   │
│  Vercel          │              │  Hugging Face Spaces  │            │ Supabase     │
└─────────────────┘              └──────────────────────┘            └─────────────┘
```

| Layer | Technology | Hosting |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui | Vercel |
| **Backend** | FastAPI, TensorFlow/Keras, SQLAlchemy | Hugging Face Spaces (Docker) |
| **Database** | PostgreSQL (production) / SQLite (local dev) | Supabase |
| **ML Model** | EfficientNetB3 (300×300 input) | Bundled in backend container |

---

## 📁 Project Structure

```
DermScan/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── routes/             # API route handlers
│   │   │   └── predict.py      # POST /predict — image classification endpoint
│   │   ├── config.py           # Paths, model settings, 23 class names, CORS
│   │   ├── database.py         # SQLAlchemy engine and session management
│   │   ├── inference.py        # TensorFlow model loading and prediction logic
│   │   ├── main.py             # FastAPI app, lifespan events, middleware
│   │   ├── models.py           # Database ORM models (images, predictions)
│   │   └── schemas.py          # Pydantic request/response schemas
│   ├── model/                  # Trained EfficientNetB3 .keras model file
│   ├── uploads/                # Temporary image storage
│   ├── requirements.txt        # Python dependencies
│   └── run.py                  # Uvicorn entry point
│
├── Docker/
│   └── dermscan-api/           # Dockerfile and config for HF Spaces deployment
│
├── src/                        # React frontend
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   ├── Layout.tsx          # Shared layout — nav bar, background, footer
│   │   ├── ImageCapture.tsx    # Camera capture component
│   │   ├── ImageUpload.tsx     # File upload with drag & drop
│   │   ├── ResultsView.tsx     # Prediction cards with expandable disease details
│   │   └── ThemeToggle.tsx     # Dark/light mode switch
│   ├── lib/
│   │   ├── api.ts              # API client — analyzeImage() fetch wrapper
│   │   ├── diseases.ts         # Disease knowledge base (23 conditions)
│   │   └── utils.ts            # Tailwind class merge utility
│   ├── pages/
│   │   ├── Index.tsx           # Home page — upload, preview, analyze flow
│   │   ├── Diseases.tsx        # Disease Library — searchable grid + detail modals
│   │   ├── About.tsx           # About page — how it works, tech stack, disclaimer
│   │   └── NotFound.tsx        # 404 page
│   ├── App.tsx                 # Router and provider setup
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Global styles, animations, design tokens
│
├── index.html                  # Vite HTML entry point
├── vite.config.ts              # Vite config with API proxy for local dev
├── tailwind.config.ts          # Tailwind theme customization
├── package.json                # Frontend dependencies
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- Trained model file (`skinnet_v3_phase3_best.keras`) placed in `backend/model/`

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server (with hot-reload)
set ENV=development    # Windows
# export ENV=development  # macOS/Linux
python run.py
```

The backend API starts at **`http://localhost:8000`**.

### 2. Frontend Setup

Open a **new terminal** in the project root:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend starts at **`http://localhost:8080`**. The Vite dev server automatically proxies `/predict` requests to the backend.

### 3. Open the App

Navigate to `http://localhost:8080` in your browser. Upload or capture an image to analyze!

---

## 🌐 Deployment

### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set the **Production Branch** to `deployment`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-space-name.hf.space
   ```
4. Deploy — Vercel auto-deploys on every push to `deployment`

### Backend → Hugging Face Spaces

1. Create a **Docker** Space on [Hugging Face](https://huggingface.co/spaces)
2. Upload the contents of `Docker/dermscan-api/` along with your `backend/` code and model
3. Set **Secrets** in the Space settings:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```

### Database → Supabase

1. Create a free project on [Supabase](https://supabase.com)
2. Copy the **Connection String** (PostgreSQL) from Project Settings → Database
3. Use it as the `DATABASE_URL` secret in Hugging Face

> **Note:** Free Supabase projects pause after 7 days of inactivity. Restore from the dashboard if this happens.

---

## 🔌 Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | Frontend (Vercel) | Backend API URL (empty for local dev) |
| `DATABASE_URL` | Backend (HF Spaces) | PostgreSQL connection string |
| `CORS_ORIGINS` | Backend (HF Spaces) | Allowed frontend origins |
| `ENV` | Backend (local) | Set to `development` for hot-reload |

---

## 🧬 Supported Skin Conditions

The model classifies images into **23 categories**:

| # | Condition | Category | Severity |
|---|-----------|----------|----------|
| 1 | Acne & Rosacea | Inflammatory | Moderate |
| 2 | Allergic Contact Dermatitis | Allergic | Moderate |
| 3 | Athlete's Foot | Fungal | Low |
| 4 | Atopic Dermatitis & Keratosis | Inflammatory | Moderate |
| 5 | Bacterial Skin Infection | Infectious | High |
| 6 | Benign Skin Lesion | Neoplastic | Low |
| 7 | Bullous Disease | Autoimmune | High |
| 8 | Cutaneous Larva Migrans | Parasitic | Moderate |
| 9 | Eczema (Other Types) | Inflammatory | Moderate |
| 10 | HSV / HPV / STD-Related | Viral | High |
| 11 | Leprosy (Hansen's Disease) | Infectious | Critical |
| 12 | Lichenoid Dermatoses | Inflammatory | Moderate |
| 13 | Lupus & Connective Tissue Diseases | Autoimmune | High |
| 14 | Malignant Skin Lesion | Neoplastic | Critical |
| 15 | Nail Fungus (Onychomycosis) | Fungal | Low |
| 16 | Psoriasis & Seborrheic Dermatitis | Inflammatory | Moderate |
| 17 | Scabies & Skin Infestation | Parasitic | Moderate |
| 18 | Seborrheic Keratoses | Neoplastic | Low |
| 19 | Tinea (Ringworm) Infection | Fungal | Moderate |
| 20 | Urticaria (Hives) | Allergic | Moderate |
| 21 | VZV Viral Infection (Shingles / Chickenpox) | Viral | High |
| 22 | Vascular Tumors | Neoplastic | Moderate |
| 23 | Warts | Viral | Low |

---

## 🧪 Development

```bash
# Run linter
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `deployment` | Production — Vercel deploys from here |
| `feature/ui-enhancements` | Development — latest working code |
| `cleanup-post-deploy` | Post-deployment cleanup snapshot |

---

## ⚠️ Disclaimer

DermScan is an **educational tool** developed as a thesis project. It is **not a substitute for professional medical advice, diagnosis, or treatment**. Always consult a qualified dermatologist or healthcare provider for skin concerns. The AI model's predictions should be used as a preliminary reference only.

---

## 📄 License

This project was developed as part of an academic thesis. All rights reserved.
