from services.data_loader import load_collection
from core.recommender import get_recommendation


def main():
    collection = load_collection()
    print(f"Sammlung geladen: {len(collection)} Platten\n")

    # Nutzereingabe
    mood = input("Wie ist deine Stimmung? ")
    occasion = input("Was ist der Anlass? ")
    duration = str(input("Wie lange willst du hören? "))

    print("\nEinen Moment, ich überlege...\n")

    empfehlung = get_recommendation(collection, mood, occasion, duration)
    print(empfehlung)


if __name__ == "__main__":
    main()