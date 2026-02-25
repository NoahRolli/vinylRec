from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.data_loader import load_collection
from core.recommender import get_recommendation
from services.collection_manager import add_vinyl, delete_vinyl, update_vinyl
from services.feedback_manager import save_feedback, get_recent_feedback
from core.models import Vinyl

# FastAPI-Instanz erstellen
app = FastAPI(title="Vinyl Recommendations API")

# CORS — erlaubt dem Frontend (HTML-Datei) auf die API zuzugreifen
# Ohne das blockt der Browser die Requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Später einschränken auf deine Domain
    allow_methods=["*"],
    allow_headers=["*"],
)


# === Sammlung ===

@app.get("/api/collection")
def get_collection():
    """Gibt die gesamte Sammlung zurück."""
    collection = load_collection()
    return [
        {
            "artist": v.artist,
            "album": v.album,
            "genre_primary": v.genre_primary,
            "genre_secondary": v.genre_secondary,
            "mood": v.mood,
            "year": v.year,
            "type": v.type,
        }
        for v in collection
    ]


@app.post("/api/collection")
def add_record(artist: str, album: str, genre_primary: str = "",
               genre_secondary: str = "", mood: str = "",
               year: int = None, type: str = "studio"):
    """Fügt eine neue Platte hinzu."""
    vinyl = Vinyl(
        artist=artist,
        album=album,
        genre_primary=genre_primary,
        genre_secondary=genre_secondary,
        mood=mood,
        year=year,
        type=type,
    )
    add_vinyl(vinyl)
    return {"message": f"{artist} – {album} hinzugefügt"}


@app.delete("/api/collection/{vinyl_id}")
def remove_record(vinyl_id: int):
    """Löscht eine Platte nach ID."""
    delete_vinyl(vinyl_id)
    return {"message": f"Platte {vinyl_id} gelöscht"}


# === Empfehlung ===

@app.post("/api/recommend")
def recommend(mood: str, occasion: str, duration: str):
    """Gibt eine Schallplattenempfehlung basierend auf Stimmung/Anlass/Dauer."""
    collection = load_collection()
    empfehlung = get_recommendation(collection, mood, occasion, duration)
    return {"recommendation": empfehlung}


# === Feedback ===

@app.post("/api/feedback")
def add_feedback(vinyl_id: int, mood: str, occasion: str,
                 rating: str, comment: str = ""):
    """Speichert Feedback zu einer Empfehlung."""
    save_feedback(vinyl_id, mood, occasion, rating, comment)
    return {"message": "Feedback gespeichert"}


@app.get("/api/feedback")
def get_feedback():
    """Gibt die letzten Feedbacks zurück."""
    return get_recent_feedback()