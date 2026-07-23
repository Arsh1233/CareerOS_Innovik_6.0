import uuid
from datetime import datetime
from sqlalchemy.orm import declarative_base, declared_attr
from sqlalchemy import Column, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class UUIDMixin:
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    deleted_at = Column(DateTime, nullable=True)

class BaseModel(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __abstract__ = True
    
    @declared_attr
    def __tablename__(cls):
        # Default table name generation based on class name
        return cls.__name__.lower() + 's'
