// Elementi del DOM
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');
const narrationText = document.getElementById('narration-text');
const questionBox = document.getElementById('question-box');
const questionText = document.getElementById('question-text');
const answerButtonsContainer = document.getElementById('answer-buttons');
const feedbackText = document.getElementById('feedback-text');
const nextButton = document.getElementById('next-button');
const speakButton = document.getElementById('speak-button');

// Elementi animazione
const skyElement = document.getElementById('sky');
const sunElement = document.getElementById('sun');
const rainDropElement = document.getElementById('rain-drop');
const seedElement = document.getElementById('seed');
const sproutElement = document.getElementById('sprout');
const smallTreeElement = document.getElementById('small-tree');
const mediumTreeElement = document.getElementById('medium-tree');
const bigTreeElement = document.getElementById('big-tree');
const rootsElement = document.getElementById('roots');

// Stato del gioco
let currentStep = 0;
let score = 0;
let sunIsWarm = false;
let seedIsPlanted = false;
let sproutIsGrowing = false;
let treeIsGrowing = false;
let speechSynthesis = window.speechSynthesis;
let speechEnabled = false;

// Inizializza SpeechSynthesis
let speechUtterance = null;

// Start button event listener
startButton.addEventListener('click', function() {
    // Nascondi la schermata iniziale
    startScreen.classList.add('hidden');
    
    // Mostra l'area di gioco
    gameArea.classList.remove('hidden');
    
    // Inizializza la sintesi vocale dopo l'interazione dell'utente
    initializeSpeech();
    
    // Avvia il gioco
    showStep(currentStep);
});

// Inizializza la sintesi vocale dopo l'interazione dell'utente
function initializeSpeech() {
    if ('speechSynthesis' in window) {
        speechEnabled = true;
        setupVoice();
        
        // Leggi il primo messaggio di benvenuto
        setTimeout(() => {
            speakText(gameSteps[currentStep].narration);
        }, 500);
    } else {
        console.warn("Il browser non supporta la Web Speech API");
    }
}

// Configura voce italiana se disponibile
function setupVoice() {
    if (speechEnabled && 'speechSynthesis' in window) {
        speechUtterance = new SpeechSynthesisUtterance();
        // Ottieni la lista delle voci disponibili
        let voices = speechSynthesis.getVoices();
        
        // Riprova ad ottenere le voci se l'array è vuoto
        if (voices.length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                // Cerca una voce italiana
                const italianVoice = voices.find(voice => 
                    voice.lang.includes('it-IT') || voice.lang.includes('it')
                );
                if (italianVoice) {
                    speechUtterance.voice = italianVoice;
                }
                speechUtterance.rate = 0.9; // Leggermente più lento per i bambini
                speechUtterance.pitch = 1.1; // Tono leggermente più alto
            };
        } else {
            // Cerca una voce italiana
            const italianVoice = voices.find(voice => 
                voice.lang.includes('it-IT') || voice.lang.includes('it')
            );
            if (italianVoice) {
                speechUtterance.voice = italianVoice;
            }
            speechUtterance.rate = 0.9; // Leggermente più lento per i bambini
            speechUtterance.pitch = 1.1; // Tono leggermente più alto
        }
    }
}

// Funzione per leggere il testo
function speakText(text) {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    
    // Ferma qualsiasi narrazione in corso
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    speechUtterance.text = text;
    speechSynthesis.speak(speechUtterance);
}

