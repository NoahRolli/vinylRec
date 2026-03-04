// === Konfiguration ===
// URL der FastAPI — läuft lokal auf Port 8000
const API_URL = "http://localhost:8000";

// Speichert die aktuelle Sammlung für Filter und Feedback
var currentCollection = [];
// Speichert mood/occasion der letzten Empfehlung für Feedback
var lastMood = "";
var lastOccasion = "";

// AbortController — damit können wir laufende API-Requests abbrechen
// Jeder neue Request bekommt seinen eigenen Controller
var currentController = null;

// === Statustext-Animation ===
// Zeigt verschiedene Nachrichten während des Ladens
// statusElementId: ID des <p>-Elements für den Text
// Gibt eine Interval-ID zurück zum Stoppen
function startStatusAnimation(statusElementId) {
    var messages = [
        "Verbindung zu Ollama wird hergestellt...",
        "Deine Sammlung wird analysiert...",
        "Passende Platten werden gesucht...",
        "Empfehlung wird formuliert...",
        "Fast fertig..."
    ];
    var index = 0;
    var element = document.getElementById(statusElementId);

    // Alle 3 Sekunden nächste Nachricht anzeigen
    var interval = setInterval(function() {
        index++;
        if (index < messages.length) {
            element.textContent = messages[index];
        }
    }, 3000);

    // Erste Nachricht sofort setzen
    element.textContent = messages[0];

    return interval;
}

// ============================================
// NAVIGATION
// ============================================

var navButtons = document.querySelectorAll(".nav-btn");
var sections = document.querySelectorAll(".section");

navButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        var target = btn.dataset.section;

        navButtons.forEach(function(b) { b.classList.remove("active"); });
        sections.forEach(function(s) {
            s.classList.remove("active");
            s.classList.add("hidden");
        });

        btn.classList.add("active");
        document.getElementById(target).classList.remove("hidden");
        document.getElementById(target).classList.add("active");

        if (target === "collection") {
            loadCollection();
        }
    });
});

// ============================================
// EMPFEHLUNG
// ============================================

document.getElementById("get-recommendation").addEventListener("click", async function() {
    var mood = document.getElementById("mood").value;
    var occasion = document.getElementById("occasion").value;
    var duration = document.getElementById("duration").value;

    if (!mood || !occasion || !duration) {
        alert("Bitte fülle alle Felder aus.");
        return;
    }

    // Für Feedback speichern
    lastMood = mood;
    lastOccasion = occasion;

    // UI vorbereiten: Loading zeigen, Ergebnis/Feedback verstecken
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    document.getElementById("feedback-section").classList.add("hidden");
    document.getElementById("get-recommendation").disabled = true;

    // Statustext-Animation starten
    var statusInterval = startStatusAnimation("loading-status");

    // Neuen AbortController erstellen — damit kann der Request abgebrochen werden
    currentController = new AbortController();

    try {
        var response = await fetch(
            API_URL + "/api/recommend?mood=" + encodeURIComponent(mood)
            + "&occasion=" + encodeURIComponent(occasion)
            + "&duration=" + encodeURIComponent(duration),
            {
                method: "POST",
                // signal verbindet den Request mit dem AbortController
                signal: currentController.signal
            }
        );
        var data = await response.json();

        document.getElementById("result").textContent = data.recommendation;
        document.getElementById("result").classList.remove("hidden");
        document.getElementById("feedback-section").classList.remove("hidden");
    } catch (error) {
        // AbortError = Nutzer hat abgebrochen, kein Fehler
        if (error.name === "AbortError") {
            document.getElementById("result").textContent = "Empfehlung abgebrochen.";
        } else {
            document.getElementById("result").textContent = "Fehler: Ist die API gestartet? (uvicorn main:app --reload)";
        }
        document.getElementById("result").classList.remove("hidden");
    }

    // Aufräumen: Animation stoppen, Loading verstecken, Button aktivieren
    clearInterval(statusInterval);
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("get-recommendation").disabled = false;
    currentController = null;
});

// Abbrechen-Button für Empfehlung
document.getElementById("cancel-recommendation").addEventListener("click", function() {
    // abort() bricht den laufenden fetch-Request ab
    // Das löst einen AbortError im try/catch aus
    if (currentController) {
        currentController.abort();
    }
});

