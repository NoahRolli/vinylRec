from services.data_loader import load_collection
from services.cli import show_menu, handle_recommendation, handle_manage, handle_purchase


def main():
    collection = load_collection()
    print(f"Sammlung geladen: {len(collection)} Platten")

    while True:
        choice = show_menu()

        if choice == "1":
            handle_recommendation(collection)
        elif choice == "2":
            handle_manage()
            collection = load_collection()
        elif choice == "3":
            handle_purchase()
        elif choice == "0":
            print("Bis bald!")
            break
        else:
            print("Ungültige Eingabe, versuch's nochmal.")


if __name__ == "__main__":
    main()