
class Vinyl:
    """Räpresentiert eine Schallplatte aus der Sammlug."""
    
    def __init__(
        self,
        artist: str,
        album: str,
        genre_primary: str,
        genre_secondary: str,
        mood: str,
        year: int | None,
        type: str
    ):
        self.artist = artist
        self.album = album
        self.genre_primary = genre_primary
        self.genre_secondary = genre_secondary
        self.mood = mood
        self.year = year
        self.type = type

    def __repr__(self):
        return (
            f"Vinyl(artist={self.artist!r}, album={self.album!r}), "
            f"genre_primary={self.genre_primary!r}, "
            f"genre_secondary={self.genre_secondary!r}, "
            f"mood={self.mood!r}, year={self.year!r}, type={self.type!r})"
        )

    