// Definiamo i passi del gioco (narrazione, animazione, domanda)
const gameSteps = [
    { // Step 0: Introduzione
        narration: "Ciao! Oggi guarderemo come un piccolo semino diventa un albero grande! Premi 'Avanti' per iniziare!",
        animation: () => {
            // Reset degli elementi
            seedElement.classList.add('hidden');
            sproutElement.classList.add('hidden');
            smallTreeElement.classList.add('hidden');
            mediumTreeElement.classList.add('hidden');
            bigTreeElement.classList.add('hidden');
            rootsElement.classList.add('hidden');
            rainDropElement.classList.add('hidden');
            
            // Reset degli stati
            sunIsWarm = false;
            seedIsPlanted = false;
            sproutIsGrowing = false;
            treeIsGrowing = false;
        },
        question: null // Nessuna domanda all'inizio
    },
    { // Step 1: Il Seme
        narration: "Ecco un piccolo semino! Prima deve sentire il calore. Clicca sul sole per scaldare la terra!",
        animation: () => {
            // Mostra il seme e rimuovi eventuali classi
            seedElement.classList.remove('hidden', 'seed-planted');
            sunElement.classList.remove('sun-warm');
            sunIsWarm = false;
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché il sole non è caldo
        },
        question: {
            text: "Di cosa ha bisogno il semino?",
            answers: [
                { text: "Solo luce", correct: false },
                { text: "Calore e acqua", correct: true },
                { text: "Solo aria", correct: false }
            ],
            correctFeedback: "Giusto! Il semino ha bisogno di calore e acqua per crescere.",
            incorrectFeedback: "Non proprio. Il semino ha bisogno di calore e acqua per crescere."
        },
        requiresInteraction: 'sun'
    },
    { // Step 2: Piantare il Seme
        narration: "Ora che la terra è calda, possiamo mettere il semino nella terra. Clicca sul semino!",
        animation: () => {
            // Terreno già caldo dallo step precedente
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché il seme non è piantato
        },
        question: {
            text: "Perché mettiamo i semi nella terra?",
            answers: [
                { text: "Per nasconderli", correct: false },
                { text: "Per farli crescere meglio", correct: true },
                { text: "Per decorare", correct: false }
            ],
            correctFeedback: "Bravo! La terra aiuta il semino a crescere meglio.",
            incorrectFeedback: "Non proprio. La terra aiuta il semino a crescere meglio."
        },
        requiresInteraction: 'seed'
    },
    { // Step 3: Acqua per il Seme
        narration: "Il nostro semino è nella terra! Ma ha bisogno di acqua. Guarda, sta piovendo! Clicca sulla goccia di pioggia!",
        animation: () => {
            // Mostriamo la pioggia
            rainDropElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Perché le piante hanno bisogno di acqua?",
            answers: [
                { text: "Per farle brillare", correct: false },
                { text: "Per aiutarle a crescere", correct: true },
                { text: "Per farle diventare blu", correct: false }
            ],
            correctFeedback: "Esatto! L'acqua aiuta le piante a crescere, proprio come fa con te quando bevi.",
            incorrectFeedback: "Non proprio. L'acqua aiuta le piante a crescere, proprio come fa con te quando bevi."
        },
        requiresInteraction: 'rain-drop'
    },
    { // Step 4: Germogliazione semplificata
        narration: "Il semino ha sentito il sole e bevuto l'acqua! Guarda, sta spuntando una piccola piantina verde! Clicca sulla piantina per aiutarla a crescere!",
        animation: () => {
            // Nascondiamo il seme e mostriamo il germoglio
            seedElement.classList.add('hidden');
            sproutElement.classList.remove('hidden');
            rainDropElement.classList.add('hidden'); // Fermiamo la pioggia
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Da dove viene la piccola piantina?",
            answers: [
                { text: "È caduta dal cielo", correct: false },
                { text: "È nata dal semino", correct: true },
                { text: "L'ha portata un uccellino", correct: false }
            ],
            correctFeedback: "Esatto! La piantina è nata dal semino che abbiamo messo nella terra.",
            incorrectFeedback: "Non proprio. La piantina è nata dal semino che abbiamo messo nella terra."
        },
        requiresInteraction: 'sprout'
    },
    { // Step 5: Radici semplificate
        narration: "Mentre la piantina cresce verso l'alto, sotto terra crescono le radici. Le radici sono come le gambe della pianta e la aiutano a bere l'acqua.",
        animation: () => {
            // Mostriamo le radici
            rootsElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "E dopo?";
        },
        question: {
            text: "A cosa servono le radici?",
            answers: [
                { text: "A far volare la pianta", correct: false },
                { text: "A far bere la pianta", correct: true },
                { text: "A far cantare la pianta", correct: false }
            ],
            correctFeedback: "Bravo! Le radici aiutano la pianta a bere l'acqua dalla terra.",
            incorrectFeedback: "Non proprio. Le radici aiutano la pianta a bere l'acqua dalla terra."
        }
    },
    { // Step 6: Piccolo Albero semplificato
        narration: "La piantina è cresciuta ancora! Le foglioline verdi prendono la luce del sole e aiutano la pianta a diventare più grande. Clicca sulla piantina per farla crescere!",
        animation: () => {
            // Nascondiamo il germoglio e mostriamo il piccolo albero
            sproutElement.classList.add('hidden');
            smallTreeElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Di cosa hanno bisogno le foglie verdi?",
            answers: [
                { text: "Del buio", correct: false },
                { text: "Del sole", correct: true },
                { text: "Del vento", correct: false }
            ],
            correctFeedback: "Giusto! Le foglie hanno bisogno del sole, proprio come noi abbiamo bisogno del cibo.",
            incorrectFeedback: "Non proprio. Le foglie hanno bisogno del sole, proprio come noi abbiamo bisogno del cibo."
        },
        requiresInteraction: 'small-tree'
    },
    { // Step 7: Albero in crescita
        narration: "La nostra piantina è diventata un alberello! Il tronco diventa più forte e spuntano nuovi rami con tante foglie.",
        animation: () => {
            // Nascondiamo il piccolo albero e mostriamo l'albero medio
            smallTreeElement.classList.add('hidden');
            mediumTreeElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "E poi?";
        },
        question: {
            text: "Quale parte dell'albero tiene su i rami?",
            answers: [
                { text: "Le foglie", correct: false },
                { text: "Il tronco", correct: true },
                { text: "I fiori", correct: false }
            ],
            correctFeedback: "Giusto! Il tronco è la parte forte che tiene su tutti i rami e le foglie.",
            incorrectFeedback: "Non proprio. Il tronco è la parte forte che tiene su tutti i rami e le foglie."
        }
    },
    { // Step 8: Albero adulto
        narration: "Passano tanti giorni e l'albero diventa grande e forte! Ora può dare casa agli uccellini, fare frutti buoni e pulire l'aria che respiriamo.",
        animation: () => {
            // Nascondiamo l'albero medio e mostriamo l'albero grande
            mediumTreeElement.classList.add('hidden');
            bigTreeElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Perché sono importanti gli alberi?";
        },
        question: {
            text: "Perché gli alberi sono nostri amici?",
            answers: [
                { text: "Perché sono alti", correct: false },
                { text: "Perché ci danno aria pulita", correct: true },
                { text: "Perché sono tutti verdi", correct: false }
            ],
            correctFeedback: "Esatto! Gli alberi puliscono l'aria che respiriamo e ci aiutano a stare bene.",
            incorrectFeedback: "Non proprio. Gli alberi puliscono l'aria che respiriamo e ci aiutano a stare bene."
        }
    },
    { // Step 9: Il Ciclo della Vita semplificato
        narration: "L'albero grande fa i frutti con dentro nuovi semini. Quando i semini cadono a terra, possono nascere nuovi alberi!",
        animation: () => {
            // Mostriamo di nuovo un seme accanto all'albero
            seedElement.classList.remove('hidden');
            seedElement.classList.remove('seed-planted');
            seedElement.style.left = '30%'; // Spostiamo il seme in una nuova posizione
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Ricomincia";
            currentStep = -1; // Per ricominciare dal passo 0
        },
        question: {
            text: "Cosa c'è dentro i frutti degli alberi?",
            answers: [
                { text: "Solo acqua", correct: false },
                { text: "Nuovi semini", correct: true },
                { text: "Piccole foglie", correct: false }
            ],
            correctFeedback: "Bravo! Dentro i frutti ci sono semini che possono far nascere nuovi alberi.",
            incorrectFeedback: "Non proprio. Dentro i frutti ci sono semini che possono far nascere nuovi alberi."
        }
    }
];

