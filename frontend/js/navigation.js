// === Navigation zwischen den drei Bereichen ===

var navButtons = document.querySelectorAll(".nav-btn");
var sections = document.querySelectorAll(".section");

navButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        var target = btn.dataset.section;

        // Alle deaktivieren
        navButtons.forEach(function(b) { b.classList.remove("active"); });
        sections.forEach(function(s) {
            s.classList.remove("active");
            s.classList.add("hidden");
        });

        // Gewählten aktivieren
        btn.classList.add("active");
        document.getElementById(target).classList.remove("hidden");
        document.getElementById(target).classList.add("active");

        // Sammlung laden wenn Tab gewechselt wird
        if (target === "collection") {
            loadCollection();
        }
    });
});