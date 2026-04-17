"""
Pydantic schemas for API request / response validation.
"""

from pydantic import BaseModel


class PredictionOut(BaseModel):
    """A single prediction returned by the API."""
    name: str
    confidence: float


class AnalysisResponse(BaseModel):
    """Full response for POST /predict."""
    image_id: str
    predictions: list[PredictionOut]
