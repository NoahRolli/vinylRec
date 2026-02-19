from services.data_loader import load_collection
from core.recommender import get_recommendation

def ask(question: str) -> str | None:
    """Fragt den Nutzer. Gibt None zurück wenn er abbrechen will."""
    answer = input(question)
    if answer.strip().lower() in ("q", "quit", "zurück", "back"):
        print("\n↩ Zurück zum Hauptmenü")
        return None
    return answer

def show_menu():
    """Zeigt das Hauptmenü an und gibt die Auswahl zurück."""
    print("\n===== Vinyl Recommendations =====")
    print("1 - Schallplattenempfehlung")
    print("2 - Sammlung verwalten")
    print("3 - Kaufempfehlung")
    print("0 - Beenden")
    print("==================================")

    return input("\nWas möchtest du tun? ")


def handle_recommendation(collection):
    """Holt Nutzerwünsche und gibt eine Empfehlung."""
    print("\n--- Schallplattenempfehlung (q = zurück) ---")

    mood = ask("Wie ist deine Stimmung? ")
    if mood is None:
        return

    occasion = ask("Was ist der Anlass? ")
    if occasion is None:
        return

    duration = ask("Wie lange willst du hören? ")
    if duration is None:
        return

    print("\nEinen Moment, ich überlege...\n")
    empfehlung = get_recommendation(collection, mood, occasion, duration)
    print(empfehlung)


def handle_manage():
    """Platzhalter für Sammlungsverwaltung."""
    print("\n--- Sammlung verwalten ---")
    print("(in progress)")


def handle_purchase():
    """Platzhalter für Kaufempfehlungen."""
    print("\n--- Kaufempfehlung ---")
    print("(in progress)")

def main():
    collection = load_collection()
    print(f"Sammlung geladen: {len(collection)} Platten")

    while True:
        choice = show_menu()

        if choice == "1":
            handle_recommendation(collection)
        elif choice == "2":
            handle_manage()
        elif choice == "3":
            handle_purchase()
        elif choice == "0":
            print("Aurevoir!")
            break
        else:
            print("Ungültige Eingabe, try again.")


if __name__ == "__main__":
    main()