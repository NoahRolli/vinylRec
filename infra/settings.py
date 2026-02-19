from pathlib import Path

#Projektsstandort Lokal 
PROJECT_DIR = Path("/Users/noahrolli/vsCode/vinylrecommendations").resolve().parent.parent

#externer Datenstandort
DATA_DIR = Path("/Volumes/T7_ML/vinylRecommendations/data")

# === DATEIEN ===
COLLECTION_FILE = DATA_DIR / "vinyl_collection.csv"
DB_FILE = DATA_DIR / "vinyl_collection.db"

# === Ollama ===
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3"