// Funzione per mostrare la narrazione e gestire le animazioni
function showStep(stepIndex) {
    if (stepIndex >= gameSteps.length) {
        console.error("Step non valido:", stepIndex);
        return;
    }
    const step = gameSteps[stepIndex];

    // Nascondi domande precedenti
    questionBox.classList.add('hidden');
    feedbackText.textContent = '';
    answerButtonsContainer.innerHTML = ''; // Pulisci bottoni vecchi

    // Mostra narrazione
    narrationText.textContent = step.narration;
    
    // Leggi la narrazione ad alta voce
    speakText(step.narration);

    // Esegui animazione (se presente)
    if (step.animation) {
        step.animation();
    }

    // Gestisci la visibilità del pulsante Avanti in base alle interazioni richieste
    if (step.requiresInteraction) {
        nextButton.classList.add('hidden');
    } else if (!step.question) {
        nextButton.classList.remove('hidden');
        // Aggiorna testo bottone se necessario
        if (stepIndex === 0) nextButton.textContent = "Iniziamo!";
        else if (stepIndex === gameSteps.length - 1) nextButton.textContent = "Ricomincia";
        else nextButton.textContent = "Avanti";
    }

    // Mostra domanda (se presente)
    if (step.question) {
        // In presenza di domanda, verifichiamo se deve essere mostrata subito o dopo l'interazione
        if (!step.requiresInteraction) {
            nextButton.classList.add('hidden');
            displayQuestion(step.question);
        }
    }
}

