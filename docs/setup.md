# Setup Guide

## Voraussetzungen

- Python 3.11+
- [Ollama](https://ollama.com) installiert
- Externe SSD (T7_ML) für Daten und Modell

## Installation
```bash
# Repository klonen
git clone https://github.com/NoahRolli/vinylRec.git
cd vinylrecommendations

# Virtuelle Umgebung
python3 -m venv .venv
source .venv/bin/activate

# Abhängigkeiten
pip install -r requirements.txt

# Umgebungsvariablen
cp .env.example .env
# .env editieren und Pfade/Tokens eintragen

# Datenbank erstellen
python -m services.db_setup
```

## Ollama einrichten
```bash
# Modell auf externe SSD speichern
export OLLAMA_MODELS="/Volumes/T7_ML/ollama_models"
echo 'export OLLAMA_MODELS="/Volumes/T7_ML/ollama_models"' >> ~/.zshrc

# Modell herunterladen
ollama pull llama3
```

## Starten
```bash
# Option 1: CLI
python cli.py

# Option 2: API
uvicorn main:app --reload
# Docs: http://localhost:8000/docs
```

## Symlink für Daten
```bash
ln -s /Volumes/T7_ML/vinylRecommendations/data data
```

## Häufige Probleme

| Problem | Lösung |
|---------|--------|
| `ModuleNotFoundError: infra` | Nicht direkt ausführen, immer `python -m` oder über `main.py`/`cli.py` |
| `No module named 'requests'` | `pip install -r requirements.txt` |
| `FileNotFoundError` | SSD angeschlossen? Pfad in `.env` prüfen |
| `Connection refused` Ollama | `ollama serve` in separatem Terminal |
| Duplikate in DB | `rm data/vinyl_collection.db` dann `python -m services.db_setup` |