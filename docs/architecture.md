# Architektur

## Schichtenmodell

Das Projekt folgt einer strikten Separation of Concerns:

| Schicht | Aufgabe | Beispiel |
|---------|---------|----------|
| `core/` | Was das Programm **ist** | Vinyl-Modell, Empfehlungslogik |
| `services/` | Was das Programm **benutzt** | DB, Ollama, Discogs, CLI |
| `infra/` | Was das Programm **konfiguriert** | Pfade, Modellwahl, Tokens |
| `main.py` | Was das Programm **startet** | FastAPI Server |
| `cli.py` | Alternative Oberfläche | Terminal-Menü |

## Abhängigkeiten
```mermaid
graph TD
    CLI[cli.py<br/>CLI Interface] --> CORE
    API[main.py<br/>FastAPI Server] --> CORE
    
    subgraph CORE[core/]
        MODELS[models.py<br/>Vinyl-Klasse]
        REC[recommender.py<br/>Prompt + Empfehlung]
    end
    
    subgraph SERVICES[services/]
        LLM[llm.py<br/>Ollama HTTP]
        DL[data_loader.py<br/>DB lesen]
        CM[collection_manager.py<br/>CRUD]
        FM[feedback_manager.py<br/>Feedback]
        DC[discogs.py<br/>Discogs API]
    end
    
    subgraph INFRA[infra/]
        SETTINGS[settings.py<br/>Config + Pfade]
    end
    
    REC --> LLM
    REC --> FM
    DL --> MODELS
    CM --> MODELS
    
    LLM --> OLLAMA[(Ollama<br/>Llama 3)]
    DC --> DISCOGS[(Discogs API)]
    DL --> DB[(SQLite)]
    CM --> DB
    FM --> DB
```

## Datenbankstruktur

### Tabelle: vinyl

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | INTEGER PK | Eindeutige ID (auto) |
| artist | TEXT NOT NULL | Künstlername |
| album | TEXT NOT NULL | Albumtitel |
| genre_primary | TEXT | Hauptgenre |
| genre_secondary | TEXT | Nebengenre |
| mood | TEXT | Stimmung |
| year | INTEGER | Erscheinungsjahr |
| type | TEXT | studio / compilation / live |

### Tabelle: feedback

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | INTEGER PK | Eindeutige ID (auto) |
| vinyl_id | INTEGER FK | Referenz auf vinyl.id |
| mood | TEXT | Stimmung bei Empfehlung |
| occasion | TEXT | Anlass bei Empfehlung |
| rating | TEXT | gut / mittel / schlecht |
| comment | TEXT | Freitext-Kommentar |
| created_at | TIMESTAMP | Automatisch gesetzt |