// Funzione per mostrare la domanda e i bottoni
function displayQuestion(questionData) {
    questionText.textContent = questionData.text;
    answerButtonsContainer.innerHTML = ''; // Pulisci bottoni precedenti

    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.onclick = () => handleAnswer(answer.correct, questionData.correctFeedback, questionData.incorrectFeedback);
        answerButtonsContainer.appendChild(button);
    });

    questionBox.classList.remove('hidden');
    
    // Leggi la domanda ad alta voce
    speakText(questionData.text);
}

// Funzione per gestire la risposta data
function handleAnswer(isCorrect, correctFeedback, incorrectFeedback) {
    // Disabilita i bottoni dopo la risposta
    const buttons = answerButtonsContainer.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);

    if (isCorrect) {
        feedbackText.textContent = "🥳 " + correctFeedback;
        feedbackText.style.color = 'green';
        speakText(correctFeedback); // Leggi feedback positivo
        score++; // Incrementa punteggio se lo usiamo
    } else {
        feedbackText.textContent = "🤔 " + incorrectFeedback;
        feedbackText.style.color = 'red';
        speakText(incorrectFeedback); // Leggi feedback negativo
    }

    // Mostra il pulsante "Avanti" per procedere al passo successivo
    nextButton.classList.remove('hidden');
    nextButton.textContent = "Continua";
}

// Event Listener per il pulsante parlante
speakButton.addEventListener('click', () => {
    const textToRead = narrationText.textContent;
    speakText(textToRead);
});

// Event Listener per il pulsante Avanti/Inizia/Continua
nextButton.addEventListener('click', () => {
    currentStep++;
    if (currentStep >= gameSteps.length) {
        currentStep = 0; // Ricomincia il ciclo
    }
    showStep(currentStep);
});

// Gestori di eventi per elementi interattivi
sunElement.addEventListener('click', function() {
    // Se siamo al passo del sole (1)
    if (currentStep === 1) {
        sunIsWarm = true;
        this.classList.add('sun-warm');
        narrationText.textContent = "Molto bene! Il sole ha riscaldato il terreno ed è pronto per accogliere il nostro seme.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

seedElement.addEventListener('click', function() {
    // Se siamo allo step del seme (2)
    if (currentStep === 2) {
        seedIsPlanted = true;
        this.classList.add('seed-planted');
        narrationText.textContent = "Ottimo lavoro! Hai piantato il seme nel terreno dove sarà al sicuro e potrà crescere.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

rainDropElement.addEventListener('click', function() {
    // Se siamo allo step della pioggia (3)
    if (currentStep === 3) {
        narrationText.textContent = "Perfetto! L'acqua sta nutrendo il nostro seme che presto inizierà a germogliare.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

sproutElement.addEventListener('click', function() {
    // Se siamo allo step del germoglio (4)
    if (currentStep === 4) {
        sproutIsGrowing = true;
        this.classList.add('sprout-growing');
        narrationText.textContent = "Guarda come cresce il nostro germoglio! Le foglioline verdi catturano la luce del sole.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

smallTreeElement.addEventListener('click', function() {
    // Se siamo allo step del piccolo albero (6)
    if (currentStep === 6) {
        treeIsGrowing = true;
        this.classList.add('tree-growing');
        narrationText.textContent = "L'albero sta crescendo e diventa sempre più forte! Presto sarà un bell'albero adulto.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});