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
async function loadExercise(forceNew = false) {
    const subject = state.subject || getUrlParameter('subject') || 'math';
    const topic = state.topic || getUrlParameter('topic') || 'algebra';
    const subtopic = state.subtopic || getUrlParameter('subtopic') || 'equations';

    // Zeige Ladeindikator
    elements.exerciseContainer().innerHTML = 'Lade neue Aufgabe...';
    
    // Setze Eingabefelder zurück
    resetInputFields();
    
    // Verstecke Feedback und Lösungsbutton
    elements.feedback().classList.add('hidden');
    elements.showSolutionBtn().style.display = 'none';

    try {
        const response = await fetch('/api/generateExercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject,
                topic,
                subtopic,
                forceNew
            })
        });

        if (!response.ok) {
            throw new Error('Netzwerk-Antwort war nicht ok');
        }

        state.currentExercise = await response.json();
        displayExercise(state.currentExercise);
        setupInputField(state.currentExercise);

    } catch (error) {
        console.error('Fehler beim Laden der Aufgabe:', error);
        elements.exerciseContainer().innerHTML = 'Fehler beim Laden der Aufgabe. Bitte versuche es erneut.';
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
    const isMathExercise = document.getElementById('solution-input').classList.contains('hidden') === false;
    let userAnswer;
    
    if (isMathExercise) {
        userAnswer = window.mathInput.getLatex();
    } else {
        userAnswer = document.getElementById('text-solution-input').value.trim();
    }

    if (!userAnswer) {
        showFeedback('Bitte gib eine Antwort ein.', 'error');
        return;
    }

    // Vergleiche die Antwort
    const isCorrect = compareAnswers(userAnswer, state.currentExercise.solution, isMathExercise);
    
    if (isCorrect) {
        showFeedback('Richtig! Gut gemacht!', 'success');
    } else {
        showFeedback('Das ist leider nicht korrekt. Versuche es noch einmal!', 'error');
        elements.showSolutionBtn().style.display = 'block';
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

function setupInputField(exercise) {
    const textInput = document.getElementById('text-solution-input');
    const mathTools = document.getElementById('math-tools');
    
    // Zeige immer das Textfeld
    textInput.classList.remove('hidden');
    
    // Zeige die mathematischen Werkzeuge für mathematische Aufgaben
    const isMathExercise = exercise.subject === 'math' || 
                          exercise.requiresMathInput === true ||
                          exercise.question.includes('\\(') ||
                          exercise.question.includes('\\[');
    
    mathTools.style.display = isMathExercise ? 'block' : 'none';
}

function resetInputFields() {
    // Reset math input
    if (window.mathInput && window.mathInput.clearInput) {
        window.mathInput.clearInput();
    }
    // Reset text input
    document.getElementById('text-solution-input').value = '';
}

function compareAnswers(userAnswer, correctAnswer, isMathExercise) {
    if (isMathExercise) {
        // Für mathematische Antworten: Vergleiche LaTeX
        return normalizeMathAnswer(userAnswer) === normalizeMathAnswer(correctAnswer);
    } else {
        // Für Text-Antworten: Normalisiere und vergleiche Text
        return normalizeTextAnswer(userAnswer) === normalizeTextAnswer(correctAnswer);
    }
}

function normalizeMathAnswer(latex) {
    // Entferne Whitespace und normalisiere mathematische Ausdrücke
    return latex.replace(/\s+/g, '')
               .replace(/\\cdot/g, '*')
               .replace(/\\times/g, '*')
               .toLowerCase();
}

function normalizeTextAnswer(text) {
    // Normalisiere Text-Antworten (Groß-/Kleinschreibung, Whitespace, etc.)
    return text.toLowerCase()
              .replace(/\s+/g, ' ')
              .trim();
}

/**
 * Liest einen Parameter aus der URL aus
 * @param {string} param - Der Name des Parameters
 * @returns {string|null} Der Wert des Parameters oder null
 */
function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Fügt ein mathematisches Symbol an der Cursorposition ein
 */
function insertSymbol(symbol) {
    const textInput = document.getElementById('text-solution-input');
    const cursorPos = textInput.selectionStart;
    const textBefore = textInput.value.substring(0, cursorPos);
    const textAfter = textInput.value.substring(textInput.selectionEnd);
    
    // Wandle spezielle Symbole in ihre Textdarstellung um
    let insertText = symbol;
    switch(symbol) {
        case '\\cdot':
            insertText = '·';
            break;
        case '\\div':
            insertText = '÷';
            break;
        case '\\sqrt':
            insertText = '√';
            break;
        case '\\pi':
            insertText = 'π';
            break;
        case '\\infty':
            insertText = '∞';
            break;
    }
    
    textInput.value = textBefore + insertText + textAfter;
    
    // Setze den Cursor hinter das eingefügte Symbol
    const newCursorPos = cursorPos + insertText.length;
    textInput.setSelectionRange(newCursorPos, newCursorPos);
    textInput.focus();
}

/**
 * Fügt einen Bruch an der Cursorposition ein
 */
function insertFraction() {
    const textInput = document.getElementById('text-solution-input');
    const cursorPos = textInput.selectionStart;
    const textBefore = textInput.value.substring(0, cursorPos);
    const textAfter = textInput.value.substring(textInput.selectionEnd);
    
    const fraction = "(a/b)";
    textInput.value = textBefore + fraction + textAfter;
    
    // Setze den Cursor auf die Position des "a"
    const newCursorPos = cursorPos + 1;
    textInput.setSelectionRange(newCursorPos, newCursorPos + 1);
    textInput.focus();
}

/**
 * Fügt eine Potenz an der Cursorposition ein
 */
function insertPower() {
    const textInput = document.getElementById('text-solution-input');
    const cursorPos = textInput.selectionStart;
    const textBefore = textInput.value.substring(0, cursorPos);
    const textAfter = textInput.value.substring(textInput.selectionEnd);
    
    const power = "x^(n)";
    textInput.value = textBefore + power + textAfter;
    
    // Setze den Cursor auf die Position des "n"
    const newCursorPos = cursorPos + 2;
    textInput.setSelectionRange(newCursorPos, newCursorPos + 1);
    textInput.focus();
}

// Füge die Funktionen dem window.mathInput Objekt hinzu
window.mathInput = {
    insertSymbol,
    insertFraction,
    insertPower,
    clearInput: () => {
        document.getElementById('text-solution-input').value = '';
    },
    getLatex: () => {
        return document.getElementById('text-solution-input').value;
    }
};

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', initializeApp); 