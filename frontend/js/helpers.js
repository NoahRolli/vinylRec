// === Hilfsfunktionen ===

// Statustext-Animation — wechselt den Text alle 3 Sekunden
// Gibt die Interval-ID zurück um die Animation später zu stoppen
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

    // Erste Nachricht sofort setzen
    element.textContent = messages[0];

    // Alle 3 Sekunden nächste Nachricht
    var interval = setInterval(function() {
        index++;
        if (index < messages.length) {
            element.textContent = messages[index];
        }
    }, 3000);

    return interval;
}