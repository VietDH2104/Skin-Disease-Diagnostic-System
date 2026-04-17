# DermScan — AI Skin Disease Classification

AI-powered skin disease classification web application. Upload or capture a photo for instant skin condition analysis with confidence scores.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Query, React Router
- **Theming**: next-themes (light/dark mode)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui primitives
│   ├── ImageCapture   # Camera capture
│   ├── ImageUpload    # File upload
│   ├── ResultsView    # Prediction display
│   └── ThemeToggle    # Dark/light toggle
├── lib/              # API client & utilities
├── pages/            # Route pages
└── test/             # Test setup & specs
```

## API Configuration

Set the `VITE_API_URL` environment variable to point to your prediction backend:

```env
VITE_API_URL=http://localhost:8000/predict
```

The API expects a `POST` with `multipart/form-data` containing a `file` field and returns:

```json
{
  "predictions": [
    { "name": "Condition Name", "confidence": 0.95 }
  ]
}
```

## Disclaimer

This tool is for **educational purposes only** and is not a substitute for professional medical advice.
