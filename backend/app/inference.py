"""
Model loading, image preprocessing, and inference.
"""

import logging
from io import BytesIO

import numpy as np
from PIL import Image

from .config import CLASS_NAMES, IMG_SIZE, MODEL_PATH, TOP_K

logger = logging.getLogger(__name__)

# Module-level variable — loaded once at startup
_model = None


def load_model() -> None:
    """Load the Keras model from disk into memory.

    Called once during FastAPI lifespan startup.
    """
    global _model

    if not MODEL_PATH.exists():
        logger.warning(
            "Model file not found at %s — predictions will fail until "
            "you place the .keras file there.",
            MODEL_PATH,
        )
        return

    # Import TensorFlow only when needed (heavy import)
    import tensorflow as tf

    logger.info("Loading model from %s …", MODEL_PATH)
    _model = tf.keras.models.load_model(str(MODEL_PATH))
    logger.info("Model loaded successfully ✓")


def preprocess(image_bytes: bytes) -> np.ndarray:
    """Decode raw image bytes and prepare tensor for EfficientNetB3.

    Returns:
        numpy array of shape (1, 300, 300, 3), preprocessed.
    """
    import tensorflow as tf

    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE), Image.BILINEAR)
    arr = np.array(img, dtype=np.float32)
    arr = tf.keras.applications.efficientnet.preprocess_input(arr)
    return np.expand_dims(arr, axis=0)  # (1, 300, 300, 3)


def predict(image_bytes: bytes) -> list[dict]:
    """Run inference and return the top-K predictions.

    Returns:
        List of dicts sorted by confidence (descending):
        [{"name": "Acne_Rosacea", "confidence": 0.82}, ...]

    Raises:
        RuntimeError: If the model has not been loaded.
    """
    if _model is None:
        raise RuntimeError(
            "Model is not loaded. Ensure the .keras file exists in backend/model/."
        )

    tensor = preprocess(image_bytes)
    probabilities = _model.predict(tensor, verbose=0)[0]  # shape (23,)

    # Get top-K indices sorted by probability (descending)
    top_indices = np.argsort(probabilities)[::-1][:TOP_K]

    return [
        {
            "name": CLASS_NAMES[idx],
            "confidence": round(float(probabilities[idx]), 6),
        }
        for idx in top_indices
    ]
