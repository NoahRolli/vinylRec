// === Kaufempfehlung ===

document.getElementById("get-purchase").addEventListener("click", async function() {
    var goal = document.getElementById("purchase-goal").value;
    var details = document.getElementById("purchase-details").value;

    // UI vorbereiten
    document.getElementById("purchase-loading").classList.remove("hidden");
    document.getElementById("purchase-result").classList.add("hidden");
    document.getElementById("discogs-search").classList.add("hidden");
    document.getElementById("get-purchase").disabled = true;

    var statusInterval = startStatusAnimation("purchase-status");
    currentController = new AbortController();

    try {
        // Eigener Endpunkt für Kaufempfehlungen
        var response = await fetch(
            API_URL + "/api/purchase?goal=" + encodeURIComponent(goal)
            + "&details=" + encodeURIComponent(details),
            { method: "POST", signal: currentController.signal }
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

// Abbrechen
document.getElementById("cancel-purchase").addEventListener("click", function() {
    if (currentController) {
        currentController.abort();
    }
});

// === Discogs Suche ===
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