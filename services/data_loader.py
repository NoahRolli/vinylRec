import sqlite3
from infra.settings import DB_FILE
from core.models import Vinyl


def load_collection() -> list[Vinyl]:
    """Liest die Sammlung aus der SQLite-Datenbank."""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    cursor.execute("SELECT artist, album, genre_primary, genre_secondary, mood, year, type FROM vinyl")
    rows = cursor.fetchall()

    connection.close()

    collection = []
    for row in rows:
        vinyl = Vinyl(
            artist=row[0],
            album=row[1],
            genre_primary=row[2],
            genre_secondary=row[3],
            mood=row[4],
            year=row[5],
            type=row[6],
        )
        collection.append(vinyl)

    return collection