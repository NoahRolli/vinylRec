# API Referenz

Die API läuft mit FastAPI unter `http://localhost:8000`.
Interaktive Dokumentation: `http://localhost:8000/docs`

## Endpunkte

### Sammlung

#### GET /api/collection
Gibt die gesamte Schallplattensammlung zurück.

**Response:**
```json
[
  {
    "artist": "Shirley Bassey",
    "album": "Something Else",
    "genre_primary": "Jazz",
    "genre_secondary": "Vocal",
    "mood": "Elegant",
    "year": 1970,
    "type": "studio"
  }
]
```

#### POST /api/collection
Fügt eine neue Schallplatte hinzu.

**Parameter:** artist, album, genre_primary, genre_secondary, mood, year, type

#### DELETE /api/collection/{id}
Löscht eine Schallplatte nach ID.

### Empfehlung

#### POST /api/recommend
Generiert eine Empfehlung basierend auf Stimmung und Anlass.

**Parameter:** mood, occasion, duration

**Response:**
```json
{
  "recommendation": "Für einen entspannten Abend empfehle ich..."
}
```

### Feedback

#### POST /api/feedback
Speichert Feedback zu einer Empfehlung.

**Parameter:** vinyl_id, mood, occasion, rating, comment

#### GET /api/feedback
Gibt die letzten Feedbacks zurück.