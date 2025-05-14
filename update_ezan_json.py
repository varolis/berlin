import requests
from datetime import datetime

URL = "https://ezanvakti.emushaf.net/vakitler/11002"
FILENAME = "ezan.json"

def download_ezan_data():
    try:
        response = requests.get(URL)
        response.raise_for_status()
        with open(FILENAME, "w", encoding="utf-8") as f:
            f.write(response.text)
        print(f"{datetime.now()}: Datei '{FILENAME}' erfolgreich aktualisiert.")
    except Exception as e:
        print(f"Fehler beim Laden oder Speichern: {e}")

if __name__ == "__main__":
    download_ezan_data()
