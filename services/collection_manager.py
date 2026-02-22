import sqlite3
from infra.settings import DB_FILE
from core.models import Vinyl


def add_vinyl(vinyl: Vinyl):
    """Fügt eine neue Schallplatte zur Datenbank hinzu."""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO vinyl (artist, album, genre_primary, genre_secondary, mood, year, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        vinyl.artist,
        vinyl.album,
        vinyl.genre_primary,
        vinyl.genre_secondary,
        vinyl.mood,
        vinyl.year,
        vinyl.type,
    ))

    connection.commit()
    connection.close()


def delete_vinyl(vinyl_id: int):
    """Löscht eine Schallplatte anhand ihrer ID."""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    cursor.execute("DELETE FROM vinyl WHERE id = ?", (vinyl_id,))

    connection.commit()
    connection.close()


def update_vinyl(vinyl_id: int, field: str, value: str):
    """Aktualisiert ein einzelnes Feld einer Schallplatte."""
    allowed_fields = {"artist", "album", "genre_primary", "genre_secondary", "mood", "year", "type"}

    if field not in allowed_fields:
        print(f"Ungültiges Feld: {field}")
        return

    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    cursor.execute(f"UPDATE vinyl SET {field} = ? WHERE id = ?", (value, vinyl_id))

    connection.commit()
    connection.close()


def list_collection():
    """Zeigt alle Schallplatten mit ID an."""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    cursor.execute("SELECT id, artist, album, genre_primary, mood, year FROM vinyl ORDER BY artist")
    rows = cursor.fetchall()

    connection.close()

    for row in rows:
        year = int(row[5]) if row[5] else "?"
        print(f"  [{row[0]:3d}] {row[1]} – {row[2]} | {row[3]} | {row[4]} | {year}")