# DermScan Backend — Implementation Plan

Build a FastAPI backend that loads the trained EfficientNetB3 `.keras` model, serves skin disease predictions, and persists images + results in a SQLite database.

---

## Decisions Made

| Decision | Choice |
|---|---|
| Predictions stored/displayed | **Top 5** per image |
| Python version | **3.12.10** (already installed) |
| TensorFlow | `tensorflow` (installed via pip in venv) |
| Database | **SQLite** (zero config, single file — swap to PostgreSQL at deploy time by changing 1 env var) |
| User accounts | **None** — no login, no auth |
| TTA | **No** — single-pass inference only |
| Model file | User places `skinnet_v3_phase3_best.keras` in `backend/model/` |

---

## Architecture Overview

```mermaid
graph LR
    subgraph Browser ["Browser (React · port 8080)"]
        A["User captures/uploads image"]
    end
    subgraph Server ["Python Backend (FastAPI · port 8000)"]
        B["POST /predict"]
        C["Preprocess 300×300"]
        D["EfficientNetB3 model.predict()"]
        E["Save image to disk"]
        F["Save to SQLite DB"]
    end
    A -->|"FormData (image file)"| B
    B --> C --> D
    B --> E
    D --> F
    F -->|"JSON { image_id, predictions }"| A
```

**Two terminals to run the app:**
- Terminal 1: `npm run dev` → React frontend on port 8080
- Terminal 2: `python run.py` → FastAPI backend on port 8000

---

## Database Design (2 Tables)

Each image upload creates **1 row** in `images` + **5 rows** in `predictions`.

```mermaid
erDiagram
    images {
        TEXT id PK "UUID4"
        TEXT original_filename "user's file name"
        TEXT stored_filename "uuid.jpg on disk"
        TEXT file_path "relative path to uploads/"
        INTEGER file_size_bytes
        DATETIME created_at "auto-set"
    }
    predictions {
        INTEGER id PK "autoincrement"
        TEXT image_id FK "→ images.id"
        TEXT class_name "e.g. Acne_Rosacea"
        REAL confidence "0.0 – 1.0"
        INTEGER rank "1 = highest confidence"
    }
    images ||--|{ predictions : "has 5"
```

### Example — user uploads `photo.jpg`:

**`images` table** — 1 row:

| id | original_filename | stored_filename | file_size_bytes | created_at |
|---|---|---|---|---|
| `a1b2c3d4-...` | photo.jpg | a1b2c3d4.jpg | 245760 | 2026-04-17 12:50 |

**`predictions` table** — 5 rows:

| id | image_id | class_name | confidence | rank |
|---|---|---|---|---|
| 1 | `a1b2c3d4-...` | Acne_Rosacea | 0.8234 | 1 |
| 2 | `a1b2c3d4-...` | Eczema_Others | 0.0912 | 2 |
| 3 | `a1b2c3d4-...` | Psoriasis_and_Seborrheic Dermatitis | 0.0401 | 3 |
| 4 | `a1b2c3d4-...` | Tinea_Fungal_Infection | 0.0298 | 4 |
| 5 | `a1b2c3d4-...` | Allergic_Contact_Dermatitis | 0.0155 | 5 |

> [!TIP]
> This schema supports powerful queries like *"Show me all images where Acne_Rosacea was predicted with > 80% confidence"* — just a simple `WHERE class_name = 'Acne_Rosacea' AND confidence > 0.8` on the predictions table.

---

## Project Structure

```
DermScan/
├── backend/                         ← NEW FOLDER (entire thing)
│   ├── app/
│   │   ├── __init__.py              # Package marker
│   │   ├── main.py                  # FastAPI app, CORS, startup
│   │   ├── config.py                # Paths, class names, settings
│   │   ├── database.py              # SQLite connection setup
│   │   ├── models.py                # Image & Prediction DB tables
│   │   ├── schemas.py               # API response shapes
│   │   ├── inference.py             # Load model + predict function
│   │   └── routes/
│   │       ├── __init__.py          # Package marker
│   │       └── predict.py           # POST /predict endpoint
│   ├── model/
│   │   └── (you place .keras here)  # Model checkpoint
│   ├── uploads/                     # Saved images (auto-created)
│   ├── requirements.txt             # Python dependencies
│   └── run.py                       # Entry point: python run.py
│
├── src/                             ← EXISTING (minimal changes)
│   └── lib/
│       └── api.ts                   # Add image_id to response type
├── .gitignore                       ← MODIFY (add backend ignores)
└── ...
```

---

## Detailed File-by-File Plan

---

### Part 1: Backend Setup Files

#### [NEW] `backend/requirements.txt`

Python dependencies to install:
```
fastapi
uvicorn[standard]
python-multipart
tensorflow
Pillow
sqlalchemy
pydantic-settings
```

