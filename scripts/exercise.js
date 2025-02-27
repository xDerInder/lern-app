/**
 * Übungsaufgaben-Modul
 * Verwaltet die Logik für das Anzeigen und Überprüfen von Übungsaufgaben
 */

// Zustandsverwaltung
const state = {
    currentExercise: null,
    hintsShown: 0,
    subject: '',
    topic: '',
    subtopic: '',
    isLoading: false
};

// DOM-Elemente
const elements = {
    exerciseContainer: () => document.getElementById('dynamic-exercise'),
    feedback: () => document.getElementById('feedback'),
    feedbackText: () => document.getElementById('feedback-text'),
    showSolutionBtn: () => document.getElementById('show-solution'),
    newExerciseBtn: () => document.getElementById('new-exercise'),
    mathTools: () => document.getElementById('math-tools'),
    solutionModal: () => document.getElementById('solution-modal'),
    solutionSteps: () => document.getElementById('solution-steps'),
    subjectName: () => document.getElementById('subject-name'),
    topicName: () => document.getElementById('topic-name')
};

// Konstanten
const COLORS = {
    success: '#2ecc71',
    warning: '#f1c40f',
    error: '#e74c3c'
};

/**
 * Initialisiert die Anwendung
 */
async function initializeApp() {
    try {
        // URL-Parameter auslesen
        const urlParams = new URLSearchParams(window.location.search);
        state.subject = urlParams.get('subject') || 'mathematik';
        state.topic = urlParams.get('topic') || '';
        state.subtopic = urlParams.get('subtopic') || '';

        // Überprüfe, ob subjects.js geladen ist
        if (typeof subjects === 'undefined') {
            throw new Error('subjects.js ist nicht geladen');
        }

        setupSubjectSpecificUI();
        setupEventListeners();
        await loadExercise();

    } catch (error) {
        console.error('Fehler bei der Initialisierung:', error);
        showError('Die Anwendung konnte nicht initialisiert werden.');
    }
}

/**
 * Richtet die fachspezifische Benutzeroberfläche ein
 */
function setupSubjectSpecificUI() {
    const subject = subjects[state.subject];
    if (!subject) return;

    // Farbschema setzen
    const [primary, secondary] = subject.gradientColors;
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(45deg, ${primary}, ${secondary})`);

    // UI-Elemente aktualisieren
    elements.subjectName().textContent = subject.name;
    elements.topicName().textContent = state.topic || 'Allgemein';
    
    // Mathematik-spezifische Elemente
    const isMath = state.subject === 'mathematik';
    elements.mathTools().style.display = isMath ? 'flex' : 'none';

    // Seitentitel aktualisieren
    document.title = `${state.topic || subject.name} - Übungsaufgabe`;
}

/**
 * Event-Listener einrichten
 */
function setupEventListeners() {
    // Neue Aufgabe laden
    elements.newExerciseBtn().addEventListener('click', async () => {
        if (state.isLoading) return;
        
        const btn = elements.newExerciseBtn();
        toggleLoadingState(btn, true);
        await loadExercise();
        toggleLoadingState(btn, false);
    });

    // Antwort überprüfen
    document.getElementById('check-answer').addEventListener('click', checkAnswer);

    // Lösungsweg anzeigen
    elements.showSolutionBtn().addEventListener('click', showSolution);

    // Modal schließen
    document.querySelector('.close-modal').addEventListener('click', () => {
        elements.solutionModal().classList.add('hidden');
    });

    // ESC-Taste zum Schließen des Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            elements.solutionModal().classList.add('hidden');
        }
    });
}

/**
 * Lädt eine neue Übungsaufgabe
 */
async function loadExercise() {
    try {
        resetExerciseState();
        
        const response = await fetch('/.netlify/functions/generateExercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subject: state.subject, 
                topic: state.topic, 
                subtopic: state.subtopic,
                forceNew: true
            })
        });

        if (!response.ok) {
            throw new Error('Netzwerk-Antwort war nicht ok');
        }

        state.currentExercise = await response.json();
        displayExercise(state.currentExercise);

    } catch (error) {
        console.error('Fehler beim Laden der Aufgabe:', error);
        showError('Beim Laden der Aufgabe ist ein Fehler aufgetreten.');
    }
}

/**
 * Zeigt die Übungsaufgabe an
 */
function displayExercise(exercise) {
    elements.exerciseContainer().innerHTML = `
        <h3>${state.topic || 'Übungsaufgabe'}</h3>
        <p class="exercise-question">${exercise.question}</p>
    `;
}

/**
 * Überprüft die eingegebene Antwort
 */
function checkAnswer() {
    if (!state.currentExercise) return;

    const userAnswer = window.mathInput?.getLatex()?.trim().toLowerCase() || '';
    const correctAnswer = state.currentExercise.solution.trim().toLowerCase();
    
    if (userAnswer === correctAnswer) {
        showFeedback('Richtig! Sehr gut gemacht!', 'success');
        elements.showSolutionBtn().style.display = 'none';
    } else {
        handleWrongAnswer();
    }
}

/**
 * Behandelt falsche Antworten und zeigt Hinweise an
 */
function handleWrongAnswer() {
    const hints = state.currentExercise.hints;
    
    if (state.hintsShown < hints.length) {
        showFeedback(`Hinweis: ${hints[state.hintsShown]}`, 'warning');
        state.hintsShown++;
    } else {
        showFeedback('Leider falsch. Schaue dir den Lösungsweg an.', 'error');
    }
    
    elements.showSolutionBtn().style.display = 'block';
}

/**
 * Zeigt das Feedback zur Antwort an
 */
function showFeedback(message, type = 'info') {
    const feedback = elements.feedback();
    const feedbackText = elements.feedbackText();
    
    feedbackText.textContent = message;
    feedbackText.style.color = COLORS[type];
    feedback.classList.remove('hidden');
}

/**
 * Zeigt den Lösungsweg im Modal an
 */
function showSolution() {
    const { solution, solutionSteps } = state.currentExercise;
    
    elements.solutionSteps().innerHTML = `
        <div class="solution-content">
            <p class="solution-final">Lösung: ${solution}</p>
            <div class="solution-steps">
                ${solutionSteps.map(step => `
                    <div class="solution-step">
                        <p>${step}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    elements.solutionModal().classList.remove('hidden');
}

/**
 * Setzt den Zustand der Übungsaufgabe zurück
 */
function resetExerciseState() {
    state.currentExercise = null;
    state.hintsShown = 0;
    
    elements.feedback().classList.add('hidden');
    elements.solutionModal().classList.add('hidden');
    
    if (window.mathInput?.mathField && state.subject === 'mathematik') {
        window.mathInput.clearInput();
    }
}

/**
 * Zeigt eine Fehlermeldung an
 */
function showError(message) {
    elements.exerciseContainer().innerHTML = `
        <h3>Fehler</h3>
        <p class="error-message">${message}</p>
    `;
}

/**
 * Schaltet den Ladezustand eines Buttons um
 */
function toggleLoadingState(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Lade neue Aufgabe...' : 'Neue Aufgabe';
    state.isLoading = isLoading;
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', initializeApp); 