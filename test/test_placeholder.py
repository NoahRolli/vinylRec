# Platzhalter-Test damit pytest nicht mit Exit-Code 5 abbricht
# Exit-Code 5 bedeutet "keine Tests gefunden" — das zählt als Fehler
# Wird ersetzt sobald wir richtige Tests schreiben

def test_placeholder():
    """Einfacher Test der immer besteht."""
    assert True
    