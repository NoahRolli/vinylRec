// === Globale Konfiguration ===
// URL der FastAPI — läuft lokal auf Port 8000
const API_URL = "http://localhost:8000";

// Globale Variablen für den Zustand der App
var currentCollection = [];  // Aktuelle Sammlung für Filter
var lastMood = "";           // Letzte Stimmung für Feedback
var lastOccasion = "";       // Letzter Anlass für Feedback
var currentController = null; // AbortController für laufende Requests