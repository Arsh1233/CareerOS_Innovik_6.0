import os
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))

# Standard dimension size for Google Gemini embeddings
VECTOR_SIZE = 768

def init_collections():
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
    
    collections = [
        "student_profiles", # For resumes, skills, career twins
        "job_listings"      # For job descriptions and requirements
    ]
    
    for collection_name in collections:
        try:
            if not client.collection_exists(collection_name):
                logger.info(f"Creating collection: {collection_name}")
                client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
                )
                logger.info(f"Successfully created {collection_name}.")
            else:
                logger.info(f"Collection {collection_name} already exists. Skipping.")
        except Exception as e:
            logger.error(f"Failed to create collection {collection_name}: {e}")

if __name__ == "__main__":
    logger.info(f"Connecting to Qdrant at {QDRANT_HOST}:{QDRANT_PORT}...")
    init_collections()
    logger.info("Qdrant initialization complete.")
