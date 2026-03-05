// === Sammlung laden ===

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

// Sammlung als HTML-Tabelle rendern
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

    // Lösch-Buttons
    document.querySelectorAll(".delete-btn").forEach(function(btn) {
        btn.addEventListener("click", async function() {
            var index = parseInt(btn.dataset.index);
            var vinyl = currentCollection[index];

            if (confirm("Wirklich löschen: " + vinyl.artist + " – " + vinyl.album + "?")) {
                try {
                    await fetch(API_URL + "/api/collection/" + (index + 1), { method: "DELETE" });
                    loadCollection();
                } catch (error) {
                    alert("Fehler beim Löschen.");
                }
            }
        });
    });
}

// === Filter ===
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

// === Aufklapp-Formular ===
document.getElementById("toggle-add-form").addEventListener("click", function() {
    var form = document.getElementById("add-form");
    form.classList.toggle("hidden");
    this.textContent = form.classList.contains("hidden") ? "+ Neue Platte hinzufügen" : "− Schliessen";
});

// === Neue Platte hinzufügen ===
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
        ["add-artist", "add-album", "add-genre-primary", "add-genre-secondary", "add-mood", "add-year", "add-type"].forEach(function(id) {
            document.getElementById(id).value = "";
        });

        loadCollection();
    } catch (error) {
        document.getElementById("add-result").textContent = "Fehler beim Hinzufügen.";
        document.getElementById("add-result").classList.remove("hidden");
    }
});