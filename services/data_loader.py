import csv
from infra.settings import COLLECTION_FILE
from core.models import Vinyl


def load_collection() -> list[Vinyl]:
    """Liest die CSV-Datei ein und gibt eine Liste von Vinyl-Objekten zurück."""
    collection = []

    with open(COLLECTION_FILE, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            vinyl = Vinyl(
                artist=row["artist"],
                album=row["album"],
                genre_primary=row["genre_primary"],
                genre_secondary=row["genre_secondary"],
                mood=row["mood"],
                year=float(row["year"]) if row["year"] else None,
                type=row["type"],
            )
            collection.append(vinyl)

    return collection