const subjectTopics = {
    mathematik: [
        {
            id: 'analysis',
            name: 'Analysis',
            icon: '📈',
            topics: [
                {
                    title: 'Differentialrechnung',
                    description: 'Ableitungen und ihre Anwendungen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Integralrechnung',
                    description: 'Integrale und Flächenberechnung',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Funktionen',
                    description: 'Eigenschaften und Graphen von Funktionen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Grenzwerte',
                    description: 'Grenzwertberechnung und Stetigkeit',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Kurvendiskussion',
                    description: 'Extrema, Wendepunkte und Monotonie',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Exponentialfunktionen',
                    description: 'e-Funktion und natürlicher Logarithmus',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'algebra',
            name: 'Algebra',
            icon: '🔢',
            topics: [
                {
                    title: 'Gleichungen',
                    description: 'Lineare und quadratische Gleichungen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Terme',
                    description: 'Termumformungen und Faktorisierung',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Folgen und Reihen',
                    description: 'Arithmetische und geometrische Folgen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Polynome',
                    description: 'Polynomfunktionen und Nullstellen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Matrizen',
                    description: 'Matrizenrechnung und lineare Gleichungssysteme',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Komplexe Zahlen',
                    description: 'Rechnen mit komplexen Zahlen',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'geometry',
            name: 'Geometrie',
            icon: '📐',
            topics: [
                {
                    title: 'Analytische Geometrie',
                    description: 'Vektoren und Geraden im Raum',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Trigonometrie',
                    description: 'Winkelfunktionen und Dreiecksberechnungen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Kegelschnitte',
                    description: 'Kreise, Ellipsen und Parabeln',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Koordinatengeometrie',
                    description: 'Abstände, Winkel und Schnittberechnungen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Ebenengeometrie',
                    description: 'Flächen und Konstruktionen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Raumgeometrie',
                    description: 'Körper und Volumenberechnung',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'stochastik',
            name: 'Stochastik',
            icon: '🎲',
            topics: [
                {
                    title: 'Wahrscheinlichkeitsrechnung',
                    description: 'Zufallsexperimente und Wahrscheinlichkeiten',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Statistik',
                    description: 'Datenanalyse und statistische Kenngrößen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Kombinatorik',
                    description: 'Permutationen und Kombinationen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Bedingte Wahrscheinlichkeit',
                    description: 'Satz von Bayes und Unabhängigkeit',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Verteilungen',
                    description: 'Normal-, Binomial- und Poissonverteilung',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Hypothesentests',
                    description: 'Signifikanztests und Konfidenzintervalle',
                    link: 'exercise-template.html'
                }
            ]
        }
    ],
    physik: [
        {
            id: 'mechanics',
            name: 'Mechanik',
            icon: '🎯',
            topics: [
                {
                    title: 'Kinematik',
                    description: 'Bewegungen und Beschleunigung',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Dynamik',
                    description: 'Kräfte und Newtonsche Gesetze',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Impuls und Energie',
                    description: 'Erhaltungssätze und Stöße',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Kreisbewegung',
                    description: 'Zentripetalkraft und Drehimpuls',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Gravitation',
                    description: 'Gravitationsfeld und Keplersche Gesetze',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'em',
            name: 'Elektrodynamik',
            icon: '⚡',
            topics: [
                {
                    title: 'Elektrische Felder',
                    description: 'Ladungen und Coulomb-Kraft',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Magnetische Felder',
                    description: 'Magnetismus und Induktion',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Elektrische Stromkreise',
                    description: 'Ohmsches Gesetz und Kirchhoffsche Regeln',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Elektromagnetische Wellen',
                    description: 'Maxwell-Gleichungen und Wellenoptik',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'quantum',
            name: 'Quantenphysik',
            icon: '🌌',
            topics: [
                {
                    title: 'Photoeffekt',
                    description: 'Welle-Teilchen-Dualismus',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Atommodelle',
                    description: 'Bohr bis Schrödinger',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Quantenmechanik',
                    description: 'Grundlagen und Heisenbergsche Unschärferelation',
                    link: 'exercise-template.html'
                }
            ]
        }
    ],
    biologie: [
        {
            id: 'genetics',
            name: 'Genetik',
            icon: '🧬',
            topics: [
                {
                    title: 'Molekulargenetik',
                    description: 'DNA, RNA und Proteinbiosynthese',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Klassische Genetik',
                    description: 'Mendel und Stammbaumanalyse',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Gentechnik',
                    description: 'Methoden und Anwendungen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Mutation und Repair',
                    description: 'DNA-Schäden und Reparaturmechanismen',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'cell',
            name: 'Zellbiologie',
            icon: '🔬',
            topics: [
                {
                    title: 'Zellorganellen',
                    description: 'Aufbau und Funktion',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Stoffwechsel',
                    description: 'Zellatmung und Photosynthese',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Zellteilung',
                    description: 'Mitose und Meiose',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'ecology',
            name: 'Ökologie',
            icon: '🌱',
            topics: [
                {
                    title: 'Ökosysteme',
                    description: 'Struktur und Dynamik',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Stoffkreisläufe',
                    description: 'Kohlenstoff und Stickstoff',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Evolution',
                    description: 'Evolutionstheorien und Artbildung',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Biodiversität',
                    description: 'Artenvielfalt und Naturschutz',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'human',
            name: 'Humanbiologie',
            icon: '🫀',
            topics: [
                {
                    title: 'Nervensystem',
                    description: 'Aufbau und Funktion',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Immunsystem',
                    description: 'Abwehrmechanismen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Hormonsystem',
                    description: 'Regulation und Feedback',
                    link: 'exercise-template.html'
                }
            ]
        }
    ],
    chemie: [
        {
            id: 'organic',
            name: 'Organische Chemie',
            icon: '🧪',
            topics: [
                {
                    title: 'Kohlenwasserstoffe',
                    description: 'Alkane, Alkene, Alkine',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Funktionelle Gruppen',
                    description: 'Alkohole, Aldehyde, Ketone, Carbonsäuren',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Aromaten',
                    description: 'Benzol und Derivate',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Reaktionsmechanismen',
                    description: 'Addition, Substitution, Elimination',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'inorganic',
            name: 'Anorganische Chemie',
            icon: '⚗️',
            topics: [
                {
                    title: 'Atombau',
                    description: 'Schalenmodell und Orbital',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Chemische Bindung',
                    description: 'Ionisch, kovalent, metallisch',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Säure-Base-Reaktionen',
                    description: 'pH-Wert und Puffer',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Redoxreaktionen',
                    description: 'Elektronenübertragung und Galvanische Zellen',
                    link: 'exercise-template.html'
                }
            ]
        },
        {
            id: 'physical',
            name: 'Physikalische Chemie',
            icon: '🔋',
            topics: [
                {
                    title: 'Thermodynamik',
                    description: 'Energetik chemischer Reaktionen',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Kinetik',
                    description: 'Reaktionsgeschwindigkeit und Katalyse',
                    link: 'exercise-template.html'
                },
                {
                    title: 'Chemisches Gleichgewicht',
                    description: 'MWG und Gleichgewichtsverschiebung',
                    link: 'exercise-template.html'
                }
            ]
        }
    ]
};

// Globale Variablen
let currentSubject = '';

document.addEventListener('DOMContentLoaded', function() {
    // URL-Parameter auslesen
    const urlParams = new URLSearchParams(window.location.search);
    currentSubject = urlParams.get('subject') || 'mathematik';

    // Fachspezifische Inhalte aktualisieren
    updateSubjectSpecificContent(currentSubject);

    // Kategorien anzeigen
    const subjectData = subjectTopics[currentSubject];
    if (subjectData && Array.isArray(subjectData)) {
        displayCategories(subjectData);
    } else {
        console.error('Keine Themen gefunden für:', currentSubject);
    }
});

function updateSubjectSpecificContent(subject) {
    if (!subjects[subject]) return;

    // Titel aktualisieren
    const subjectTitle = document.getElementById('subject-title');
    if (subjectTitle) {
        subjectTitle.textContent = subjects[subject].name;
    }

    // Header aktualisieren
    const topicsHeader = document.getElementById('topics-header');
    if (topicsHeader) {
        topicsHeader.textContent = `Themengebiete - ${subjects[subject].name}`;
    }

    // Logo aktualisieren
    const logo = document.getElementById('subject-logo');
    if (logo) {
        logo.src = `../images/${subject}-logo.png`;
        logo.alt = `${subjects[subject].name} Logo`;
    }

    // Farben setzen
    const colors = subjects[subject].gradientColors;
    document.documentElement.style.setProperty('--primary-color', colors[0]);
    document.documentElement.style.setProperty('--secondary-color', colors[1]);
    document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`);
}

function displayCategories(categories) {
    const categoryGrid = document.getElementById('category-grid');
    if (!categoryGrid) return;

    categoryGrid.innerHTML = '';

    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => showTopics(category);

        card.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <h3>${category.name}</h3>
            <p>${category.description || ''}</p>
        `;

        categoryGrid.appendChild(card);
    });
}

function showTopics(category) {
    if (!category || !Array.isArray(category.topics)) {
        console.error('Ungültige Kategorie oder keine Topics gefunden');
        return;
    }

    const container = document.getElementById('topics-container');
    if (!container) return;

    container.innerHTML = `
        <section class="topic-section">
            <h2>${category.name}</h2>
            <div class="topic-grid">
                ${category.topics.map(topic => `
                    <div class="topic-card">
                        <h3>${topic.title}</h3>
                        <p>${topic.description}</p>
                        <button onclick="window.location.href='exercise-template.html?subject=${currentSubject}&topic=${encodeURIComponent(topic.title)}'" style="background: var(--primary-gradient)">
                            Übung starten
                        </button>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    // Scroll to topics
    container.scrollIntoView({ behavior: 'smooth' });
}
