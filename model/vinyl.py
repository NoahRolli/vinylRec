
class Vinyl:
    """Räpresentiert eine Schallplatte aus der Sammlug."""
    
    def __init__(
        self,
        artist: str
        album: str
        genre_primary: str
        genre_secondary: str
        mood: str
        year: int | None
        type: str
    ):
        self.artist = artist
    