# csv: Python-Standardbibliothek zum Lesen von CSV-Dateien
import csv
# sqlite3: Python-Standardbibliothek für SQLite-Datenbanken
import sqlite3
# Importiert die Pfade aus unserer Konfiguration
from infra.settings import COLLECTION_FILE, DB_FILE


def create_database():
    """Erstellt die SQLite-Datenbank aus der CSV-Datei."""

    # Verbindung zur Datenbank herstellen (erstellt die Datei falls sie nicht existiert)
    connection = sqlite3.connect(DB_FILE)
    # Cursor ist wie ein Zeiger — damit führen wir SQL-Befehle aus
    cursor = connection.cursor()

    # === Vinyl-Tabelle erstellen ===
    # IF NOT EXISTS: Tabelle nur erstellen wenn sie noch nicht da ist
    # INTEGER PRIMARY KEY AUTOINCREMENT: Jede Platte bekommt eine eindeutige, automatische ID
    # TEXT NOT NULL: Pflichtfeld — artist und album müssen immer ausgefüllt sein
    # TEXT ohne NOT NULL: Optionale Felder — dürfen leer sein
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

    # === Feedback-Tabelle erstellen ===
    # Speichert Nutzerfeedback zu Empfehlungen
    # FOREIGN KEY: vinyl_id muss auf eine existierende Platte in der vinyl-Tabelle zeigen
    # DEFAULT CURRENT_TIMESTAMP: Datum/Uhrzeit wird automatisch gesetzt
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vinyl_id INTEGER NOT NULL,
            mood TEXT,
            occasion TEXT,
            rating TEXT,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (vinyl_id) REFERENCES vinyl(id)
        )
    """)

    # === CSV-Daten einlesen und in die Datenbank einfügen ===
    # open() mit "with" sorgt dafür, dass die Datei automatisch geschlossen wird
    # newline="" verhindert doppelte Zeilenumbrüche auf Windows
    # encoding="utf-8" stellt sicher, dass Sonderzeichen (é, ü, etc.) richtig gelesen werden
    with open(COLLECTION_FILE, newline="", encoding="utf-8") as file:
        # DictReader liest jede Zeile als Dictionary — Spaltenüberschriften werden zu Keys
        reader = csv.DictReader(file)

        for row in reader:
            # ? sind Platzhalter — SQLite setzt die Werte sicher ein (verhindert SQL-Injection)
            # Die Werte werden als Tuple übergeben (daher die Klammern)
            cursor.execute("""
                INSERT INTO vinyl (artist, album, genre_primary, genre_secondary, mood, year, type)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                row["artist"],
                row["album"],
                row["genre_primary"],
                row["genre_secondary"],
                row["mood"],
                # int(float(...)) weil CSV das Jahr als "1970.0" speichert
                # Erst zu float, dann zu int → ergibt 1970
                # "if row["year"] else None" fängt leere Felder ab
                int(float(row["year"])) if row["year"] else None,
                row["type"],
            ))

    # commit() speichert alle Änderungen — ohne commit geht nichts in die Datenbank
    connection.commit()
    # Verbindung schliessen — gute Praxis, gibt Ressourcen frei
    connection.close()
    print(f"Datenbank erstellt: {DB_FILE}")


# Dieses Skript nur ausführen wenn es direkt gestartet wird (nicht beim Import)
if __name__ == "__main__":
    create_database()