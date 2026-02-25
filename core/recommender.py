from core.models import Vinyl
from services.llm import ask_llm
from services.feedback_manager import get_recent_feedback


def build_prompt(collection: list[Vinyl], mood: str, occasion: str, duration: str) -> str:
    """Baut den Prompt für Ollama aus Sammlung, Wünschen und Feedback."""

    # Sammlung als lesbaren Text formatieren
    vinyl_list = ""
    for v in collection:
        vinyl_list += f"- {v.artist} – {v.album} | Genre: {v.genre_primary}/{v.genre_secondary} | Mood: {v.mood} | Jahr: {v.year} | Typ: {v.type}\n"

    # Bisheriges Feedback laden und formatieren
    feedbacks = get_recent_feedback()
    feedback_text = ""
    if feedbacks:
        feedback_text = "\nBisheriges Feedback des Nutzers:\n"
        for fb in feedbacks:
            feedback_text += f"- {fb['artist']} – {fb['album']} bei Stimmung '{fb['mood']}' / Anlass '{fb['occasion']}': Bewertung {fb['rating']}"
            if fb["comment"]:
                feedback_text += f" — Kommentar: {fb['comment']}"
            feedback_text += "\n"

    prompt = f"""Du bist ein Musikexperte und Schallplattenberater. 
Der Nutzer hat folgende Schallplattensammlung:

{vinyl_list}
{feedback_text}
Der Nutzer möchte Musik hören mit folgenden Angaben:
- Stimmung: {mood}
- Anlass: {occasion}
- Verfügbare Zeit: {duration}

Empfehle passende Schallplatten NUR aus der obigen Sammlung.
Berücksichtige das bisherige Feedback bei deiner Auswahl.
Erkläre kurz, warum jede Platte zur Stimmung und zum Anlass passt.
Schlage eine Reihenfolge vor, die einen schönen Hörfluss ergibt.
Antworte auf Deutsch."""

    return prompt


def get_recommendation(collection: list[Vinyl], mood: str, occasion: str, duration: str) -> str:
    """Holt eine Empfehlung vom LLM basierend auf Sammlung und Wünschen."""
    prompt = build_prompt(collection, mood, occasion, duration)
    return ask_llm(prompt)