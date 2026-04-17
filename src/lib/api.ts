export interface Prediction {
  name: string;
  confidence: number;
}

export interface AnalysisResult {
  image_id: string;
  predictions: Prediction[];
}

// Relative URL — works on localhost and network devices via Vite proxy
const API_URL = import.meta.env.VITE_API_URL || "/predict";

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
