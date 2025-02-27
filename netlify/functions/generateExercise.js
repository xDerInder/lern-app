import fetch from 'node-fetch';

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Methode nicht erlaubt' })
        };
    }

    let subject, topic, subtopic;

    try {
        if (!process.env.HUGGINGFACE_API_KEY) {
            throw new Error('API-Key nicht konfiguriert');
        }

        ({ subject, topic, subtopic } = JSON.parse(event.body));
        
        const promptConfig = {
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            inputs: `Generiere eine Übungsaufgabe als JSON. Fach: ${subject}, Thema: ${topic || 'Allgemein'}${subtopic ? ', Unterthema: ' + subtopic : ''}.

Gib EXAKT dieses JSON-Format zurück (ersetze nur die Beispielwerte):

{
    "question": "Berechne die Ableitung von f(x) = x² + 2x",
    "hints": [
        "Die Ableitung von x² ist 2x",
        "Nutze die Summenregel"
    ],
    "solution": "f'(x) = 2x + 2",
    "solutionSteps": [
        "Wende die Potenzregel auf x² an: 2x",
        "Die Ableitung von 2x ist 2",
        "Addiere die Terme: 2x + 2"
    ]
}

Anforderungen:
1. Deutsch
2. ${subject === 'mathematik' ? 'LaTeX für Formeln (z.B. $x^2$ für x²)' : 'Klare Fachsprache'}
3. Angemessener Schwierigkeitsgrad
4. Mindestens 2 Hinweise
5. Mindestens 3 Lösungsschritte

WICHTIG: Gib NUR das JSON zurück. Kein Text davor oder danach.`,
            parameters: {
                max_new_tokens: 1000,
                temperature: 0.7,
                top_p: 0.95,
                do_sample: true,
                return_full_text: false
            }
        };

        console.log('Sende Anfrage an Hugging Face API...');

        const response = await fetch(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promptConfig)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API-Fehler:', errorText);
            console.error('Status:', response.status);
            console.error('Statustext:', response.statusText);
            throw new Error(`API-Anfrage fehlgeschlagen: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('API-Antwort erhalten:', JSON.stringify(result, null, 2));

        let exercise;
        try {
            if (!result || !Array.isArray(result) || !result[0]?.generated_text) {
                console.error('Unerwartetes API-Antwortformat:', result);
                throw new Error('Ungültiges API-Antwortformat');
            }

            function cleanJsonText(text) {
                // Entferne Markdown-Code-Block-Marker
                text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                
                // Entferne Whitespace am Anfang und Ende
                text = text.trim();
                
                // Finde den JSON-Teil
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) return null;
                text = jsonMatch[0];

                // Normalisiere Zeilenumbrüche und Leerzeichen
                text = text.split('\n').map(line => line.trim()).join(' ');
                
                // Korrigiere häufige JSON-Formatierungsprobleme
                text = text
                    // Entferne zusätzliche Leerzeichen
                    .replace(/\s+/g, ' ')
                    // Korrigiere Kommas in Arrays
                    .replace(/",\s+"/g, '","')
                    // Korrigiere Array-Formatierung
                    .replace(/\[\s+"/g, '["')
                    .replace(/"\s+\]/g, '"]')
                    // Korrigiere Objekt-Formatierung
                    .replace(/{\s+"/g, '{"')
                    .replace(/"\s+}/g, '"}')
                    // Korrigiere Doppelpunkte
                    .replace(/"\s+:/g, '":')
                    .replace(/:\s+"/g, ':"')
                    // Korrigiere Kommas zwischen Eigenschaften
                    .replace(/"\s*,\s*"/g, '","')
                    // Entferne Komma vor schließender Klammer oder Array
                    .replace(/,(\s*[\]}])/g, '$1')
                    // Behandle LaTeX-Backslashes
                    .replace(/\\\\/g, '\\')
                    .replace(/([^\\])\\/g, '$1\\\\');

                return text;
            }

            let text = result[0].generated_text;
            console.log('Roher Text:', text);

            // Erste Bereinigung
            text = cleanJsonText(text);
            if (!text) {
                throw new Error('Konnte kein JSON-Objekt im Text finden');
            }
            console.log('Bereinigter Text:', text);

            try {
                // Versuche das JSON zu parsen
                exercise = JSON.parse(text);
            } catch (e) {
                console.error('JSON Parse Fehler:', e.message);
                throw new Error('Ungültiges JSON-Format');
            }

            // Validiere die Struktur
            const requiredFields = ['question', 'solution', 'hints', 'solutionSteps'];
            const missingFields = requiredFields.filter(field => !exercise[field]);
            
            if (missingFields.length > 0) {
                console.error('Fehlende Felder in der Antwort:', missingFields);
                throw new Error(`Fehlende Felder: ${missingFields.join(', ')}`);
            }

            if (!Array.isArray(exercise.hints) || !Array.isArray(exercise.solutionSteps)) {
                console.error('Ungültige Arrays in der Antwort:', {
                    hints: exercise.hints,
                    solutionSteps: exercise.solutionSteps
                });
                throw new Error('hints und solutionSteps müssen Arrays sein');
            }

            // Validiere Mindestanforderungen
            if (exercise.hints.length < 2) {
                throw new Error('Mindestens 2 Hinweise erforderlich');
            }
            if (exercise.solutionSteps.length < 3) {
                throw new Error('Mindestens 3 Lösungsschritte erforderlich');
            }

        } catch (e) {
            console.log('Fehler beim Verarbeiten der API-Antwort:', e.message);
            console.log('Verwende Fallback-Aufgabe für', subject);
            exercise = getFallbackExercise(subject, topic);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(exercise)
        };

    } catch (error) {
        console.error('Fehler in generateExercise:', error);
        
        const fallbackExercise = getFallbackExercise(subject, topic);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(fallbackExercise)
        };
    }
};

function getFallbackExercise(subject, topic) {
    const fallbacks = {
        mathematik: {
            question: "Berechne die Ableitung der Funktion f(x) = 3x² + 2x - 5.",
            hints: [
                "Wende die Potenzregel an",
                "Die Ableitung von x² ist 2x",
                "Beachte die Summenregel"
            ],
            solution: "f'(x) = 6x + 2",
            solutionSteps: [
                "1. Wir wenden die Potenzregel auf 3x² an: 3 · 2x = 6x",
                "2. Die Ableitung von 2x ist 2",
                "3. Die Ableitung einer Konstanten ist 0",
                "4. Zusammenfassen: f'(x) = 6x + 2"
            ]
        },
        physik: {
            question: "Ein Auto beschleunigt gleichmäßig aus dem Stand auf 100 km/h in 8 Sekunden. Berechne die Beschleunigung.",
            hints: [
                "Wandle km/h in m/s um",
                "Nutze die Formel a = Δv/Δt",
                "Beachte die Einheiten"
            ],
            solution: "3,47 m/s²",
            solutionSteps: [
                "1. Umrechnung: 100 km/h = 27,78 m/s",
                "2. Zeitdifferenz: Δt = 8 s",
                "3. Geschwindigkeitsänderung: Δv = 27,78 m/s",
                "4. a = 27,78 m/s ÷ 8 s = 3,47 m/s²"
            ]
        },
        chemie: {
            question: "Berechne die molare Masse von Schwefelsäure (H₂SO₄).",
            hints: [
                "Schaue die atomaren Massen nach: H = 1,01 g/mol, S = 32,07 g/mol, O = 16,00 g/mol",
                "Beachte die Anzahl der Atome"
            ],
            solution: "98,09 g/mol",
            solutionSteps: [
                "1. Masse von H₂: 2 · 1,01 g/mol = 2,02 g/mol",
                "2. Masse von S: 1 · 32,07 g/mol = 32,07 g/mol",
                "3. Masse von O₄: 4 · 16,00 g/mol = 64,00 g/mol",
                "4. Gesamtmasse: 2,02 + 32,07 + 64,00 = 98,09 g/mol"
            ]
        },
        biologie: {
            question: "Erkläre den Prozess der Photosynthese und nenne die wichtigsten Reaktanden und Produkte.",
            hints: [
                "Denke an die Rolle des Sonnenlichts",
                "Welche Stoffe werden aufgenommen?",
                "Was sind die Endprodukte?"
            ],
            solution: "6 CO₂ + 6 H₂O + Lichtenergie → C₆H₁₂O₆ + 6 O₂",
            solutionSteps: [
                "1. Aufnahme von Kohlenstoffdioxid aus der Luft",
                "2. Aufnahme von Wasser durch die Wurzeln",
                "3. Absorption von Lichtenergie durch Chlorophyll",
                "4. Bildung von Glucose als Energiespeicher",
                "5. Freisetzung von Sauerstoff als Nebenprodukt"
            ]
        }
    };

    return fallbacks[subject] || fallbacks.mathematik;
} 