from pathlib import Path

#Projektsstandort Lokal 
PROJECT_DIR = Path("/Users/noahrolli/vsCode/vinylrecommendations").resolve().parent.parent

#externer Datenstandort
DATA_DIR = Path("/Volumes/T7/vinylRecommendations/data")

# === DATEIEN ===
#spätere füge ich hier vielleich andere dateien hinzu

# === Ollama ===
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3"