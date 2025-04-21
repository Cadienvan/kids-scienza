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
const cloudSmallElement = document.getElementById('cloud-small');
const cloudBigElement = document.getElementById('cloud-big');
const thunderCloudElement = document.getElementById('thunder-cloud');
const lightningElement = document.getElementById('lightning');
const rainElement = document.getElementById('rain');
const warmAirElement = document.getElementById('warm-air');

// Stato del gioco
let currentStep = 0;
let score = 0;
let sunIsHot = false;
let cloudIsFormed = false;
let thunderCloudIsFormed = false;
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
        narration: "Ciao! Sono la gocciolina e oggi ti spiegherò come si forma un temporale! Premi 'Avanti' per iniziare!",
        animation: () => {
            // Reset delle visualizzazioni
            cloudSmallElement.classList.add('hidden');
            cloudBigElement.classList.add('hidden');
            thunderCloudElement.classList.add('hidden');
            lightningElement.classList.add('hidden');
            rainElement.classList.add('hidden');
            warmAirElement.classList.add('hidden');
            
            // Reset degli stati
            sunIsHot = false;
            cloudIsFormed = false;
            thunderCloudIsFormed = false;
            
            // Reset del cielo
            skyElement.classList.remove('sky-dark');
            sunElement.classList.remove('sun-hidden');
        },
        question: null // Nessuna domanda all'inizio
    },
    { // Step 1: Il Sole Scalda la Terra
        narration: "Per iniziare, il sole scalda la terra. Clicca sul sole per renderlo più caldo!",
        animation: () => {
            // Resetta stato del sole
            sunElement.classList.remove('sun-hot');
            sunIsHot = false;
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché il sole non è caldo
        },
        question: {
            text: "Cosa succede quando il sole scalda la terra?",
            answers: [
                { text: "L'aria diventa fredda", correct: false },
                { text: "L'aria si riscalda", correct: true },
                { text: "L'aria scompare", correct: false }
            ],
            correctFeedback: "Esatto! Il Sole scalda la terra, che a sua volta riscalda l'aria.",
            incorrectFeedback: "Non proprio. Quando il Sole scalda la terra, l'aria si riscalda."
        },
        requiresInteraction: 'sun'
    },
    { // Step 2: L'Aria Calda Sale
        narration: "L'aria calda è leggera e sale verso l'alto. Questo movimento di aria calda è molto importante per i temporali!",
        animation: () => {
            warmAirElement.classList.remove('hidden'); // Mostra le frecce di aria calda
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "E poi?";
        },
        question: {
            text: "Perché l'aria calda sale verso l'alto?",
            answers: [
                { text: "Perché è pesante", correct: false },
                { text: "Perché è leggera", correct: true },
                { text: "Perché è bagnata", correct: false }
            ],
            correctFeedback: "Bravo/a! L'aria calda è più leggera dell'aria fredda, per questo sale verso l'alto.",
            incorrectFeedback: "In realtà, l'aria calda sale perché è più leggera dell'aria fredda."
        }
    },
    { // Step 3: Formazione delle Nuvole
        narration: "L'aria calda che sale contiene vapore acqueo. Salendo in alto, l'aria si raffredda e il vapore forma piccole nuvole. Clicca dove vedi l'aria calda per formare una nuvola!",
        animation: () => {
            // Prepariamo la piccola nuvola, ma la teniamo nascosta
            cloudSmallElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Cosa succede quando l'aria calda sale e si raffredda?",
            answers: [
                { text: "Il vapore acqueo scompare", correct: false },
                { text: "Il vapore acqueo forma le nuvole", correct: true },
                { text: "La terra diventa più calda", correct: false }
            ],
            correctFeedback: "Perfetto! Quando l'aria calda con vapore acqueo sale e si raffredda, si formano le nuvole.",
            incorrectFeedback: "Non è corretto. Quando l'aria calda con vapore acqueo sale e si raffredda, forma piccole goccioline che vediamo come nuvole."
        },
        requiresInteraction: 'warm-air'
    },
    { // Step 4: La Nuvola Cresce
        narration: "La nuvola continua a crescere mentre sempre più aria calda sale. Clicca sulla nuvola per farla diventare più grande!",
        animation: () => {
            // Nuvola già visibile dallo step precedente
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Cosa fa crescere le nuvole temporalesche?",
            answers: [
                { text: "Il sole che le illumina", correct: false },
                { text: "L'aria fredda che scende", correct: false },
                { text: "L'aria calda che continua a salire", correct: true }
            ],
            correctFeedback: "Esatto! L'aria calda che continua a salire porta più umidità e fa crescere la nuvola.",
            incorrectFeedback: "Non proprio. Le nuvole temporalesche crescono grazie all'aria calda che continua a salire portando umidità."
        },
        requiresInteraction: 'cloud-small'
    },
    { // Step 5: La Nuvola Diventa un Cumulonembo
        narration: "La nostra nuvola è diventata un 'cumulonembo', una grande nuvola temporalesca. Continua a crescere sempre di più verso l'alto fino a diventare molto alta e scura.",
        animation: () => {
            // Nascondi nuvola piccola e mostra nuvola di temporale
            cloudSmallElement.classList.add('hidden');
            cloudBigElement.classList.remove('hidden');
            
            // Inizia a scurire il cielo
            setTimeout(() => {
                skyElement.classList.add('sky-dark');
                sunElement.classList.add('sun-hidden');
            }, 1000);
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Cosa succede dopo?";
        },
        question: {
            text: "Come si chiama la grande nuvola del temporale?",
            answers: [
                { text: "Cirro", correct: false },
                { text: "Cumulonembo", correct: true },
                { text: "Strato", correct: false }
            ],
            correctFeedback: "Giusto! Si chiama cumulonembo ed è la nuvola tipica dei temporali.",
            incorrectFeedback: "Non esattamente. La grande nuvola del temporale si chiama cumulonembo."
        }
    },
    { // Step 6: La Formazione dei Fulmini
        narration: "Dentro la nuvola, goccioline d'acqua e cristalli di ghiaccio si scontrano continuamente. Questi urti creano cariche elettriche che provocano i fulmini!",
        animation: () => {
            // Mostra nuvola temporalesca finale e nascondi quella precedente
            cloudBigElement.classList.add('hidden');
            thunderCloudElement.classList.remove('hidden');
            
            // Mostra fulmini
            setTimeout(() => {
                lightningElement.classList.remove('hidden');
            }, 1500);
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "E il tuono?";
        },
        question: {
            text: "Cosa causa i fulmini in una nuvola temporalesca?",
            answers: [
                { text: "Il calore del sole", correct: false },
                { text: "L'urto tra goccioline e cristalli di ghiaccio", correct: true },
                { text: "La pioggia che cade", correct: false }
            ],
            correctFeedback: "Corretto! Gli urti tra goccioline d'acqua e cristalli di ghiaccio creano cariche elettriche che formano i fulmini.",
            incorrectFeedback: "In realtà, sono gli urti tra goccioline d'acqua e cristalli di ghiaccio a creare le cariche elettriche che generano i fulmini."
        }
    },
    { // Step 7: Il Tuono
        narration: "Il fulmine scalda molto rapidamente l'aria intorno, facendola espandere e creando un'onda sonora: il tuono! È proprio il suono che sentiamo dopo aver visto il lampo.",
        animation: () => {
            // Animazione rimane uguale al passo precedente
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "E la pioggia?";
        },
        question: {
            text: "Cosa produce il suono del tuono?",
            answers: [
                { text: "Le nuvole che si scontrano", correct: false },
                { text: "L'aria che si espande rapidamente a causa del fulmine", correct: true },
                { text: "La pioggia che cade sulle foglie", correct: false }
            ],
            correctFeedback: "Perfetto! Il fulmine riscalda l'aria così velocemente che questa si espande creando l'onda sonora che chiamiamo tuono.",
            incorrectFeedback: "Non è così. Il tuono è causato dall'aria che si espande rapidamente quando viene riscaldata dal fulmine."
        }
    },
    { // Step 8: La Pioggia Cade
        narration: "Nella nuvola, le goccioline d'acqua diventano sempre più pesanti finché non riescono più a rimanere sospese. Inizia così la forte pioggia del temporale!",
        animation: () => {
            // Mostra la pioggia
            rainElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "È finita!";
        },
        question: {
            text: "Perché cade la pioggia durante un temporale?",
            answers: [
                { text: "Perché le nuvole sono troppo pesanti", correct: false },
                { text: "Perché le goccioline d'acqua diventano troppo pesanti", correct: true },
                { text: "Perché il vento le spinge giù", correct: false }
            ],
            correctFeedback: "Esatto! Le goccioline d'acqua nella nuvola crescono e diventano troppo pesanti per rimanere sospese.",
            incorrectFeedback: "Non proprio. La pioggia cade quando le goccioline d'acqua nella nuvola diventano troppo pesanti per rimanere sospese."
        }
    },
    { // Step 9: Fine del Temporale
        narration: "Dopo che tutta la pioggia è caduta e l'energia si è scaricata con i fulmini, il temporale finisce. Il cielo si rischiara e tutto torna tranquillo... fino al prossimo temporale!",
        animation: () => {
            // Gradualmente rimuovi elementi del temporale
            rainElement.classList.add('hidden');
            thunderCloudElement.classList.add('hidden');
            lightningElement.classList.add('hidden');
            
            // Riporta il cielo al suo colore normale
            setTimeout(() => {
                skyElement.classList.remove('sky-dark');
                sunElement.classList.remove('sun-hidden');
            }, 1000);
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Ricomincia";
            currentStep = -1; // Per far ripartire dal passo 0 al prossimo click
        },
        question: null
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
        sunIsHot = true;
        this.classList.add('sun-hot');
        narrationText.textContent = "Wow! Il sole è diventato caldissimo! Ora sta riscaldando la terra e l'aria sopra di essa.";
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

warmAirElement.addEventListener('click', function() {
    // Se siamo allo step dell'aria calda (3)
    if (currentStep === 3) {
        cloudIsFormed = true;
        narrationText.textContent = "Guarda! L'aria calda salendo ha formato una piccola nuvola!";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 1500);
        }
    }
});

cloudSmallElement.addEventListener('click', function() {
    // Se siamo allo step della nuvola (4)
    if (currentStep === 4) {
        thunderCloudIsFormed = true;
        this.style.fontSize = '70px';
        narrationText.textContent = "La nuvola sta diventando sempre più grande! Sta diventando un cumulonembo!";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 1500);
        }
    }
});