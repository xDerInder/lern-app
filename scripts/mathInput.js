var MQ = MathQuill.getInterface(2);
var mathField;

document.addEventListener('DOMContentLoaded', function() {
    initMathQuill();
    setupEventListeners();
});

function initMathQuill() {
    const mathInputElement = document.getElementById('solution-input');
    if (!mathInputElement) {
        console.error('Math input element nicht gefunden');
        return;
    }
    
    mathField = MQ.MathField(mathInputElement, {
        spaceBehavesLikeTab: true,
        handlers: {
            edit: function() {
                if (mathField) {
                    console.log('Math Input geändert:', mathField.latex());
                }
            },
            enter: function() {
                document.getElementById('check-answer').click();
            }
        },
        autoCommands: 'pi theta sqrt sum prod int',
        autoOperatorNames: 'sin cos tan'
    });

    window.mathInput = {
        ...window.mathInput,
        mathField: mathField
    };
}

function setupEventListeners() {
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '/':
                    event.preventDefault();
                    insertFraction();
                    break;
                case '^':
                    event.preventDefault();
                    insertPower();
                    break;
            }
        }
    });
}

function insertSymbol(symbol) {
    switch(symbol) {
        case '√':
            mathField.cmd('\\sqrt');
            break;
        case '∫':
            mathField.cmd('\\int');
            break;
        case 'π':
            mathField.cmd('\\pi');
            break;
        case '±':
            mathField.write('\\pm');
            break;
        case '∞':
            mathField.cmd('\\infty');
            break;
        default:
            mathField.write(symbol);
    }
    mathField.focus();
}

function insertFraction() {
    mathField.cmd('\\frac');
    mathField.focus();
}

function insertPower() {
    mathField.cmd('^');
    mathField.focus();
}

// Hilfsfunktionen
function getLatex() {
    return mathField.latex();
}

function setLatex(latex) {
    mathField.latex(latex);
}

function clearInput() {
    mathField.latex('');
}

window.mathInput = {
    insertSymbol,
    insertFraction,
    insertPower,
    getLatex,
    setLatex,
    clearInput
}; 