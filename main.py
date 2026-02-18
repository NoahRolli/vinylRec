from services.data_loader import load_collection


def main():
    collection = load_collection()

    print(f"Sammlung geladen: {len(collection)} Platten\n")

    for vinyl in collection[:4]:
        print(f"  {vinyl.artist} – {vinyl.album} ({vinyl.year})")


if __name__ == "__main__":
    main()