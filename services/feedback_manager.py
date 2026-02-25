import sqlite3
from infra.settings import DB_FILE


def save_feedback(vinyl_id: int, mood: str, occasion: str, rating: str, comment: str):
    """Speichert Feedback zu einer Empfehlung in der Datenbank."""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    # Feedback einfügen — created_at wird automatisch gesetzt
    cursor.execute("""
        INSERT INTO feedback (vinyl_id, mood, occasion, rating, comment)
        VALUES (?, ?, ?, ?, ?)
    """, (vinyl_id, mood, occasion, rating, comment))

    connection.commit()
    connection.close()


def get_recent_feedback(limit: int = 10) -> list[dict]:
    """Holt die letzten Feedbacks mit Plattennamen für den Prompt."""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    # JOIN verbindet zwei Tabellen — hier holen wir den Plattennamen zum Feedback dazu
    # ORDER BY created_at DESC: neueste zuerst
    # LIMIT: nur die letzten X Einträge
    cursor.execute("""
        SELECT v.artist, v.album, f.mood, f.occasion, f.rating, f.comment, f.created_at
        FROM feedback f
        JOIN vinyl v ON f.vinyl_id = v.id
        ORDER BY f.created_at DESC
        LIMIT ?
    """, (limit,))

    rows = cursor.fetchall()
    connection.close()

    # Jede Zeile als Dictionary zurückgeben — lesbarer als Tuple-Indizes
    feedbacks = []
    for row in rows:
        feedbacks.append({
            "artist": row[0],
            "album": row[1],
            "mood": row[2],
            "occasion": row[3],
            "rating": row[4],
            "comment": row[5],
            "date": row[6],
        })

    return feedbacks