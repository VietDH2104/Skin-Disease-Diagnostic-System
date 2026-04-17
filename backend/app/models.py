"""
SQLAlchemy ORM models — images and predictions tables.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Image(Base):
    """An uploaded skin image."""

    __tablename__ = "images"

    id = Column(String, primary_key=True)                        # UUID4
    original_filename = Column(String, nullable=False)           # user's filename
    stored_filename = Column(String, nullable=False)             # uuid.ext on disk
    file_path = Column(String, nullable=False)                   # relative path
    file_size_bytes = Column(Integer, nullable=False)
    created_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Relationship: one image → many predictions
    predictions = relationship(
        "PredictionRecord",
        back_populates="image",
        cascade="all, delete-orphan",
    )


class PredictionRecord(Base):
    """A single class prediction for an image (top-K are stored)."""

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    image_id = Column(String, ForeignKey("images.id"), nullable=False)
    class_name = Column(String, nullable=False)                  # disease name
    confidence = Column(Float, nullable=False)                   # 0.0–1.0
    rank = Column(Integer, nullable=False)                       # 1 = top

    image = relationship("Image", back_populates="predictions")
