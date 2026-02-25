from core.models import Vinyl
from core.recommender import get_recommendation
from services.collection_manager import add_vinyl, delete_vinyl, update_vinyl, list_collection
from services.feedback_manager import save_feedback


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
    if mood is None: return

    occasion = ask("Was ist der Anlass? ")
    if occasion is None: return

    duration = ask("Wie lange willst du hören? ")
    if duration is None: return

    print("\nEinen Moment, ich überlege...\n")
    empfehlung = get_recommendation(collection, mood, occasion, duration)
    print(empfehlung)

    # === Feedback nach der Empfehlung ===
    print("\n--- Feedback (q = überspringen) ---")
    feedback_choice = ask("Möchtest du Feedback geben? (ja/nein): ")
    if feedback_choice is None or feedback_choice.lower() != "ja":
        return

    # Sammlung anzeigen damit der Nutzer die ID sieht
    list_collection()

    while True:
        vinyl_id = ask("ID der gehörten Platte (oder 'fertig'): ")
        if vinyl_id is None or vinyl_id.lower() == "fertig":
            break

        rating = ask("Bewertung (gut/mittel/schlecht): ")
        if rating is None: break

        comment = ask("Kommentar (Enter für keinen): ")
        if comment is None: break

        save_feedback(
            vinyl_id=int(vinyl_id),
            mood=mood,
            occasion=occasion,
            rating=rating,
            comment=comment if comment else "",
        )
        print("✓ Feedback gespeichert!")

    print("Danke für dein Feedback!")


def handle_manage():
    """Sammlungsverwaltung mit Untermenü."""
    while True:
        print("\n--- Sammlung verwalten (q = zurück) ---")
        print("1 - Alle anzeigen")
        print("2 - Neue Platte hinzufügen")
        print("3 - Platte bearbeiten")
        print("4 - Platte löschen")

        choice = ask("Auswahl: ")
        if choice is None: return

        if choice == "1":
            list_collection()

        elif choice == "2":
            artist = ask("Artist: ")
            if artist is None: return
            album = ask("Album: ")
            if album is None: return
            genre_primary = ask("Genre (primär): ")
            if genre_primary is None: return
            genre_secondary = ask("Genre (sekundär): ")
            if genre_secondary is None: return
            mood = ask("Mood: ")
            if mood is None: return
            year = ask("Jahr: ")
            if year is None: return
            vinyl_type = ask("Typ (studio/compilation/live): ")
            if vinyl_type is None: return

            vinyl = Vinyl(
                artist=artist,
                album=album,
                genre_primary=genre_primary,
                genre_secondary=genre_secondary,
                mood=mood,
                year=int(year) if year else None,
                type=vinyl_type,
            )
            add_vinyl(vinyl)
            print(f"\n✓ {artist} – {album} hinzugefügt!")

        elif choice == "3":
            list_collection()
            vinyl_id = ask("ID der Platte: ")
            if vinyl_id is None: return
            field = ask("Welches Feld? (artist/album/genre_primary/genre_secondary/mood/year/type): ")
            if field is None: return
            value = ask("Neuer Wert: ")
            if value is None: return

            update_vinyl(int(vinyl_id), field, value)
            print("\n✓ Aktualisiert!")

        elif choice == "4":
            list_collection()
            vinyl_id = ask("ID der Platte die gelöscht werden soll: ")
            if vinyl_id is None: return

            delete_vinyl(int(vinyl_id))
            print("\n✓ Gelöscht!")


def handle_purchase():
    """Platzhalter für Kaufempfehlungen."""
    print("\n--- Kaufempfehlung ---")
    print("(kommt bald)")