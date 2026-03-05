// === Empfehlung holen ===

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

    // UI vorbereiten
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    document.getElementById("feedback-section").classList.add("hidden");
    document.getElementById("get-recommendation").disabled = true;

    // Statusanimation starten
    var statusInterval = startStatusAnimation("loading-status");

    // AbortController für Abbrechen
    currentController = new AbortController();

    try {
        var response = await fetch(
            API_URL + "/api/recommend?mood=" + encodeURIComponent(mood)
            + "&occasion=" + encodeURIComponent(occasion)
            + "&duration=" + encodeURIComponent(duration),
            { method: "POST", signal: currentController.signal }
        );
        var data = await response.json();

        document.getElementById("result").textContent = data.recommendation;
        document.getElementById("result").classList.remove("hidden");
        document.getElementById("feedback-section").classList.remove("hidden");
    } catch (error) {
        if (error.name === "AbortError") {
            document.getElementById("result").textContent = "Empfehlung abgebrochen.";
        } else {
            document.getElementById("result").textContent = "Fehler: Ist die API gestartet?";
        }
        document.getElementById("result").classList.remove("hidden");
    }

    clearInterval(statusInterval);
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("get-recommendation").disabled = false;
    currentController = null;
});

// Abbrechen-Button
document.getElementById("cancel-recommendation").addEventListener("click", function() {
    if (currentController) {
        currentController.abort();
    }
});

// === Feedback ===

document.querySelectorAll(".feedback-btn").forEach(function(btn) {
    btn.addEventListener("click", async function() {
        var rating = btn.dataset.rating;
        var comment = document.getElementById("feedback-comment").value;

        // Geklickten Button hervorheben
        document.querySelectorAll(".feedback-btn").forEach(function(b) {
            b.classList.remove("selected");
        });
        btn.classList.add("selected");

        try {
            await fetch(
                API_URL + "/api/feedback?vinyl_id=1"
                + "&mood=" + encodeURIComponent(lastMood)
                + "&occasion=" + encodeURIComponent(lastOccasion)
                + "&rating=" + encodeURIComponent(rating)
                + "&comment=" + encodeURIComponent(comment),
                { method: "POST" }
            );

            document.getElementById("feedback-result").textContent = "✓ Feedback gespeichert!";
            document.getElementById("feedback-result").classList.remove("hidden");
        } catch (error) {
            document.getElementById("feedback-result").textContent = "Fehler beim Speichern.";
            document.getElementById("feedback-result").classList.remove("hidden");
        }
    });
});