// Feedback Buttons
document.querySelectorAll(".feedback-btn").forEach(function(btn) {
    btn.addEventListener("click", async function() {
        var rating = btn.dataset.rating;
        var comment = document.getElementById("feedback-comment").value;

        // Visuell: geklickten Button hervorheben
        document.querySelectorAll(".feedback-btn").forEach(function(b) {
            b.classList.remove("selected");
        });
        btn.classList.add("selected");

        try {
            var response = await fetch(
                API_URL + "/api/feedback?vinyl_id=1"
                + "&mood=" + encodeURIComponent(lastMood)
                + "&occasion=" + encodeURIComponent(lastOccasion)
                + "&rating=" + encodeURIComponent(rating)
                + "&comment=" + encodeURIComponent(comment),
                { method: "POST" }
            );

            document.getElementById("feedback-result").textContent = "✓ Feedback gespeichert — danke!";
            document.getElementById("feedback-result").classList.remove("hidden");
        } catch (error) {
            document.getElementById("feedback-result").textContent = "Fehler beim Speichern.";
            document.getElementById("feedback-result").classList.remove("hidden");
        }
    });
});

// ============================================
// SAMMLUNG
// ============================================

async function loadCollection() {
    try {
        var response = await fetch(API_URL + "/api/collection");
        var data = await response.json();
        currentCollection = data;
        renderCollection(data);
    } catch (error) {
        document.getElementById("collection-list").innerHTML =
            "<p>Fehler beim Laden. Ist die API gestartet?</p>";
    }
}

function renderCollection(data) {
    var html = '<table class="vinyl-table">';
    html += "<tr><th>Artist</th><th>Album</th><th>Genre</th><th>Mood</th><th>Jahr</th><th></th></tr>";

    data.forEach(function(v, index) {
        html += "<tr>";
        html += "<td>" + v.artist + "</td>";
        html += "<td>" + v.album + "</td>";
        html += "<td>" + v.genre_primary + "</td>";
        html += "<td>" + v.mood + "</td>";
        html += "<td>" + (v.year || "–") + "</td>";
        html += '<td><button class="delete-btn" data-index="' + index + '">Löschen</button></td>';
        html += "</tr>";
    });

    html += "</table>";
    html += "<p style='color: #888; margin-top: 10px;'>" + data.length + " Platten</p>";
    document.getElementById("collection-list").innerHTML = html;

    // Lösch-Buttons mit Handlern versehen
    document.querySelectorAll(".delete-btn").forEach(function(btn) {
        btn.addEventListener("click", async function() {
            var index = parseInt(btn.dataset.index);
            var vinyl = currentCollection[index];

            if (confirm("Wirklich löschen: " + vinyl.artist + " – " + vinyl.album + "?")) {
                try {
                    await fetch(API_URL + "/api/collection/" + (index + 1), {
                        method: "DELETE"
                    });
                    loadCollection();
                } catch (error) {
                    alert("Fehler beim Löschen.");
                }
            }
        });
    });
}

// Filter — filtert bei jeder Eingabe live
document.getElementById("collection-filter").addEventListener("input", function() {
    var filter = this.value.toLowerCase();

    var filtered = currentCollection.filter(function(v) {
        return v.artist.toLowerCase().includes(filter)
            || v.album.toLowerCase().includes(filter)
            || v.genre_primary.toLowerCase().includes(filter)
            || v.mood.toLowerCase().includes(filter)
            || String(v.year).includes(filter);
    });

    renderCollection(filtered);
});

// Aufklapp-Button für "Neue Platte hinzufügen"
document.getElementById("toggle-add-form").addEventListener("click", function() {
    var form = document.getElementById("add-form");
    form.classList.toggle("hidden");

    if (form.classList.contains("hidden")) {
        this.textContent = "+ Neue Platte hinzufügen";
    } else {
        this.textContent = "− Schliessen";
    }
});

// Neue Platte hinzufügen
document.getElementById("add-vinyl").addEventListener("click", async function() {
    var artist = document.getElementById("add-artist").value;
    var album = document.getElementById("add-album").value;
    var genrePrimary = document.getElementById("add-genre-primary").value;
    var genreSecondary = document.getElementById("add-genre-secondary").value;
    var mood = document.getElementById("add-mood").value;
    var year = document.getElementById("add-year").value;
    var type = document.getElementById("add-type").value;

    if (!artist || !album) {
        alert("Artist und Album sind Pflichtfelder.");
        return;
    }

    try {
        var url = API_URL + "/api/collection?"
            + "artist=" + encodeURIComponent(artist)
            + "&album=" + encodeURIComponent(album)
            + "&genre_primary=" + encodeURIComponent(genrePrimary)
            + "&genre_secondary=" + encodeURIComponent(genreSecondary)
            + "&mood=" + encodeURIComponent(mood)
            + "&year=" + encodeURIComponent(year)
            + "&type=" + encodeURIComponent(type || "studio");

        await fetch(url, { method: "POST" });

        document.getElementById("add-result").textContent = "✓ " + artist + " – " + album + " hinzugefügt!";
        document.getElementById("add-result").classList.remove("hidden");

        // Felder leeren
        document.getElementById("add-artist").value = "";
        document.getElementById("add-album").value = "";
        document.getElementById("add-genre-primary").value = "";
        document.getElementById("add-genre-secondary").value = "";
        document.getElementById("add-mood").value = "";
        document.getElementById("add-year").value = "";
        document.getElementById("add-type").value = "";

        loadCollection();
    } catch (error) {
        document.getElementById("add-result").textContent = "Fehler beim Hinzufügen.";
        document.getElementById("add-result").classList.remove("hidden");
    }
});

