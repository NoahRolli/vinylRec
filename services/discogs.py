import requests
from infra.settings import DISCOGS_API_TOKEN


# Discogs API Basis-URL
BASE_URL = "https://api.discogs.com"

# Headers die bei jedem Request mitgeschickt werden
# User-Agent ist Pflicht bei Discogs, sonst wird der Request abgelehnt
HEADERS = {
    "Authorization": f"Discogs token={DISCOGS_API_TOKEN}",
    "User-Agent": "VinylRecommendations/1.0",
}


def search_records(query: str, genre: str = "", style: str = "", year: str = "") -> list[dict]:
    """Sucht auf Discogs nach Schallplatten.
    
    Args:
        query: Suchbegriff (Artist, Album, etc.)
        genre: Genre-Filter (z.B. "Jazz", "Rock")
        style: Stil-Filter (z.B. "Bossa Nova", "Hard Rock")
        year: Jahr oder Jahrzehnt (z.B. "1970")
    
    Returns:
        Liste von Ergebnissen als Dictionaries
    """
    # Parameter für die Suche zusammenbauen
    # type=release: nur Veröffentlichungen, keine Artists oder Labels
    # format=Vinyl: nur Schallplatten, keine CDs
    params = {
        "q": query,
        "type": "release",
        "format": "Vinyl",
        "per_page": 10,
    }

    # Optionale Filter nur hinzufügen wenn sie gesetzt sind
    if genre:
        params["genre"] = genre
    if style:
        params["style"] = style
    if year:
        params["year"] = year

    # GET-Request an die Discogs Search API
    response = requests.get(
        f"{BASE_URL}/database/search",
        headers=HEADERS,
        params=params,
    )
    response.raise_for_status()

    # Ergebnisse auslesen und relevante Felder extrahieren
    results = response.json().get("results", [])

    records = []
    for r in results:
        records.append({
            "title": r.get("title", ""),
            "year": r.get("year", ""),
            "genre": ", ".join(r.get("genre", [])),
            "style": ", ".join(r.get("style", [])),
            "country": r.get("country", ""),
            "label": ", ".join(r.get("label", [])),
            "url": r.get("uri", ""),
        })

    return records