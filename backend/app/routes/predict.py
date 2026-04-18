"""
POST /predict — upload an image, run inference, save results.
"""

import uuid
import logging
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from ..config import UPLOADS_DIR
from ..database import get_db
from ..inference import predict
from ..models import Image, PredictionRecord
from ..schemas import AnalysisResponse, PredictionOut

logger = logging.getLogger(__name__)

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}


@router.post("/predict", response_model=AnalysisResponse)
async def predict_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Accept an uploaded skin image, run model inference, and persist results."""

    # ── Step 1: Validate file type ──────────────────────────────────────────
    content_type = file.content_type or ""
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid file type '{content_type}'. Allowed: JPEG, PNG, WEBP.",
        )

    ext = ALLOWED_CONTENT_TYPES[content_type]

    # ── Step 2: Read image bytes ────────────────────────────────────────────
    image_bytes = await file.read(MAX_FILE_SIZE + 1)
    if not image_bytes:
        raise HTTPException(status_code=422, detail="Uploaded file is empty.")
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large. Maximum allowed size is 10 MB.",
        )

    # ── Step 3: Generate UUID & save image to disk ──────────────────────────
    image_id = str(uuid.uuid4())
    stored_filename = f"{image_id}.{ext}"
    file_path = UPLOADS_DIR / stored_filename

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    file_path.write_bytes(image_bytes)
    logger.info("Image saved: %s (%d bytes)", stored_filename, len(image_bytes))

    # ── Step 4: Run model inference ─────────────────────────────────────────
    try:
        raw_predictions = predict(image_bytes)
    except RuntimeError as exc:
        # Clean up saved file if inference fails due to missing model
        file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        file_path.unlink(missing_ok=True)
        logger.exception("Inference error")
        raise HTTPException(
            status_code=500,
            detail=f"Model inference failed: {exc}",
        )

    # ── Step 5: Save image record to DB ─────────────────────────────────────
    db_image = Image(
        id=image_id,
        original_filename=file.filename or "unknown",
        stored_filename=stored_filename,
        file_path=str(file_path.relative_to(UPLOADS_DIR.parent)),
        file_size_bytes=len(image_bytes),
    )
    db.add(db_image)

    # ── Step 6: Save prediction records to DB ───────────────────────────────
    for rank, pred in enumerate(raw_predictions, start=1):
        db.add(
            PredictionRecord(
                image_id=image_id,
                class_name=pred["name"],
                confidence=pred["confidence"],
                rank=rank,
            )
        )

    db.commit()
    logger.info("DB records created for image %s", image_id)

    # ── Step 7: Return response ─────────────────────────────────────────────
    return AnalysisResponse(
        image_id=image_id,
        predictions=[
            PredictionOut(name=p["name"], confidence=p["confidence"])
            for p in raw_predictions
        ],
    )
