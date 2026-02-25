import threading
import time
import sys


class Spinner:
    """Zeigt eine Ladeanimation während Ollama arbeitet."""

    def __init__(self, message="Einen Moment, ich überlege"):
        self.message = message
        self.running = False
        self.thread = None

    def _spin(self):
        """Interne Methode — läuft in eigenem Thread."""
        # Animationszeichen die sich abwechseln
        chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        i = 0
        while self.running:
            # \r springt an den Zeilenanfang — überschreibt die vorherige Ausgabe
            sys.stdout.write(f"\r{chars[i % len(chars)]} {self.message}...")
            sys.stdout.flush()
            time.sleep(0.1)
            i += 1

    def start(self):
        """Startet die Animation."""
        self.running = True
        # daemon=True: Thread stirbt automatisch wenn das Hauptprogramm endet
        self.thread = threading.Thread(target=self._spin, daemon=True)
        self.thread.start()

    def stop(self):
        """Stoppt die Animation und räumt die Zeile auf."""
        self.running = False
        if self.thread:
            self.thread.join()
        # Zeile aufräumen
        sys.stdout.write("\r" + " " * 50 + "\r")
        sys.stdout.flush()
        