#### [NEW] `backend/run.py`

Simple entry point — runs the FastAPI server:
```python
import uvicorn
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

---

### Part 2: Configuration

#### [NEW] `backend/app/config.py`

All configurable settings in one place:

| Setting | Value | Purpose |
|---|---|---|
| `BASE_DIR` | `Path(__file__).parent.parent` | Root of backend/ |
| `MODEL_PATH` | `backend/model/skinnet_v3_phase3_best.keras` | Model checkpoint |
| `UPLOADS_DIR` | `backend/uploads/` | Where images are saved |
| `DATABASE_URL` | `sqlite:///backend/dermscan.db` | Database location |
| `IMG_SIZE` | `300` | Model input dimensions |
| `TOP_K` | `5` | Number of predictions to return |
| `CLASS_NAMES` | 23-element list | Maps model index → disease name |

The 23 class names (alphabetical, matching model output indices 0–22):
```python
CLASS_NAMES = [
    'Acne_Rosacea', 'Allergic_Contact_Dermatitis', 'Athletes_Foot',
    'Atopic_Dermatitis_and_Keratosis', 'Bacterial_Skin_Infection',
    'Benign_Skin_Lesion', 'Bullous_Disease', 'Cutaneous_Larva_Migrans',
    'Eczema_Others', 'HSV_HPV_STD_STI', 'Leprosy', 'Lichenoid_Dermatoses',
    'Lupus_and_Connective_Tissue_Diseases', 'Malignant_Skin_Lesion',
    'Nail_Fungus', 'Psoriasis_and_Seborrheic Dermatitis',
    'Scabies_and_Infestation', 'Seborrheic_Keratoses',
    'Tinea_Fungal_Infection', 'Urticaria_Hives', 'VZV_Viral_Infection',
    'Vascular_Tumors', 'Warts'
]
```

---

### Part 3: Database Layer

#### [NEW] `backend/app/database.py`

- Creates SQLAlchemy engine pointing to `dermscan.db`
- `SessionLocal` factory for request-scoped DB access
- `get_db()` dependency for FastAPI route injection
- `create_tables()` function called once at startup

#### [NEW] `backend/app/models.py`

Two SQLAlchemy ORM classes mapping to the 2 database tables:

**`Image` model:**

| Column | Type | Notes |
|---|---|---|
| `id` | String (UUID4) | Primary key |
| `original_filename` | String | User's original filename |
| `stored_filename` | String | UUID-based filename on disk |
| `file_path` | String | Relative path inside uploads/ |
| `file_size_bytes` | Integer | File size |
| `created_at` | DateTime | Auto-set to current time |
| `predictions` | Relationship | Links to PredictionRecord rows |

**`PredictionRecord` model:**

| Column | Type | Notes |
|---|---|---|
| `id` | Integer | Auto-increment primary key |
| `image_id` | String | Foreign key → images.id |
| `class_name` | String | Disease name (e.g. "Acne_Rosacea") |
| `confidence` | Float | Probability 0.0–1.0 |
| `rank` | Integer | 1 = highest confidence |

---

### Part 4: Model Inference

#### [NEW] `backend/app/inference.py`

Three functions:

**`load_model()`** — called once at server startup:
- Loads `skinnet_v3_phase3_best.keras` using `tf.keras.models.load_model()`
- Stores model in a module-level variable
- Logs success/failure to console

**`preprocess(image_bytes) → numpy array`:**
1. Decode image bytes using Pillow (`Image.open`)
2. Convert to RGB (handles RGBA, grayscale, etc.)
3. Resize to 300×300 (bilinear interpolation)
4. Convert to numpy float32 array
5. Apply `tf.keras.applications.efficientnet.preprocess_input()`
6. Add batch dimension → shape `(1, 300, 300, 3)`

**`predict(image_bytes) → list[dict]`:**
1. Call `preprocess()` → get tensor
2. Run `model.predict(tensor)` → get 23 probabilities
3. Get top 5 indices by confidence (descending)
4. Map each index to class name from `CLASS_NAMES`
5. Return `[{ "name": "...", "confidence": 0.xx }, ...]`

---

### Part 5: API Endpoint

#### [NEW] `backend/app/routes/predict.py`

**`POST /predict`** — the main endpoint, step by step:

```
Step 1  Receive uploaded image (FastAPI UploadFile)
Step 2  Validate file type — only jpeg, png, webp allowed
Step 3  Read the full image bytes into memory
Step 4  Generate a UUID4 for this image
Step 5  Save image file to backend/uploads/{uuid}.{extension}
Step 6  Run model inference → get top 5 predictions
Step 7  Create Image record in database
Step 8  Create 5 PredictionRecord rows in database
Step 9  Commit transaction
Step 10 Return JSON response
```

---

### Part 6: FastAPI App Entry

#### [NEW] `backend/app/main.py`

