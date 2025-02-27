const subjects = {
    mathematik: {
        name: "Mathematik",
        description: "Entdecke Mathematik auf eine neue Art - kreativ und künstlerisch",
        gradientColors: ["#6b4984", "#84494b"],
        icon: "📐",
        lastLesson: "Geometrie",
        dailyExercise: "Algebra"
    },
    physik: {
        name: "Physik",
        description: "Entdecke die Welt der Physik - experimentell und spannend",
        gradientColors: ["#4682B4", "#6495ED"],
        icon: "⚡",
        lastLesson: "Mechanik",
        dailyExercise: "Braggsche Bedingung herleiten"
    },
    biologie: {
        name: "Biologie",
        description: "Entdecke die Welt der Biologie - natürlich und lebendig",
        gradientColors: ["#2E8B57", "#3CB371"],
        icon: "🧬",
        lastLesson: "Genetik",
        dailyExercise: "Ökologie"
    },
    chemie: {
        name: "Chemie",
        description: "Entdecke die Welt der Chemie - reaktiv und faszinierend",
        gradientColors: ["#FF5733", "#FFA500"],
        icon: "🧪",
        lastLesson: "Organische Chemie",
        dailyExercise: "Reaktionsgleichung aufstellen"
    }
};

function loadSubject() {
    // URL-Parameter auslesen
    const urlParams = new URLSearchParams(window.location.search);
    const subjectName = urlParams.get('subject') || 'mathematik'; // Standard ist Mathematik
    const subject = subjects[subjectName];

    if (!subject) return; // Wenn das Fach nicht existiert, nichts tun

    // Farbschema anpassen
    document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(45deg, ${subject.gradientColors[0]}, ${subject.gradientColors[1]})`);
    document.documentElement.style.setProperty('--primary-color', subject.gradientColors[0]);
    document.documentElement.style.setProperty('--secondary-color', subject.gradientColors[1]);

    // Texte aktualisieren
    document.title = `${subject.name} - Mathly`;
    
    // Logo aktualisieren
    const logo = document.getElementById('subject-logo');
    if (logo) {
        logo.src = `../images/${subjectName}-logo.png`;
        logo.alt = `${subject.name} Logo`;
    }
    
    // Header
    const headerTitle = document.querySelector('.logo-section h1');
    if (headerTitle) headerTitle.textContent = subject.name;

    // Willkommenssektion
    const welcomeTitle = document.querySelector('.welcome-content h2');
    const welcomeDesc = document.querySelector('.welcome-content p');
    if (welcomeTitle) welcomeTitle.textContent = `Willkommen zu ${subject.name}`;
    if (welcomeDesc) welcomeDesc.textContent = subject.description;

    // Letzte Lektion
    const lastLessonTitle = document.querySelector('.quick-access-card:first-child p');
    if (lastLessonTitle) lastLessonTitle.textContent = subject.lastLesson;

    // Tägliche Übung
    const dailyExerciseTitle = document.querySelector('.quick-access-card:last-child p');
    if (dailyExerciseTitle) dailyExerciseTitle.textContent = subject.dailyExercise;
}

// Wenn das Dokument geladen ist
document.addEventListener('DOMContentLoaded', loadSubject); 