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
const sunElement = document.getElementById('sun');
const cloudElement = document.getElementById('cloud');
const evaporationElement = document.getElementById('evaporation');
const rainElement = document.getElementById('rain');

// Stato del gioco
let currentStep = 0;
let score = 0; // Potremmo usarlo se volessimo tenere un punteggio
let sunIsHot = false;
let cloudIsMoved = false;
let cloudIsGrown = false;
let speechSynthesis = window.speechSynthesis;
let speechEnabled = false; // Inizia come disabilitato finché l'utente non interagisce

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
        narration: "Ciao! Sono una piccola gocciolina d'acqua e vivo nel grande mare. Premi 'Avanti' per scoprire il mio viaggio!",
        animation: () => {
            // Nessuna animazione iniziale specifica oltre lo stato base
            cloudElement.classList.add('hidden');
            evaporationElement.classList.add('hidden');
            rainElement.classList.add('hidden');
            
            // Reset degli stati
            sunIsHot = false;
            cloudIsMoved = false;
            cloudIsGrown = false;
        },
        question: null // Nessuna domanda all'inizio
    },
    { // Step 1: Il Sole Scalda
        narration: "Guarda! Il Sole splende alto nel cielo. Clicca sul sole per farlo diventare più caldo!",
        animation: () => {
            // Rimuovi qualsiasi classe precedente dal sole
            sunElement.classList.remove('sun-hot');
            sunIsHot = false;
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché il sole non è caldo
        },
        question: {
            text: "Cosa fa il Sole quando è caldo?",
            answers: [
                { text: "Raffredda l'acqua", correct: false },
                { text: "Scalda l'acqua", correct: true },
                { text: "Fa giocare i pesci", correct: false }
            ],
            correctFeedback: "Esatto! Il Sole caldo scalda l'acqua del mare.",
            incorrectFeedback: "Non proprio. Il Sole caldo scalda l'acqua. Proviamo a vedere cosa succede!"
        },
        requiresInteraction: 'sun' // Richiede interazione con il sole
    },
    { // Step 2: Evaporazione
        narration: "L'acqua del mare, scaldata dal Sole, diventa leggera leggera e sale su nel cielo sotto forma di vapore. Si chiama evaporazione!",
        animation: () => {
            evaporationElement.classList.remove('hidden');
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "E poi?";
        },
        question: {
            text: "Come si chiama l'acqua che sale nel cielo quando è calda?",
            answers: [
                { text: "Pioggia", correct: false },
                { text: "Vapore (Evaporazione)", correct: true },
                { text: "Neve", correct: false }
            ],
            correctFeedback: "Bravissimo/a! Si chiama vapore, e il processo è l'evaporazione.",
            incorrectFeedback: "Mmmh, l'acqua che sale si chiama vapore. Ricordalo!"
        }
    },
     { // Step 3: Formazione Nuvole
        narration: "Tante goccioline di vapore salgono e si uniscono lassù nel cielo, formando una nuvola! Clicca sulla nuvola per farla muovere!",
        animation: () => {
            evaporationElement.classList.add('hidden'); // Nascondiamo l'evaporazione
            cloudElement.classList.remove('hidden'); // Mostriamo la nuvola
            cloudElement.classList.remove('cloud-moving');
            cloudElement.style.fontSize = '60px'; // Reset dimensione nuvola
            cloudElement.style.color = 'white'; // Reset colore nuvola
            cloudIsMoved = false;
            cloudIsGrown = false;
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché la nuvola non si muove
        },
        question: {
            text: "Cosa formano tante goccioline di vapore unite nel cielo?",
            answers: [
                { text: "Un aereo", correct: false },
                { text: "Una stella", correct: false },
                { text: "Una nuvola", correct: true }
            ],
            correctFeedback: "Giusto! Formano una bella nuvola.",
            incorrectFeedback: "Non esattamente. Le goccioline di vapore formano una nuvola."
        },
        requiresInteraction: 'cloud' // Richiede interazione con la nuvola
    },
    { // Step 4: La Nuvola si sposta e si ingrossa (Aggiungiamo un passo)
        narration: "La nuvola viaggia nel cielo, spinta dal vento, e raccoglie sempre più goccioline. Clicca di nuovo sulla nuvola per farla diventare più grande e pesante!",
        animation: () => {
            // Nuvola già spostata dallo step precedente
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché la nuvola non diventa più grande
        },
        question: {
            text: "Cosa succede alla nuvola mentre viaggia?",
            answers: [
                { text: "Diventa più piccola", correct: false },
                { text: "Diventa più pesante", correct: true },
                { text: "Si scioglie", correct: false }
            ],
            correctFeedback: "Proprio così! Diventa più pesante perché raccoglie acqua.",
            incorrectFeedback: "In realtà, la nuvola diventa più pesante."
        },
        requiresInteraction: 'cloud-grow' // Richiede interazione con la nuvola per ingrandirla
    },
    { // Step 5: Pioggia (Precipitazione)
        narration: "Quando la nuvola è troppo piena e pesante, le goccioline cadono giù sulla terra. È la pioggia!",
        animation: () => {
            // Aggiorna posizione della pioggia per allinearla alla nuvola
            const cloudComputedStyle = getComputedStyle(cloudElement);
            const cloudLeft = parseInt(cloudComputedStyle.left);
            const cloudTranslateX = parseInt(cloudComputedStyle.transform.match(/matrix.*\((.+)\)/)?.[1].split(', ')[4] || 0);
            rainElement.style.left = (cloudLeft + cloudTranslateX + 20) + 'px';
            rainElement.classList.remove('hidden'); // Mostra la pioggia
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Evviva la pioggia!";
        },
        question: {
            text: "Come si chiama l'acqua che cade dalla nuvola pesante?",
            answers: [
                { text: "Grandine", correct: false },
                { text: "Pioggia", correct: true },
                { text: "Vento", correct: false }
            ],
            correctFeedback: "Perfetto! Si chiama pioggia.",
            incorrectFeedback: "Si chiama pioggia. È l'acqua che torna giù!"
        }
    },
    { // Step 6: Ritorno al Mare/Terra
        narration: "La pioggia cade sulla terra, nei fiumi e ritorna nel mare. E poi il viaggio ricomincia con il Sole! Questo è il ciclo dell'acqua.",
        animation: () => {
            rainElement.classList.add('hidden'); // Nasconde pioggia
            cloudElement.classList.add('hidden'); // Nasconde nuvola
            cloudElement.classList.remove('cloud-moving'); // Resetta posizione nuvola
            cloudElement.classList.remove('cloud-grown'); // Resetta dimensione nuvola
            cloudElement.style.fontSize = '60px'; // Resetta dimensione nuvola
            cloudElement.style.color = 'white'; // Resetta colore nuvola
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Ricomincia il giro!";
            currentStep = -1; // Per far ripartire dal passo 0 al prossimo click
        },
        question: null // Fine del ciclo principale
    }
    // Aggiungere altri passi se necessario (es. neve, fiumi, ecc.)
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
        else if (stepIndex === gameSteps.length - 1) nextButton.textContent = "Ricomincia il giro!";
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
        narrationText.textContent = "Wow! Il sole è diventato caldissimo! Ora può scaldare l'acqua del mare.";
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

cloudElement.addEventListener('click', function() {
    // Se siamo allo step della nuvola (3)
    if (currentStep === 3 && !cloudIsMoved) {
        cloudIsMoved = true;
        this.classList.add('cloud-moving');
        narrationText.textContent = "Guarda! La nuvola si sta muovendo nel cielo!";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 2000); // Aspettiamo un po' di più per permettere di vedere l'animazione
        }
    }
    // Se siamo allo step dell'ingrossamento della nuvola (4)
    else if (currentStep === 4 && !cloudIsGrown) {
        cloudIsGrown = true;
        this.classList.add('cloud-grown');
        narrationText.textContent = "La nuvola diventa sempre più grande e pesante con tutte le goccioline che raccoglie!";
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