- Create FastAPI app with metadata (title, description, version)
- **Lifespan handler** (runs on startup):
  - Load the TensorFlow model into memory
  - Create database tables if they don't exist
  - Create `uploads/` directory if it doesn't exist
- **CORS middleware** — allows requests from `https://localhost:8080` (Vite dev server with SSL)
- Include the predict router at `/predict`

---

### Part 7: Frontend Changes (Minimal)

#### [MODIFY] [api.ts](file:///e:/Edu/Workspace/Thesis/Website/DermScan/src/lib/api.ts)

One-line addition — add `image_id` to the response interface:

```diff
 export interface AnalysisResult {
+  image_id: string;
   predictions: Prediction[];
 }
```

> [!NOTE]
> **No other frontend files need changes.** The existing `ImageCapture.tsx`, `ImageUpload.tsx`, `Index.tsx`, and `ResultsView.tsx` all continue to work because the `predictions` array shape `{ name, confidence }` stays identical.

---

### Part 8: Git Ignores

#### [MODIFY] [.gitignore](file:///e:/Edu/Workspace/Thesis/Website/DermScan/.gitignore)

Add these entries to avoid committing large/generated files:
```
# Backend
backend/model/*.keras
backend/model/*.h5
backend/uploads/
backend/dermscan.db
__pycache__/
*.pyc
backend/venv/
```

---

## API Contract

### `POST /predict`

**Request:**
```
Content-Type: multipart/form-data
Body: file = <image file (jpeg/png/webp)>
```

**Success Response (200):**
```json
{
  "image_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "predictions": [
    { "name": "Acne_Rosacea", "confidence": 0.8234 },
    { "name": "Eczema_Others", "confidence": 0.0912 },
    { "name": "Psoriasis_and_Seborrheic Dermatitis", "confidence": 0.0401 },
    { "name": "Tinea_Fungal_Infection", "confidence": 0.0298 },
    { "name": "Allergic_Contact_Dermatitis", "confidence": 0.0155 }
  ]
}
```

**Error Responses:**
- `422` — Invalid file type or missing file
- `500` — Model inference error

---

## Build Steps (Execution Order)

| Step | Action | Details |
|---|---|---|
| 1 | Create backend folder structure | All directories + `__init__.py` files |
| 2 | Create `requirements.txt` | Python dependency list |
| 3 | Create `config.py` | Paths, class names, settings |
| 4 | Create `database.py` | SQLite engine + session factory |
| 5 | Create `models.py` | Image + PredictionRecord ORM models |
| 6 | Create `schemas.py` | Pydantic response models |
| 7 | Create `inference.py` | Model loading + preprocessing + predict |
| 8 | Create `routes/predict.py` | POST /predict endpoint |
| 9 | Create `main.py` | FastAPI app with CORS + lifespan |
| 10 | Create `run.py` | Uvicorn entry point |
| 11 | Update `api.ts` | Add `image_id` to response type |
| 12 | Update `.gitignore` | Add backend ignores |
| 13 | Create Python 3.12 venv | `python3.12 -m venv backend/venv` |
| 14 | Install dependencies | `pip install -r requirements.txt` |
| 15 | Test backend startup | `python run.py` — should start without model warning |
| 16 | **You: place .keras file** | Copy to `backend/model/` |
| 17 | Full integration test | Upload image → verify predictions + DB |

---

## Deployment Notes (For Later)

The architecture is deployment-ready. When you want to deploy, these are **config-only changes** — no code rewrites needed:

| Setting | Local (Now) | Deployed (Later) |
|---|---|---|
| `DATABASE_URL` | `sqlite:///dermscan.db` | `postgresql://user:pass@host/db` |
| `UPLOADS_DIR` | `./uploads` | `/var/uploads` or cloud storage (S3) |
| `CORS_ORIGIN` | `https://localhost:8080` | `https://dermscan.yourdomain.com` |
| Server | `uvicorn` with reload | `gunicorn` with uvicorn workers |
| Optional | — | Add `Dockerfile` for containerization |

---

## Verification Plan

| # | Test | Expected Result |
|---|---|---|
| 1 | `python run.py` | Server starts on port 8000 |
| 2 | Check console logs | "Model loaded successfully" message |
| 3 | `POST /predict` with test image | Returns JSON with 5 predictions |
| 4 | Check `backend/uploads/` | Image file saved with UUID filename |
| 5 | Check `backend/dermscan.db` | 1 row in images, 5 rows in predictions |
| 6 | Open `localhost:8080` | Frontend loads normally |
| 7 | Upload image → click Analyze | Results display with confidence bars |

---

> [!IMPORTANT]
> **Action needed from you after I build:** Copy your `skinnet_v3_phase3_best.keras` file into the `backend/model/` folder. Without it, the backend will start but return an error when you try to analyze an image.
