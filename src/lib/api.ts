export interface Prediction {
  name: string;
  confidence: number;
}

export interface AnalysisResult {
  image_id: string;
  predictions: Prediction[];
}

// Base URL — empty string for local dev (uses Vite proxy), full URL for production
const API_BASE = import.meta.env.VITE_API_URL || "";
const API_URL = `${API_BASE}/predict`;

export async function analyzeImage(imageFile: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}
