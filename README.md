# DermScan — AI Skin Disease Diagnostic System

DermScan is an AI-powered web application designed to help classify skin conditions. Users can upload a photo of a skin lesion or capture one using their device's camera for instant analysis with confidence scores. The system uses a trained EfficientNetB3 deep learning model to process and identify various skin diseases.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Backend**: FastAPI (Python), SQLite.
- **Machine Learning**: TensorFlow/Keras (EfficientNetB3).

## 🛠️ Getting Started

### 1. Backend Setup

Navigate to the `backend` directory, set up your Python environment, and start the API server:

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastApi server
python run.py
```
The backend API usually runs on `http://localhost:8000`. It provides the prediction endpoints and handles SQLite database operations. Make sure your trained model file (`.keras` or `.h5`) is placed in the designated `backend/model/` folder.

### 2. Frontend Setup

Open a **new** terminal session, navigate to the project root directory, and start the React application:

```bash
# In the project root directory
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:8080` (or another port based on your Vite setup).

## 📁 Project Structure

```text
DermScan/
├── backend/          # FastAPI server, SQLite DB, and ML inference logic
│   ├── app/          # API routes, models, config, and schemas
│   ├── model/        # Directory for the trained EfficientNetB3 model
│   ├── uploads/      # Temporary storage for uploaded images
│   └── run.py        # Entry point for the FastAPI application
├── src/              # React frontend source code
│   ├── components/   # Reusable UI elements (ImageCapture, ImageUpload, ResultsView, etc.)
│   ├── lib/          # API utilities and helpers
│   ├── pages/        # Application views 
│   └── index.css     # Global styles and Tailwind configuration
└── package.json      # Frontend dependencies and scripts
```

## 🔌 Environment Configuration

The frontend relies on the backend to provide predictions. The default URL for the prediction endpoint is mapped to the backend server. If you need to change this, you can configure the `VITE_API_URL` environment variable:

```env
VITE_API_URL=http://localhost:8000/predict
```

## ⚠️ Disclaimer

This tool is strictly for **educational purposes only** and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider regarding any suspected skin conditions.
