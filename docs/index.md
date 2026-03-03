# Vinyl Recommendations

Empfiehlt Schallplatten aus einer persönlichen Sammlung basierend auf 
Stimmung, Anlass und verfügbarer Hörzeit.

## Was kann das System?

- **Schallplattenempfehlung** — Beschreibe deine Stimmung und den Anlass, 
  Ollama (Llama 3) empfiehlt passende Platten aus deiner Sammlung
- **Stimmungscheck** — Bei negativer Stimmung werden zwei Optionen angeboten: 
  Stimmung spiegeln oder heben
- **Feedback-System** — Bewerte Empfehlungen, das System lernt für die Zukunft
- **Sammlungsverwaltung** — Platten hinzufügen, bearbeiten, löschen
- **Kaufempfehlungen** — LLM analysiert Lücken, Discogs-Suche für konkrete Platten
- **REST API** — FastAPI-Endpunkte für das Web-Frontend

## Tech Stack

| Komponente | Technologie |
|------------|-------------|
| Backend | Python 3.13 |
| Datenbank | SQLite |
| LLM | Ollama / Llama 3 (8B, lokal) |
| API | FastAPI + Uvicorn |
| Frontend | HTML / CSS / JS (in Entwicklung) |