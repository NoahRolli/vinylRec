// === Konfiguration ===
// URL der FastAPI — läuft lokal auf Port 8000
const API_URL = "http://localhost:8000";

// === Navigation ===
// Alle Nav-Buttons und Sektionen holen
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

// Klick-Handler für jeden Nav-Button
navButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        // Ziel-Sektion aus data-section Attribut lesen
        const target = btn.dataset.section;

        // Alle Buttons deaktivieren, alle Sektionen verstecken
        navButtons.forEach(function(b) { b.classList.remove("active"); });
        sections.forEach(function(s) {
            s.classList.remove("active");
            s.classList.add("hidden");
        });

        // Geklickten Button und Ziel-Sektion aktivieren
        btn.classList.add("active");
        document.getElementById(target).classList.remove("hidden");
        document.getElementById(target).classList.add("active");

        // Sammlung laden wenn der Tab gewechselt wird
        if (target === "collection") {
            loadCollection();
        }
    });
});

// === Empfehlung ===
// Button-Klick startet die Empfehlung
document.getElementById("get-recommendation").addEventListener("click", async function() {
    // Werte aus den Eingabefeldern holen
    var mood = document.getElementById("mood").value;
    var occasion = document.getElementById("occasion").value;
    var duration = document.getElementById("duration").value;

    // Prüfen ob alle Felder ausgefüllt sind
    if (!mood || !occasion || !duration) {
        alert("Bitte fülle alle Felder aus.");
        return;
    }

    // Ladeanimation zeigen, Ergebnis verstecken
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    document.getElementById("get-recommendation").disabled = true;

    try {
        // POST-Request an die API
        // Query-Parameter werden in die URL eingebaut
        var response = await fetch(
            API_URL + "/api/recommend?mood=" + encodeURIComponent(mood)
            + "&occasion=" + encodeURIComponent(occasion)
            + "&duration=" + encodeURIComponent(duration),
            { method: "POST" }
        );
        var data = await response.json();

        // Ergebnis anzeigen
        document.getElementById("result").textContent = data.recommendation;
        document.getElementById("result").classList.remove("hidden");
    } catch (error) {
        // Fehlerbehandlung — z.B. wenn API nicht läuft
        document.getElementById("result").textContent = "Fehler: Ist die API gestartet? (uvicorn main:app --reload)";
        document.getElementById("result").classList.remove("hidden");
    }

    // Ladeanimation verstecken, Button wieder aktivieren
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("get-recommendation").disabled = false;
});

// === Sammlung laden ===
async function loadCollection() {
    try {
        // GET-Request an die API
        var response = await fetch(API_URL + "/api/collection");
        var data = await response.json();

        // Tabelle als HTML-String zusammenbauen
        var html = '<table class="vinyl-table">';
        html += "<tr><th>Artist</th><th>Album</th><th>Genre</th><th>Mood</th><th>Jahr</th></tr>";

        // Für jede Platte eine Tabellenzeile
        data.forEach(function(v) {
            html += "<tr>";
            html += "<td>" + v.artist + "</td>";
            html += "<td>" + v.album + "</td>";
            html += "<td>" + v.genre_primary + "</td>";
            html += "<td>" + v.mood + "</td>";
            html += "<td>" + (v.year || "–") + "</td>";
            html += "</tr>";
        });

        html += "</table>";

        // Tabelle ins DOM einfügen
        document.getElementById("collection-list").innerHTML = html;
    } catch (error) {
        document.getElementById("collection-list").innerHTML =
            "<p>Fehler beim Laden. Ist die API gestartet?</p>";
    }
}

// === Kaufempfehlung ===
document.getElementById("get-purchase").addEventListener("click", async function() {
    // Ladeanimation zeigen
    document.getElementById("purchase-loading").classList.remove("hidden");
    document.getElementById("purchase-result").classList.add("hidden");
    document.getElementById("get-purchase").disabled = true;

    try {
        // POST-Request — die API braucht hier noch einen Endpunkt
        var response = await fetch(API_URL + "/api/recommend?mood=kaufempfehlung&occasion=sammlung+erweitern&duration=egal", {
            method: "POST"
        });
        var data = await response.json();

        // Ergebnis anzeigen und Discogs-Suche einblenden
        document.getElementById("purchase-result").textContent = data.recommendation;
        document.getElementById("purchase-result").classList.remove("hidden");
        document.getElementById("discogs-search").classList.remove("hidden");
    } catch (error) {
        document.getElementById("purchase-result").textContent = "Fehler: Ist die API gestartet?";
        document.getElementById("purchase-result").classList.remove("hidden");
    }

    document.getElementById("purchase-loading").classList.add("hidden");
    document.getElementById("get-purchase").disabled = false;
});

// === Discogs Suche ===
document.getElementById("search-discogs").addEventListener("click", async function() {
    var query = document.getElementById("discogs-query").value;

    if (!query) {
        alert("Bitte Suchbegriff eingeben.");
        return;
    }

    try {
        // GET-Request an unsere API (die dann Discogs anfragt)
        var response = await fetch(
            API_URL + "/api/discogs/search?query=" + encodeURIComponent(query)
        );
        var data = await response.json();

        // Ergebnisse anzeigen
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