import requests
from infra.settings import OLLAMA_BASE_URL, OLLAMA_MODEL


def ask_llm(prompt: str) -> str:
    """Sendet Prompt an Ollama und gibt Antwort zurück."""
    url = f"{OLLAMA_BASE_URL}/api/generate"

    # Dictionary, das als JSON an Ollama geschickt wird
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,       # Frage/Anweisung
        "stream": False,        # ganze Antwort auf einmal
    }

    response = requests.post(url, json=payload)
    # prüft, ob Request erfolgreich war - Fehler falls nicht gefunden
    response.raise_for_status()

    # Ollama gibt JSON zurück.
    # Eigentliche Antwort steckt in "response"
    return response.json()["response"]