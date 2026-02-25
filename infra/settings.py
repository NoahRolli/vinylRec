from pathlib import Path
from dotenv import load_dotenv
import os

# .env Datei laden
load_dotenv()

# === Basispfade ===
PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.getenv("DATA_DIR", "/Volumes/T7_ML/vinylRecommendations/data"))

# === Dateien ===
COLLECTION_FILE = DATA_DIR / "vinyl_collection.csv"
DB_FILE = DATA_DIR / "vinyl_collection.db"

# === Ollama ===
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

# === Discogs (kommt später) ===
DISCOGS_API_TOKEN = os.getenv("DISCOGS_API_TOKEN", "")