// ============================================
// KAUFEMPFEHLUNG
// ============================================

document.getElementById("get-purchase").addEventListener("click", async function() {
    var goal = document.getElementById("purchase-goal").value;
    var details = document.getElementById("purchase-details").value;

    // Ziel in lesbaren Prompt-Text umwandeln
    var goalText = {
        "luecken": "Analysiere welche Genres, Epochen oder Stimmungen fehlen und empfehle Platten die diese Lücken füllen.",
        "ergaenzen": "Der Nutzer mag seine Sammlung und will mehr davon. Empfehle ähnliche Platten die gut dazu passen.",
        "neues": "Der Nutzer will etwas völlig Neues entdecken. Empfehle Platten aus Genres oder Epochen die in der Sammlung noch nicht vertreten sind."
    };

    // UI vorbereiten
    document.getElementById("purchase-loading").classList.remove("hidden");
    document.getElementById("purchase-result").classList.add("hidden");
    document.getElementById("discogs-search").classList.add("hidden");
    document.getElementById("get-purchase").disabled = true;

    // Statusanimation starten
    var statusInterval = startStatusAnimation("purchase-status");

    // AbortController für Abbrechen
    currentController = new AbortController();

    try {
        var mood = "Kaufempfehlung: " + goalText[goal];
        if (details) {
            mood += " Zusätzlicher Wunsch: " + details;
        }

        var response = await fetch(
            API_URL + "/api/recommend?mood=" + encodeURIComponent(mood)
            + "&occasion=Sammlung+erweitern"
            + "&duration=egal",
            {
                method: "POST",
                signal: currentController.signal
            }
        );
        var data = await response.json();

        document.getElementById("purchase-result").textContent = data.recommendation;
        document.getElementById("purchase-result").classList.remove("hidden");
        document.getElementById("discogs-search").classList.remove("hidden");
    } catch (error) {
        if (error.name === "AbortError") {
            document.getElementById("purchase-result").textContent = "Analyse abgebrochen.";
        } else {
            document.getElementById("purchase-result").textContent = "Fehler: Ist die API gestartet?";
        }
        document.getElementById("purchase-result").classList.remove("hidden");
    }

    clearInterval(statusInterval);
    document.getElementById("purchase-loading").classList.add("hidden");
    document.getElementById("get-purchase").disabled = false;
    currentController = null;
});

// Abbrechen-Button für Kaufempfehlung
document.getElementById("cancel-purchase").addEventListener("click", function() {
    if (currentController) {
        currentController.abort();
    }
});

// Discogs Suche
document.getElementById("search-discogs").addEventListener("click", async function() {
    var query = document.getElementById("discogs-query").value;
    var genre = document.getElementById("discogs-genre").value;

    if (!query) {
        alert("Bitte Suchbegriff eingeben.");
        return;
    }

    try {
        var url = API_URL + "/api/discogs/search?query=" + encodeURIComponent(query);
        if (genre) {
            url += "&genre=" + encodeURIComponent(genre);
        }

        var response = await fetch(url);
        var data = await response.json();

        var html = "";
        data.forEach(function(r) {
            html += '<div class="discogs-item">';
            html += "<h4>" + r.title + "</h4>";
            html += "<p>Genre: " + r.genre + " | Stil: " + r.style + "</p>";
            html += "<p>Jahr: " + r.year + " | Land: " + r.country + "</p>";
            html += "<p>Label: " + r.label + "</p>";
            html += "</div>";
        });

        if (!html) {
            html = "<p>Keine Ergebnisse gefunden.</p>";
        }

        document.getElementById("discogs-results").innerHTML = html;
    } catch (error) {
        document.getElementById("discogs-results").innerHTML =
            "<p>Fehler bei der Discogs-Suche.</p>";
    }
});