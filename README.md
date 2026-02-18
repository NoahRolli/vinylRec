# Vinyl Recommendations

Empfiehlt Schallplatten aus meiner Sammlung basierend auf 
Stimmung, Anlass und verfügbarer Hörzeit.

## Setup

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

## Verwendung

python main.py

## Projektstruktur

- `core/` — Datenmodelle und Empfehlungslogik
- `services/` — Datenanbindung (CSV, Ollama)
- `infra/` — Konfiguration und Einstellungen
- `tests/` — Tests