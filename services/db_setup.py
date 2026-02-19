import csv
import sqlite3
from infra.settings import COLLECTION_FILE, DB_FILE


def create_database():
    """Erstellt die SQLite-Datenbank aus der CSV-Datei."""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    # Tabelle erstellen
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vinyl (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artist TEXT NOT NULL,
            album TEXT NOT NULL,
            genre_primary TEXT,
            genre_secondary TEXT,
            mood TEXT,
            year INTEGER,
            type TEXT
        )
    """)

    # CSV einlesen und einfügen
    with open(COLLECTION_FILE, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            cursor.execute("""
                INSERT INTO vinyl (artist, album, genre_primary, genre_secondary, mood, year, type)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                row["artist"],
                row["album"],
                row["genre_primary"],
                row["genre_secondary"],
                row["mood"],
                int(float(row["year"])) if row["year"] else None,
                row["type"],
            ))

    connection.commit()
    connection.close()
    print(f"Datenbank erstellt: {DB_FILE}")


if __name__ == "__main__":
    create_database()